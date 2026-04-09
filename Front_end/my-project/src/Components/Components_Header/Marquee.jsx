import { motion } from "framer-motion";

const Marquee = () => {
  const items = [
    "☕ Giảm 20%",
    "🔥 Free ship",
    "🎉 Khai trương ưu đãi",
    "🍰 Mua bánh tặng cà phê",
  ];

  return (
    <div className="w-full overflow-hidden bg-[#2f1c14]">
      <div className="relative h-[36px] flex items-center">
        <motion.div
          className="flex items-center gap-16 whitespace-nowrap text-[#f7ede2] text-sm font-serif"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {/* list 1 */}
          {items.map((item, i) => (
            <span key={i} className="hover:text-[#d6a46c] transition-colors">
              {item}
            </span>
          ))}

          {/* list clone */}
          {items.map((item, i) => (
            <span
              key={`clone-${i}`}
              className="hover:text-[#d6a46c] transition-colors"
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Marquee;
