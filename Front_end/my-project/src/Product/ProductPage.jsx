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
import { getCached } from "../ApiCache";

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
  const [publicProducts, setPublicProducts] = useState([]);

  useEffect(() => {
    localStorage.setItem(
      "page_before",
      window.location.pathname + window.location.search,
    );
  }, []);

  useEffect(() => {
    let mounted = true;
    getCached("/product/public")
      .then((res) => {
        if (mounted) setPublicProducts(res.data?.result || []);
      })
      .catch((error) => console.error("Không thể tải danh sách sản phẩm:", error));
    return () => {
      mounted = false;
    };
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
      <div className="product-page min-h-screen overflow-x-hidden">
        {/* 🍂 FILTER - Made Sticky */}
        <section className="product-filter sticky top-20 z-40 py-5 mb-20">
          <div className="flex justify-center gap-4 md:gap-8 flex-wrap max-w-[1400px] mx-auto px-4">
            {categories.map((item, idx) => (
              <motion.button
                key={item.key}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                onClick={() => setOption(item.key)}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-bold tracking-wide
                  transition-all duration-300 border
                  ${
                    option === item.key
                      ? "product-filter-active text-white scale-105"
                      : "product-filter-idle"
                  }
                `}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </section>

        {/* 🧾 PRODUCTS */}
        <section className="max-w-[1400px] mx-auto px-4 pb-32">
          <AnimatePresence mode="wait">
            {/* ALL (Hiển thị từng mục dạng Grid Section) */}
            {option === "" && (
              <motion.div
                key="all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-24"
              >
                {Object.keys(urlApi).map((key) => {
                  const categoryInfo = categories.find((c) => c.key === key);
                  return (
                    <div key={key} className="flex flex-col gap-12">
                      {/* Tiêu đề & Giới thiệu cho mỗi loại */}
                        <div className="product-section-heading flex flex-col md:flex-row md:items-end justify-between pb-7 mb-4">
                        <div className="flex flex-col gap-2">
                          <motion.h2 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="product-title text-4xl md:text-5xl font-serif"
                          >
                            {categoryInfo?.label}
                          </motion.h2>
                          <motion.p 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-gray-500 italic max-w-lg text-sm md:text-base"
                          >
                            {categoryInfo?.intro}
                          </motion.p>
                        </div>
                        <motion.button
                          whileHover={{ x: 5 }}
                          onClick={() => setOption(key)}
                          className="mt-4 md:mt-0 text-[#b88754] font-bold text-sm flex items-center gap-2 hover:opacity-70 transition-opacity"
                        >
                          Xem tất cả {categoryInfo?.label} →
                        </motion.button>
                      </div>
                      
                      {/* Thay Marquee bằng ProductList Grid */}
                      <ProductList
                        products={publicProducts.filter((product) => product.category === key)}
                      />
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
                  <h2 className="product-title text-5xl font-serif mb-4">
                    {categories.find((c) => c.key === option)?.label}
                  </h2>
                  <p className="text-gray-500 italic max-w-xl text-lg px-4">
                    {categories.find((c) => c.key === option)?.intro}
                  </p>
                </div>
                {/* Dạng lưới truyền thống cho tab riêng lẻ */}
                <ProductList
                  products={publicProducts.filter((product) => product.category === option)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </>
  );
};

export default ProductPage;
