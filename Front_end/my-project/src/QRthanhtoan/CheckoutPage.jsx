import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaShoppingBag, FaArrowLeft, FaCheckCircle, FaCreditCard } from "react-icons/fa";
import { toast } from "react-toastify";
import axiosClient from "../AxiosClient";
import { getAccessToken } from "../ManagerAccessToken/ManagerAccessToken";

const NAV_HEIGHT = 80;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfaf7] text-gray-500">
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
        >
            <FaShoppingBag className="mx-auto text-6xl mb-4 text-[#d4a373]/30" />
            <h2 className="text-2xl font-bold text-[#3b2a20]">Không có thông tin đơn hàng</h2>
            <button 
                onClick={() => navigate("/")}
                className="mt-4 px-6 py-2 bg-[#3b2a20] text-white rounded-full font-medium"
            >
                Quay lại cửa hàng
            </button>
        </motion.div>
      </div>
    );
  }

  const { cartData, product, _size, toppings, quantity, totalPrice, orderCode, type } = state;

  const isCart = type === "CART";

  const handleConfirmOrder = () => {
    if (!address.trim()) {
      toast.warn("Vui lòng nhập địa chỉ nhận hàng!");
      return;
    }

    setIsLoading(true);

    const orderPayload = isCart 
      ? {
          totalPrice: cartData.totalPrice,
          createOrder: Date.now(),
          cartProductEntities: cartData.cartProductEntities,
          type_order: "ORDER_CART",
          address: address.trim(),
        }
      : {
          totalPrice: totalPrice,
          createOrder: Date.now(),
          cartProductEntities: [
            {
              product: product,
              size: _size,
              toppings: toppings,
              quantity: quantity,
            }
          ],
          type_order: "ORDER_SINGLE",
          address: address.trim(),
        };

    axiosClient
      .post("/order/create", orderPayload, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      })
      .then((res) => {
        if (res.data.statusCode === 201) {
          const order_id = res.data.result;
          // Gọi API lấy link thanh toán PayOS
          axiosClient
            .get(`/payos/createQr?order_id=${order_id}`, {
              headers: { Authorization: `Bearer ${getAccessToken()}` },
            })
            .then((payRes) => {
              if (payRes.data.statusCode === 200) {
                window.location.href = payRes.data.result.checkoutUrl;
              }
            })
            .catch((err) => {
              toast.error("Không thể tạo link thanh toán!");
              setIsLoading(false);
            });
        }
      })
      .catch((err) => {
        toast.error("Có lỗi xảy ra khi tạo đơn hàng!");
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-[#fdfaf7] pb-20" style={{ paddingTop: NAV_HEIGHT }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-4 mb-8"
        >
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-[#3b2a20]"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-3xl font-black text-[#3b2a20] tracking-tight">Xác nhận thanh toán</h1>
            <p className="text-[#8b735b]">Vui lòng kiểm tra lại thông tin và địa chỉ giao hàng</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form & Info */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Address Form */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[2rem] p-8 shadow-xl shadow-brown-500/5 border border-brown-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#d4a373]/10 rounded-xl flex items-center justify-center text-[#d4a373]">
                  <FaMapMarkerAlt />
                </div>
                <h3 className="text-xl font-bold text-[#3b2a20]">Địa chỉ giao hàng</h3>
              </div>
              
              <div className="relative group">
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập địa chỉ chi tiết (Số nhà, tên đường, phường/xã, quận/huyện...)"
                  className="w-full bg-[#fdfaf7] border-2 border-transparent focus:border-[#d4a373]/30 rounded-2xl p-5 min-h-[120px] outline-none transition-all text-[#3b2a20] placeholder:text-gray-400 font-medium"
                />
                {!address && (
                    <div className="absolute bottom-4 right-4 text-xs text-red-400 font-bold flex items-center gap-1">
                        * Bắt buộc
                    </div>
                )}
              </div>
              
              <div className="mt-4 flex items-start gap-2 text-sm text-[#8b735b] bg-[#d4a373]/5 p-4 rounded-xl">
                <FaCheckCircle className="mt-1 text-[#d4a373]" />
                <p>Đảm bảo địa chỉ chính xác để shipper có thể liên lạc và giao hàng đúng hẹn cho bạn nhé!</p>
              </div>
            </motion.div>

            {/* Payment Method (Static for now) */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2rem] p-8 shadow-xl shadow-brown-500/5 border border-brown-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                  <FaCreditCard />
                </div>
                <h3 className="text-xl font-bold text-[#3b2a20]">Phương thức thanh toán</h3>
              </div>
              <div className="p-4 border-2 border-[#d4a373] bg-[#d4a373]/5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="https://img.vietqr.io/image/970422-0977958350-compact2.jpg?amount=0&addInfo=Payment&accountName=HUYNH%20TAN%20LOC" className="w-12 h-12 object-contain rounded-lg" alt="PayOS" />
                  <div>
                    <p className="font-bold text-[#3b2a20]">Cổng thanh toán PayOS</p>
                    <p className="text-xs text-[#8b735b]">Thanh toán qua mã QR ngân hàng</p>
                  </div>
                </div>
                <FaCheckCircle className="text-[#d4a373] text-xl" />
              </div>
            </motion.div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-[#3b2a20] text-white rounded-[2rem] p-8 shadow-2xl sticky top-24"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FaShoppingBag /> Tóm tắt đơn hàng
              </h3>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-6">
                {isCart ? (
                  cartData.cartProductEntities.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center py-3 border-b border-white/10">
                      <div className="w-16 h-16 bg-white/10 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                        <img src={item.product.image} className="w-full h-full object-cover" alt={item.product.name} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate text-sm">{item.product.name}</p>
                        <p className="text-xs text-white/60">x{item.quantity} • {item.size}</p>
                      </div>
                      <p className="font-bold text-sm">{(item.product.price * item.quantity).toLocaleString()}đ</p>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-4 items-center py-3">
                    <div className="w-16 h-16 bg-white/10 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold truncate text-sm">{product.name}</p>
                        <p className="text-xs text-white/60">x{quantity} • {_size}</p>
                    </div>
                    <p className="font-bold text-sm">{(totalPrice).toLocaleString()}đ</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex justify-between text-white/60">
                  <span>Tạm tính</span>
                  <span>{(isCart ? cartData.totalPrice : totalPrice).toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                <div className="flex justify-between text-2xl font-black pt-2 text-[#d4a373]">
                  <span>Tổng cộng</span>
                  <span>{(isCart ? cartData.totalPrice : totalPrice).toLocaleString()}đ</span>
                </div>
              </div>

              <button
                disabled={!address.trim() || isLoading}
                onClick={handleConfirmOrder}
                className={`w-full mt-8 py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
                  !address.trim() || isLoading
                    ? "bg-white/10 text-white/30 cursor-not-allowed"
                    : "bg-[#d4a373] text-white hover:bg-[#c29263] hover:scale-[1.02] active:scale-95 shadow-[#d4a373]/20"
                }`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>XÁC NHẬN THANH TOÁN</>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
