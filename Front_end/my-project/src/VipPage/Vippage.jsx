import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Medal,
  Coffee,
  Sparkles,
  Gift,
  ShieldCheck,
  User,
  Check,
  Trophy,
} from "lucide-react";
import "./Vippage.css";
import axiosClient from "../AxiosClient";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getAccessToken } from "../ManagerAccessToken/ManagerAccessToken";
import Navbar from "../Components/Navbar";
import Footter from "../Components/Footter";
import { getLogout } from "../ManagerLogout/ManagerLogout";

const Vippage = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [infoUser, setInfoUser] = useState(null);
  const [topThree, setTopThree] = useState([]);
  const [rest, setRest] = useState([]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosClient.get("/user/get-users");
        const list = res.data?.result || [];
        setRankings(list);
      } catch (err) {
        console.error("Error fetching rankings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    if (getLogout() === 0 && getAccessToken() !== "") {
      axiosClient
        .get("/auth/info", {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        })
        .then((res) => setInfoUser(res.data?.result))
        .catch((err) => console.error("Error fetching user info:", err));
    }
  }, []);

  useEffect(() => {
    if (rankings && rankings.length > 0) {
      setTopThree(rankings.slice(0, 3));
      setRest(rankings.slice(3));
    } else {
      setTopThree([]);
      setRest([]);
    }
  }, [rankings]);

  // Determine realistic membership tier based on actual spending
  const getTierInfo = (amount) => {
    const spent = amount || 0;
    if (spent >= 100000) {
      return {
        name: "Hội Viên Vàng (VIP)",
        badgeClass: "bg-[#b88754]/15 text-[#b88754] border-[#b88754]/30",
        icon: Crown,
      };
    }
    if (spent >= 50000) {
      return {
        name: "Hội Viên Bạc",
        badgeClass: "bg-stone-500/15 text-stone-500 dark:text-stone-300 border-stone-500/30",
        icon: Medal,
      };
    }
    return {
      name: "Hội Viên Đồng",
      badgeClass: "bg-amber-700/15 text-amber-700 dark:text-amber-400 border-amber-700/30",
      icon: ShieldCheck,
    };
  };

  const UserAvatar = ({ src, size = 64, alt = "User", border = "border-[var(--line)]" }) => {
    const [imgError, setImgError] = useState(false);
    return (
      <div
        className={`relative rounded-full overflow-hidden flex items-center justify-center border-2 ${border} shadow-md bg-[var(--surface)] shrink-0`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {!src || imgError ? (
          <User size={size * 0.55} className="text-[var(--accent)] opacity-80" />
        ) : (
          <img
            src={src}
            alt={alt}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--page)] text-[var(--accent)]">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl mb-4" />
        <p className="text-sm font-sans tracking-wide text-[var(--muted)]">
          Đang tải bảng xếp hạng...
        </p>
      </div>
    );
  }

  return (
    <div className="vip-page-wrapper rank-page font-sans selection:bg-[#b88754]/20 selection:text-[var(--ink)]">
      <Navbar userInfo={infoUser} />

      {/* AMBIENT BACKGROUND GLOW */}
      <div className="vip-ambient-glow" />

      {/* HEADER SECTION */}
      <section className="relative z-10 pt-32 pb-14 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#b88754]/30 bg-[#b88754]/10 text-[#b88754] text-xs font-semibold uppercase tracking-wider mb-4">
            <Crown size={13} className="text-[#b88754]" />
            <span>The Coffee Chill • Khách Hàng Thân Thiết</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[var(--ink)] mb-4 tracking-tight">
            Bảng Vàng Danh Dự
          </h1>
          <p className="max-w-2xl mx-auto text-[var(--muted)] text-base sm:text-lg italic leading-relaxed">
            Vinh danh những người bạn đồng hành thân thiết nhất, đã cùng The Coffee Chill sẻ chia từng khoảnh khắc hương vị nồng nàn.
          </p>

          {/* Quick Info Badges */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs text-[var(--ink)] shadow-xs">
              <Coffee size={15} className="text-[var(--accent)] shrink-0" />
              <span>Tích lũy chi tiêu tự động</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs text-[var(--ink)] shadow-xs">
              <Sparkles size={15} className="text-[var(--accent)] shrink-0" />
              <span>Đặc quyền ưu đãi theo hạng thẻ</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs text-[var(--ink)] shadow-xs">
              <Gift size={15} className="text-[var(--accent)] shrink-0" />
              <span>Quà tặng tri ân đặc biệt</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* PODIUM TOP 3 */}
      {topThree.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 mb-20 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--ink)]">
              Tam Vị Quán Quân
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
              Top 3 khách hàng có mức chi tiêu gắn bó ấn tượng nhất tại The Coffee Chill
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-end justify-center gap-6">
            {/* #2 - Á QUÂN (BẠC) */}
            {topThree[1] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="order-2 md:order-1 flex-1 w-full"
              >
                <div className="podium-card silver-card p-6 sm:p-7 rounded-2xl text-center relative flex flex-col items-center">
                  <div className="-mt-12 mb-3">
                    <UserAvatar
                      src={topThree[1].avatar}
                      size={80}
                      alt={topThree[1].fullname}
                      border="border-stone-400"
                    />
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[var(--ink)] truncate max-w-full">
                    {topThree[1].fullname}
                  </h3>
                  <p className="text-xl font-extrabold text-[var(--ink)] mt-2">
                    {formatCurrency(topThree[1].totalPriceOrder)}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full badge-silver text-xs font-bold shadow-sm">
                    <Medal size={14} />
                    <span>#2 - Bạc</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* #1 - QUÁN QUÂN (VÀNG - CENTER) */}
            {topThree[0] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1.04, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-1 md:order-2 flex-1 w-full z-20 md:-translate-y-4"
              >
                <div className="podium-card gold-card p-7 sm:p-8 rounded-3xl text-center relative flex flex-col items-center border-2">
                  <div className="w-12 h-12 rounded-full bg-[#b88754] text-white flex items-center justify-center shadow-lg -mt-14 mb-3">
                    <Crown size={24} />
                  </div>

                  <UserAvatar
                    src={topThree[0].avatar}
                    size={96}
                    alt={topThree[0].fullname}
                    border="border-[#b88754]"
                  />

                  <h3 className="font-serif font-bold text-2xl text-[var(--ink)] truncate max-w-full mt-4">
                    {topThree[0].fullname}
                  </h3>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#b88754] mt-2">
                    {formatCurrency(topThree[0].totalPriceOrder)}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-6 py-1.5 rounded-full badge-gold text-sm font-bold shadow-md">
                    <Crown size={15} />
                    <span>#1 - Vàng</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* #3 - QUÝ QUÂN (ĐỒNG) */}
            {topThree[2] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="order-3 md:order-3 flex-1 w-full"
              >
                <div className="podium-card bronze-card p-6 sm:p-7 rounded-2xl text-center relative flex flex-col items-center">
                  <div className="-mt-12 mb-3">
                    <UserAvatar
                      src={topThree[2].avatar}
                      size={80}
                      alt={topThree[2].fullname}
                      border="border-amber-700"
                    />
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[var(--ink)] truncate max-w-full">
                    {topThree[2].fullname}
                  </h3>
                  <p className="text-xl font-extrabold text-[var(--ink)] mt-2">
                    {formatCurrency(topThree[2].totalPriceOrder)}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full badge-bronze text-xs font-bold shadow-sm">
                    <Medal size={14} />
                    <span>#3 - Đồng</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* LIST HẠNG 4+ */}
      {rest.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 mb-24 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-serif font-bold text-[var(--ink)]">
              Bảng Thứ Hạng Tiếp Theo
            </h3>
            <span className="text-xs text-[var(--muted)] bg-[var(--surface)] px-3 py-1 rounded-full border border-[var(--line)]">
              {rest.length} thành viên
            </span>
          </div>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm divide-y divide-[var(--line)] overflow-hidden">
            {rest.map((user, index) => {
              const tier = getTierInfo(user.totalPriceOrder);
              const TierIcon = tier.icon;
              return (
                <motion.div
                  key={user.id_user || index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="rank-row flex items-center justify-between p-4 sm:p-5"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="w-8 font-extrabold text-sm text-[var(--muted)] text-center">
                      #{index + 4}
                    </span>
                    <UserAvatar
                      src={user.avatar}
                      size={46}
                      alt={user.fullname}
                      border="border-[var(--line)]"
                    />
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-[var(--ink)]">
                        {user.fullname}
                      </h4>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border mt-0.5 ${tier.badgeClass}`}
                      >
                        <TierIcon size={11} />
                        {tier.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[var(--muted)] block">Đã chi tiêu</span>
                    <span className="font-extrabold text-sm sm:text-base text-[var(--ink)]">
                      {formatCurrency(user.totalPriceOrder)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* MEMBERSHIP TIERS (QUYỀN LỢI & HẠNG THẺ HỘI VIÊN) */}
      <section className="max-w-6xl mx-auto px-4 mb-24 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={13} className="text-[var(--accent)]" />
            <span>Quyền Lợi & Hạng Thẻ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--ink)]">
            Hệ Thống Đặc Quyền Hội Viên
          </h2>
          <p className="text-sm text-[var(--muted)] mt-2">
            Mỗi hóa đơn tích lũy là một bước đưa bạn đến gần hơn với những trải nghiệm cà phê thượng hạng và ưu đãi không giới hạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* THẺ ĐỒNG */}
          <div className="tier-card p-6 sm:p-7 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-700/10 border border-amber-700/20 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-5">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-[var(--ink)]">
                Thành Viên Đồng
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1">
                Chi tiêu từ 0 ₫ - 49.000 ₫
              </p>
              <div className="my-5 border-t border-[var(--line)]" />
              <ul className="space-y-3 text-xs sm:text-sm text-[var(--muted)]">
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#b88754] shrink-0 mt-0.5" />
                  <span>Tích lũy điểm thưởng tự động trên từng đơn hàng</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#b88754] shrink-0 mt-0.5" />
                  <span>Voucher ưu đãi khi đăng ký tài khoản</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#b88754] shrink-0 mt-0.5" />
                  <span>Quà tặng bất ngờ trong tuần sinh nhật</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--line)] text-xs font-semibold text-[var(--muted)]">
              Mức khởi đầu thân thiện
            </div>
          </div>

          {/* THẺ BẠC */}
          <div className="tier-card p-6 sm:p-7 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-stone-500/10 border border-stone-500/20 text-stone-600 dark:text-stone-300 flex items-center justify-center mb-5">
                <Medal size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-[var(--ink)]">
                Thành Viên Bạc
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1">
                Chi tiêu từ 50.000 ₫ - 99.000 ₫
              </p>
              <div className="my-5 border-t border-[var(--line)]" />
              <ul className="space-y-3 text-xs sm:text-sm text-[var(--muted)]">
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#b88754] shrink-0 mt-0.5" />
                  <span className="font-semibold text-[var(--ink)]">Giảm ngay 10% trực tiếp</span> trên toàn bộ menu
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#b88754] shrink-0 mt-0.5" />
                  <span>Miễn phí giao hàng nội thành</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#b88754] shrink-0 mt-0.5" />
                  <span>Thưởng thức menu Seasonal mới sớm</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--line)] text-xs font-semibold text-[var(--muted)]">
              Khách hàng gắn bó
            </div>
          </div>

          {/* THẺ VÀNG VIP */}
          <div className="tier-card featured p-6 sm:p-7 rounded-2xl flex flex-col justify-between relative">
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#b88754] text-white">
              Đẳng Cấp Nhất
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#b88754]/20 border border-[#b88754]/40 text-[#b88754] flex items-center justify-center mb-5">
                <Crown size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-[var(--ink)]">
                Thành Viên Vàng (VIP)
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1">
                Chi tiêu từ 100.000 ₫ trở lên
              </p>
              <div className="my-5 border-t border-[var(--line)]" />
              <ul className="space-y-3 text-xs sm:text-sm text-[var(--muted)]">
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#b88754] shrink-0 mt-0.5" />
                  <span className="font-semibold text-[var(--ink)]">Giảm vĩnh viễn 15%</span> trên tất cả các đơn hàng
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#b88754] shrink-0 mt-0.5" />
                  <span>Tặng ly sứ The Coffee Chill phiên bản giới hạn</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#b88754] shrink-0 mt-0.5" />
                  <span>Ưu tiên phục vụ & đặt bàn tại quán</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--line)] text-xs font-semibold text-[#b88754]">
              Quyền lợi thượng hạng trọn đời
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO ACCUMULATE POINTS (3 BƯỚC ĐƠN GIẢN) */}
      <section className="max-w-5xl mx-auto px-4 mb-24 relative z-10">
        <div className="p-8 sm:p-10 rounded-3xl border border-[var(--line)] bg-[var(--surface)] shadow-md">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-2xl font-serif font-bold text-[var(--ink)]">
              Cách Thức Tích Điểm Đơn Giản
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
              Chỉ 3 bước đơn giản để nâng hạng và nhận trọn bộ đặc quyền
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h4 className="font-bold text-base text-[var(--ink)] mb-2">Thưởng Thức Cà Phê</h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Gọi món trực tiếp tại các chi nhánh quán hoặc đặt hàng online trên website The Coffee Chill.
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h4 className="font-bold text-base text-[var(--ink)] mb-2">Ghi Nhận Tích Lũy</h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Cung cấp số điện thoại khi thanh toán hoặc đăng nhập tài khoản khi đặt hàng trực tuyến.
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h4 className="font-bold text-base text-[var(--ink)] mb-2">Tận Hưởng Đặc Quyền</h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Hệ thống tự động nâng hạng thẻ, bạn nhận ngay chiết khấu trực tiếp và quà tặng theo từng mốc.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footter />
    </div>
  );
};

export default Vippage;
