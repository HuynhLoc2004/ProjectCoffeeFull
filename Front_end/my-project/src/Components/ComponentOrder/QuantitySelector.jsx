import React from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const QuantitySelector = ({ quantity, setQuantity }) => {
  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        className="w-10 h-10 rounded-full bg-white text-emerald-600 font-bold text-lg hover:bg-emerald-100 shadow-sm transition-all flex items-center justify-center border border-emerald-200"
      >
        <Minus size={18} />
      </motion.button>

      <div className="text-center min-w-12">
        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">
          {quantity}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setQuantity(quantity + 1)}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-600 to-green-500 text-white font-bold text-lg hover:shadow-md shadow-sm transition-all flex items-center justify-center"
      >
        <Plus size={18} />
      </motion.button>
    </div>
  );
};

export default QuantitySelector;
