import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import "../src/Animation.css";
import SizeSelector from "../Components/ComponentOrder/SizeSelector";
import ToppingSelector from "../Components/ComponentOrder/ToppingSelector";
import QuantitySelector from "../Components/ComponentOrder/QuantitySelector";
import axiosClient from "../AxiosClient";
import Navbar from "../Components/Navbar";
import { unlogout, logout, getLogout } from "../ManagerLogout/ManagerLogout";
import {
  getAccessToken,
  setAccessToken,
} from "../ManagerAccessToken/ManagerAccessToken";
const NAV_HEIGHT = 80;

import {
  setCheckAddProduct,
  getCheckAddProduct,
} from "../ManagerAddCartProduct/ManagerAddCartProduct";
const SIZE_PRICE = {
  S: 0,
  M: 5000,
  L: 8000,
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
  const [checkaddcartProduct, setCheckaddcartProduct] =
    useState(getCheckAddProduct());
  // Reset quantity to 1 when size changes
  console.log(getCheckAddProduct());
  let toppingExtra = 0;
  const handleSizeChange = (newSize) => {
    setSize(newSize);
    setQuantity(1); // Reset quantity to 1
  };
  const flyToCartAnimation = (imageSrc) => {
    const cartIcon = document.getElementById("cart-icon");
    const startElement = document.getElementById("product-image"); // Add an ID to the product image container

    if (!cartIcon || !startElement) {
      console.error("Cart icon or start element not found!");
      return;
    }

    const startRect = startElement.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyingImage = document.createElement("img");
    flyingImage.src = imageSrc;
    flyingImage.className = "flying-image";

    // Set initial position
    flyingImage.style.left = `${startRect.left + startRect.width / 2 - 25}px`;
    flyingImage.style.top = `${startRect.top + startRect.height / 2 - 25}px`;
    flyingImage.style.width = "50px";
    flyingImage.style.height = "50px";

    document.body.appendChild(flyingImage);

    // Animate to cart
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
    }, 10); // Small delay to ensure transition triggers

    // Remove the element after animation
    flyingImage.addEventListener("transitionend", () => {
      flyingImage.remove();
      // Optional: Add a little jiggle to the cart icon
      cartIcon.style.transform = "scale(1.2)";
      setTimeout(() => {
        cartIcon.style.transform = "scale(1)";
      }, 200);
    });
  };

  const handleCheckout = (e) => {
    navigate("/checkout", {
      state: {
        product: product,
        _size: _size,
        toppings: toppings,
        quantity: quantity,
        totalPrice: totalPrice,
        type: "ORDER_NOW"
      }
    });
  };

  const handleAddToCart = (e) => {
    flyToCartAnimation(product.img);
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
        if (res.data.statusCode == 201) {
          console.log(res);
          setCheckAddProduct(1);
          setCheckaddcartProduct((prev) => prev + 1);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        }
      })
      .catch((err) => {
        if (err.status == 401) {
          console.log(err);
        }
      });
  };
  useEffect(() => {
    localStorage.setItem(
      "page_before",
      window.location.pathname + window.location.search,
    );
  });
  useEffect(() => {
    axiosClient
      .get("/auth/info", {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          withCredentials: getLogout() == 1 ? true : false,
        },
      })
      .then((res) => {
        setInfoUser({
          fullname: res.data.result.fullname,
          picture: res.data.result.picture,
        });
      })
      .catch((err) => {
        if (err.status == 401) {
          axiosClient
            .get("/auth/refresh_token", {
              withCredentials: true,
            })
            .then((res) => {
              if (res.data.statusCode == 401) {
                localStorage.setItem(
                  "page_before",
                  window.location.pathname + window.location.search,
                );
                navigate("/login");
              }
              unlogout();
              setAccessToken(res.data.result.accessToken);
              setAccesstoken(res.data.result.accessToken);
            })
            .catch((err) => {
              if (err.status == 401) {
                localStorage.setItem(
                  "page_before",
                  window.location.pathname + window.location.search,
                );
                navigate("/login");
              }
            });
        }
      });
  }, [accessToken]);

  useEffect(() => {
    axiosClient
      .get(`product/getProductById?id=${product_id}`)
      .then((res) => {
        if (res.data.statusCode == 200) {
          setAvailableToppings(res.data.result.toppingEntities || []);
          setProduct(res.data.result);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [product_id]);

  const totalPrice = useMemo(() => {
    if (!product) return -1;
    const basePrice = product.sale == null ? product.price : product.sale;
    const sizeExtra = SIZE_PRICE[_size] || 0;

    if (toppings != null) {
      toppings.forEach((item) => {
        toppingExtra += item.price_topping;
      });
    }
    return (basePrice + sizeExtra + toppingExtra) * quantity;
  }, [product, _size, toppings, quantity]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Đang tải sản phẩm...
      </div>
    );
  }

  return (
    <>
      <Navbar userInfo={infoUser} />
      <div
        className="min-h-screen bg-gray-50"
        style={{ paddingTop: NAV_HEIGHT }}
      >
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl mx-auto"
          >
            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
              {/* LEFT - PRODUCT IMAGE AND DETAILS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="flex flex-col lg:sticky lg:top-32 h-fit w-full"
              >
                <div
                  id="product-image"
                  className="relative w-full aspect-square overflow-hidden rounded-[2.5rem] mb-8 bg-gradient-to-br from-gray-50 to-gray-200/50 shadow-inner border border-white/40"
                >
                  <motion.img
                    animate={{
                      rotateY: [0, 90, 180, 270, 360],
                      translateY: ["0%", "2%", "0%", "-2%", "0%"],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-contain p-6 md:p-12 drop-shadow-2xl"
                  />
                </div>

                <div className="space-y-4 text-center lg:text-left px-2">
                  <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[0.9]">
                    {product.name}
                  </h1>
                  <p className="text-sm md:text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                    {product.description}
                  </p>
                  <div className="pt-4 flex flex-col items-center lg:items-start">
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#D4A373] font-black mb-1">
                      Giá khởi điểm
                    </span>
                    <p className="text-5xl md:text-7xl font-black text-[#1a1a1a] tracking-tighter">
                      {product.sale == null
                        ? product.price.toLocaleString()
                        : product.sale.toLocaleString()}
                      <span className="text-2xl md:text-3xl ml-1">đ</span>
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* RIGHT - CUSTOMIZATION & CHECKOUT */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-col space-y-8 w-full items-center lg:items-stretch"
              >
                {/* Customization Card */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-10 space-y-8 w-full flex flex-col items-center lg:items-stretch">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 border-b border-gray-100 pb-6 tracking-tight w-full text-center lg:text-left">
                    Tùy Chỉnh
                  </h2>

                  {product.category !== "cake" && (
                    <div className="w-full flex flex-col items-center lg:items-start">
                      <label className="block text-lg font-bold text-gray-900 mb-4 tracking-tight">
                        📏 Chọn Size
                      </label>
                      <div className="flex justify-center lg:justify-start w-full">
                        <SizeSelector
                          _size={_size}
                          setSize={handleSizeChange}
                          listSize={product.sizeEntitySet}
                        />
                      </div>
                    </div>
                  )}

                  {product.category !== "cake" && (
                    <div className="w-full flex flex-col items-center lg:items-start">
                      <label className="block text-lg font-bold text-gray-900 mb-4 tracking-tight">
                        ✨ Thêm Topping
                      </label>
                      <div className="bg-slate-50 rounded-[1.5rem] p-4 h-56 overflow-y-auto border border-gray-100 w-full">
                        <ToppingSelector
                          availableToppings={availableToppings}
                          selectedToppings={toppings}
                          setSelectedToppings={setToppings}
                        />
                      </div>
                    </div>
                  )}

                  <div className="w-full flex flex-col items-center lg:items-start">
                    <label className="block text-lg font-bold text-gray-900 mb-4 tracking-tight">
                      🛒 Số lượng
                    </label>
                    <div className="flex justify-center lg:justify-start w-full">
                      <QuantitySelector
                        quantity={quantity}
                        setQuantity={setQuantity}
                      />
                    </div>
                  </div>
                </div>

                {/* Summary Card */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-10 space-y-6 w-full">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 border-b border-gray-100 pb-6 tracking-tight text-center lg:text-left">
                    Tóm Tắt Đơn Hàng
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-gray-600 font-medium">
                      <span>Giá sản phẩm:</span>
                      <span className="text-gray-900 font-bold">
                        {(product.sale == null
                          ? product.price * quantity
                          : product.sale * quantity
                        ).toLocaleString()}
                        đ
                      </span>
                    </div>
                    {toppings.length > 0 && (
                      <div className="flex justify-between items-center text-gray-600 font-medium">
                        <span>Topping:</span>
                        <span className="text-gray-900 font-bold">
                          {toppingExtra.toLocaleString()}đ
                        </span>
                      </div>
                    )}
                    {_size !== "S" && (
                      <div className="flex justify-between items-center text-gray-600 font-medium">
                        <span>
                          Phụ thu Size ({_size}):
                        </span>
                        <span className="text-gray-900 font-bold">
                          {(SIZE_PRICE[_size] * quantity).toLocaleString()}đ
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-2xl md:text-3xl font-black pt-6 border-t-2 border-dashed border-gray-100">
                    <span>Tổng cộng:</span>
                    <span className="text-[#D4A373]">
                      {totalPrice.toLocaleString()}đ
                    </span>
                  </div>
                </div>

                {/* Success Message */}
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center text-base font-semibold text-green-700"
                  >
                    ✅ Thêm vào giỏ hàng thành công!
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => handleCheckout(e)}
                    className="w-full py-4 text-lg rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    💳 Thanh toán ngay
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => handleAddToCart(e)}
                    className="w-full py-3 rounded-xl bg-black text-white font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    🛒 Thêm vào giỏ
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 1 }}
                    onClick={() => navigate("/product")}
                    className="w-full py-3 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 transition-all"
                  >
                    ← Quay lại trang sản phẩm
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
