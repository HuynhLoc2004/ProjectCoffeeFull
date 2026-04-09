import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const ToppingSelector = ({
  availableToppings,
  selectedToppings,
  setSelectedToppings,
}) => {
  const isSelected = (topping) =>
    selectedToppings.some((t) => t.id === topping.id);

  const toggle = (topping) => {
    if (isSelected(topping)) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {availableToppings.map((t) => {
        const selected = isSelected(t);
        return (
          <motion.div
            key={t.id}
            onClick={() => toggle(t)}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            className={`relative p-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out text-center ${
              selected
                ? "bg-emerald-500 text-white shadow-lg border-2 border-emerald-600"
                : "bg-white text-gray-800 shadow-sm border border-gray-200 hover:border-emerald-400"
            }`}
          >
            {selected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-1.5 right-1.5 text-white"
              >
                <CheckCircle size={18} />
              </motion.div>
            )}
            <h3 className="font-semibold text-sm truncate">{t.nameTopping}</h3>
            <p
              className={`text-xs font-mono ${
                selected ? "text-emerald-100" : "text-gray-500"
              }`}
            >
              +{t.price_topping}đ
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ToppingSelector;
