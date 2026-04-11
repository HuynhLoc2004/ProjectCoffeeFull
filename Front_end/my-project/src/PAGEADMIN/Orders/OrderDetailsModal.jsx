import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Package, 
  ShoppingCart,
  Clock,
  ChevronRight,
  Coffee,
  CreditCard,
  Hash,
  MapPin,
  User,
  Mail
} from "lucide-react";

const getStatusStyle = (status) => {
  switch (status) {
    case "PAID":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "CANCEL":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    default:
      return "bg-orange-500/10 text-orange-500 border-orange-500/20";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "PAID":
      return "Đã thanh toán";
    case "CANCEL":
      return "Đã hủy";
    default:
      return status || "Đang xử lý";
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return "---";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999] flex items-center justify-center p-4"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] z-[1000] overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-8 py-8 border-b border-neutral-800 bg-white/[0.02]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                    <Package className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">Chi tiết hoá đơn</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Hash className="w-3 h-3 text-neutral-500" />
                      <span className="text-sm font-mono text-neutral-400 font-bold">{order.id || "N/A"}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-3 rounded-2xl hover:bg-neutral-800 text-neutral-500 hover:text-white transition-all active:scale-90"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-8 overflow-y-auto space-y-8 custom-scrollbar">
              
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-5 rounded-[2rem] bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center text-center space-y-2">
                  <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Trạng thái</p>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </div>
                </div>
                <div className="p-5 rounded-[2rem] bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center text-center space-y-1">
                  <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Thời gian đặt</p>
                  <p className="text-sm font-black text-white">{formatDate(order.createdAt)}</p>
                </div>
                <div className="p-5 rounded-[2rem] bg-orange-500/5 border border-orange-500/10 flex flex-col items-center justify-center text-center space-y-1">
                  <p className="text-[10px] font-black text-orange-500/50 uppercase tracking-widest">Tổng tiền</p>
                  <p className="text-xl font-black text-orange-500">{formatPrice(order.totalPrice)}</p>
                  <p className="text-[10px] text-orange-500/30 font-bold uppercase">VNĐ</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-6 rounded-[2rem] bg-neutral-900 border border-neutral-800 space-y-4">
                <div className="flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-[0.2em]">
                  <User className="w-4 h-4 text-orange-500" />
                  Thông tin khách hàng
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-neutral-500 font-bold uppercase">Tên khách hàng</p>
                    <p className="text-sm text-white font-black uppercase">{order.fullname || "---"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-neutral-500 font-bold uppercase">Email liên hệ</p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-orange-500" />
                      <p className="text-sm text-white font-black">{order.mail || "---"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1 pt-2 border-t border-neutral-800">
                  <p className="text-[10px] text-neutral-500 font-bold uppercase">Địa chỉ giao hàng</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3 h-3 text-orange-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-neutral-300 font-medium leading-relaxed">{order.address || "---"}</p>
                  </div>
                </div>
              </div>

              {/* Products List */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-[0.2em] mb-2">
                  <ShoppingCart className="w-4 h-4 text-orange-500" />
                  Danh sách sản phẩm ({order.quantity || 0} loại)
                </div>

                <div className="space-y-3">
                  {order.orderDetailsDTOS && order.orderDetailsDTOS.length > 0 ? (
                    order.orderDetailsDTOS.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="p-5 rounded-3xl bg-neutral-900/50 border border-neutral-800 flex items-center justify-between group hover:border-neutral-700 transition-all"
                      >
                        <div className="flex gap-5">
                          {/* Product Image */}
                          <div className="w-16 h-16 rounded-2xl bg-neutral-800 border border-neutral-700 overflow-hidden shrink-0">
                            {item.pictureProduct ? (
                              <img 
                                src={item.pictureProduct} 
                                alt={item.nameproduct} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-600">
                                <Coffee className="w-8 h-8" />
                              </div>
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[10px] font-black text-orange-500">
                                {item.quantity}x
                              </span>
                              <h4 className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors uppercase tracking-tight">
                                {item.nameproduct}
                              </h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-0.5 rounded-lg bg-neutral-800 text-[9px] font-black text-neutral-500 uppercase border border-neutral-700">
                                Size {item.size}
                              </span>
                              {item.toppingDTOs && item.toppingDTOs.length > 0 && item.toppingDTOs.map((t, tid) => (
                                <span key={tid} className="px-2 py-0.5 rounded-lg bg-orange-500/10 text-[9px] font-black text-orange-400 uppercase border border-orange-500/10">
                                  + {t.nameTopping} ({formatPrice(t.price_topping)})
                                </span>
                              ))}
                            </div>
                            <p className="text-[9px] text-neutral-600 font-bold italic mt-1">
                              Ngày tạo: {formatDate(item.creatAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-white">{formatPrice(item.totalPrice)}</p>
                          <ChevronRight className="w-4 h-4 text-neutral-800 ml-auto mt-1" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center border-2 border-dashed border-neutral-800 rounded-[2rem]">
                      <Clock className="w-8 h-8 text-neutral-800 mx-auto mb-3 animate-pulse" />
                      <p className="text-xs text-neutral-600 font-bold uppercase tracking-widest">Đang tải dữ liệu món ăn...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-neutral-800 bg-neutral-900/50">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Tổng thanh toán</p>
                    <p className="text-xl font-black text-white leading-none">{formatPrice(order.totalPrice)}</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="px-8 py-3.5 rounded-2xl bg-orange-500 text-xs font-black text-white hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                >
                  ĐÓNG CỬA SỔ
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderDetailsModal;