import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import banner1 from "/src/assets/BannerIMG/Banner_6.png";
import banner2 from "/src/assets/BannerIMG/Banner_7.png";

const Banner = () => {
  const banners = [banner1, banner2];

  return (
    <section className="relative h-[90vh] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        className="h-full"
      >
        {banners.map((img, i) => (
          <SwiperSlide key={i}>
            <img src={img} className="w-full h-full object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-[#F7F3EE]" />

      {/* Hero text */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6"
      >
        <h1 className="text-4xl md:text-6xl font-serif tracking-wide">
          Coffee & Milk Tea Chill
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/90">
          Cà phê đậm vị thủ công – Trà sữa ngọt ngào hiện đại
        </p>
        <div className="mt-8 flex gap-4">
          <button className="px-6 py-3 rounded-full bg-[#C7A17A] text-[#3B2F2F] font-medium hover:scale-105 transition">
            Khám phá Coffee
          </button>
          <button className="px-6 py-3 rounded-full border border-white hover:bg-white hover:text-[#3B2F2F] transition">
            Xem Trà Sữa
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Banner;
