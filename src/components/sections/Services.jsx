import { motion } from "framer-motion";
import { services } from "../../data/portfolio";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Services() {
  return (
    <section id="services" className="relative px-6 max-md:py-12 py-20 lg:py-32 w-full">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl mx-auto mb-8 md:mb-20"
      >
        <p className="font-mono text-xs text-accent-emerald/60 tracking-[0.25em] uppercase mb-4">
          What I Build
        </p>
        <h2 className="font-display text-3xl sm:text-5xl lg:text-7xl font-bold text-white max-w-3xl leading-[1.05]">
          One engineer,
          <br />
          <span className="text-white/20">three surfaces.</span>
        </h2>
      </motion.div>

      {/* Asymmetric staggered card grid / Mobile Carousel */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-6xl mx-auto flex max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:pb-6 gap-6 lg:gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 hide-scrollbar"
      >
        {services.map(
          ({ icon: Icon, title, description, stack, glowHover, floatDelay, offset }) => (
            <motion.div
              key={title}
              variants={item}
              className={`${offset} max-md:min-w-[75vw] max-md:snap-center shrink-0`}
            >
              <motion.div
                whileHover={{ y: -12, transition: { type: "spring", stiffness: 300, damping: 22 } }}
                className={`group relative rounded-2xl void-card p-6 md:p-8 lg:p-12 transition-shadow duration-500 ${glowHover}`}
                style={{
                  animation: `antigravity 8s ease-in-out ${floatDelay} infinite`,
                }}
              >
                {/* Top sheen */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent rounded-t-2xl" />

                {/* Icon */}
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-6 md:mb-8">
                  <Icon
                    className="w-6 h-6 md:w-7 md:h-7 text-white/50 group-hover:text-accent-emerald transition-colors duration-300"
                    strokeWidth={1.6}
                  />
                </div>

                <h3 className="font-display text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">
                  {title}
                </h3>
                <p className="text-sm md:text-base text-white/40 leading-relaxed mb-6 md:mb-8">
                  {description}
                </p>

                {/* Tech stack — reveals on hover with slide-up */}
                <div className="relative h-auto md:h-7 overflow-hidden mt-auto">
                  <div className="flex flex-wrap gap-1.5 md:absolute md:inset-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-400 ease-out">
                    {stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-white/[0.04] px-2.5 py-1 text-[10px] md:text-xs font-mono text-accent-emerald/70 border border-white/[0.04]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )
        )}
      </motion.div>
    </section>
  );
}
