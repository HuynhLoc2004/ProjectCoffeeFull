import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Bell,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import { logout } from "../ManagerLogout/ManagerLogout";
import DashboardView from "./Dashboard/DashboardView";
import ProductView from "./Products/ProductView";
import OrderView from "./Orders/OrderView";
import CustomerView from "./Customers/CustomerView";
import { clearAccessToken } from "../ManagerAccessToken/ManagerAccessToken";
import Logo from "../assets/BannerIMG/Logo.png";
import axiosClient from "../AxiosClient";
import { useLocation, useNavigate } from "react-router-dom";
const AdminPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(false);
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: ShoppingBag, label: "Sản phẩm" },
    { icon: ShoppingCart, label: "Đơn hàng" },
    { icon: Users, label: "Khách hàng" },
    { icon: BarChart3, label: "Báo cáo" },
    { icon: Settings, label: "Cài đặt" },
  ];

  // useEffect(() => {
  //   return () => {
  //     console.log("ĐÃ RỜI PAGE");

  //     axiosClient
  //       .get("/admin/AdminLogOut", {
  //         withCredentials: true,
  //       })
  //       .then((res) => {
  //         if (res.data.statusCode === 200) {
  //           logout();
  //           setAccessToken("");
  //         }
  //       })
  //       .catch(() => {
  //         console.log("không call được api");
  //       });
  //   };
  // }, []);
  // Hàm render nội dung dựa trên Tab đang chọn

  useEffect(() => {
    axiosClient
      .get("/admin/authenAdmin", {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        setCheckingAuth(!checkingAuth);
      })
      .catch((err) => {
        if (err.status == 401) {
          navigate("/admin-login");
        }
      });
  }, []);
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardView />;
      case "Sản phẩm":
        return <ProductView />;
      case "Đơn hàng":
        return <OrderView />;
      case "Khách hàng":
        return <CustomerView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-neutral-500">
            <Settings className="w-16 h-16 mb-4 animate-spin-slow" />
            <p className="text-xl font-medium">
              Tính năng "{activeTab}" đang được phát triển...
            </p>
          </div>
        );
    }
  };
  const handleLogout = () => {
    axiosClient
      .get("/auth/logout", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.statusCode == 200) {
          console.log("log out thành công");
          clearAccessToken();
          logout();
          localStorage.setItem("page_before", "/admin");
          navigate("/loadingPage");
        }
      });
  };

  return checkingAuth == true ? (
    <div className="flex h-screen bg-neutral-950 text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="relative z-20 flex flex-col h-full bg-neutral-900 border-r border-neutral-800 transition-all duration-300 ease-in-out"
      >
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="flex items-center justify-center min-w-[40px] w-10 h-10 rounded-xl bg-white overflow-hidden shadow-lg shadow-orange-500/20">
            <img
              src={Logo}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          {isSidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400 whitespace-nowrap"
            >
              Coffee Admin
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`flex items-center w-full gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                activeTab === item.label
                  ? "bg-orange-500/10 text-orange-500"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <item.icon
                className={`min-w-[20px] w-5 h-5 ${activeTab === item.label ? "animate-pulse" : ""}`}
              />
              {isSidebarOpen && (
                <span className="font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
              {activeTab === item.label && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-orange-500 rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-4 px-4 py-3.5 text-neutral-400 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all"
          >
            <LogOut className="min-w-[20px] w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Đăng xuất</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-orange-500/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/5 blur-[100px] rounded-full -z-10" />

        {/* Header */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-neutral-800/50 backdrop-blur-md bg-neutral-950/50 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 transition-colors"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 group focus-within:border-orange-500/50 transition-all">
              <Search className="w-4 h-4 text-neutral-500 group-focus-within:text-orange-500" />
              <input
                type="text"
                placeholder="Tìm kiếm nhanh..."
                className="bg-transparent border-none outline-none text-sm w-64 placeholder:text-neutral-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer group">
              <Bell className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-neutral-950" />
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-neutral-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">Admin Huynh</p>
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
                  Quản trị viên
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-orange-500/20 p-0.5 overflow-hidden">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="Admin avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main View Area */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #262626; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #404040; }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow { animation: spin-slow 8s linear infinite; }
            `,
        }}
      />
    </div>
  ) : (
    <div className="h-screen flex items-center justify-center text-white">
      Checking permission...
    </div>
  );
};
export default AdminPage;
