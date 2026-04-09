import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronRight,
  MoreVertical,
  Eye,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Loader2,
  PackageSearch,
} from "lucide-react";
import axiosClient from "../../AxiosClient";
import OrderDetailsModal from "./OrderDetailsModal";

const getStatusStyle = (status) => {
  switch (status) {
    case "PAID":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "CANCEL":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    default:
      return "bg-neutral-500/10 text-neutral-500 border-neutral-500/20";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "PAID":
      return "Đã thanh toán";
    case "CANCEL":
      return "Đã hủy";
    default:
      return status || "Chờ xử lý";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "PAID":
      return <CheckCircle2 className="w-3 h-3 mr-1.5" />;
    case "CANCEL":
      return <XCircle className="w-3 h-3 mr-1.5" />;
    default:
      return <Clock className="w-3 h-3 mr-1.5" />;
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
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OrderView = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axiosClient
      .get(`/order/get-orders`, {
        withCredentials: true,
      })
      .then((res) => {
        setOrders(res.data.result || []);
      })
      .catch((err) => {
        console.error("Lỗi khi tải đơn hàng:", err);
      })
      .finally(() => {
        setTimeout(() => setIsLoading(false), 500);
      });
  }, []);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedOrder(null), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Đơn hàng</h1>
          <p className="text-neutral-500 mt-1">
            Theo dõi và quản lý các đơn hàng của khách hàng trong hệ thống.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-sm font-bold hover:bg-neutral-800 transition-all">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      <div className="rounded-3xl bg-neutral-900 border border-neutral-800 overflow-hidden min-h-[500px] flex flex-col">
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-white/[0.02]">
                <th className="px-6 py-5 font-semibold text-neutral-400 text-sm">
                  Mã đơn
                </th>
                <th className="px-6 py-5 font-semibold text-neutral-400 text-sm">
                  Khách hàng
                </th>
                <th className="px-6 py-5 font-semibold text-neutral-400 text-sm">
                  Ngày đặt
                </th>
                <th className="px-6 py-5 font-semibold text-neutral-400 text-sm">
                  Tổng tiền
                </th>
                <th className="px-6 py-5 font-semibold text-neutral-400 text-sm">
                  Trạng thái
                </th>
                <th className="px-6 py-5 font-semibold text-neutral-400 text-sm text-right"></th>
              </tr>
            </thead>
            <tbody className="relative">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.tr
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="6" className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="relative">
                          <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                          <div className="absolute inset-0 blur-xl bg-orange-500/20 animate-pulse"></div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-medium text-white tracking-wide">
                            Đang tải danh sách...
                          </p>
                          <p className="text-sm text-neutral-500">
                            Hệ thống đang đồng bộ dữ liệu đơn hàng
                          </p>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ) : orders.length === 0 ? (
                  <motion.tr
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="6" className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 text-neutral-500">
                        <div className="p-6 rounded-full bg-neutral-800/50">
                          <PackageSearch className="w-12 h-12 opacity-50" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-medium text-neutral-300">
                            Không có đơn hàng
                          </p>
                          <p className="text-sm">
                            Hiện tại chưa có dữ liệu đơn hàng nào được ghi nhận.
                          </p>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  orders.map((order, index) => (
                    <motion.tr
                      key={order.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group hover:bg-white/[0.02] transition-colors border-b border-neutral-800/50 last:border-0"
                    >
                      <td className="px-6 py-5">
                        <span className="font-mono font-bold text-orange-500 text-sm tracking-tight">
                          #{order.id}
                        </span>
                        <p className="text-[10px] text-neutral-500 mt-1 font-medium">
                          Số lượng: {order.quantity}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 text-orange-500 flex items-center justify-center text-sm font-bold border border-orange-500/10 shadow-inner">
                            {(order.fullname || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-neutral-200">
                              {order.fullname}
                            </p>
                            <p className="text-[11px] text-neutral-500 mt-0.5">
                              {order.mail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-neutral-400 font-medium">
                          {formatDate(order.createdAt).split(" ")[0]}
                        </div>
                        <div className="text-[10px] text-neutral-600">
                          {formatDate(order.createdAt).split(" ")[1]}
                        </div>
                      </td>
                      <td className="px-6 py-5 font-bold text-sm text-white">
                        {formatPrice(order.totalPrice)}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-extrabold border uppercase tracking-widest ${getStatusStyle(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => {
                            axiosClient
                              .get(`/order/get-order?orderId=${order.id}`, {
                                withCredentials: true,
                              })
                              .then((res) => {
                                console.log(res.data.result);
                                handleOpenModal(res.data.result);
                              })
                              .catch((err) => {
                                console.log("không call được api", err);
                              });
                          }}
                          className="p-2.5 hover:bg-orange-500/10 rounded-xl transition-all text-neutral-500 hover:text-orange-500 active:scale-90"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />
    </motion.div>
  );
};

export default OrderView;
