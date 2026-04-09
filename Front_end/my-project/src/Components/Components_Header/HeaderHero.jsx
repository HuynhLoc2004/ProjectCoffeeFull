import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MousePointer2 } from "lucide-react";

// Sử dụng ảnh chất lượng cao từ assets/Shop cho Banner chung
import HeroImg from "../../assets/Shop/hero-coffee.jpg";
import { useNavigate } from "react-router-dom";

const HeaderHero = () => {
  const targetRef = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  // Hiệu ứng Parallax cho ảnh nền và làm mờ nội dung khi cuộn
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <section
      ref={targetRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Background Image với hiệu ứng Parallax và Zoom */}
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
            <img
          src={HeroImg}
          alt="The Coffee Chill Banner"
          className="w-full h-full object-cover brightness-[0.45]"
            />
      </motion.div>

      {/* Nội dung Banner theo phong cách mới của Shop */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center text-white px-4 max-w-5xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="uppercase tracking-[0.4em] text-xs md:text-sm font-semibold text-[#D4A373] mb-6 block">
            Premium Coffee Experience
          </span>
          <h1 className="text-6xl md:text-9xl font-serif italic mb-8 leading-tight">
            The Coffee Chill
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl font-light text-gray-200 mb-12 leading-relaxed italic">
            "Khám phá hương vị nguyên bản được rang xay với cả sự tận tâm. Nơi
            thời gian chậm lại sau mỗi tách cà phê."
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate("/product");
              }}
              className="px-10 py-4 bg-[#D4A373] text-white font-medium rounded-full flex items-center gap-3 transition-shadow hover:shadow-[0_0_30px_rgba(212,163,115,0.4)]"
            >
              Đặt hàng ngay <ArrowRight size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 border border-white/30 text-white font-medium rounded-full backdrop-blur-sm hover:bg-white/10 transition-all"
              onClick={() => {
                navigate("/product");
              }}
            >
              Xem thực đơn
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Icon cuộn xuống */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white flex flex-col items-center gap-2 opacity-50"
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">
          Cuộn để khám phá
        </span>
        <MousePointer2 size={14} />
      </motion.div>
    </section>
  );
};

export default HeaderHero;
