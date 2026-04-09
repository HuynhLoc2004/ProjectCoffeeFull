import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MessageSquare, Clock, Headphones, Users, Award, Zap } from "lucide-react";
import { toast } from "react-toastify";
import axiosClient from "../AxiosClient";
import Navbar from "../Components/Navbar";
import { getAccessToken, setAccessToken } from "../ManagerAccessToken/ManagerAccessToken";
import { unlogout, getLogout } from "../ManagerLogout/ManagerLogout";

const ContactPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [infoUser, setInfoUser] = useState(null);
  const [formData, setFormData] = useState({ email: "", textForm: "" });

  useEffect(() => {
    if (getAccessToken()) {
      axiosClient.get("/auth/info", { headers: { Authorization: `Bearer ${getAccessToken()}` } })
        .then((res) => setInfoUser({ fullname: res.data.result.fullname, picture: res.data.result.picture }))
        .catch(() => {});
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.textForm) return toast.warning("Vui lòng điền đầy đủ!");
    setLoading(true);
    axiosClient.post("/email/sendEvaluate", { ...formData, localDateTime: new Date().toISOString() })
      .then(() => { toast.success("Cảm ơn bạn đã đóng góp!"); setFormData({ email: "", textForm: "" }); })
      .catch(() => toast.error("Có lỗi xảy ra!"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
      <Navbar userInfo={infoUser} />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 text-[#1a1a1a]">Kết nối cùng The Coffee Chill</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">Bạn gặp khó khăn hay cần tư vấn về sản phẩm? Chúng tôi luôn sẵn sàng lắng nghe và đồng hành cùng bạn 24/7.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div initial={{ x: -50 }} whileInView={{ x: 0 }} className="space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><Headphones className="text-[#D4A373]" /> Dịch vụ khách hàng</h3>
              <div className="space-y-6">
                {[
                  { icon: Headphones, title: "Hỗ trợ 24/7", info: "Đội ngũ chăm sóc khách hàng luôn túc trực để giải đáp mọi thắc mắc của bạn." },
                  { icon: Users, title: "Cộng đồng Chillers", info: "Tham gia cùng hàng ngàn khách hàng thân thiết và chia sẻ trải nghiệm cà phê mỗi ngày." },
                  { icon: Award, title: "Chính sách đổi trả", info: "Chúng tôi cam kết đổi trả sản phẩm nếu không đạt chất lượng tốt nhất khi đến tay bạn." },
                  { icon: Zap, title: "Phản hồi siêu tốc", info: "Mọi ý kiến của bạn sẽ được ghi nhận và xử lý trong vòng 30 phút làm việc." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="p-3 bg-[#D4A373]/10 text-[#D4A373] rounded-2xl group-hover:bg-[#D4A373] group-hover:text-white transition-all"><item.icon size={20}/></div>
                    <div>
                      <p className="font-bold">{item.title}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.info}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <img src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1000" className="w-full h-72 object-cover rounded-[2.5rem] shadow-2xl" alt="Support" />
          </motion.div>

          <motion.div initial={{ x: 50 }} whileInView={{ x: 0 }} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100">
            <h3 className="text-2xl font-black mb-8">Gửi tin nhắn trực tiếp</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Địa chỉ email của bạn" className="w-full p-4 rounded-2xl border bg-gray-50 outline-none focus:border-[#D4A373]" />
              <textarea name="textForm" value={formData.textForm} onChange={(e) => setFormData({...formData, textForm: e.target.value})} placeholder="Bạn cần hỗ trợ gì? Hãy viết chi tiết tại đây..." rows="8" className="w-full p-4 rounded-2xl border bg-gray-50 outline-none focus:border-[#D4A373]"></textarea>
              <button type="submit" disabled={loading} className="w-full py-5 bg-[#1a1a1a] text-white rounded-2xl font-black hover:bg-[#D4A373] transition-all">
                {loading ? "Đang gửi..." : "GỬI YÊU CẦU"}
              </button>
            </form>
          </motion.div>
        </div>

        <section className="mt-20">
          <img src="https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=2000" className="w-full h-[500px] object-cover rounded-[3rem] shadow-2xl" alt="Coffee Experience" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center max-w-3xl mx-auto space-y-6"
          >
            <h3 className="text-3xl font-black tracking-tight text-[#1a1a1a]">Hơn cả một tách cà phê</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Chúng tôi không chỉ bán cà phê, chúng tôi bán sự trải nghiệm. Mỗi hạt cà phê đều được tuyển chọn kỹ lưỡng, mỗi kỹ thuật pha chế đều là tâm huyết của đội ngũ tại The Coffee Chill. Hãy ghé thăm chúng tôi để cảm nhận sự khác biệt trong từng hơi thở của không gian này.
            </p>
            <button 
              onClick={() => navigate("/product")}
              className="px-10 py-4 bg-[#D4A373] text-white font-black rounded-full hover:shadow-lg transition-all hover:scale-105"
            >
              KHÁM PHÁ MENU NGAY
            </button>
          </motion.div>
        </section>
      </main>
    </div>
  );
};
export default ContactPage;