import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Coffee, 
  ShoppingBag, 
  CreditCard, 
  ArrowLeft, 
  Check, 
  Plus, 
  Minus, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Flame
} from "lucide-react";
import "./OrderPage.css";
import "../src/Animation.css";
import axiosClient from "../AxiosClient";
import Navbar from "../Components/Navbar";
import { toast } from "react-toastify";
import { unlogout, getLogout } from "../ManagerLogout/ManagerLogout";
import {
  getAccessToken,
  setAccessToken,
} from "../ManagerAccessToken/ManagerAccessToken";
import {
  setCheckAddProduct,
  getCheckAddProduct,
} from "../ManagerAddCartProduct/ManagerAddCartProduct";

const NAV_HEIGHT = 80;

const SIZE_PRICE = {
  S: 0,
  M: 5000,
  L: 8000,
};

const CATEGORY_FALLBACKS = {
  coffee: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800",
  "milk-tea": "https://images.unsplash.com/photo-1558857563-b37cf537b0d7?auto=format&fit=crop&q=80&w=800",
  cake: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800",
  americano: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800",
  default: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800",
};

const OrderPage = () => {
  const [searchParam] = useSearchParams();
  const product_id = searchParam.get("id");
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const [_size, setSize] = useState("S");
  const [toppings, setToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [infoUser, setInfoUser] = useState(null);
  const [accessToken, setAccesstoken] = useState(getAccessToken());
  const [showSuccess, setShowSuccess] = useState(false);
  const [availableToppings, setAvailableToppings] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);

  const handleSizeChange = (newSize) => {
    setSize(newSize);
    setQuantity(1);
  };

  const toggleTopping = (topping) => {
    const isSelected = toppings.some((t) => t.id === topping.id);
    if (isSelected) {
      setToppings(toppings.filter((t) => t.id !== topping.id));
    } else {
      setToppings([...toppings, topping]);
    }
  };

  const flyToCartAnimation = (imageSource) => {
    const cartIcon = document.getElementById("cart-icon");
    const startElement = document.getElementById("product-image");

    if (!cartIcon || !startElement) {
      return;
    }

    const startRect = startElement.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyingImage = document.createElement("img");
    flyingImage.src = imageSource || CATEGORY_FALLBACKS.default;
    flyingImage.className = "flying-image";

    flyingImage.style.left = `${startRect.left + startRect.width / 2 - 25}px`;
    flyingImage.style.top = `${startRect.top + startRect.height / 2 - 25}px`;
    flyingImage.style.width = "50px";
    flyingImage.style.height = "50px";

    document.body.appendChild(flyingImage);

    setTimeout(() => {
      const startCenter = {
        x: startRect.left + startRect.width / 2,
        y: startRect.top + startRect.height / 2,
      };
      const endCenter = {
        x: cartRect.left + cartRect.width / 2,
        y: cartRect.top + cartRect.height / 2,
      };

      const translateX = endCenter.x - startCenter.x;
      const translateY = endCenter.y - startCenter.y;

      flyingImage.style.transform = `translate(${translateX}px, ${translateY}px)`;
      flyingImage.style.width = "20px";
      flyingImage.style.height = "20px";
      flyingImage.style.opacity = "0.5";
    }, 10);

    flyingImage.addEventListener("transitionend", () => {
      flyingImage.remove();
      cartIcon.style.transform = "scale(1.2)";
      setTimeout(() => {
        cartIcon.style.transform = "scale(1)";
      }, 200);
    });
  };

  const handleCheckout = () => {
    const token = getAccessToken();
    if (!token || getLogout() === 1) {
      toast.info("Vui lòng đăng nhập để tiến hành đặt hàng bạn nhé! ☕");
      localStorage.setItem(
        "page_before",
        window.location.pathname + window.location.search
      );
      navigate("/login");
      return;
    }

    navigate("/checkout", {
      state: {
        product: product,
        _size: _size,
        toppings: toppings,
        quantity: quantity,
        totalPrice: totalPrice,
        type: "ORDER_NOW",
      },
    });
  };

  const handleAddToCart = () => {
    const token = getAccessToken();
    if (!token || getLogout() === 1) {
      toast.info("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng nhé! ☕");
      localStorage.setItem(
        "page_before",
        window.location.pathname + window.location.search
      );
      navigate("/login");
      return;
    }

    flyToCartAnimation(imgSrc || product.img);
    const cartRequest = {
      productId: product.id,
      size: _size,
      toppingIds: toppings.map((t) => t.id),
      quantity,
      totalPrice,
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
    };
    axiosClient
      .post(`/cart/createCart`, cartRequest, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })
      .then((res) => {
        if (res.data.statusCode === 201) {
          setCheckAddProduct(1);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2400);
        }
      })
      .catch((err) => {
        console.error("Add to cart error:", err);
      });
  };

  useEffect(() => {
    localStorage.setItem(
      "page_before",
      window.location.pathname + window.location.search,
    );
  }, []);

  useEffect(() => {
    axiosClient
      .get("/auth/info", {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })
      .then((res) => {
        if (res.data?.result) {
          setInfoUser({
            fullname: res.data.result.fullname,
            picture: res.data.result.picture,
          });
        }
      })
      .catch((err) => {
        if (err.status === 401) {
          axiosClient
            .get("/auth/refresh_token", {
              withCredentials: true,
            })
            .then((res) => {
              if (res.data.statusCode === 200) {
                unlogout();
                setAccessToken(res.data.result.accessToken);
                setAccesstoken(res.data.result.accessToken);
              }
            })
            .catch(() => {});
        }
      });
  }, [accessToken]);

  useEffect(() => {
    axiosClient
      .get(`product/getProductById?id=${product_id}`)
      .then((res) => {
        if (res.data.statusCode === 200 && res.data.result) {
          const item = res.data.result;
          setAvailableToppings(item.toppingEntities || []);
          setProduct(item);
          setImgSrc(item.img || CATEGORY_FALLBACKS[item.category] || CATEGORY_FALLBACKS.default);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
      });
  }, [product_id]);

  const toppingExtra = useMemo(
    () =>
      (toppings || []).reduce(
        (total, item) => total + (item.price_topping || 0),
        0,
      ),
    [toppings],
  );

  const basePrice = product
    ? product.sale == null
      ? product.price
      : product.sale
    : 0;

  const unitPrice = product ? basePrice + (SIZE_PRICE[_size] || 0) + toppingExtra : 0;
  const totalPrice = unitPrice * quantity;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--page)] text-[var(--muted)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#d4a373] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold">Đang tải hương vị cà phê...</p>
        </div>
      </div>
    );
  }

  const fallbackImage = CATEGORY_FALLBACKS[product.category] || CATEGORY_FALLBACKS.default;

  return (
    <>
      <Navbar userInfo={infoUser} />
      <div
        className="order-page-wrapper page-shell min-h-screen"
        style={{ paddingTop: NAV_HEIGHT + 16, paddingBottom: 60 }}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Top Breadcrumb & Back */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigate("/product")}
              className="order-back-link"
            >
              <ArrowLeft size={16} />
              <span>Quay lại thực đơn</span>
            </button>
            <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-[var(--order-accent-soft)] text-[var(--order-accent)] border border-[var(--order-accent-border)]">
              {product.category === "coffee" ? "Cà phê đặc sản" : product.category === "cake" ? "Bánh tươi mỗi ngày" : "Thức uống chọn lọc"}
            </span>
          </div>

          {/* MAIN 2-COLUMN BALANCED GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ================= LEFT: SHOWCASE (5 Cols) ================= */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28"
            >
              <div className="order-glass-card p-5 sm:p-6 flex flex-col gap-5">
                {/* Image Frame */}
                <div id="product-image" className="order-image-frame shadow-md">
                  <img
                    src={imgSrc || fallbackImage}
                    alt={product.name}
                    onError={() => setImgSrc(fallbackImage)}
                    className="select-none"
                    loading="eager"
                  />
                  {product.sale != null && (
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-red-500 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                      <Flame size={12} />
                      <span>Sale</span>
                    </div>
                  )}
                </div>

                {/* Product Name & Description */}
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[var(--order-text-title)] tracking-tight leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-sm text-[var(--order-text-muted)] leading-relaxed mt-2 line-clamp-3">
                    {product.description || "Hương vị cà phê nguyên bản được pha chế từ những hạt cà phê hảo hạng, đậm đà và thơm lừng."}
                  </p>
                </div>

                {/* Price Tag */}
                <div className="pt-3 border-t border-[var(--order-border)] flex items-baseline justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--order-text-muted)]">
                    Giá khởi điểm
                  </span>
                  <div className="flex items-baseline gap-2">
                    {product.sale != null && (
                      <span className="text-sm text-gray-400 line-through font-medium">
                        {product.price.toLocaleString("vi-VN")}đ
                      </span>
                    )}
                    <span className="text-2xl sm:text-3xl font-black text-[var(--order-accent)]">
                      {(product.sale != null ? product.sale : product.price).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--order-border)] text-center text-[11px] font-bold text-[var(--order-text-muted)]">
                  <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[var(--order-field-bg)]">
                    <Coffee size={14} className="text-[var(--order-accent)]" />
                    <span>Pha tươi</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[var(--order-field-bg)]">
                    <Clock size={14} className="text-[var(--order-accent)]" />
                    <span>Giao 15-30p</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[var(--order-field-bg)]">
                    <ShieldCheck size={14} className="text-[var(--order-accent)]" />
                    <span>Chuẩn vị</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ================= RIGHT: CONSOLE (7 Cols) ================= */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-7 flex flex-col gap-4"
            >
              <div className="order-glass-card p-6 sm:p-8 flex flex-col">
                <div className="flex items-center justify-between pb-5 mb-5 border-b border-[var(--order-border)]">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[var(--order-text-title)] tracking-tight">
                      Tùy Chỉnh Đơn Hàng
                    </h2>
                    <p className="text-xs text-[var(--order-text-muted)] mt-0.5">
                      Chọn size, topping và số lượng cho ly nước của bạn
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-[var(--order-accent)] bg-[var(--order-accent-soft)] px-3 py-1.5 rounded-full border border-[var(--order-accent-border)]">
                    <Sparkles size={13} />
                    <span>Tùy chỉnh riêng</span>
                  </div>
                </div>

                {/* SECTION 1: CHỌN SIZE */}
                {product.category !== "cake" && (
                  <div className="order-console-section">
                    <div className="order-section-title">
                      <Coffee size={16} />
                      <span>Chọn Size</span>
                    </div>
                    <div className="order-size-grid">
                      {(product.sizeEntitySet && product.sizeEntitySet.length > 0
                        ? product.sizeEntitySet
                        : [
                            { id: 1, size: "S", price_size: 0 },
                            { id: 2, size: "M", price_size: 5000 },
                            { id: 3, size: "L", price_size: 8000 },
                          ]
                      ).map((item) => {
                        const active = _size === item.size;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSizeChange(item.size)}
                            className={`order-size-btn ${active ? "active" : ""}`}
                          >
                            <span className="order-size-name">{item.size}</span>
                            <span className="order-size-price">
                              {item.price_size > 0
                                ? `+${(item.price_size / 1000).toFixed(0)}k`
                                : "Cơ bản"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SECTION 2: CHỌN TOPPING */}
                {product.category !== "cake" && availableToppings && availableToppings.length > 0 && (
                  <div className="order-console-section">
                    <div className="order-section-title">
                      <Sparkles size={16} />
                      <span>Thêm Topping ({toppings.length} đã chọn)</span>
                    </div>
                    <div className="order-topping-grid">
                      {availableToppings.map((t) => {
                        const selected = toppings.some((item) => item.id === t.id);
                        return (
                          <div
                            key={t.id}
                            onClick={() => toggleTopping(t)}
                            className={`order-topping-card ${selected ? "active" : ""}`}
                          >
                            {selected && (
                              <div className="order-topping-check">
                                <Check size={12} strokeWidth={3} />
                              </div>
                            )}
                            <span className="order-topping-name truncate w-full">
                              {t.nameTopping}
                            </span>
                            <span className="order-topping-price">
                              +{t.price_topping.toLocaleString("vi-VN")}đ
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SECTION 3: SỐ LƯỢNG & TỔNG TIỀN TRỰC TIẾP */}
                <div className="order-bottom-bar">
                  <div className="flex flex-col gap-1.5">
                    <span className="order-total-label">Số lượng</span>
                    <div className="order-stepper">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="order-stepper-btn"
                        aria-label="Giảm"
                      >
                        <Minus size={15} strokeWidth={2.5} />
                      </button>
                      <span className="order-stepper-value">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="order-stepper-btn"
                        aria-label="Tăng"
                      >
                        <Plus size={15} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  <div className="order-total-block">
                    <span className="order-total-label">Tổng cộng</span>
                    <div className="order-total-price">
                      {totalPrice.toLocaleString("vi-VN")}
                      <span className="text-lg ml-0.5">đ</span>
                    </div>
                    {quantity > 1 && (
                      <span className="text-[11px] font-semibold text-[var(--order-text-muted)] block">
                        ({unitPrice.toLocaleString("vi-VN")}đ / ly)
                      </span>
                    )}
                  </div>
                </div>

                {/* SUCCESS NOTIFICATION */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <Check size={16} strokeWidth={3} />
                      <span>Đã thêm vào giỏ hàng thành công!</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* SECTION 4: ACTIONS */}
                <div className="order-actions-grid">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddToCart}
                    className="order-btn-secondary"
                  >
                    <ShoppingBag size={18} />
                    <span>Thêm vào giỏ</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCheckout}
                    className="order-btn-primary"
                  >
                    <CreditCard size={18} />
                    <span>Thanh toán ngay</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
