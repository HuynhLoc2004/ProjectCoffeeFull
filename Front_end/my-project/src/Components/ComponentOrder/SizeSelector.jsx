import React from "react";
import { motion } from "framer-motion";

const SizeSelector = ({ _size, setSize, listSize }) => {
  return (
    <div className="relative flex w-full h-16 bg-slate-100 rounded-full p-2 space-x-2">
      {listSize?.map((item) => (
        <div key={item.id} className="relative flex-1">
          <motion.button
            onClick={() => setSize(item.size)}
            className="relative w-full h-full rounded-full font-bold transition-colors text-gray-800 z-10 flex flex-col items-center justify-center"
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-lg font-black">{item.size}</div>
            <div className="text-xs opacity-75">
              {item.price_size > 0
                ? `+${(item.price_size / 1000).toFixed(0)}k`
                : "Cơ bản"}
            </div>
          </motion.button>
          {item.size === _size && (
            <motion.div
              layoutId="activeSize"
              className="absolute inset-0 bg-white rounded-full shadow-md z-0"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SizeSelector;
