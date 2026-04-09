import { motion } from "framer-motion";
import Product from "./Product";
import axiosClient from "../../AxiosClient";
import { useEffect, useState, useRef } from "react";

const MarqueeProductList = ({ urlApi }) => {
  const [listProduct, setListProduct] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosClient.get(urlApi);
        setListProduct(res.data?.result || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setListProduct([]);
      }
    })();
  }, [urlApi]);

  if (listProduct.length === 0) return null;

  // Nhân bản danh sách để tạo hiệu ứng vô tận
  // Mỗi card 280px + gap 40px = 320px
  const itemWidth = 320; 
  const totalWidth = listProduct.length * itemWidth;

  return (
    <div className="relative overflow-hidden py-12 group">
      <motion.div
        className="flex gap-10 will-change-transform"
        animate={{
          x: [0, -totalWidth],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: listProduct.length * 6, // Tốc độ vừa phải, mượt mà
            ease: "linear",
          },
        }}
        style={{ width: `${totalWidth * 2}px` }} // Đảm bảo đủ độ rộng cho animation
      >
        {/* Render danh sách gốc + danh sách nhân bản để nối đuôi */}
        {[...listProduct, ...listProduct].map((itemData, index) => (
          <div key={`${itemData.id}-${index}`} className="flex-shrink-0">
            <Product ProductItem={itemData} />
          </div>
        ))}
      </motion.div>
      
      {/* Hiệu ứng bóng mờ ở 2 đầu để trông sang hơn */}
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#faf7f2] via-[#faf7f2]/50 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#faf7f2] via-[#faf7f2]/50 to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default MarqueeProductList;
