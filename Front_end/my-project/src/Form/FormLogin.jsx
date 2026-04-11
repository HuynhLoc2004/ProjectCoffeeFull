import React, { useState, useEffect } from "react";
import { VscAccount } from "react-icons/vsc";
import { TbLockPassword } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "../AxiosClient";
import { setAccessToken } from "../ManagerAccessToken/ManagerAccessToken";
import { unlogout } from "../ManagerLogout/ManagerLogout";

const FormLogin = () => {
  const [valueUseraccounnt, setValueUseraccount] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (params.message) {
      alert(params.message);
      navigate("/login", { replace: true });
    }
  }, [params.message, navigate]);

  const handleUserAccount = (e) => {
    setValueUseraccount(e.target.value);
  };
  const handlepassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    if (valueUseraccounnt === "") {
      alert("vui lòng nhập tài khoản");
      return;
    }
    if (password === "") {
      alert("vui lòng nhập password");
      return;
    }

    const userLogin = {
      account_user: valueUseraccounnt,
      password: password,
    };

    axiosClient
      .post("/auth/login", userLogin, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.statusCode === 400 || res.data.statusCode === 404) {
          alert(res.data.message);
        } else {
          setAccessToken(res.data.result.accessToken);
          unlogout();
          navigate(localStorage.getItem("page_before") || "/", {
            state: {
              statusCode: res.data.statusCode,
            },
          });
        }
      })
      .catch((err) => {
        console.log("không call api được");
      });
    setValueUseraccount("");
    setPassword("");
  };

  const springConfig = { type: "spring", stiffness: 400, damping: 30 };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative p-4">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={springConfig}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-black text-white mb-2 tracking-tight"
            >
              Chào mừng trở lại!
            </motion.h1>
            <p className="text-gray-300 font-medium">
              Đăng nhập để tiếp tục hành trình cà phê của bạn
            </p>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative group"
            >
              <VscAccount className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-[#D4A373] transition-colors text-xl" />
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 focus:border-[#D4A373]/50 focus:bg-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 outline-none transition-all duration-300"
                placeholder="Tên tài khoản hoặc Email"
                value={valueUseraccounnt}
                onChange={handleUserAccount}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative group"
            >
              <TbLockPassword className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-[#D4A373] transition-colors text-xl" />
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 focus:border-[#D4A373]/50 focus:bg-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 outline-none transition-all duration-300"
                placeholder="Mật khẩu"
                value={password}
                onChange={handlepassword}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-between items-center px-2"
            >
              <Link
                to="/ForgotPassword"
                title="Quên mật khẩu?"
                className="text-xs text-[#D4A373] hover:underline font-bold"
              >
                Quên mật khẩu?
              </Link>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full bg-[#D4A373] hover:bg-[#c29263] text-white font-black py-4 rounded-2xl shadow-[0_10px_20px_rgba(212,163,115,0.3)] transition-all"
              onClick={handleLogin}
            >
              ĐĂNG NHẬP
            </motion.button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-transparent text-white/40 font-bold uppercase tracking-widest">
                  Hoặc đăng nhập với
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-3 flex items-center justify-center gap-2 transition-all"
                onClick={() => {
                  window.location.href =
                    "http://coffeweb.duckdns.org/oauth2/authorization/google";
                }}
              >
                <FcGoogle className="text-xl" />
                <span className="text-sm font-bold text-white">Google</span>
              </motion.button>
              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-3 flex items-center justify-center gap-2 transition-all"
              >
                <FaFacebook className="text-xl text-blue-500" />
                <span className="text-sm font-bold text-white">Facebook</span>
              </motion.button>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-gray-400 text-sm mt-8"
            >
              Chưa có tài khoản?{" "}
              <Link
                to="/registry"
                className="text-[#D4A373] font-black hover:underline"
              >
                Đăng kí ngay
              </Link>
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FormLogin;
