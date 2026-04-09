import React from "react";
import { motion } from "framer-motion";
import { Coffee, Leaf, Smile } from "lucide-react";

const ExperienceSection = () => {
  return (
    <section className="relative w-full py-32 bg-[#f7f3ee] overflow-hidden">
      {/* decorative blur */}
      <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-[#d6a46c]/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] bg-[#6b3e2e]/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-20"
        >
          <p className="uppercase tracking-widest text-sm text-[#c89b6d]">
            Our philosophy
          </p>
          <h2 className="mt-4 text-5xl font-serif text-[#3b2f2f] leading-tight">
            Một nơi để <br /> chậm lại và thưởng thức
          </h2>
          <p className="mt-6 text-gray-600 leading-relaxed">
            Chúng tôi tin rằng cà phê và trà sữa không chỉ để uống — mà là một
            khoảng dừng nhẹ giữa nhịp sống vội vàng.
          </p>
        </motion.div>

        {/* CONTENT GRID */}
        <div className="grid md:grid-cols-3 gap-10 items-end">
          {/* BIG CARD */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="
              md:col-span-2
              relative group rounded-[32px] p-14
              bg-gradient-to-br from-white/90 to-white/60
              backdrop-blur-xl
              shadow-[0_30px_60px_rgba(0,0,0,0.12)]
            "
          >
            <Coffee className="w-12 h-12 text-[#c89b6d]" />
            <h3 className="mt-6 text-3xl font-serif text-[#3b2f2f]">
              Pha chế thủ công
            </h3>
            <p className="mt-4 text-gray-600 text-lg leading-relaxed max-w-xl">
              Mỗi ly được pha bằng tay, chậm rãi và cẩn trọng, để giữ trọn hương
              thơm nguyên bản và cảm xúc tự nhiên nhất.
            </p>

            <span className="absolute bottom-8 right-10 text-7xl font-serif text-[#c89b6d]/10">
              01
            </span>
          </motion.div>

          {/* SMALL CARDS */}
          <div className="flex flex-col gap-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="
                relative rounded-3xl p-8 bg-white/80 backdrop-blur
                shadow-lg hover:shadow-2xl transition
              "
            >
              <Leaf className="w-9 h-9 text-[#6b8e4e]" />
              <h4 className="mt-4 text-xl font-semibold text-[#3b2f2f]">
                Nguyên liệu chọn lọc
              </h4>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Trà, cà phê và sữa được chọn từ nguồn ổn định, ưu tiên chất
                lượng và sự an toàn.
              </p>

              <span className="absolute top-6 right-6 text-5xl font-serif text-[#c89b6d]/10">
                02
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="
                relative rounded-3xl p-8 bg-white/80 backdrop-blur
                shadow-lg hover:shadow-2xl transition
              "
            >
              <Smile className="w-9 h-9 text-[#c89b6d]" />
              <h4 className="mt-4 text-xl font-semibold text-[#3b2f2f]">
                Không gian thư giãn
              </h4>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Ánh sáng dịu, màu sắc ấm và sự yên tĩnh — đủ để bạn muốn ngồi
                lại lâu hơn một chút.
              </p>

              <span className="absolute top-6 right-6 text-5xl font-serif text-[#c89b6d]/10">
                03
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
