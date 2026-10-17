import React, { useState } from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { motion } from "framer-motion";

const ProductCart = ({ cartProduct, onIncrease, onDecrease, onDelete }) => {
  const [imgError, setImgError] = useState(false);
  const fallbackImg = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=200";

  if (!cartProduct) return null;

  const product = cartProduct.productEntity || {};
  const imgSrc = (!imgError && product.img) ? product.img : fallbackImg;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, x: -30 }}
      transition={{ duration: 0.2 }}
      className="cart-item-card flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 rounded-2xl mb-3 gap-4"
    >
      {/* Product Information */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative w-20 h-20 sm:w-22 sm:h-22 shrink-0 rounded-2xl overflow-hidden border border-[var(--line,#d4a373)]/20 shadow-sm bg-black/5">
          <img
            src={imgSrc}
            alt={product.name || "Sản phẩm"}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-black tracking-tight truncate leading-tight mb-1 text-[var(--ink,#fff)]">
            {product.name || "Cà phê đặc sản"}
          </h3>
          
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#d4a373]/15 text-[#d4a373] border border-[#d4a373]/30">
              Size {cartProduct.size || "M"}
            </span>

            {cartProduct.toppingEntityList && cartProduct.toppingEntityList.length > 0 && (
              <span className="text-xs text-gray-400 font-medium truncate max-w-[200px] sm:max-w-none">
                + {cartProduct.toppingEntityList.map((t) => t.nameTopping).join(", ")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Controls & Price */}
      <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
        {/* Quantity Controls */}
        <div className="cart-qty-ctrl flex items-center rounded-xl p-1 gap-1">
          <button
            type="button"
            className="cart-qty-btn w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-[#d4a373] hover:text-white transition-colors cursor-pointer text-xs disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => onDecrease(cartProduct.id)}
            disabled={cartProduct.quantity <= 1}
            title="Giảm số lượng"
            aria-label="Giảm số lượng"
          >
            <FaMinus size={10} />
          </button>
          
          <span className="w-9 text-center font-mono font-bold text-sm text-[var(--ink,#fff)] select-none">
            {cartProduct.quantity}
          </span>
          
          <button
            type="button"
            className="cart-qty-btn w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-[#d4a373] hover:text-white transition-colors cursor-pointer text-xs"
            onClick={() => onIncrease(cartProduct.id)}
            title="Tăng số lượng"
            aria-label="Tăng số lượng"
          >
            <FaPlus size={10} />
          </button>
        </div>

        {/* Item Total Price */}
        <div className="text-right min-w-[100px] sm:min-w-[120px]">
          <p className="text-lg sm:text-xl font-black text-[#d4a373] tracking-tight">
            {Number(cartProduct.totalPrice || 0).toLocaleString("vi-VN")}đ
          </p>
        </div>

        {/* Delete Item */}
        <button
          type="button"
          onClick={() => onDelete(cartProduct.id)}
          className="cart-del-btn p-2.5 rounded-xl text-gray-400 hover:text-red-500 cursor-pointer"
          title="Xóa món khỏi giỏ hàng"
          aria-label="Xóa món"
        >
          <FaTrash size={15} />
        </button>
      </div>
    </motion.div>
  );
};

export default React.memo(ProductCart);
