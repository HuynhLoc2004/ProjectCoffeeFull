import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

const MouseCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{
        translateX: cursorX,
        translateY: cursorY,
      }}
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#D4A373]/30 pointer-events-none z-[9999] hidden lg:block"
    >
      <div className="absolute inset-0 bg-[#D4A373]/10 rounded-full blur-sm animate-pulse" />
    </motion.div>
  );
};

export default MouseCursor;
