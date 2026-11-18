import { motion, useReducedMotion } from "framer-motion";
import { aboutPillars, profile } from "../../data/portfolio";

export default function WhyHireMe() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="about"
      className="relative px-5 sm:px-10 py-24 sm:py-32 lg:py-40 scroll-mt-24"
    >
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* ── Left Sticky Editorial Column (5 cols) ── */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 lg:sticky lg:top-32 space-y-6"
          >
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-champagne">
              <span>01</span>
              <span className="w-8 h-px bg-champagne/45" />
              <span>Approach</span>
            </div>

            <h2 className="font-serif text-editorial-lg font-light text-porcelain">
              Useful software <br />
              <span className="italic text-champagne-pale">over surface demos.</span>
            </h2>

            <p className="text-sm sm:text-[15px] text-stone leading-[1.78] max-w-md font-light">
              I focus on building dependable applications that address everyday
              workflows—whether a browser chat tool, a relational blood bank or
              banking system, or Python desktop software for Chartered Accountant
              offices.
            </p>

            <div className="pt-2 border-t border-porcelain/[0.08] font-mono text-[11px] text-stone-dark space-y-1">
              <p>{profile.degreeFull}</p>
              <p className="text-champagne/80">
                {profile.primarySkills.join(" · ")}
              </p>
            </div>
          </motion.div>

          {/* ── Right Matte Hairline Manifesto Index (7 cols) ── */}
          <div className="lg:col-span-7 border-t border-porcelain/[0.12]">
            {aboutPillars.map((pillar, idx) => (
              <motion.article
                key={pillar.index}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: shouldReduceMotion ? 0.2 : 0.6,
                  delay: shouldReduceMotion ? 0 : idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative py-8 sm:py-10 border-b border-porcelain/[0.1] transition-colors duration-300 hover:border-champagne/35"
              >
                <div className="grid grid-cols-1 sm:grid-cols-[56px_1fr] gap-4 sm:gap-6 items-baseline">
                  <span className="font-mono text-xs tracking-[0.2em] text-champagne/75 group-hover:text-champagne-light transition-colors">
                    {pillar.index}
                  </span>

                  <div className="space-y-3 transition-transform duration-500 ease-out group-hover:translate-x-1.5 motion-reduce:transform-none">
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal text-porcelain tracking-tight group-hover:text-champagne-pale transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="text-sm text-stone leading-[1.75] max-w-xl font-light">
                      {pillar.summary}
                    </p>

                    <p className="pt-1 font-mono text-[11px] tracking-[0.08em] text-stone-dark group-hover:text-champagne/80 transition-colors">
                      {pillar.focus}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
