import { motion } from "framer-motion";
import Product from "./Product";
import axiosClient from "../../AxiosClient";
import { useEffect, useState } from "react";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 50, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const ProductList = ({ urlApi }) => {
  const [listProduct, setListProduct] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosClient.get(urlApi);
        setListProduct(res.data?.result || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setListProduct([]); // Set empty array on error
      }
    })();
  }, [urlApi]);

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 place-items-center"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {listProduct.map((itemData) => (
        <motion.div key={itemData.id} variants={item}>
          <Product ProductItem={itemData} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductList;
