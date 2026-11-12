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

const ProductList = ({ urlApi, products, isLoading: externalLoading }) => {
  const [listProduct, setListProduct] = useState(products || []);
  const [internalLoading, setInternalLoading] = useState(products === undefined);

  useEffect(() => {
    if (products !== undefined) {
      setListProduct(products);
      return undefined;
    }

    let isMounted = true;
    setInternalLoading(true);

    (async () => {
      try {
        const res = await getCached(urlApi);
        if (isMounted) {
          setListProduct(res.data?.result || []);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        if (isMounted) {
          setListProduct([]);
        }
      } finally {
        if (isMounted) {
          setInternalLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [urlApi, products]);

  const loading = externalLoading !== undefined ? externalLoading : internalLoading;

  if (loading) {
    return (
      <div className="w-full py-16 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#D4A373]/30 border-t-[#D4A373] rounded-full animate-spin"></div>
        <p className="text-[#D4A373] text-sm font-medium tracking-wide animate-pulse">
          Đang tải danh sách sản phẩm... (Vui lòng đợi giây lát nếu server đang khởi động)
        </p>
      </div>
    );
  }

  if (!listProduct || listProduct.length === 0) {
    return (
      <div className="w-full py-16 text-center">
        <p className="text-gray-400 text-base">Hiện chưa có sản phẩm nào trong danh mục này.</p>
      </div>
    );
  }

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
