import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { timelineEvents, profile } from "../../data/portfolio";

export default function Timeline() {
  const shouldReduceMotion = useReducedMotion();
  const trackRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 75%", "end 70%"],
  });

  const spineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="journey"
      className="relative px-5 sm:px-10 py-24 sm:py-32 lg:py-40 scroll-mt-24 border-t border-porcelain/[0.07]"
    >
      <div className="max-w-[1160px] mx-auto">
        {/* Editorial Section Header */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 sm:mb-20 space-y-4 max-w-2xl"
        >
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-champagne">
            <span>05</span>
            <span className="w-8 h-px bg-champagne/45" />
            <span>Chronology</span>
          </div>

          <h2 className="font-serif text-editorial-lg font-light text-porcelain">
            Education &amp; <span className="italic text-champagne-pale">Development Path.</span>
          </h2>

          <p className="text-sm sm:text-[15px] text-stone font-light leading-relaxed">
            Factual progression of {profile.degreeFull} and shipped software work.
          </p>
        </motion.div>

        {/* Scroll-Drawn Hairline Spine Chronology */}
        <div ref={trackRef} className="relative pl-8 sm:pl-12 md:pl-16">
          {/* Base matte track */}
          <div
            aria-hidden="true"
            className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 w-px bg-porcelain/[0.1]"
          />

          {/* Scroll-driven champagne progress line (static full line under reduced motion) */}
          <motion.div
            aria-hidden="true"
            style={
              shouldReduceMotion
                ? { scaleY: 1, transformOrigin: "top" }
                : { scaleY: spineScaleY, transformOrigin: "top" }
            }
            className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-champagne via-champagne-light to-porcelain/70"
          />

          <div className="space-y-14 sm:space-y-16">
            {timelineEvents.map((event, idx) => (
              <motion.article
                key={event.title}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: shouldReduceMotion ? 0.2 : 0.65,
                  delay: shouldReduceMotion ? 0 : idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative grid grid-cols-1 md:grid-cols-[190px_1fr] gap-3 md:gap-10 pb-10 border-b border-porcelain/[0.08] last:border-b-0 last:pb-0"
              >
                {/* Minimal Diamond Milestone Marker */}
                <span
                  aria-hidden="true"
                  className={`absolute -left-[29px] sm:-left-[43px] md:-left-[59px] top-2 w-2.5 h-2.5 rotate-45 border transition-colors duration-300 ${
                    idx === 0
                      ? "bg-champagne border-champagne-light"
                      : "bg-obsidian border-porcelain/35 group-hover:border-champagne group-hover:bg-champagne/25"
                  }`}
                />

                {/* Period & Tag Column */}
                <div className="space-y-1.5 pt-0.5">
                  <p className="font-mono text-xs tracking-[0.14em] text-champagne-light">
                    {event.period}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-dark">
                    {event.tag}
                  </p>
                </div>

                {/* Editorial Milestone Body */}
                <div className="space-y-2.5">
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-porcelain group-hover:text-champagne-pale transition-colors">
                    {event.title}
                  </h3>
                  <p className="font-mono text-xs text-porcelain/65">
                    {event.subtitle}
                  </p>
                  <p className="text-sm text-stone leading-[1.75] font-light max-w-2xl">
                    {event.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
