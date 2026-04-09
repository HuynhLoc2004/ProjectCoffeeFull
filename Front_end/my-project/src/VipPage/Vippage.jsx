import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, User, Medal, TrendingUp, Wallet, Trophy, ShieldCheck, Zap, Gift, Star } from "lucide-react";
import "./Vippage.css";
import axiosClient from "../AxiosClient";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getAccessToken } from "../ManagerAccessToken/ManagerAccessToken";
import Navbar from "../Components/Navbar";
import { getLogout } from "../ManagerLogout/ManagerLogout";

const Vippage = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [infoUser, setInfoUser] = useState(null);
  const [topThree, setTopThree] = useState([]);
  const [rest, setRest] = useState([]);

  const formatCurrency = (amount) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosClient.get("/user/get-users");
        setRankings(res.data.result || []);
      } catch (err) { console.error("Error:", err); } finally { setLoading(false); }
    };
    fetchData();
    if (getLogout() === 0 && getAccessToken() !== "") {
      axiosClient.get("/auth/info", { headers: { Authorization: `Bearer ${getAccessToken()}` } })
        .then((res) => setInfoUser(res.data.result));
    }
  }, []);

  useEffect(() => {
    if (rankings.length > 0) {
      setTopThree(rankings.slice(0, 3));
      setRest(rankings.slice(3));
    }
  }, [rankings]);

  const UserAvatar = ({ src, size, border, rankColor }) => {
    const [error, setError] = useState(false);
    const containerClasses = `relative rounded-full border-4 ${border} object-cover shadow-md overflow-hidden flex items-center justify-center bg-[#dcd7cc]`;
    const iconSize = size === "w-32 h-32" ? 48 : 36;
    if (!src || error) return <div className={containerClasses} style={{ width: size.split(' ')[0].replace('w-', ''), height: size.split(' ')[1].replace('h-', '') }}><User size={iconSize} className={rankColor || "text-[#8d7b68]"} /></div>;
    return <img src={src} className={`${size} rounded-full border-4 ${border} object-cover shadow-md`} onError={() => setError(true)} alt="User" />;
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-[#f4f1ea]"><AiOutlineLoading3Quarters className="animate-spin text-[#8d7b68] text-3xl" /></div>;

  return (
    <div className="vip-container relative min-h-screen font-sans overflow-x-hidden bg-[#f4f1ea] text-[#3b2a20]">
      <Navbar userInfo={infoUser} />

      {/* HEADER */}
      <section className="relative z-10 pt-32 pb-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="px-4">
          <h1 className="text-5xl md:text-7xl font-black text-[#3b2a20] mb-6 tracking-tighter">Bảng Vàng Danh Dự</h1>
          <p className="max-w-xl mx-auto text-[#8d7b68] text-lg italic">Nơi vinh danh những người bạn đồng hành thân thiết nhất của The Coffee Chill.</p>
        </motion.div>
      </section>

      {/* PODIUM */}
      <div className="max-w-6xl mx-auto px-4 mb-32">
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 mt-16">
          {topThree.length >= 2 && (
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="order-2 md:order-1 flex-1 w-full">
              <div className="relative p-6 rounded-2xl text-center bg-[#ede9e1] border border-[#dcd7cc] shadow-sm">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2"><UserAvatar src={topThree[1].avatar} size="w-24 h-24" border="border-[#ede9e1]" /></div>
                <h3 className="mt-14 font-bold text-lg text-[#3b2a20] truncate">{topThree[1].fullname}</h3>
                <p className="font-extrabold text-[#3b2a20]">{formatCurrency(topThree[1].totalPriceOrder)}</p>
                <div className="mt-4 inline-block px-4 py-1 rounded-full bg-[#dcd7cc] font-bold text-sm">#2 - Bạc</div>
              </div>
            </motion.div>
          )}
          {topThree.length >= 1 && (
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} whileInView={{ opacity: 1, scale: 1.05, y: 0 }} viewport={{ once: true }} className="order-1 md:order-2 flex-1 w-full z-20">
              <div className="relative p-8 rounded-3xl text-center bg-[#e4dfd5] border-2 border-[#c7bca9] shadow-md">
                <div className="absolute -top-16 left-1/2 -translate-x-1/2"><UserAvatar src={topThree[0].avatar} size="w-32 h-32" border="border-[#e4dfd5]" /></div>
                <h3 className="mt-16 text-2xl text-[#2c1810] font-black truncate">{topThree[0].fullname}</h3>
                <p className="text-[#a68a64] font-black text-2xl mt-1">{formatCurrency(topThree[0].totalPriceOrder)}</p>
                <div className="mt-4 inline-block px-8 py-2 rounded-full bg-[#3b2a20] text-white font-black text-lg shadow-lg">#1 - Vàng</div>
              </div>
            </motion.div>
          )}
          {topThree.length >= 3 && (
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="order-3 md:order-3 flex-1 w-full">
              <div className="relative p-6 rounded-2xl text-center bg-[#ede9e1] border border-[#dcd7cc] shadow-sm">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2"><UserAvatar src={topThree[2].avatar} size="w-24 h-24" border="border-[#ede9e1]" /></div>
                <h3 className="mt-14 font-bold text-lg text-[#3b2a20] truncate">{topThree[2].fullname}</h3>
                <p className="font-extrabold text-[#3b2a20]">{formatCurrency(topThree[2].totalPriceOrder)}</p>
                <div className="mt-4 inline-block px-4 py-1 rounded-full bg-[#dcd7cc] font-bold text-sm">#3 - Đồng</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* LIST */}
      <div className="max-w-4xl mx-auto px-4 mb-32">
        <div className="rounded-3xl bg-[#e9e4d9] border border-[#dcd7cc] divide-y divide-[#dcd7cc]/50">
          {rest.map((user, index) => (
            <motion.div key={user.id} whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -10 }} className="flex items-center justify-between p-5">
              <div className="flex items-center gap-5">
                <span className="w-8 font-black text-[#8d7b68]">#{index + 4}</span>
                <UserAvatar src={user.avatar} size="w-12 h-12" border="border-[#dcd7cc]" />
                <h4 className="font-bold">{user.fullname}</h4>
              </div>
              <p className="font-extrabold">{formatCurrency(user.totalPriceOrder)}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* GALLERY ZIG-ZAG */}
      <section className="max-w-6xl mx-auto px-4 mb-32 space-y-32">
        {[
          { title: "Không khí tấp nập tại The Coffee Chill", text: "Những hàng dài người chờ đợi, đó là minh chứng cho tình yêu của bạn.", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200" },
          { title: "Trải nghiệm đặc quyền hội viên", text: "Quà tặng riêng biệt cho những khách hàng thân thiết nhất.", img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1200" },
          { title: "Góc nhỏ của những tâm hồn đồng điệu", text: "Ngôi nhà thứ hai của những tín đồ yêu cà phê.", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200" }
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}>
            <div className="w-full md:w-1/2">
              <img src={item.img} className="w-full h-[400px] object-cover rounded-[3rem] shadow-2xl transition-all duration-700 hover:grayscale cursor-pointer" alt={item.title} />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h3 className="text-4xl font-black tracking-tighter text-[#3b2a20]">{item.title}</h3>
              <p className="text-lg text-[#8d7b68] italic">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};
export default Vippage;