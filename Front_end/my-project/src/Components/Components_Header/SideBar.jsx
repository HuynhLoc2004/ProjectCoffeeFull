import { motion } from "framer-motion";

const SideBar = ({ img }) => {
  return (
    <section className="relative w-full py-32 overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f5efe7] via-[#faf7f2] to-[#efe6d8]" />

      {/* DECOR BLUR */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#d6a46c]/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-32 w-[300px] h-[300px] bg-[#6b3e2e]/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-20 items-center">
        {/* IMAGE BLOCK */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Image frame */}
          <div className="relative z-10 rounded-[32px] overflow-hidden shadow-2xl">
            <img
              src={img.srcCake}
              alt="Cake"
              className="w-full h-[480px] object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* Border accent */}
          <div className="absolute inset-0 -rotate-2 rounded-[36px] border border-[#d6a46c]/40" />
        </motion.div>

        {/* TEXT BLOCK */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Glass card */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-10 shadow-xl">
            <span className="uppercase tracking-widest text-xs text-[#c89b6d] font-semibold">
              Signature Moment
            </span>

            <h2 className="mt-4 text-4xl font-serif text-[#3b2f2f] leading-tight">
              Bánh ngọt &<br />
              Cà phê thủ công
            </h2>

            <p className="mt-6 text-gray-600 leading-relaxed">
              Một chiếc bánh mềm mịn, một tách cà phê ấm nóng. Không vội vàng,
              không ồn ào — chỉ là khoảnh khắc bạn cho phép mình chậm lại và tận
              hưởng.
            </p>

            {/* Divider */}
            <div className="mt-8 h-[1px] w-24 bg-[#d6a46c]" />

            {/* Quote */}
            <p className="mt-6 italic text-sm text-gray-500">
              “Good coffee. Sweet moments.”
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SideBar;
