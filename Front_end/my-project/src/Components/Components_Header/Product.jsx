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
      whileHover={{ y: -10, scale: 1.02 }}
      className="relative w-[280px] h-[400px] rounded-[32px] bg-white/80 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden group border border-white/40 cursor-pointer"
    >
      {/* Hover Slide-in Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-40 translate-x-[-100%]"
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#d6a46c]/10 rounded-full blur-3xl group-hover:bg-[#d6a46c]/20 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-[#3b2a20]/5 rounded-full blur-3xl group-hover:bg-[#3b2a20]/10 transition-all duration-700" />

      {/* Image Container */}
      <div className="relative z-10 h-[240px] overflow-hidden m-4 rounded-[24px]">
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
      <div className="relative z-20 px-6 text-center">
        <h3 className="font-serif text-xl text-[#3b2a20] mb-2 group-hover:text-[#d6a46c] transition-colors duration-300">
          {ProductItem.name}
        </h3>
        
        <div className="flex justify-center items-baseline gap-2">
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
            <span className="text-2xl font-bold text-[#3b2a20]">
              {ProductItem.price.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>
      </div>

      {/* Interactive Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-30">
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            handleOrder(e);
          }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 rounded-2xl bg-[#3b2a20] text-white text-sm font-bold shadow-[0_10px_20px_rgba(59,42,32,0.3)] hover:bg-[#d6a46c] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>Thêm ngay</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Product;
