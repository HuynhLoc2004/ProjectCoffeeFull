import { motion } from "framer-motion";
import { useRef } from "react";
import ProductList from "./ProductList";
import FloatingElements from "./FloatingElements";
import { Coffee, Sparkles, MoveRight, Star, Heart } from "lucide-react";

const Content = () => {
  const containerRef = useRef(null);
  
  const urlApi = {
    coffee: "/product/getTopProductByCategory?size=6&category=coffee",
    milkTea: "/product/getTopProductByCategory?size=6&category=milk-tea",
  };

  return (
    <div className="w-full bg-[#faf7f2] relative overflow-hidden" ref={containerRef}>
      <FloatingElements />
      
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col gap-40">
        
        {/* ☕ SECTION 1: COFFEE GRID */}
        <motion.section
          className="relative z-10"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <div className="h-1 w-20 bg-[#d6a46c] mb-6" />
              <h2 className="text-5xl md:text-7xl font-serif text-[#3b2a20] leading-tight">
                Cà Phê <br /> <span className="text-[#d6a46c]">Nguyên Bản</span>
              </h2>
            </div>
            <motion.div whileHover={{ x: 10 }} className="flex items-center gap-3 text-[#3b2a20] font-bold cursor-pointer group">
              <span>Khám phá bộ sưu tập</span>
              <MoveRight className="group-hover:text-[#d6a46c] transition-colors" />
            </motion.div>
          </div>
          <ProductList urlApi={urlApi.coffee} />
        </motion.section>

        {/* 🌟 HIGHLIGHT SECTION - SEASONAL COLLECTION */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <div className="bg-[#3b2a20] rounded-[48px] p-12 md:p-24 overflow-hidden relative group shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#d6a46c]/10 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -ml-32 -mb-32" />

            <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#d6a46c] text-[10px] font-bold uppercase tracking-widest mb-6">
                  <Sparkles size={12} /> Seasonal Collection
                </div>
                <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight">
                  Trải Nghiệm <br /> <span className="italic text-[#d6a46c]">Tuyệt Tác Hương Vị</span>
                </h2>
                <p className="text-gray-300 text-lg mb-10 leading-relaxed">
                  Sự kết hợp tinh tế giữa nghệ thuật pha chế và nguồn nguyên liệu thượng hạng.
                </p>
                <div className="flex gap-10">
                  <div>
                    <div className="text-3xl font-serif text-[#d6a46c]">100%</div>
                    <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Tự nhiên</div>
                  </div>
                  <div className="w-[1px] h-12 bg-white/10" />
                  <div>
                    <div className="text-3xl font-serif text-[#d6a46c]">Premium</div>
                    <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Chất lượng</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-8 border-white/5">
                  <img 
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800" 
                    alt="Signature Drink" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                </div>
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block"
                >
                  <Heart fill="#ef4444" className="text-[#ef4444] w-8 h-8 mb-2" />
                  <div className="text-[#3b2a20] font-bold">Signature</div>
                  <div className="text-gray-400 text-xs">Được yêu thích nhất</div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* 🍃 SECTION 2: MILK TEA GRID */}
        <motion.section
          className="relative z-10"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row-reverse justify-between items-end mb-16 gap-6">
            <div className="max-w-xl text-right">
              <div className="h-1 w-20 bg-[#6b8e4e] mb-6 ml-auto" />
              <h2 className="text-5xl md:text-7xl font-serif text-[#3b2a20] leading-tight">
                Trà Sữa <br /> <span className="text-[#6b8e4e]">Thanh Khiết</span>
              </h2>
            </div>
          </div>
          <ProductList urlApi={urlApi.milkTea} />
        </motion.section>

        {/* ✨ SECTION 3: THE CRAFT */}
        <section className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative rounded-[40px] overflow-hidden group shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=1000" 
                alt="The Craft" 
                className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3b2a20]/80 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 text-white">
                <p className="uppercase tracking-widest text-xs font-bold mb-2">Barista Spirit</p>
                <h3 className="text-3xl font-serif">Nghệ thuật pha chế</h3>
              </div>
            </motion.div>

            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block p-3 bg-[#d6a46c]/10 rounded-2xl mb-6">
                  <Coffee className="text-[#d6a46c]" size={32} />
                </span>
                <h2 className="text-4xl md:text-5xl font-serif text-[#3b2a20] leading-tight">Sự tỉ mỉ tạo nên sự khác biệt</h2>
                <p className="mt-6 text-gray-600 text-lg leading-relaxed">
                  Mỗi tách thức uống là sự kết hợp giữa kỹ thuật điêu luyện và niềm đam mê của người nghệ nhân.
                </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-8">
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-[#3b2a20]/5">
                  <div className="text-3xl font-serif text-[#d6a46c] mb-2">12+</div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-tighter">Công thức độc quyền</p>
                </div>
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-[#3b2a20]/5">
                  <div className="text-3xl font-serif text-[#d6a46c] mb-2">100%</div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-tighter">Tận tâm phục vụ</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🌿 SECTION 4: INGREDIENTS */}
        <section className="relative z-10 bg-[#3b2a20] rounded-[60px] p-12 md:p-24 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d6a46c]/10 rounded-full blur-[120px] -mr-64 -mt-64" />
          
          <div className="text-center mb-20 relative z-10">
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-6 p-4 rounded-full bg-white/5 border border-white/10"
            >
              <Star className="text-[#d6a46c]" fill="#d6a46c" size={24} />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Nguyên Liệu Tinh Túy</h2>
            <p className="text-gray-400 max-w-2xl mx-auto italic text-lg">
              "Khởi nguồn của sự ngon miệng là sự tử tế từ khâu chọn lọc nguyên liệu."
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {[
              {
                id: "coffee-beans",
                title: "Hạt Cà Phê Mộc",
                desc: "Tuyển chọn từ những nông trại cao nhất vùng Đà Lạt.",
                img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800"
              },
              {
                id: "tea-leaf",
                title: "Lá Trà Thượng Hạng",
                desc: "Tuyển chọn từ những búp trà non nhất, giữ trọn hương vị thanh tao.",
                img: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=800"
              },
              {
                id: "milk-fresh",
                title: "Sữa Tươi Thanh Trùng",
                desc: "Sữa tươi nguyên chất từ trang trại, đảm bảo độ béo và hương thơm tự nhiên.",
                img: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=800"
              }
            ].map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-[32px] mb-6 aspect-video">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-[#d6a46c] mb-3">{item.title}</h4>
                <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 🎥 GALLERY SECTION */}
        <section className="py-20">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-4xl md:text-6xl font-serif text-[#3b2a20]">The Coffee Moments</h2>
            <div className="h-[1px] flex-1 bg-[#3b2a20]/10" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 h-[400px] md:h-[600px]">
            {[
              "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600"
            ].map((url, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={`overflow-hidden rounded-3xl shadow-lg ${i % 2 === 0 ? "translate-y-10" : "-translate-y-10"}`}
              >
                <img src={url} className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" alt="Moments" />
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Content;
