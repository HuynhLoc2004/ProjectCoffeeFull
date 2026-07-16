import React from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const QuantitySelector = ({ quantity, setQuantity }) => {
  return (
    <div className="quantity-selector flex items-center justify-center gap-5 p-3 rounded-2xl border">
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        className="quantity-button w-10 h-10 rounded-full font-bold transition-all flex items-center justify-center border"
      >
        <Minus size={18} />
      </motion.button>

      <div className="text-center min-w-12">
        <div className="text-3xl font-black text-[#b88754]">
          {quantity}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setQuantity(quantity + 1)}
        className="w-10 h-10 rounded-full bg-[#b88754] text-white font-bold transition-all flex items-center justify-center"
      >
        <Plus size={18} />
      </motion.button>
    </div>
  );
};

export default QuantitySelector;
