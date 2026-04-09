import React from "react";
import { Coffee } from "lucide-react";

const OrderSummary = ({ product }) => {
  return (
    <div className="flex gap-6 items-start">
      <motion.img
        whileHover={{ scale: 1.05 }}
        src={product.img}
        alt={product.name}
        className="w-40 h-40 object-cover rounded-2xl shadow-md flex-shrink-0"
      />
      <div className="flex-1">
        <h2 className="text-3xl font-bold flex items-center gap-2 text-[#3b2a20] mb-3">
          <Coffee className="text-emerald-600" size={32} /> {product.name}
        </h2>
        <p className="text-gray-600 text-base leading-relaxed mb-4">
          {product.description}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">
            {(product?.price ?? 0).toLocaleString()}đ
          </span>
          <span className="text-sm text-gray-500">/ cốc</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
