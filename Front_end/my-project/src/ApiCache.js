import axiosClient from "./AxiosClient";
import fallbackData from "./fallbackProducts.json";

const responseCache = new Map();
const inFlightRequests = new Map();

// Trích xuất dữ liệu dự phòng (fallback) để hiển thị tức thì (0ms) khi server Render đang ngủ
const getInitialFallback = (url) => {
  const allProducts = fallbackData?.result || [];
  if (url.includes("/product/public")) {
    return { data: { statusCode: 200, message: "OK", result: allProducts } };
  }
  if (url.includes("/product/getTopProductByCategory") || url.includes("/product/getProducts")) {
    const urlObj = new URL(url, "http://dummy");
    const category = urlObj.searchParams.get("category");
    const size = parseInt(urlObj.searchParams.get("size")) || 6;
    let filtered = allProducts;
    if (category) {
      filtered = allProducts.filter((p) => p.category === category);
    }
    return {
      data: {
        statusCode: 200,
        message: "OK",
        result: filtered.slice(0, size),
      },
    };
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
        return parsed.data;
      }
    }
  } catch (e) {
    console.warn("Lỗi đọc cache localStorage:", e);
  }
  return null;
};

const saveLocalStorageCache = (key, data) => {
  try {
    localStorage.setItem(
      `app_cache:${key}`,
      JSON.stringify({
        data,
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
          responseCache.set(key, { response: freshResponse, expiresAt: Date.now() + ttlMs });
          saveLocalStorageCache(key, freshResponse);
          return freshResponse;
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
          responseCache.set(key, { response: freshResponse, expiresAt: Date.now() + ttlMs });
          saveLocalStorageCache(key, freshResponse);
          return freshResponse;
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
      responseCache.set(key, { response, expiresAt: Date.now() + ttlMs });
      saveLocalStorageCache(key, response);
      return response;
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
