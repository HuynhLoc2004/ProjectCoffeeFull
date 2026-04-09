import React from "react";
import { motion } from "framer-motion";
import { Coffee, Leaf, Zap, Star } from "lucide-react";

const FloatingElements = () => {
  const elements = [
    { Icon: Coffee, color: "#d6a46c", size: 24, top: "10%", left: "5%" },
    { Icon: Leaf, color: "#6b8e4e", size: 20, top: "25%", left: "85%" },
    { Icon: Star, color: "#f9ca24", size: 18, top: "45%", left: "15%" },
    { Icon: Coffee, color: "#5a3826", size: 28, top: "65%", left: "80%" },
    { Icon: Zap, color: "#60a5fa", size: 22, top: "85%", left: "10%" },
    { Icon: Leaf, color: "#6b8e4e", size: 24, top: "15%", left: "75%" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el, i) => (
        <motion.div
          key={i}
          initial={{ y: 0, rotate: 0 }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 360],
            x: [0, 10, 0]
          }}
          transition={{
            duration: 5 + i * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute opacity-20"
          style={{ top: el.top, left: el.left }}
        >
          <el.Icon size={el.size} color={el.color} fill={el.color === "#f9ca24" ? el.color : "transparent"} />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;
