import { motion } from "framer-motion";
import Product from "./Product";
import { useEffect, useState } from "react";
import { getCached } from "../../ApiCache";

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

const ProductList = ({ urlApi, products }) => {
  const [listProduct, setListProduct] = useState(products || []);

  useEffect(() => {
    if (products !== undefined) {
      setListProduct(products);
      return undefined;
    }

    (async () => {
      try {
        const res = await getCached(urlApi);
        setListProduct(res.data?.result || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setListProduct([]); // Set empty array on error
      }
    })();
  }, [urlApi, products]);

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 place-items-center"
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
