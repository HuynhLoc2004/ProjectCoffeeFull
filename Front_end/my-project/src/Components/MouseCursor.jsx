import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

const MouseCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useSpring(-100, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(-100, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        translateX: cursorX,
        translateY: cursorY,
      }}
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#D4A373]/40 pointer-events-none z-[9999] hidden lg:block transition-opacity duration-200"
    >
      <div className="absolute inset-0 bg-[#D4A373]/10 rounded-full blur-sm animate-pulse" />
    </motion.div>
  );
};

export default MouseCursor;
