import axiosClient from "./AxiosClient";
import fallbackData from "./fallbackProducts.json";

const responseCache = new Map();
const inFlightRequests = new Map();

// Luôn bổ sung ảnh Cloudinary chuẩn trong folder TheCoffeeChill/Products cho mỗi sản phẩm
export const enrichProductImage = (product) => {
  if (!product) return product;
  // Nếu ảnh đã là ảnh mới trong folder TheCoffeeChill/Products -> giữ nguyên
  if (product.img && product.img.includes("TheCoffeeChill/Products")) {
    return product;
  }
  // Tìm ảnh chuẩn theo id, code hoặc tên món trong fallbackProducts
  const fallback = fallbackData?.result?.find(
    (p) =>
      (product.id != null && String(p.id) === String(product.id)) ||
      (product.code && p.code === product.code) ||
      (product.name && p.name.trim().toLowerCase() === product.name.trim().toLowerCase())
  );
  if (fallback?.img) {
    return { ...product, img: fallback.img };
  }
  return product;
};

export const sanitizeAndEnrichResponse = (rawResponse) => {
  if (!rawResponse || !rawResponse.data) return rawResponse;
  const resData = rawResponse.data;
  if (Array.isArray(resData.result)) {
    return {
      ...rawResponse,
      data: {
        ...resData,
        result: resData.result.map(enrichProductImage),
      },
    };
  } else if (resData.result && typeof resData.result === "object") {
    return {
      ...rawResponse,
      data: {
        ...resData,
        result: enrichProductImage(resData.result),
      },
    };
  }
  return rawResponse;
};

// Trích xuất dữ liệu dự phòng (fallback) để hiển thị tức thì (0ms) khi server Render đang ngủ
const getInitialFallback = (url) => {
  const allProducts = (fallbackData?.result || []).map(enrichProductImage);
  if (url.includes("/product/public")) {
    return { data: { statusCode: 200, message: "OK", result: allProducts } };
  }
  if (url.includes("/product/getTopProductByCategory") || url.includes("/product/getProducts")) {
    let category = null;
    let size = null;
    try {
      const urlObj = new URL(url, "http://dummy");
      category = urlObj.searchParams.get("category");
      const sizeParam = urlObj.searchParams.get("size");
      if (sizeParam) size = parseInt(sizeParam, 10);
    } catch (e) {}

    let filtered = allProducts;
    if (category) {
      filtered = allProducts.filter((p) => p.category === category);
    }
    return {
      data: {
        statusCode: 200,
        message: "OK",
        result: size ? filtered.slice(0, size) : filtered,
      },
    };
  }
  if (url.includes("/product/getProductById")) {
    let id = null;
    try {
      const urlObj = new URL(url, "http://dummy");
      id = urlObj.searchParams.get("id");
    } catch (e) {}
    const item = allProducts.find((p) => String(p.id) === String(id));
    if (item) {
      return {
        data: {
          statusCode: 200,
          message: "get product succesfully",
          result: item,
        },
      };
    }
  }
  return null;
};

// Đọc cache từ localStorage (Stale-While-Revalidate)
const readLocalStorageCache = (key) => {
  try {
    const raw = localStorage.getItem(`app_cache:${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Cache hợp lệ trong 60 phút
      if (Date.now() - parsed.timestamp < 60 * 60 * 1000) {
        return sanitizeAndEnrichResponse(parsed.data);
      }
    }
  } catch (e) {
    console.warn("Lỗi đọc cache localStorage:", e);
  }
  return null;
};

const saveLocalStorageCache = (key, rawResponse) => {
  try {
    if (!rawResponse || !rawResponse.data) return;
    const cleanData = {
      data: rawResponse.data,
      status: rawResponse.status || 200,
    };
    localStorage.setItem(
      `app_cache:${key}`,
      JSON.stringify({
        data: cleanData,
        timestamp: Date.now(),
      })
    );
  } catch (e) {
    console.warn("Lỗi lưu cache localStorage:", e);
  }
};

export const getCached = async (url, config = {}, ttlMs = 15 * 60 * 1000) => {
  const paramsKey = config.params ? JSON.stringify(config.params) : "";
  const key = `${url}:${paramsKey}`;

  // 1. Kiểm tra RAM cache
  const ramCached = responseCache.get(key);
  if (ramCached && ramCached.expiresAt > Date.now()) {
    return ramCached.response;
  }

  // 2. Kiểm tra LocalStorage cache (Hiển thị ngay lập tức 0ms)
  const localCached = readLocalStorageCache(key);
  if (localCached) {
    responseCache.set(key, { response: localCached, expiresAt: Date.now() + ttlMs });
    
    // Âm thầm gửi request làm mới dữ liệu dưới nền (Background Revalidation)
    if (!inFlightRequests.has(key)) {
      const bgRequest = axiosClient
        .get(url, config)
        .then((freshResponse) => {
          const enriched = sanitizeAndEnrichResponse(freshResponse);
          responseCache.set(key, { response: enriched, expiresAt: Date.now() + ttlMs });
          saveLocalStorageCache(key, enriched);
          return enriched;
        })
        .catch(() => null)
        .finally(() => inFlightRequests.delete(key));
      inFlightRequests.set(key, bgRequest);
    }
    return localCached;
  }

  // 3. Nếu chưa từng vào web và là API sản phẩm công khai -> Dùng Fallback tức thì (0ms)
  const fallback = getInitialFallback(url);
  if (fallback) {
    responseCache.set(key, { response: fallback, expiresAt: Date.now() + ttlMs });
    // Âm thầm gửi request để sync với backend thật
    if (!inFlightRequests.has(key)) {
      const bgRequest = axiosClient
        .get(url, config)
        .then((freshResponse) => {
          const enriched = sanitizeAndEnrichResponse(freshResponse);
          responseCache.set(key, { response: enriched, expiresAt: Date.now() + ttlMs });
          saveLocalStorageCache(key, enriched);
          return enriched;
        })
        .catch(() => null)
        .finally(() => inFlightRequests.delete(key));
      inFlightRequests.set(key, bgRequest);
    }
    return fallback;
  }

  // 4. Nếu là API khác (không có fallback), thực hiện request thông thường
  if (inFlightRequests.has(key)) return inFlightRequests.get(key);

  const request = axiosClient
    .get(url, config)
    .then((response) => {
      const enriched = sanitizeAndEnrichResponse(response);
      responseCache.set(key, { response: enriched, expiresAt: Date.now() + ttlMs });
      saveLocalStorageCache(key, enriched);
      return enriched;
    })
    .finally(() => inFlightRequests.delete(key));

  inFlightRequests.set(key, request);
  return request;
};

export const invalidateCached = (urlPrefix) => {
  for (const key of responseCache.keys()) {
    if (key.startsWith(urlPrefix)) {
      responseCache.delete(key);
      try {
        localStorage.removeItem(`app_cache:${key}`);
      } catch (e) {}
    }
  }
};
