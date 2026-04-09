import { motion, AnimatePresence } from "framer-motion";
import ProductList from "../Components/Components_Header/ProductList";
import MarqueeProductList from "../Components/Components_Header/MarqueeProductList";
import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import axiosClient from "../AxiosClient";
import {
  getAccessToken,
  setAccessToken,
} from "../ManagerAccessToken/ManagerAccessToken";
import { unlogout, getLogout } from "../ManagerLogout/ManagerLogout";

const categories = [
  { key: "", label: "Tất cả" },
  { key: "coffee", label: "Cà phê", intro: "Hương vị đậm đà từ những hạt cà phê tuyển chọn, đánh thức mọi giác quan của bạn." },
  { key: "milk-tea", label: "Trà sữa", intro: "Sự kết hợp hoàn hảo giữa trà hảo hạng và sữa thơm ngậy, ngọt ngào khó cưỡng." },
  { key: "cake", label: "Bánh ngọt", intro: "Những chiếc bánh thủ công tinh tế, mang đến niềm vui ngọt ngào trong từng miếng cắn." },
  { key: "americano", label: "Americano", intro: "Sự đơn giản đầy tinh tế, giữ trọn vẹn hương thơm nguyên bản của cà phê." },
];

const urlApi = {
  coffee: "/product/getProducts?category=coffee",
  "milk-tea": "/product/getProducts?category=milk-tea",
  cake: "/product/getProducts?category=cake",
  americano: "/product/getProducts?category=americano",
};

const ProductPage = () => {
  const [option, setOption] = useState("");
  const [infoUser, setInfoUser] = useState(null);
  const [accessToken, setAccesstoken] = useState(getAccessToken());

  useEffect(() => {
    localStorage.setItem(
      "page_before",
      window.location.pathname + window.location.search,
    );
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (getLogout() == 0 && getAccessToken() != "") {
        try {
          const res = await axiosClient.get("/auth/info", {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
            },
          });
          setInfoUser({
            fullname: res.data.result.fullname,
            picture: res.data.result.picture,
          });
        } catch (err) {
          if (err.status == 401) {
            try {
              const res = await axiosClient.get("/auth/refresh_token", {
                withCredentials: true,
              });
              if (res.data.statusCode != 401) {
                unlogout();
                setAccessToken(res.data.result.accessToken);
                setAccesstoken(res.data.result.accessToken);
              }
            } catch (refreshErr) {
              console.error("Refresh token failed", refreshErr);
            }
          }
        }
      } else {
        try {
          const res = await axiosClient.get("/auth/refresh_token", {
            withCredentials: true,
          });
          if (res.data.statusCode != 401) {
            unlogout();
            setAccessToken(res.data.result.accessToken);
            setAccesstoken(res.data.result.accessToken);
          }
        } catch (err) {
          // Ignore 401 here as user might be a guest
        }
      }
    };

    fetchUserInfo();
  }, [getAccessToken()]);

  return (
    <>
      <Navbar userInfo={infoUser} />
      <div className="min-h-screen bg-[#faf7f2] overflow-x-hidden">
        {/* 🌿 HERO */}
        <section className="relative pt-32 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-4 px-4 py-1 rounded-full bg-[#d6a46c]/10 text-[#d6a46c] text-xs font-bold uppercase tracking-widest"
          >
            Thưởng thức hương vị
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-serif text-[#3b2a20] relative inline-block"
          >
            Thực đơn
            <motion.span 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -bottom-2 left-0 h-1 bg-[#d6a46c] rounded-full"
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 max-w-2xl mx-auto text-gray-600 text-lg leading-relaxed px-4"
          >
            Khám phá tinh hoa ẩm thực trong từng món đồ uống và bánh ngọt. 
            Chúng tôi tận tâm mang đến trải nghiệm hương vị tuyệt vời nhất cho bạn.
          </motion.p>
        </section>

        {/* 🍂 FILTER */}
        <section className="flex justify-center gap-6 flex-wrap mb-24 px-4">
          {categories.map((item, idx) => (
            <motion.button
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              onClick={() => setOption(item.key)}
              className={`
                px-8 py-3 rounded-2xl text-sm font-bold tracking-wide
                transition-all duration-500
                ${
                  option === item.key
                    ? "bg-[#3b2a20] text-white shadow-[0_15px_30px_rgba(59,42,32,0.3)] scale-110"
                    : "bg-white text-[#3b2a20] hover:bg-[#d6a46c] hover:text-white shadow-sm"
                }
              `}
            >
              {item.label}
            </motion.button>
          ))}
        </section>

        {/* 🧾 PRODUCTS */}
        <section className="max-w-[1400px] mx-auto px-4 pb-32">
          <AnimatePresence mode="wait">
            {/* ALL (Hiển thị từng mục dạng Băng chuyền) */}
            {option === "" && (
              <motion.div
                key="all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-36"
              >
                {Object.entries(urlApi).map(([key, api]) => {
                  const categoryInfo = categories.find((c) => c.key === key);
                  return (
                    <div key={key} className="flex flex-col">
                      {/* Tiêu đề & Giới thiệu cho mỗi loại */}
                      <div className="flex flex-col items-center text-center px-4 mb-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="flex items-center gap-4 mb-2"
                        >
                          <div className="h-[2px] w-12 bg-[#d6a46c]/40" />
                          <h2 className="text-4xl font-serif text-[#3b2a20]">
                            {categoryInfo?.label}
                          </h2>
                          <div className="h-[2px] w-12 bg-[#d6a46c]/40" />
                        </motion.div>
                        <motion.p 
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 }}
                          className="text-gray-500 italic max-w-lg text-sm md:text-base leading-relaxed"
                        >
                          {categoryInfo?.intro}
                        </motion.p>
                      </div>
                      
                      {/* Băng chuyền chạy mượt mà cho TẤT CẢ các loại */}
                      <MarqueeProductList urlApi={api} />
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* SINGLE CATEGORY (Vẫn giữ dạng Grid để khách hàng dễ chọn món cụ thể) */}
            {option !== "" && (
              <motion.div
                key={option}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-16"
              >
                <div className="flex flex-col items-center text-center">
                  <h2 className="text-5xl font-serif text-[#3b2a20] mb-4">
                    {categories.find((c) => c.key === option)?.label}
                  </h2>
                  <p className="text-gray-500 italic max-w-xl text-lg px-4">
                    {categories.find((c) => c.key === option)?.intro}
                  </p>
                </div>
                {/* Dạng lưới truyền thống cho tab riêng lẻ */}
                <ProductList urlApi={urlApi[option]} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </>
  );
};

export default ProductPage;
