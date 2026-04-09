import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import axiosClient from "../AxiosClient";
import {
  getAccessToken,
  setAccessToken,
} from "../ManagerAccessToken/ManagerAccessToken";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { getLogout } from "../ManagerLogout/ManagerLogout";
import {
  Coffee,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Phone,
  Heart,
  Sparkles,
} from "lucide-react";

// Import các ảnh cho phần nội dung Shop
import StoryImg from "../assets/Shop/story-coffee.jpg";
import SpaceImg from "../assets/Shop/space-coffee.jpg";
import FlavorImg from "../assets/Shop/flavor-coffee.jpg";
import BrewingImg from "../assets/Shop/brewing-coffee.jpg";

import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import { unlogout } from "../ManagerLogout/ManagerLogout";

const Shop = () => {
  const [infoUser, setInfoUser] = useState(null);
  const containerRef = useRef(null);
  const [accesstoken, setAccesstoken] = useState("");

  // Tối ưu hóa Scroll Progress - sử dụng cách tiếp cận nhẹ hơn
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Giảm stiffness và damping để mượt mà hơn, ít lag hơn
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 50, // Giảm từ 100 xuống 50
    damping: 20, // Giảm từ 30 xuống 20
    restDelta: 0.001,
  });

  // Memoize shop sections để tránh re-render không cần thiết
  const shopSections = useMemo(
    () => [
      {
        id: 1,
        title: "Hành Trình Chinh Phục",
        subtitle: "Nguồn gốc & Đam mê",
        content:
          "Mỗi hạt cà phê tại The Coffee Chill là kết tinh của những giọt mồ hôi trên cao nguyên Di Linh. Chúng tôi không chỉ bán cà phê, chúng tôi kể câu chuyện về sự tận tâm từ khâu chọn lọc hạt mộc đến khi rót vào tách của bạn.",
        image: StoryImg,
        icon: <Coffee className="w-6 h-6" />,
        color: "#D4A373",
      },
      {
        id: 2,
        title: "Không Gian Tĩnh Lặng",
        subtitle: "Chill & Work",
        content:
          "Thiết kế tối giản kết hợp với ánh sáng tự nhiên và hương thơm nồng nàn, tạo nên một 'ốc đảo' giữa lòng thành phố nhộn nhịp. Một nơi lý tưởng để khơi nguồn cảm hứng sáng tạo hay chỉ đơn giản là đọc một cuốn sách hay.",
        image: SpaceImg,
        icon: <Star className="w-6 h-6" />,
        color: "#A98467",
      },
      {
        id: 3,
        title: "Hương Vị Độc Bản",
        subtitle: "Rang xay thủ công",
        content:
          "Chúng tôi áp dụng kỹ thuật rang Light-Medium để giữ nguyên được nốt hương trái cây đặc trưng của hạt Arabica vùng Cầu Đất. Vị đắng thanh, hậu vị ngọt sâu là điều khiến khách hàng luôn nhớ về chúng tôi.",
        image: FlavorImg,
        icon: <Clock className="w-6 h-6" />,
        color: "#6C584C",
      },
      {
        id: 4,
        title: "Nghệ Thuật Pha Chế",
        subtitle: "Barista Skills",
        content:
          "Pha chế cà phê là một môn nghệ thuật. Tại đây, mỗi Barista đều là một nghệ sĩ, tỉ mỉ trong từng công đoạn đo lường nhiệt độ, áp suất để mang lại tách Espresso hoàn hảo nhất.",
        image: BrewingImg,
        icon: <MapPin className="w-6 h-6" />,
        color: "#432818",
      },
    ],
    [],
  );

  useEffect(() => {
    if (getLogout() == 0 && getAccessToken() != "") {
      axiosClient
        .get("/auth/info", {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            withCredentials: getLogout() == 1 ? true : false,
          },
        })
        .then((res) => {
          setInfoUser({
            fullname: res.data.result.fullname,
            picture: res.data.result.picture,
          });
        })
        .catch((err) => {
          if (err.status == 401) {
            axiosClient
              .get("/auth/refresh_token", {
                withCredentials: true,
              })
              .then((res) => {
                if (res.data.statusCode == 401) {
                  return;
                }
                unlogout();
                setAccessToken(res.data.result.accessToken);
                setAccesstoken(res.data.result.accessToken);
              })
              .catch((err) => {
                if (err.status == 401) {
                  return;
                }
              });
          }
        });
    } else {
      axiosClient
        .get("/auth/refresh_token", {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.statusCode == 401) {
            return;
          }
          unlogout();
          setAccessToken(res.data.result.accessToken);
          setAccesstoken(res.data.result.accessToken);
        })
        .catch((err) => {
          if (err.status == 401) {
            return;
          }
        });
    }
  }, [accesstoken]);

  return (
    <div
      ref={containerRef}
      className="bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900 selection:bg-blue-500 selection:text-white overflow-x-hidden relative"
    >
      <Navbar userInfo={infoUser} />

      {/* Scroll Progress Bar - Tối ưu hóa */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-[100]"
        style={{
          scaleX,
          // Performance optimizations
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      />

      {/* TRANG SHOP BẮT ĐẦU NGAY VỚI NỘI DUNG VÀ HIỆU ỨNG */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block uppercase tracking-[0.3em] text-xs font-bold text-[#5a3826] mb-6 bg-[#d6a46c]/10 px-6 py-2 rounded-full border border-[#d6a46c]/20"
            >
              <Sparkles className="inline w-4 h-4 mr-2" />
              Câu chuyện của chúng tôi
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-serif mb-8 text-[#3b2a20] leading-tight"
            >
              Về{" "}
              <span className="bg-gradient-to-r from-[#3b2a20] via-[#5a3826] to-[#d6a46c] bg-clip-text text-transparent">
                The Coffee Chill
              </span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="h-[2px] bg-gradient-to-r from-transparent via-[#d6a46c] to-transparent mx-auto max-w-xs mb-8 origin-center"
            ></motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Khám phá hành trình đam mê cà phê của chúng tôi - từ hạt giống đến
              tách thức uống hoàn hảo
            </motion.p>
          </div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute top-40 right-20 w-16 h-16 bg-purple-200/30 rounded-full blur-xl"
          />

          {shopSections.map((section, index) => (
            <StickySection key={section.id} section={section} index={index} />
          ))}
        </div>
      </section>

      {/* Address & Map Section */}
      <section className="py-32 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 relative overflow-hidden">
        {/* Background decorations */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-20 left-20 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-20 right-20 w-60 h-60 bg-purple-200/20 rounded-full blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Info Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 space-y-12"
            >
              <div>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-block uppercase tracking-[0.3em] text-xs font-bold text-[#5a3826] mb-6 bg-[#d6a46c]/10 px-6 py-2 rounded-full border border-[#d6a46c]/20"
                >
                  <MapPin className="inline w-4 h-4 mr-2" />
                  Kết nối với chúng tôi
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl md:text-7xl font-serif mb-8 text-[#3b2a20] leading-tight"
                >
                  Ghé Thăm{" "}
                  <span className="bg-gradient-to-r from-[#3b2a20] to-[#d6a46c] bg-clip-text text-transparent">
                    Cửa Hàng
                  </span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-xl text-gray-600 leading-relaxed font-light max-w-xl"
                >
                  Chúng tôi luôn chào đón bạn ghé thăm để trực tiếp trải nghiệm
                  hương vị cà phê nguyên bản và không gian yên tĩnh của The
                  Coffee Chill.
                </motion.p>
              </div>

              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex items-start gap-6 group cursor-pointer"
                  style={{
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300"
                    whileHover={{
                      scale: 1.05,
                      rotate: 2,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      },
                    }}
                    style={{
                      willChange: "transform",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <MapPin size={24} />
                  </motion.div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors">
                      Địa chỉ
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      08 Nguyễn Thị Nhu, Tân Thạnh Đông, Củ Chi,
                      <br />
                      Thành phố Hồ Chí Minh, Việt Nam
                    </p>
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex items-start gap-6 group cursor-pointer"
                >
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-[#3b2a20] flex items-center justify-center text-white shrink-0 shadow-lg group-hover:shadow-[#d6a46c]/30 transition-all duration-300"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                  >
                    <Phone size={24} />
                  </motion.div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-xl text-[#3b2a20] group-hover:text-[#d6a46c] transition-colors">
                      Số điện thoại
                    </h4>
                    <p className="text-gray-600 font-mono text-lg">
                      0977 958 350
                    </p>
                  </div>
                </motion.div>

                {/* Opening Hours */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="flex items-start gap-6 group cursor-pointer"
                >
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-[#d6a46c] flex items-center justify-center text-white shrink-0 shadow-lg group-hover:shadow-[#3b2a20]/30 transition-all duration-300"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                  >
                    <Clock size={24} />
                  </motion.div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-xl text-[#3b2a20] group-hover:text-[#3b2a20] transition-colors">
                      Giờ mở cửa
                    </h4>
                    <p className="text-gray-600">
                      <span className="font-semibold text-[#3b2a20]">Thứ 2 - Chủ Nhật</span>
                      <br />
                      <span className="text-2xl font-bold text-[#d6a46c]">
                        07:00 - 22:00
                      </span>
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.button
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#3b2a20",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-[#3b2a20] text-white font-bold text-lg rounded-2xl inline-flex items-center gap-3 transition-all duration-300 shadow-xl hover:shadow-2xl border border-white/20"
                onClick={() => {
                  window.location.href =
                    "https://maps.app.goo.gl/QZNePYHftTDTyKiM8";
                }}
              >
                <span>Chỉ đường ngay</span>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowRight size={20} />
                </motion.div>
              </motion.button>
            </motion.div>

            {/* Map Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex-1 w-full min-h-[600px] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white relative group"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
              >
                <iframe
                  src="https://maps.google.com/maps?q=10.952193655925461,106.6040771317643&z=16&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "600px" }}
                  loading="lazy"
                  allowFullScreen
                  title="The Coffee Chill Map"
                />
              </motion.div>

              {/* Map overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-[#3b2a20]/10 backdrop-blur-[2px] transition-all duration-500 pointer-events-none flex items-center justify-center"
              >
                <div className="bg-white/90 p-6 rounded-3xl shadow-2xl border border-[#d6a46c]/20 text-center scale-90 group-hover:scale-100 transition-transform duration-500">
                  <MapPin className="w-10 h-10 mx-auto mb-3 text-[#d6a46c]" />
                  <p className="font-bold text-[#3b2a20] text-xl">The Coffee Chill</p>
                  <p className="text-[#8d7b68] text-sm">Nhấn để xem đường đi chi tiết</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

const StickySection = ({ section, index }) => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className="min-h-screen flex items-center py-20 relative group"
    >
      {/* Background decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.05 }}
        className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl"
      />

      <div
        className={`flex flex-col md:flex-row items-center gap-16 w-full relative z-10 ${!isEven ? "md:flex-row-reverse" : ""}`}
      >
        {/* Content Side */}
        <motion.div style={{ y, opacity }} className="flex-1 space-y-8 p-8">
          <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
            >
              {section.icon}
            </motion.div>
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-blue-600 font-bold tracking-wider uppercase text-sm bg-blue-50 px-3 py-1 rounded-full border border-blue-200"
            >
              {section.subtitle}
            </motion.span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-black leading-tight text-gray-800"
          >
            {section.title.split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                className="inline-block mr-4"
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-xl text-gray-600 leading-relaxed font-light max-w-2xl"
          >
            {section.content}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="pt-6"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/product")}
              className="group flex items-center gap-3 font-bold text-blue-600 hover:text-blue-700 transition-all duration-300 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-blue-200 hover:border-blue-300 shadow-lg hover:shadow-xl"
            >
              <span className="text-lg">Xem chi tiết</span>
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Image Side - Sticky Effect */}
        <motion.div
          style={{ scale, opacity }}
          className="flex-1 w-full relative"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative group overflow-hidden rounded-3xl shadow-2xl aspect-[4/5] md:aspect-square bg-gradient-to-br from-blue-50 to-purple-50 p-2"
          >
            <motion.img
              src={section.image}
              alt={section.title}
              className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-110"
              whileHover={{ scale: 1.05 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl" />

            {/* Floating elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <Heart className="w-6 h-6 text-white" />
            </motion.div>

            {/* Hover overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent rounded-2xl flex items-end justify-center pb-8"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                className="text-white text-center"
              >
                <p className="font-bold text-lg">Khám phá ngay</p>
                <p className="text-sm opacity-90">Trải nghiệm độc đáo</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Shop;
