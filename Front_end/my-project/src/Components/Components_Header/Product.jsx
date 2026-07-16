import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../AxiosClient";
import {
  getAccessToken,
  setAccessToken,
} from "../../ManagerAccessToken/ManagerAccessToken";
import { getLogout } from "../../ManagerLogout/ManagerLogout";

const Product = ({ ProductItem }) => {
  const navigate = useNavigate();
  const handleOrder = (e) => {
    if (getLogout() == 1) {
      navigate("/login");
    } else {
      axiosClient
        .get("/auth/info", {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        })
        .then((res) => {
          if (res.data.statusCode == 200) {
            navigate(
              `/order/?category=${ProductItem.category}&id=${ProductItem.id}`,
            );
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status == 401) {
            axiosClient
              .get("/auth/refresh_token", {
                withCredentials: true,
              })
              .then((res) => {
                if (res.data.statusCode == 200) {
                  setAccessToken(res.data.result.accessToken);
                }
                if (res.data.statusCode == 401) {
                  navigate("/login");
                  localStorage.setItem(
                    "page_before",
                    window.location.pathname + window.location.search,
                  );
                }
              })
              .catch((err) => {
                navigate("/login");
                localStorage.setItem(
                  "page_before",
                  window.location.pathname + window.location.search,
                );
              });
          }
        });
    }
  };

  return (
    <motion.div
      onClick={handleOrder}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      whileHover={{ y: -7 }}
      className="product-card relative w-[280px] h-[410px] rounded-[28px] overflow-hidden group cursor-pointer"
    >
      {/* Hover Slide-in Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-40 translate-x-[-100%]"
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      {/* Image Container */}
      <div className="relative z-10 h-[265px] overflow-hidden m-3 rounded-[21px] bg-[#ece9e4]">
        <motion.img
          src={ProductItem.img}
          alt={ProductItem.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />
        
        {/* Sale Tag */}
        {ProductItem.sale != null && (
          <div className="absolute top-3 left-3 z-30">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg"
            >
              Sale
            </motion.div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-20 px-6 pt-2 text-left">
        <h3 className="product-card-title font-serif text-xl mb-2 group-hover:text-[#b88754] transition-colors duration-300 truncate">
          {ProductItem.name}
        </h3>
        
        <div className="flex items-baseline gap-2">
          {ProductItem.sale != null ? (
            <>
              <span className="text-xs text-gray-400 line-through font-medium">
                {ProductItem.price.toLocaleString("vi-VN")}đ
              </span>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3b2a20] to-[#d6a46c]">
                {ProductItem.sale.toLocaleString("vi-VN")}đ
              </span>
            </>
          ) : (
            <span className="product-card-price text-xl font-bold">
              {ProductItem.price.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>
      </div>

      {/* Interactive Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-30">
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            handleOrder(e);
          }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 rounded-2xl bg-[#171513] text-white text-sm font-bold hover:bg-[#b88754] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>Thêm ngay</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Product;
