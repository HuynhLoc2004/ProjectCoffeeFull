import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaStar,
} from "react-icons/fa";
import { Coffee, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full mt-[100px] bg-[#fdfaf7] text-[#3b2a20] border-t border-[#d6a46c]/20">
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-5 gap-12">
        {/* About / Logo */}
        <div className="flex flex-col space-y-6 md:col-span-2 pr-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#3b2a20] rounded-xl text-white">
              <Coffee size={24} />
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#3b2a20] tracking-tight">
              The Coffee Chill
            </h1>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">
            Nơi hội tụ những tâm hồn đam mê cà phê nguyên bản và không gian tĩnh lặng. 
            Chúng tôi tận tâm mang đến hương vị ngọt ngào, ấm áp cho mọi khoảnh khắc của bạn.
          </p>
          <div className="flex space-x-4 text-xl">
            {[
              {
                Icon: FaFacebookF,
                href: "https://www.facebook.com/ChangTraiXiChoet",
              },
              {
                Icon: FaInstagram,
                href: "https://www.instagram.com/tlox_isme/",
              },
              { Icon: FaTwitter, href: "https://twitter.com/" },
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white border border-[#d6a46c]/20 rounded-full shadow-sm text-[#3b2a20] transition-all duration-300 hover:scale-110 hover:bg-[#d6a46c] hover:text-white"
              >
                <social.Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#d6a46c] mb-6">Thực đơn</h2>
          <ul className="space-y-3">
            {["Cà Phê Mộc", "Trà Sữa Tươi", "Bánh Thủ Công", "Americano"].map((item) => (
              <li key={item} className="group">
                <a className="text-gray-600 hover:text-[#d6a46c] transition-colors text-sm font-medium cursor-pointer">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Store Info */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#d6a46c] mb-6">Liên hệ</h2>
          <div className="space-y-4">
            <p className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed group cursor-pointer">
              <FaMapMarkerAlt className="text-[#d6a46c] mt-1 shrink-0 group-hover:scale-110 transition-transform" />
              <span>08 Nguyễn Thị Nhu, Củ Chi, TP. Hồ Chí Minh</span>
            </p>
            <p className="flex items-center gap-3 text-gray-600 text-sm group cursor-pointer">
              <FaPhoneAlt className="text-[#d6a46c] shrink-0 group-hover:scale-110 transition-transform" />
              <span>0977 958 350</span>
            </p>
            <div className="pt-2 flex gap-3">
              <div className="flex items-center gap-1 px-3 py-1 bg-[#d6a46c]/10 text-[#d6a46c] rounded-full text-[10px] font-bold uppercase">
                <Heart size={10} fill="currentColor" /> Open 7:00 - 22:00
              </div>
            </div>
          </div>
        </div>

        {/* Support & Payment */}
        <div className="flex flex-col space-y-8">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#d6a46c] mb-4">Chất lượng</h2>
            <div className="flex items-center space-x-1 text-[#d6a46c]">
              {[...Array(5)].map((_, idx) => (
                <FaStar key={idx} size={14} />
              ))}
              <span className="text-xs text-gray-400 ml-2">(5.0)</span>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#d6a46c] mb-4">Thanh toán</h2>
            <div className="flex space-x-4 text-3xl">
              {[FaCcVisa, FaCcMastercard, FaCcPaypal].map((Icon, idx) => (
                <Icon
                  key={idx}
                  className="text-gray-300 hover:text-[#3b2a20] transition-colors cursor-pointer"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="bg-[#f4f1ea] text-gray-500 text-center py-6 text-xs border-t border-[#d6a46c]/10 font-medium">
        <p>© 2026 The Coffee Chill. Crafted with Passion for Coffee Lovers.</p>
      </div>
    </footer>
  );
};

export default Footer;
