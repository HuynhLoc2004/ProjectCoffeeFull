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
        toast.success("Đăng kí tài khoản thành công!");
        navigate("/login");
      })
      .catch((err) => {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
        console.error(err);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg bg-white/10 backdrop-blur-2xl border border-white/20 p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">Tạo tài khoản</h1>
          <p className="text-gray-300 font-medium">Trở thành thành viên của gia đình Coffe ngay</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: VscAccount, val: valueUseraccounnt, set: setValueUseraccount, ph: "Tài khoản", span: "col-span-2 md:col-span-1" },
            { icon: TbLockPassword, val: password, set: setPassword, ph: "Mật khẩu", type: "password", span: "col-span-2 md:col-span-1" },
            { icon: TfiEmail, val: email, set: setEmail, ph: "Email", span: "col-span-2 md:col-span-1" },
            { icon: FaUserEdit, val: fullName, set: setFullName, ph: "Họ và tên", span: "col-span-2 md:col-span-1" },
            { icon: CiPhone, val: phone, set: setPhone, ph: "Số điện thoại", span: "col-span-1" },
            { icon: FaBirthdayCake, val: birthdate, set: setBirthdate, ph: "Ngày sinh", type: "date", span: "col-span-1" },
            { icon: FaMapMarkerAlt, val: address, set: setAddress, ph: "Địa chỉ", span: "col-span-2" },
          ].map((field, i) => (
            <div key={i} className={`relative group ${field.span}`}>
              <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-xl" />
              <input
                type={field.type || "text"}
                className="w-full bg-white/5 border border-white/10 focus:border-[#D4A373]/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/40 outline-none transition-all"
                placeholder={field.ph}
                value={field.val}
                onChange={(e) => field.set(e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-8">
          <Link to="/" className="w-1/3">
            <button className="w-full py-4 rounded-2xl bg-white/10 text-white font-black hover:bg-white/20 transition-all">Thoát</button>
          </Link>
          <button onClick={handleValidForm} className="w-2/3 py-4 rounded-2xl bg-[#D4A373] text-white font-black hover:bg-[#c29263] transition-all shadow-lg">ĐĂNG KÝ</button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          Đã có tài khoản? <Link to="/login" className="text-[#D4A373] font-black hover:underline">Đăng nhập</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default FormRegister;
