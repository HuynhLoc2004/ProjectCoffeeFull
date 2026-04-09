import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  MoreHorizontal,
  Star,
  User,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
} from "lucide-react";
import axiosClient from "../../AxiosClient";

const CustomerView = () => {
  const [countCustomer, setCountCustomer] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [updateBlock, setUpdateBlock] = useState(false);
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const [refreshKey, setRefreshKey] = useState(0);
  const fetchCustomers = () => {
    setLoading(true);
    axiosClient
      .get(`/user/get-infoAllUser`, {
        withCredentials: true,
      })
      .then((res) => {
        setCustomers(res.data.result || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log("không call được api info", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    axiosClient
      .get(`/user/get-CountAllUser`, {
        withCredentials: true,
      })
      .then((res) => {
        setCountCustomer(res.data.result);
      })
      .catch((err) => {
        console.log("không call được api count", err);
      });

    fetchCustomers();
  }, []);

  const handleToggleStatus = (userId, currentStatus) => {
    const actionText = !currentStatus ? "mở khóa" : "khóa";
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn ${actionText} tài khoản này không?`,
      )
    ) {
      return;
    }

    setUpdatingId(userId);

    // API endpoint cập nhật trạng thái
    axiosClient
      .put(
        `/user/change-userActive?userId=${userId}`,
        { activeupdate: !currentStatus },
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        if (res.data.statusCode == 200) {
          alert(res.data.message);

          fetchCustomers();
          setUpdatingId(null);
          return;
        }
      })
      .catch((err) => {
        console.error("Lỗi khi cập nhật trạng thái:", err);
        alert(`Lỗi: Không thể ${actionText} tài khoản lúc này.`);
        setUpdatingId(null);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Khách hàng</h1>
          <p className="text-neutral-500 mt-1">
            Quản lý thông tin và trạng thái (Active/Inactive) của khách hàng.
          </p>
        </div>
        <div className="flex gap-4 items-center bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl">
          <Users className="w-5 h-5 text-emerald-500" />
          <div>
            <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">
              Tổng khách hàng
            </p>
            <p className="text-lg font-bold text-emerald-500">
              {countCustomer}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {customers.map((customer, idx) => (
            <motion.div
              key={customer.userId || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-6 rounded-3xl bg-neutral-900 border ${customer.active === false ? "border-red-500/50 bg-red-500/[0.02]" : "border-neutral-800"} hover:border-orange-500/30 transition-all group relative overflow-hidden`}
            >
              {/* Status Badge - Explicitly checking for false */}
              <div className="absolute top-6 right-6">
                {customer.active === false ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black border border-red-500/20 uppercase tracking-widest">
                    <ShieldAlert className="w-3 h-3" /> Đã khóa
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black border border-emerald-500/20 uppercase tracking-widest">
                    <ShieldCheck className="w-3 h-3" /> Hoạt động
                  </span>
                )}
              </div>

              <div className="flex justify-between items-start mb-4">
                <div
                  className={`w-16 h-16 rounded-2xl overflow-hidden border-2 ${customer.active === false ? "border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "border-orange-500/20"} group-hover:border-orange-500/50 transition-all bg-neutral-800`}
                >
                  <img
                    src={customer.avatar || customer.picture}
                    alt={customer.fullname || customer.name}
                    className={`w-full h-full object-cover ${customer.active === false ? "grayscale brightness-50" : ""}`}
                    onError={(e) => {
                      e.target.src = defaultAvatar;
                    }}
                  />
                </div>
              </div>

              <h3
                className={`text-lg font-bold mb-1 truncate ${customer.active === false ? "text-neutral-500" : "text-white"}`}
              >
                {customer.fullname || customer.name || "N/A"}
              </h3>
              <p className="text-xs text-neutral-500 flex items-center gap-2 mb-4 truncate">
                <Mail className="w-3 h-3" /> {customer.email || "No email"}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">
                    Chi tiêu
                  </p>
                  <p
                    className={`text-sm font-bold ${customer.active === false ? "text-neutral-600" : "text-orange-500"}`}
                  >
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(customer.totalPriceOrder || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">
                    Đơn hàng
                  </p>
                  <p
                    className={`text-sm font-bold ${customer.active === false ? "text-neutral-600" : "text-white"}`}
                  >
                    {customer.countOrder || 0}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-1 text-[10px] text-neutral-600">
                    <Calendar className="w-3 h-3" />{" "}
                    {customer.date || "Chưa rõ ngày"}
                  </span>
                  {(customer.totalPriceOrder > 1000000 ||
                    customer.countOrder > 10) && (
                    <span className="flex items-center gap-1 px-2 py-0.5 w-fit rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-bold">
                      <Star className="w-2.5 h-2.5 fill-orange-500" /> VIP
                    </span>
                  )}
                </div>

                <button
                  onClick={() =>
                    handleToggleStatus(customer.userId, customer.active)
                  }
                  disabled={updatingId === customer.userId}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-[11px] font-black uppercase tracking-tighter ${
                    customer.active !== false
                      ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white shadow-lg shadow-red-500/5"
                      : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white shadow-lg shadow-emerald-500/5"
                  } ${updatingId === customer.userId ? "opacity-50 cursor-wait" : "active:scale-90"}`}
                >
                  {updatingId === customer.userId ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : customer.active !== false ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      Khóa
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      Mở
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default CustomerView;
