import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth * 0.85; // Roughly one card width
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
        <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white max-w-3xl leading-[1.15] sm:leading-[1.05]">
          One engineer,
          <br />
          <span className="text-white/20 mt-1 sm:mt-0 block sm:inline">three surfaces.</span>
        </h2>
      </motion.div>

      {/* Asymmetric staggered card grid / Mobile Carousel */}
      <div className="relative group/carousel">
        <motion.div
          ref={scrollRef}
          onScroll={checkScroll}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-6xl mx-auto flex max-md:-mx-6 max-md:px-6 max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:pb-6 gap-6 lg:gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 hide-scrollbar relative"
        >
        {services.map(
          ({ icon: Icon, title, description, stack, glowHover, floatDelay, offset }) => (
            <motion.div
              key={title}
              variants={item}
              className={`${offset} max-md:w-[85vw] max-md:snap-center shrink-0`}
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

        {/* Mobile Carousel Navigation Arrows */}
        <div className="md:hidden">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-10 h-10 rounded-full bg-void border border-white/[0.08] shadow-2xl flex items-center justify-center text-white/50 hover:text-accent-emerald transition-colors z-10"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 w-10 h-10 rounded-full bg-void border border-white/[0.08] shadow-2xl flex items-center justify-center text-white/50 hover:text-accent-emerald transition-colors z-10"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
