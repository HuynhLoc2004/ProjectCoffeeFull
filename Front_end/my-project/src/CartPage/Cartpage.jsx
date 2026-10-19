import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaShoppingCart, FaArrowLeft, FaShieldAlt, FaTruck, FaCoffee } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "./CartPage.css";
import ProductCart from "./ProductCart";
import Navbar from "../Components/Navbar";
import {
  getAccessToken,
  setAccessToken,
} from "../ManagerAccessToken/ManagerAccessToken";
import { unlogout } from "../ManagerLogout/ManagerLogout";
import { setCheckAddProduct } from "../ManagerAddCartProduct/ManagerAddCartProduct";
import axiosClient from "../AxiosClient";

const EmptyCart = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col items-center justify-center text-center py-20 px-4"
  >
    <div className="w-28 h-28 rounded-full bg-[#d4a373]/10 border border-[#d4a373]/20 flex items-center justify-center mb-6 shadow-inner">
      <FaCoffee className="w-12 h-12 text-[#d4a373]" />
    </div>
    
    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--ink,#fff)] mb-3">
      Giỏ hàng của bạn đang trống
    </h2>
    
    <p className="text-sm sm:text-base text-gray-400 max-w-md mb-8 leading-relaxed">
      Hãy khám phá thực đơn đa dạng của The Coffee Chill và thưởng thức những ly cà phê hảo hạng cùng món bánh thơm ngon.
    </p>

    <Link
      to="/product"
      className="inline-flex items-center gap-3 px-8 py-4 cart-checkout-btn rounded-2xl text-sm font-black uppercase tracking-wider"
    >
      <FaArrowLeft size={13} /> Khám phá thực đơn
    </Link>
  </motion.div>
);

const CartSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-28 rounded-2xl bg-white/5 border border-white/5" />
    ))}
  </div>
);

const Cartpage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const pendingUpdatesRef = useRef(new Map());

  // Helper to fetch cart from server
  const fetchCart = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      toast.info("Vui lòng đăng nhập để xem giỏ hàng của bạn nhé! ☕");
      localStorage.setItem(
        "page_before",
        window.location.pathname + window.location.search
      );
      navigate("/login");
      return;
    }

    try {
      const res = await axiosClient.get("/cart/getCart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.statusCode === 204 || res.data?.statusCode === 200) {
        setCart(res.data.result || null);
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        try {
          const refreshRes = await axiosClient.get("/auth/refresh_token", {
            withCredentials: true,
          });
          if (refreshRes.data?.statusCode === 200 && refreshRes.data?.result?.accessToken) {
            setAccessToken(refreshRes.data.result.accessToken);
            unlogout();
            const retryRes = await axiosClient.get("/cart/getCart", {
              headers: { Authorization: `Bearer ${refreshRes.data.result.accessToken}` },
            });
            if (retryRes.data?.statusCode === 204 || retryRes.data?.statusCode === 200) {
              setCart(retryRes.data.result || null);
            }
          } else {
            localStorage.setItem("page_before", window.location.pathname + window.location.search);
            navigate("/login");
          }
        } catch {
          localStorage.setItem("page_before", window.location.pathname + window.location.search);
          navigate("/login");
        }
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // OPTIMISTIC QUANTITY INCREASE (0ms UI latency)
  const handleIncreaseQuantity = useCallback(async (productId) => {
    let unitPrice = 0;
    let rollbackSnapshot = null;

    setCart((prev) => {
      if (!prev || !prev.cartProductEntities) return prev;
      rollbackSnapshot = prev;

      const updatedEntities = prev.cartProductEntities.map((item) => {
        if (item.id === productId) {
          unitPrice = item.quantity > 0 ? item.totalPrice / item.quantity : 0;
          const nextQty = item.quantity + 1;
          return {
            ...item,
            quantity: nextQty,
            totalPrice: Math.round(nextQty * unitPrice),
          };
        }
        return item;
      });

      return {
        ...prev,
        totalPrice: Math.round(prev.totalPrice + unitPrice),
        cartProductEntities: updatedEntities,
      };
    });

    setCheckAddProduct(1);

    // Background sync
    try {
      const token = getAccessToken();
      const res = await axiosClient.put(
        `/cartproduct/incrCartproduct/${productId}`,
        { quantityUpdate: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.result !== true && res.data?.statusCode !== 204) {
        if (rollbackSnapshot) setCart(rollbackSnapshot);
        setCheckAddProduct(-1);
        toast.error("Không thể cập nhật số lượng món!");
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        try {
          const refreshRes = await axiosClient.get("/auth/refresh_token", { withCredentials: true });
          if (refreshRes.data?.statusCode === 200) {
            setAccessToken(refreshRes.data.result.accessToken);
            unlogout();
            await axiosClient.put(
              `/cartproduct/incrCartproduct/${productId}`,
              { quantityUpdate: 1 },
              { headers: { Authorization: `Bearer ${refreshRes.data.result.accessToken}` } }
            );
            return;
          }
        } catch (e) {}
      }
      if (rollbackSnapshot) setCart(rollbackSnapshot);
      setCheckAddProduct(-1);
      toast.error("Lỗi mạng khi cập nhật số lượng!");
    }
  }, []);

  // OPTIMISTIC QUANTITY DECREASE (0ms UI latency)
  const handleDecreaseQuantity = useCallback(async (productId) => {
    let unitPrice = 0;
    let rollbackSnapshot = null;

    setCart((prev) => {
      if (!prev || !prev.cartProductEntities) return prev;
      const target = prev.cartProductEntities.find((p) => p.id === productId);
      if (!target || target.quantity <= 1) return prev;

      rollbackSnapshot = prev;
      unitPrice = target.totalPrice / target.quantity;

      const updatedEntities = prev.cartProductEntities.map((item) => {
        if (item.id === productId) {
          const nextQty = item.quantity - 1;
          return {
            ...item,
            quantity: nextQty,
            totalPrice: Math.round(nextQty * unitPrice),
          };
        }
        return item;
      });

      return {
        ...prev,
        totalPrice: Math.max(0, Math.round(prev.totalPrice - unitPrice)),
        cartProductEntities: updatedEntities,
      };
    });

    if (!rollbackSnapshot) return;
    setCheckAddProduct(-1);

    // Background sync
    try {
      const token = getAccessToken();
      const res = await axiosClient.put(
        `/cartproduct/descCartproduct/${productId}`,
        { quantityUpdate: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.result !== true && res.data?.statusCode !== 204) {
        if (rollbackSnapshot) setCart(rollbackSnapshot);
        setCheckAddProduct(1);
        toast.error("Không thể cập nhật số lượng món!");
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        try {
          const refreshRes = await axiosClient.get("/auth/refresh_token", { withCredentials: true });
          if (refreshRes.data?.statusCode === 200) {
            setAccessToken(refreshRes.data.result.accessToken);
            unlogout();
            await axiosClient.put(
              `/cartproduct/descCartproduct/${productId}`,
              { quantityUpdate: 1 },
              { headers: { Authorization: `Bearer ${refreshRes.data.result.accessToken}` } }
            );
            return;
          }
        } catch (e) {}
      }
      if (rollbackSnapshot) setCart(rollbackSnapshot);
      setCheckAddProduct(1);
      toast.error("Lỗi mạng khi cập nhật số lượng!");
    }
  }, []);

  // OPTIMISTIC DELETE ITEM (0ms UI latency)
  const handleDeleteItem = useCallback(async (productId) => {
    let removedItem = null;
    let rollbackSnapshot = null;

    setCart((prev) => {
      if (!prev || !prev.cartProductEntities) return prev;
      removedItem = prev.cartProductEntities.find((p) => p.id === productId);
      if (!removedItem) return prev;

      rollbackSnapshot = prev;
      const filtered = prev.cartProductEntities.filter((p) => p.id !== productId);

      return {
        ...prev,
        totalPrice: Math.max(0, Math.round(prev.totalPrice - removedItem.totalPrice)),
        cartProductEntities: filtered,
      };
    });

    if (!removedItem) return;
    setCheckAddProduct(-removedItem.quantity);

    try {
      const token = getAccessToken();
      const res = await axiosClient.delete(`/cartproduct/deleteCartproduct/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.result !== true && res.data?.statusCode !== 204) {
        if (rollbackSnapshot) setCart(rollbackSnapshot);
        setCheckAddProduct(removedItem.quantity);
        toast.error("Không thể xóa sản phẩm khỏi giỏ!");
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        try {
          const refreshRes = await axiosClient.get("/auth/refresh_token", { withCredentials: true });
          if (refreshRes.data?.statusCode === 200) {
            setAccessToken(refreshRes.data.result.accessToken);
            unlogout();
            await axiosClient.delete(`/cartproduct/deleteCartproduct/${productId}`, {
              headers: { Authorization: `Bearer ${refreshRes.data.result.accessToken}` },
            });
            return;
          }
        } catch (e) {}
      }
      if (rollbackSnapshot) setCart(rollbackSnapshot);
      setCheckAddProduct(removedItem.quantity);
      toast.error("Lỗi khi xóa sản phẩm!");
    }
  }, []);

  const handleCheckout = () => {
    if (!cart || !cart.cartProductEntities || cart.cartProductEntities.length === 0) {
      toast.warn("Giỏ hàng của bạn đang trống!");
      return;
    }
    navigate("/checkout", {
      state: {
        cartData: cart,
        type: "CART",
      },
    });
  };

  const totalItemsCount = cart?.cartProductEntities?.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  ) || 0;

  return (
    <div className="cart-page-wrapper">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        <div className="cart-main-card rounded-3xl p-6 sm:p-10">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-8 border-b border-[var(--line,rgba(255,255,255,0.08))] gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--ink,#fff)] flex items-center gap-3">
                <FaShoppingCart className="text-[#d4a373]" size={28} />
                Giỏ Hàng Của Bạn
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {totalItemsCount > 0
                  ? `Đang có ${totalItemsCount} món thơm ngon sẵn sàng thưởng thức`
                  : "Chưa có món nào được chọn"}
              </p>
            </div>

            <Link
              to="/product"
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#d4a373] transition-colors uppercase tracking-widest py-2 px-3 rounded-xl hover:bg-white/5"
            >
              <FaArrowLeft size={11} /> Tiếp tục chọn món
            </Link>
          </div>

          {/* Body Content */}
          {loading ? (
            <CartSkeleton />
          ) : !cart || !cart.cartProductEntities || cart.cartProductEntities.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              {/* Product List with Smooth Exit Animation */}
              <div className="space-y-1 mb-8">
                <AnimatePresence mode="popLayout">
                  {cart.cartProductEntities.map((item) => (
                    <ProductCart
                      key={item.id}
                      cartProduct={item}
                      onIncrease={handleIncreaseQuantity}
                      onDecrease={handleDecreaseQuantity}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="cart-item-card rounded-3xl p-6 sm:p-8 mt-6">
                <div className="space-y-3 pb-6 border-b border-white/5">
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>Tổng số lượng:</span>
                    <span className="font-bold text-[var(--ink,#fff)]">{totalItemsCount} ly/món</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span className="flex items-center gap-2">
                      <FaTruck className="text-[#d4a373]" /> Phí vận chuyển:
                    </span>
                    <span className="font-bold text-green-500">Miễn phí giao hàng</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 gap-6">
                  <div>
                    <span className="text-xs uppercase font-bold text-gray-400 tracking-wider block mb-1">
                      Tổng tiền thanh toán
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-[#d4a373] tracking-tight">
                      {Number(cart.totalPrice || 0).toLocaleString("vi-VN")}đ
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full sm:w-auto px-10 py-5 cart-checkout-btn rounded-2xl text-base font-black uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <FaShieldAlt size={16} /> Thanh toán ngay
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Cartpage;
