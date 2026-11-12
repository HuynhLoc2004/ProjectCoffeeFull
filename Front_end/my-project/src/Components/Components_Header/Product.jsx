import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import fallbackProductsData from "../../fallbackProducts.json";

const CATEGORY_FALLBACKS = {
  coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=500",
  "milk-tea": "https://images.unsplash.com/photo-1558857563-b37cfb8cb831?auto=format&fit=crop&q=80&w=500",
  americano: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=500",
  cake: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=500",
};

export const resolveProductImage = (item) => {
  if (!item) return CATEGORY_FALLBACKS.coffee;

  // 1. Nếu ảnh đã là ảnh mới trong folder TheCoffeeChill/Products -> sử dụng ngay
  if (item.img && item.img.includes("TheCoffeeChill/Products")) {
    return item.img;
  }

  // 2. Tìm ảnh Cloudinary chuẩn trong fallbackProducts theo id, code hoặc name
  const fallbackList = fallbackProductsData?.result || [];
  const matched = fallbackList.find(
    (p) =>
      (item.id != null && String(p.id) === String(item.id)) ||
      (item.code && p.code === item.code) ||
      (item.name && p.name.trim().toLowerCase() === item.name.trim().toLowerCase())
  );
  if (matched?.img) {
    return matched.img;
  }

  // 3. Nếu ảnh hiện tại không phải link lỗi Cloudinary cũ
  if (
    item.img &&
    !item.img.includes("TraSua_") &&
    !item.img.includes("AMERICANO_") &&
    !item.img.includes("Cake_") &&
    !item.img.includes("CF_")
  ) {
    return item.img;
  }

  // 4. Fallback theo danh mục
  return CATEGORY_FALLBACKS[item.category] || CATEGORY_FALLBACKS.coffee;
};

const Product = ({ ProductItem }) => {
  const navigate = useNavigate();

  const handleOrder = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    navigate(`/order/?category=${ProductItem.category}&id=${ProductItem.id}`);
  };

  const targetImg = resolveProductImage(ProductItem);
  const categoryFallback = CATEGORY_FALLBACKS[ProductItem.category] || CATEGORY_FALLBACKS.coffee;

  return (
    <motion.div
      onClick={handleOrder}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      whileHover={{ y: -7 }}
      className="product-card relative w-[280px] h-[415px] rounded-[28px] overflow-hidden group cursor-pointer flex flex-col justify-between select-none"
    >
      {/* Hover Slide-in Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-40 translate-x-[-100%] pointer-events-none"
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      {/* Image Container */}
      <div className="relative z-10 h-[225px] overflow-hidden m-3 rounded-[21px] bg-[#ece9e4] shrink-0">
        <motion.img
          src={targetImg}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = categoryFallback;
          }}
          alt={ProductItem.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />
        
        {/* Sale Tag */}
        {ProductItem.sale != null && (
          <div className="absolute top-3 left-3 z-30">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg"
            >
              Sale
            </motion.div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-20 px-5 pt-1 text-left flex-1 flex flex-col justify-between">
        <div>
          <h3 className="product-card-title font-serif text-lg font-bold mb-1.5 group-hover:text-[#d4a373] transition-colors duration-300 truncate">
            {ProductItem.name}
          </h3>
          
          <div className="flex items-baseline gap-2">
            {ProductItem.sale != null ? (
              <>
                <span className="text-xs text-gray-400 line-through font-medium">
                  {ProductItem.price.toLocaleString("vi-VN")}đ
                </span>
                <span className="text-xl font-black text-[#d4a373]">
                  {ProductItem.sale.toLocaleString("vi-VN")}đ
                </span>
              </>
            ) : (
              <span className="product-card-price text-lg font-black text-[#d4a373]">
                {ProductItem.price.toLocaleString("vi-VN")}đ
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Footer - Sits safely below price */}
      <div className="relative z-30 px-4 pb-3.5 pt-1">
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            handleOrder(e);
          }}
          whileTap={{ scale: 0.96 }}
          className="w-full py-2.5 rounded-xl bg-[#b88754] hover:bg-[#a27343] text-white text-sm font-bold shadow-md shadow-[#b88754]/25 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto cursor-pointer"
        >
          <Plus size={16} className="stroke-[2.5]" />
          <span>Thêm ngay</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Product;
