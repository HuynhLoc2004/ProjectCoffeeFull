import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MousePointer2, Sparkles, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeroImg from "../../assets/Shop/hero-coffee.jpg";

const Coffee3DBackground = lazy(() => import("../Coffee3DBackground"));

const HeaderHero = () => {
  const targetRef = useRef(null);
  const navigate = useNavigate();
  const [show3DBackground, setShow3DBackground] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const update3DVisibility = () => {
      setShow3DBackground(
        desktopQuery.matches && !reducedMotionQuery.matches,
      );
    };

    update3DVisibility();
    desktopQuery.addEventListener("change", update3DVisibility);
    reducedMotionQuery.addEventListener("change", update3DVisibility);
    return () => {
      desktopQuery.removeEventListener("change", update3DVisibility);
      reducedMotionQuery.removeEventListener("change", update3DVisibility);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  // Parallax shifts for clean depth separation
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={targetRef}
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#140a05] via-[#21130a] to-[#120703] z-10"
    >
      {/* 3D Background - interactive floating beans and steam */}
      {show3DBackground && (
        <Suspense fallback={null}>
          <Coffee3DBackground />
        </Suspense>
      )}

      {/* Decorative Warm Spotlights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4A373]/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-[#3b2a20]/20 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Hero Content Grid */}
      <motion.div
        style={{ y: yContent, opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
      >
        {/* Left Column: Premium Typography and CTA */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left text-white space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[#D4A373] text-[11px] font-bold uppercase tracking-[0.25em]"
          >
            <Sparkles size={12} className="animate-pulse" />
            <span>Premium Coffee Experience</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-7xl xl:text-8xl font-serif leading-[1.1] font-bold tracking-tight">
              The Coffee <br />
              <span className="text-[#D4A373] italic font-light font-serif">Chill</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="max-w-xl text-base sm:text-lg font-light text-gray-300 leading-relaxed italic"
          >
            "Khám phá hương vị nguyên bản được rang xay với cả sự tận tâm. Nơi mỗi giọt cà phê kể một câu chuyện, và thời gian dừng lại sau mỗi tách trà ấm áp."
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            {/* Primary Action Button with Shine Sweep Effect */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/product")}
              className="group relative overflow-hidden w-full sm:w-auto px-10 py-4 bg-[#D4A373] text-white font-bold rounded-full flex items-center justify-center gap-3 transition-shadow hover:shadow-[0_0_40px_rgba(212,163,115,0.5)] cursor-pointer"
            >
              {/* Shine line */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <span>Đặt hàng ngay</span>
              <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </motion.button>

            {/* Secondary Action Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/product")}
              className="w-full sm:w-auto px-10 py-4 border border-white/20 hover:border-white/50 text-white font-bold rounded-full backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Coffee size={18} />
              <span>Xem thực đơn</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Right Column: Interactive 3D Frame Image with Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="lg:col-span-5 hidden lg:flex items-center justify-center relative perspective-[1000px] z-20"
        >
          {/* Neon Glow under the image */}
          <div className="absolute w-[80%] h-[80%] bg-[#D4A373]/15 rounded-full blur-[80px] -z-10 animate-pulse" />

          {/* Interactive Card Container */}
          <motion.div
            style={{ y: yBg }}
            whileHover={{
              rotateY: -12,
              rotateX: 8,
              scale: 1.03,
              boxShadow: "0 30px 60px rgba(212,163,115,0.25)",
            }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="w-[360px] xl:w-[400px] aspect-[4/5] rounded-[36px] overflow-hidden border border-white/15 bg-[#140a05]/80 backdrop-blur-md p-4 cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.5)] group"
          >
            <div className="w-full h-full rounded-[26px] overflow-hidden relative">
              <img
                src={HeroImg}
                alt="Premium roasted coffee"
                className="w-full h-full object-cover brightness-[0.8] group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000 ease-out"
              />

              {/* Floating Overlay Badge */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base font-bold">Signature Blend</h4>
                  <p className="text-[10px] text-gray-400">100% Arabica Specialty</p>
                </div>
                <div className="px-3.5 py-1 rounded-full bg-[#D4A373] text-xs font-bold">
                  Top Seller
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white flex flex-col items-center gap-2.5 opacity-60 z-10"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-300">
          Cuộn để khám phá
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-[#D4A373]"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeaderHero;
