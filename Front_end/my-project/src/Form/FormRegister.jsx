import React, { useState } from "react";
import { VscAccount } from "react-icons/vsc";
import { TbLockPassword } from "react-icons/tb";
import { CiPhone } from "react-icons/ci";
import { TfiEmail } from "react-icons/tfi";
import { FaUserEdit, FaBirthdayCake, FaMapMarkerAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axiosClient from "../AxiosClient";

const FormRegister = () => {
  const [valueUseraccounnt, setValueUseraccount] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleValidForm = () => {
    if (!valueUseraccounnt.trim()) { toast.error("Tài khoản không được bỏ trống!"); return; }
    if (!password) { toast.error("Mật khẩu không được bỏ trống!"); return; }
    if (!email.trim()) { toast.error("Email không được bỏ trống!"); return; }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Email phải đúng định dạng (ví dụ: example@gmail.com)");
      return;
    }
    
    setIsLoading(true);
    const DataRegistry = {
      account: valueUseraccounnt.trim(),
      password: password,
      email: email.trim(),
      phone: phone.trim() || null,
      fullname: fullName.trim() || null,
      date: birthdate || null,
      address: address.trim() || null,
    };

    axiosClient
      .post("/user/registry", DataRegistry)
      .then((res) => {
        if (res.data.statusCode === 400) { 
          const msg = res.data.message || "";
          if (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("tồn tại")) {
            toast.warn("Email này đã được sử dụng!");
          } else {
            toast.warn(msg);
          }
          return; 
        }
        toast.success("Đăng ký tài khoản thành công!");
        navigate("/login");
      })
      .catch((err) => {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  const fields = [
    { icon: VscAccount, val: valueUseraccounnt, set: setValueUseraccount, ph: "Tài khoản", type: "text" },
    { icon: TbLockPassword, val: password, set: setPassword, ph: "Mật khẩu", type: "password" },
    { icon: TfiEmail, val: email, set: setEmail, ph: "Email", type: "email" },
    { icon: FaUserEdit, val: fullName, set: setFullName, ph: "Họ và tên", type: "text" },
    { icon: CiPhone, val: phone, set: setPhone, ph: "Số điện thoại", type: "tel" },
    { icon: FaBirthdayCake, val: birthdate, set: setBirthdate, ph: "Ngày sinh", type: "date" },
    { icon: FaMapMarkerAlt, val: address, set: setAddress, ph: "Địa chỉ", type: "text", span: "md:col-span-2" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-fixed bg-center relative p-2 sm:p-6 md:p-8 overflow-x-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="relative z-10 w-full max-w-xl bg-neutral-900/60 backdrop-blur-3xl border border-white/10 p-5 sm:p-10 md:p-12 rounded-[2rem] sm:rounded-[3rem] shadow-[0_25px_100px_rgba(0,0,0,0.6)]"
      >
        <div className="text-center mb-6 sm:mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-3 tracking-tighter uppercase"
          >
            Đăng Ký
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-neutral-400 text-[12px] sm:text-base font-medium"
          >
            Gia nhập cộng đồng yêu thích hương vị nguyên bản
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
          {fields.map((field, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`relative group w-full ${field.span || ""}`}
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4A373]/70 group-focus-within:text-[#D4A373] transition-colors z-20">
                <field.icon className="text-lg sm:text-xl" />
              </div>
              
              {field.type === "date" && (
                <label className="absolute left-12 top-2 text-[9px] font-black text-[#D4A373]/50 uppercase pointer-events-none z-20">
                  Ngày sinh
                </label>
              )}

              <input
                type={field.type}
                className={`w-full block box-border bg-white/[0.03] border border-white/10 focus:border-[#D4A373] focus:bg-white/[0.05] rounded-xl sm:rounded-2xl ${field.type === 'date' ? 'pt-6 pb-2 pl-12' : 'py-4 pl-12'} pr-4 text-white text-sm sm:text-base placeholder:text-white/20 outline-none transition-all duration-300 ring-0 focus:ring-4 focus:ring-[#D4A373]/10 min-w-0`}
                placeholder={field.type === "date" ? "" : field.ph}
                value={field.val}
                onChange={(e) => field.set(e.target.value)}
                style={{ colorScheme: 'dark', WebkitAppearance: 'none' }}
              />
              
              <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4A373] to-transparent w-0 group-focus-within:w-full transition-all duration-500 opacity-50"></div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
          <Link to="/" className="w-full sm:w-1/3 order-2 sm:order-1">
            <button className="w-full py-4 rounded-xl sm:rounded-2xl bg-white/5 text-white text-sm font-black hover:bg-white/10 border border-white/5 transition-all uppercase tracking-widest active:scale-95">
              Hủy
            </button>
          </Link>
          <button 
            disabled={isLoading}
            onClick={handleValidForm} 
            className="w-full sm:w-2/3 order-1 sm:order-2 py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#D4A373] to-[#b88c5d] text-white text-sm font-black hover:shadow-[0_10px_30px_rgba(212,163,115,0.3)] hover:-translate-y-0.5 transition-all uppercase tracking-widest active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Đang xử lý..." : "Bắt đầu ngay"}
          </button>
        </div>

        <p className="text-center text-neutral-500 text-[12px] sm:text-sm mt-8">
          Thành viên cũ? <Link to="/login" className="text-[#D4A373] font-black hover:text-[#e4b383] transition-colors decoration-2 hover:underline">Quay lại đăng nhập</Link>
        </p>
      </motion.div>
      
      {/* Decorative Floating Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#D4A373]/10 blur-[100px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#D4A373]/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
    </div>
  );
};

export default FormRegister;
