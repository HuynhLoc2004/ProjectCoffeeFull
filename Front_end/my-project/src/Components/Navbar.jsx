import React from "react";
import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/BannerIMG/Logo.png";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { BsCart } from "react-icons/bs";
import {
  FaRegUser,
  FaHome,
  FaCoffee,
  FaStore,
  FaPhoneAlt,
  FaTrophy,
  FaLock,
} from "react-icons/fa";
import { CiMenuBurger } from "react-icons/ci";
import "../index.css";
import { TfiClose } from "react-icons/tfi";
import axiosClient from "../AxiosClient";
import debounce from "lodash/debounce";
import { RxAvatar } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "../ManagerAccessToken/ManagerAccessToken";
import { unlogout, logout, getLogout } from "../ManagerLogout/ManagerLogout";
import {
  getCheckAddProduct,
} from "../ManagerAddCartProduct/ManagerAddCartProduct";

const Navbar = ({ userInfo }) => {
  const menuLinks = [
    { name: "Trang chủ", path: "/" },
    { name: "Sản phẩm", path: "/product" },
    { name: "Cửa hàng", path: "/shop" },
    { name: "Xếp hạng", path: "/rank-page" },
    { name: "Liên hệ", path: "/contact" },
  ];
  const mobileMenuIcons = [
    { name: "Trang chủ", path: "/", icon: <FaHome /> },
    { name: "Sản phẩm", path: "/product", icon: <FaCoffee /> },
    { name: "Cửa hàng", path: "/shop", icon: <FaStore /> },
    { name: "Xếp hạng", path: "/rank-page", icon: <FaTrophy /> },
    { name: "Liên hệ", path: "/contact", icon: <FaPhoneAlt /> },
  ];
  const text = "Nhập món bạn cần tìm...";
  const [placeholder, setPlaceholder] = useState("");
  const [index, setIndex] = useState(0);
  const [valuesearch, setValueSearch] = useState("");
  const [openbarMenu, setOpenbarMenu] = useState(false);
  const [itemSearch, setItemSeach] = useState([]);
  const [focus, setFocus] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [cartProductEntities, setcartProductEntities] = useState([]);
  const [accesstoken, setAccesstoken] = useState(getAccessToken());

  const springConfig = { type: "spring", stiffness: 200, damping: 25 };

  // Optimized Scroll logic to reduce lag
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastBanner, setIsPastBanner] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled(scrollY > 20);
          setIsPastBanner(scrollY > window.innerHeight * 0.75);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const HandlevalueInput = (e) => {
    if (e.target.value === "") {
      setPlaceholder("");
      setIndex(0);
      setValueSearch("");
    } else {
      setValueSearch(e.target.value);
      setIndex(text.length + 1);
    }
  };

  useEffect(() => {
    if (index === text.length) {
      setPlaceholder("");
      setIndex(0);
    } else if (index > text.length) {
      return;
    }
    const interval = setInterval(() => {
      setPlaceholder((prev) => prev + text[index]);
      setIndex((i) => i + 1);
    }, 100);
    return () => clearInterval(interval);
  }, [placeholder, index]);

  const callApiSearch = () => {
    if (!valuesearch) {
      setItemSeach([]);
      return;
    }
    axiosClient
      .get(`product/getTOpProductbySearch?top=5&searchname=${valuesearch}`)
      .then((res) => setItemSeach(res.data.result))
      .catch(() => console.log("không call dc api"));
  };

  const debounceSearch = useCallback(debounce(callApiSearch, 500), [valuesearch]);
  useEffect(() => {
    debounceSearch();
    return () => debounceSearch.cancel();
  }, [valuesearch, debounceSearch]);

  useEffect(() => {
    setValueSearch("");
    setFocus(false);
    setOpenbarMenu(false);
  }, [pathname]);

  const handleLogout = () => {
    axiosClient.get("/auth/logout", { withCredentials: true }).then((res) => {
      if (res.data.statusCode === 200) {
        clearAccessToken();
        logout();
        localStorage.setItem("page_before", "/");
        navigate("/loadingPage");
      }
    });
  };

  useEffect(() => {
    if (getAccessToken() !== "") {
      axiosClient.get(`/cart/getCart`, { headers: { Authorization: `Bearer ${getAccessToken()}` } })
        .then((res) => {
          if (res.data.statusCode === 401) return;
          setcartProductEntities(res.data.result?.cartProductEntities ?? []);
        });
    }
  }, [getAccessToken(), getCheckAddProduct()]);

  const handleCart = () => {
    if (getAccessToken() !== "" && getLogout() === 0) {
      navigate("/Cartpage");
    } else {
      axiosClient.get("/auth/refresh_token", { withCredentials: true })
        .then((res) => {
          if (res.data.statusCode === 401) {
            localStorage.setItem("page_before", window.location.pathname + window.location.search);
            navigate("/login");
          }
          if (res.data.statusCode === 200) {
            setAccessToken(res.data.result.accessToken);
            unlogout();
            setAccesstoken(res.data.result.accessToken);
          }
        })
        .catch(() => {
          localStorage.setItem("page_before", window.location.pathname + window.location.search);
          navigate("/login");
        });
    }
  };

  return (
    <>
      <div className={`fixed top-4 left-0 right-0 z-[100] flex px-6 lg:px-12 pointer-events-none transition-all duration-500 ${
        isScrolled ? "justify-center lg:justify-start" : "justify-center"
      }`}>
        <motion.nav
          layout
          initial={{ y: -100, opacity: 0 }}
          animate={{ 
            y: 0, 
            opacity: 1,
            backgroundColor: isPastBanner ? "rgba(255, 255, 255, 0.15)" : "rgba(10, 10, 10, 0.8)",
            borderColor: isPastBanner ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.1)",
          }}
          transition={{ 
            layout: springConfig,
            opacity: { duration: 0.4 },
            backgroundColor: { duration: 0.4 }
          }}
          className="pointer-events-auto flex items-center justify-between gap-6 px-6 py-2 h-[58px] rounded-full backdrop-blur-3xl border shadow-[0_15px_40px_rgba(0,0,0,0.2)] max-w-fit"
        >
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="shrink-0 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={Logo} alt="Logo" className={`w-9 h-9 rounded-full object-cover border transition-colors ${
              isPastBanner ? "border-black/5" : "border-white/10"
            }`} />
          </motion.div>

          {/* Menu */}
          <div className="hidden md:flex items-center gap-1">
            {menuLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <motion.div
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                  className={`px-4 py-2 rounded-full text-sm font-black transition-colors relative ${
                    pathname === link.path 
                      ? "text-[#D4A373]" 
                      : isPastBanner ? "text-gray-800 hover:text-black" : "text-gray-200 hover:text-white"
                  }`}
                >
                  {link.name}
                  {pathname === link.path && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#D4A373] shadow-[0_0_8px_rgba(212,163,115,0.6)]"
                      transition={springConfig}
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Search */}
          <div className="hidden lg:flex items-center relative group">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={placeholder}
                className={`rounded-full text-[11px] py-2 px-4 pl-10 w-[150px] focus:w-[200px] transition-all duration-500 outline-none border ${
                  isPastBanner 
                    ? "bg-black/5 border-black/5 text-gray-800 placeholder:text-gray-400 focus:bg-black/10" 
                    : "bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:bg-white/10"
                } focus:border-[#D4A373]/30`}
                onChange={HandlevalueInput}
                value={valuesearch}
                onFocus={() => setFocus(true)}
                onBlur={() => setTimeout(() => setFocus(false), 200)}
              />
              <CiSearch className={`absolute left-3 transition-colors text-base ${
                isPastBanner ? "text-gray-400" : "text-white/30"
              } group-focus-within:text-[#D4A373]`} />
            </div>
            
            <AnimatePresence>
              {focus && itemSearch.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute top-full mt-4 left-0 w-[300px] backdrop-blur-3xl rounded-3xl shadow-2xl border overflow-hidden z-[110] ${
                    isPastBanner ? "bg-white/95 border-black/5 text-gray-800" : "bg-black/95 border-white/5 text-white"
                  }`}
                >
                  <div className="p-3">
                    {itemSearch.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/10" onMouseDown={() => navigate(`/order/?category=${item.category}&id=${item.id}`)}>
                        <img src={item.img} className="w-9 h-9 rounded-lg object-cover" alt="" />
                        <span className="text-sm font-bold">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Icons Area */}
          <div className="flex items-center gap-1">
            {/* Cart */}
            <motion.div whileHover={{ scale: 1.1 }} onClick={handleCart} className={`relative p-2.5 rounded-full cursor-pointer transition-colors ${isPastBanner ? "text-gray-700 hover:text-[#D4A373]" : "text-gray-200 hover:text-[#D4A373]"}`}>
              <BsCart size={18} />
              {cartProductEntities.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#D4A373] text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border shadow-sm" style={{ borderColor: isPastBanner ? "white" : "#0a0a0a" }}>
                  {cartProductEntities.length}
                </span>
              )}
            </motion.div>

            {/* Profile Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => userInfo && setShowAvatarMenu(true)}
              onMouseLeave={() => setShowAvatarMenu(false)}
            >
              <motion.button 
                onClick={() => userInfo && setShowAvatarMenu(!showAvatarMenu)} 
                className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-all"
              >
                <div className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border ${isPastBanner ? "bg-black/5 border-black/10" : "bg-white/5 border-white/10"}`}>
                  {userInfo?.picture ? <img src={userInfo.picture} className="w-full h-full object-cover" /> : <FaRegUser className={isPastBanner ? "text-gray-400" : "text-white/40"} />}
                </div>
                {userInfo && <span className={`text-[10px] font-black hidden lg:block uppercase tracking-tighter pr-2 ${isPastBanner ? "text-gray-700" : "text-gray-200"}`}>{userInfo.fullname}</span>}
              </motion.button>

              <AnimatePresence>
                {userInfo && showAvatarMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 8, scale: 0.95 }} 
                    className={`absolute right-0 top-full pt-2 w-64 z-[110]`}
                  >
                    <div className={`backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border overflow-hidden ${
                      isPastBanner ? "bg-white/98 border-black/5 text-gray-800" : "bg-black/98 border-white/10 text-white"
                    }`}>
                      <div className="p-6 border-b border-white/5 bg-white/5">
                        <p className="text-[8px] text-[#D4A373] font-black uppercase tracking-widest mb-1">Elite Member</p>
                        <p className="text-sm font-black truncate">{userInfo.fullname}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link to="/profile" onClick={() => setShowAvatarMenu(false)}>
                          <div className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all hover:bg-white/5 text-gray-400 hover:text-[#D4A373]">
                            <FaRegUser size={14} /> Hồ sơ cá nhân
                          </div>
                        </Link>
                        <Link to="/change-password" onClick={() => setShowAvatarMenu(false)}>
                          <div className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all hover:bg-white/5 text-gray-400 hover:text-[#D4A373]">
                            <FaLock size={14} /> Đổi mật khẩu
                          </div>
                        </Link>
                        <div className="h-px bg-white/5 mx-3 my-1" />
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black text-red-400 hover:bg-red-500/10 rounded-2xl transition-all text-left">
                          <TfiClose size={14} /> Đăng xuất
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!userInfo && <Link to="/login" className={`text-xs font-black px-4 py-2 rounded-full border transition-all ${isPastBanner ? "border-black/10 text-gray-800 hover:bg-black/5" : "border-white/10 text-white hover:bg-white/5"}`}>LOGIN</Link>}

            {/* Mobile Burger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setOpenbarMenu(true)}
              className={`p-2 rounded-full md:hidden transition-colors ${
                isPastBanner ? "text-gray-800 hover:bg-black/5" : "text-white hover:bg-white/10"
              }`}
            >
              <CiMenuBurger size={22} />
            </motion.button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {openbarMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenbarMenu(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[1999]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={springConfig}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-[340px] bg-[#0a0a0a] z-[2000] shadow-2xl flex flex-col border-l border-white/5"
            >
              <div className="p-8 flex justify-between items-center border-b border-white/5">
                <span className="font-black text-2xl text-[#D4A373] tracking-tighter italic">MENU</span>
                <motion.div whileTap={{ rotate: 90 }} className="p-2 bg-white/5 rounded-full" onClick={() => setOpenbarMenu(false)}>
                  <TfiClose className="text-xl text-white" />
                </motion.div>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="mb-10 p-6 bg-white/5 rounded-[2rem] border border-white/5 text-center">
                  {userInfo ? (
                    <>
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <img src={userInfo.picture || "https://via.placeholder.com/150"} className="w-full h-full rounded-full object-cover border-2 border-[#D4A373] p-1" alt="" />
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></div>
                      </div>
                      <p className="font-black text-xl text-white tracking-tight">{userInfo.fullname}</p>
                      <p className="text-[9px] text-[#D4A373] font-black uppercase tracking-[0.2em] mt-2">Elite Member</p>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setOpenbarMenu(false)}>
                      <button className="w-full py-4 bg-[#D4A373] text-white rounded-2xl font-black shadow-lg shadow-[#8B4513]/20 uppercase tracking-widest text-xs">Đăng nhập ngay</button>
                    </Link>
                  )}
                </div>

                <div className="space-y-2">
                  {mobileMenuIcons.map((item, i) => (
                    <Link key={i} to={item.path} onClick={() => setOpenbarMenu(false)}>
                      <motion.div whileTap={{ x: 10 }} className="flex items-center gap-5 p-5 rounded-2xl hover:bg-white/5 text-gray-300 font-bold transition-all">
                        <span className="text-[#D4A373] text-2xl">{item.icon}</span>
                        <span className="text-base tracking-tight uppercase">{item.name}</span>
                      </motion.div>
                    </Link>
                  ))}
                  
                  {userInfo && (
                    <>
                      <div className="h-px bg-white/5 my-6 mx-4" />
                      <Link to="/change-password" onClick={() => setOpenbarMenu(false)}>
                        <div className="flex items-center gap-5 p-5 rounded-2xl hover:bg-white/5 text-gray-300 font-bold transition-all">
                          <FaLock className="text-[#D4A373] text-2xl" />
                          <span className="text-base tracking-tight uppercase">Đổi mật khẩu</span>
                        </div>
                      </Link>
                      <button onClick={() => { handleLogout(); setOpenbarMenu(false); }} className="w-full flex items-center gap-5 p-5 rounded-2xl hover:bg-red-500/10 text-red-400 font-black transition-all">
                        <TfiClose size={22} />
                        <span className="text-base tracking-tight uppercase text-left">Đăng xuất hệ thống</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
