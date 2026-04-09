import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Kiểm tra vị trí cuộn để ẩn/hiện nút (Chỉ hiện khi cuộn quá 70% trang)
  useEffect(() => {
    const toggleVisibility = () => {
      const scrollY = window.pageYOffset;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // Tính toán phần trăm đã cuộn
      const scrollPercentage = (scrollY / (scrollHeight - clientHeight)) * 100;

      if (scrollPercentage > 70) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    // Chạy kiểm tra ngay lập tức khi component mount
    toggleVisibility();

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1, backgroundColor: "#d6a46c" }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-[100px] right-8 z-[999] p-4 rounded-full bg-[#3b2a20] text-white shadow-2xl border border-white/20 transition-colors duration-300"
          aria-label="Back to top"
        >
          <ArrowUp size={24} strokeWidth={3} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
