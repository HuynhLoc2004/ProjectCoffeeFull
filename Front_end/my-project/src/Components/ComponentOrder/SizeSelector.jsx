import React from "react";
import { motion } from "framer-motion";

const SizeSelector = ({ _size, setSize, listSize }) => {
  return (
    <div className="size-selector relative flex w-full min-h-16 rounded-2xl p-1.5 gap-1.5">
      {listSize?.map((item) => (
        <div key={item.id} className="relative flex-1">
          <motion.button
            type="button"
            onClick={() => setSize(item.size)}
            aria-pressed={item.size === _size}
            className={`size-option relative w-full min-h-13 rounded-xl font-bold z-10 flex flex-col items-center justify-center ${item.size === _size ? "is-active" : ""}`}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-lg font-black">{item.size}</div>
            <div className="text-xs opacity-75">
              {item.price_size > 0
                ? `+${(item.price_size / 1000).toFixed(0)}k`
                : "Cơ bản"}
            </div>
          </motion.button>
        </div>
      ))}
    </div>
  );
};

export default SizeSelector;
