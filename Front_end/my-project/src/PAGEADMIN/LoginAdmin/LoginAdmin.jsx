import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  Activity,
  Globe,
  Cpu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import local logo and banner
import logo from "../../assets/BannerIMG/Logo.png";
import banner from "../../assets/BannerIMG/Banner_1.png"; // Using Banner_1 for the side image
import axiosClient from "../../AxiosClient";
import {
  setAccessToken,
  clearAccessToken,
} from "../../ManagerAccessToken/ManagerAccessToken";
import { logout, unlogout } from "../../ManagerLogout/ManagerLogout";

const LoginAdmin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Vui lòng nhập đầy đủ thông tin!", { position: "top-right" });
      return;
    }

    setIsLoading(true);
    axiosClient
      .post(
        "/admin/login",
        {
          account_user: username,
          password: password,
        },
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        if (res.data.statusCode == 200) {
          setAccessToken(res.data.result.accessToken);
          unlogout();
          axiosClient
            .get("/admin/authenAdmin", {
              withCredentials: true,
            })
            .then((res) => {
              if (res.data.statusCode == 204) {
                navigate("/admin");
              } else {
                toast.error("Tài khoản hoặc mật khẩu không đúng");
                setIsLoading(false);
              }
            })
            .catch((err) => {
              toast.error("Bạn không có quyền truy cập vùng này!");
              setIsLoading(false);
              axiosClient
                .get("/auth/logout", {
                  withCredentials: true,
                })
                .then((res) => {
                  logout();
                  clearAccessToken();
                })
                .catch((err) => {
                  console.log(err);
                });
            });
        } else {
          toast.error("Đăng nhập thất bại. Vui lòng thử lại!");
          setIsLoading(false);
        }
      })
      .catch((err) => {
        toast.error("Lỗi kết nối hệ thống!");
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0f0a0a] overflow-hidden font-sans selection:bg-[#C7A17A]/30">
      <ToastContainer theme="dark" />

      {/* Left Side: Visual Experience (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <img
            src={banner}
            alt="Admin Experience"
            className="w-full h-full object-cover brightness-[0.4] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0f0a0a]/20 to-[#0f0a0a]" />
        </motion.div>

        {/* Content Overlay */}
        <div className="relative z-10 w-full p-16 flex flex-col justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-white font-bold tracking-widest text-xl">
              COFFEE ADMIN
            </span>
          </motion.div>

          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-6xl font-black text-white leading-tight mb-6"
            >
              Control Your <br />
              <span className="text-[#C7A17A]">Coffee Empire.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-white/50 text-lg max-w-md font-light leading-relaxed"
            >
              Hệ thống quản trị trung tâm dành cho chuỗi cửa hàng Coffee. Giám
              sát doanh thu, quản lý đơn hàng và tối ưu hóa quy trình vận hành.
            </motion.p>
          </div>

          {/* System Metrics (Decorative) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex gap-8"
          >
            {[
              {
                icon: Activity,
                label: "System Status",
                value: "Online",
                color: "text-green-400",
              },
              {
                icon: Cpu,
                label: "Processing",
                value: "Optimal",
                color: "text-blue-400",
              },
              {
                icon: Globe,
                label: "Network",
                value: "Secure",
                color: "text-[#C7A17A]",
              },
            ].map(
              (stat, i) =>
                stat && (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-2 text-white/30">
                      <stat.icon size={14} />
                      <span className="text-[10px] uppercase tracking-widest">
                        {stat.label}
                      </span>
                    </div>
                    <div className={`text-sm font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                  </div>
                ),
            )}
          </motion.div>
        </div>

        {/* Floating Abstract Elements */}
        <div className="absolute top-1/4 -right-20 w-64 h-64 bg-[#C7A17A]/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 relative">
        {/* Grainy Noise Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Form Header */}
          <div className="mb-10 lg:hidden flex flex-col items-center">
            <img src={logo} alt="Logo" className="h-16 mb-4" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest">
              Admin Access
            </h2>
          </div>

          <div className="space-y-2 mb-10 hidden lg:block">
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Chào mừng trở lại
            </h2>
            <p className="text-white/40">
              Vui lòng đăng nhập để tiếp tục quản trị hệ thống.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-semibold uppercase tracking-wider ml-1">
                Tài khoản quản trị
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#C7A17A] transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin_id"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 outline-none focus:border-[#C7A17A]/40 focus:bg-white/[0.06] transition-all duration-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-semibold uppercase tracking-wider ml-1">
                Mật khẩu bảo mật
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#C7A17A] transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-white/10 outline-none focus:border-[#C7A17A]/40 focus:bg-white/[0.06] transition-all duration-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-white/40 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/10 bg-transparent accent-[#C7A17A]"
                />
                <span className="group-hover:text-white/60 transition-colors">
                  Ghi nhớ phiên làm việc
                </span>
              </label>
              <a
                href="#"
                className="text-[#C7A17A] hover:text-[#D4B595] font-medium transition-colors"
              >
                Trợ giúp?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-500 cursor-pointer
                ${
                  isLoading
                    ? "bg-[#C7A17A]/80 text-[#1a1212]/50"
                    : "bg-gradient-to-r from-[#C7A17A] to-[#D4B595] text-[#1a1212] shadow-[0_10px_30px_-10px_rgba(199,161,122,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(199,161,122,0.6)]"
                }`}
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-[#1a1212]/30 border-t-[#1a1212] rounded-full animate-spin" />
                  <span className="tracking-[0.1em]">ĐANG XỬ LÝ...</span>
                </>
              ) : (
                <>
                  <span className="tracking-[0.1em]">ĐĂNG NHẬP NGAY</span>
                  <LogIn size={20} />
                </>
              )}
            </motion.button>
          </form>

          {/* Verification Footer */}
          <div className="mt-12 pt-8 border-t border-white/5">
            <div className="flex items-center justify-between opacity-40">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} />
                <span className="text-[10px] uppercase tracking-tighter">
                  AES-256 Encrypted
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-tighter">
                v2.4.0 Final
              </span>
            </div>
          </div>
        </motion.div>

        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C7A17A]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3B2F2F]/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
      </div>
    </div>
  );
};

export default LoginAdmin;
