import { motion } from "framer-motion";
import { stack } from "../../data/portfolio";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Stack() {
  return (
    <section id="stack" className="relative px-6 max-md:py-12 py-20 lg:py-32 w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl mx-auto mb-10 md:mb-20"
      >
        <p className="font-mono text-xs text-accent-emerald/60 tracking-[0.25em] uppercase mb-4">
          The Stack
        </p>
        <h2 className="font-display text-3xl sm:text-5xl lg:text-7xl font-bold text-white max-w-xl leading-[1.05]">
          Tools I reach for.
        </h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4"
      >
        {stack.map(({ icon: Icon, name }, i) => (
          <motion.div
            key={name}
            variants={item}
            whileHover={{
              y: -6,
              borderColor: "rgba(16,185,129,0.2)",
              transition: { type: "spring", stiffness: 300, damping: 22 },
            }}
            className="group flex flex-col items-center justify-center gap-2 lg:gap-4 rounded-2xl void-card-sm py-6 md:py-8 lg:py-12 cursor-default transition-colors duration-300"
            style={{
              animation: `antigravity 9s ease-in-out ${i * 0.7}s infinite`,
            }}
          >
            <Icon
              className="w-6 h-6 lg:w-10 lg:h-10 text-white/40 group-hover:text-accent-emerald transition-colors"
              strokeWidth={1.5}
            />
            <span className="text-xs md:text-sm font-mono text-white/35">{name}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
