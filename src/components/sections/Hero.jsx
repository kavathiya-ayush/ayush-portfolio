import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

// ── Entrance animation variants ──
// Triggered only after the preloader exits (heroReady === true).

const textLine = {
  hidden: { opacity: 0, y: 60, skewY: 3, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    skewY: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const portraitReveal = {
  hidden: { opacity: 0, x: 80, scale: 1.08, filter: "blur(12px)" },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Hero — "Big Picture" section.
 *
 * Asymmetric layout: massive portrait on the right with text overlapping
 * on the left. The portrait floats with an antigravity animation and
 * parallaxes on scroll (moves faster, fades out).
 *
 * @param {{ heroReady: boolean }} props
 */
export default function Hero({ heroReady }) {
  const sectionRef = useRef(null);

  // Scroll-linked parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Direct useTransform without useSpring — much lighter on CPU
  // useSpring adds interpolation on every frame which is expensive on low-end devices

  // Portrait: moves up faster than scroll, fades out
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const portraitOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const portraitScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);

  // Text: slight counter-parallax for depth separation
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Scroll indicator fade-out
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Ambient mesh glow */}
      <div className="pointer-events-none absolute inset-0 bg-mesh-hero" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.02] mix-blend-overlay" />

      {/* ── Content grid ── */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="relative flex flex-col lg:flex-row items-center lg:items-start min-h-[100svh] pt-28 md:pt-20 pb-16 lg:pt-24 lg:pb-0">
          {/* ── LEFT: Typography block ── */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="relative z-20 flex-1 flex flex-col justify-center max-md:justify-start"
          >
            <motion.div
              initial="hidden"
              animate={heroReady ? "show" : "hidden"}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
              }}
            >
              {/* Status badge */}
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.06] px-4 py-1.5 lg:px-5 lg:py-2 text-xs lg:text-sm font-mono text-accent-emerald/90 mb-6 lg:mb-8"
              >
                <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-accent-emerald animate-pulse" />
                Available for new projects
              </motion.div>

              {/* Giant name lines & Mobile Portrait inline */}
              <div className="flex items-center justify-between gap-3 sm:gap-6 w-full">
                <div className="flex flex-col shrink-0">
                  <div className="overflow-hidden">
                    <motion.h1
                      variants={textLine}
                      className="font-display font-bold text-[2.7rem] sm:text-5xl md:text-hero text-white tracking-tight leading-none"
                    >
                      AYUSH.
                    </motion.h1>
                  </div>
                  <div className="overflow-hidden">
                    <motion.h1
                      variants={textLine}
                      className="font-display font-bold text-[2.7rem] sm:text-5xl md:text-hero text-white/20 tracking-tight leading-none"
                    >
                      ENGINEER.
                    </motion.h1>
                  </div>
                  <div className="overflow-hidden">
                    <motion.h1
                      variants={textLine}
                      className="font-display font-bold text-[2.7rem] sm:text-5xl md:text-hero text-white/10 tracking-tight leading-none"
                    >
                      CREATOR.
                    </motion.h1>
                  </div>
                </div>

                {/* Mobile-only inline circular portrait - flexes to fill space but stays completely stationary */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { duration: 1 } }
                  }}
                  className="md:hidden flex-1 aspect-square max-w-[160px] relative mt-2"
                >
                  {/* Radiating Background Ripples — CSS-only for compositor thread performance */}
                  <div
                    className="absolute inset-0 rounded-full border-2 border-accent-emerald/50 z-0 pointer-events-none hero-ripple"
                  />
                  <div
                    className="absolute inset-0 rounded-full border-2 border-accent-emerald/50 z-0 pointer-events-none hero-ripple-delayed"
                  />

                  {/* Main Portrait Container */}
                  <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-white/10 bg-void-100 flex items-center justify-center relative z-10 shadow-void-sm">
                    <img
                      src="/hero-portrait.jpeg"
                      alt="Ayush"
                      className="w-full h-full object-cover scale-110"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div className="hidden absolute inset-0 items-center justify-center bg-accent-emerald/10">
                       <span className="font-display text-4xl font-bold text-white/50 select-none">A</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Sub-line */}
              <motion.p
                variants={fadeUp}
                className="mt-6 lg:mt-8 text-sm sm:text-base lg:text-lg text-white/40 max-w-md leading-relaxed font-light"
              >
                <span className="block md:inline">Full Stack Developer</span>
                <span className="text-white/15 mx-2 max-md:hidden">|</span>
                <span className="block md:inline">Mobile & Desktop Software Engineer</span>
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="mt-3 lg:mt-4 text-xs sm:text-sm text-white/25 max-w-lg leading-relaxed"
              >
                I build production-grade software across the stack — from
                native mobile apps to desktop tools to the web services that
                tie them together.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="mt-8 lg:mt-10 flex flex-wrap gap-3 lg:gap-4">
                <motion.a
                  href="#work"
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="group inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 lg:px-8 lg:py-4 text-sm lg:text-base font-semibold text-void tracking-wide hover:shadow-glow-emerald transition-shadow"
                >
                  View Projects
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </motion.a>

                <motion.a
                  href="#contact"
                  whileHover={{
                    y: -3,
                    scale: 1.03,
                    borderColor: "rgba(255,255,255,0.2)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-3.5 lg:px-8 lg:py-4 text-sm lg:text-base font-medium text-white/60 hover:text-white transition-colors"
                >
                  Contact Me
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Big Picture portrait ── */}
          <motion.div
            style={{
              y: portraitY,
              opacity: portraitOpacity,
              scale: portraitScale,
            }}
            className="max-md:hidden relative z-10 flex-shrink-0 w-full lg:w-[55%] lg:absolute lg:right-[-5%] lg:top-24 flex items-start justify-center lg:justify-end"
          >
            <motion.div
              initial="hidden"
              animate={heroReady ? "show" : "hidden"}
              variants={portraitReveal}
              className="relative"
            >
              {/* Portrait image — replace /hero-portrait.png with your transparent PNG */}
              <div className="portrait-mask relative">
                <img
                  src="/hero-portrait.jpeg"
                  alt="Ayush — Full Stack Engineer"
                  className="w-full max-w-[280px] sm:max-w-[400px] lg:max-w-[600px] h-auto object-contain select-none"
                  draggable={false}
                  onError={(e) => {
                    // Fallback: show a gradient silhouette if image missing
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                {/* Fallback silhouette — shown only if portrait is missing */}
                <div
                  className="hidden w-[280px] sm:w-[400px] lg:w-[600px] h-[280px] sm:h-[400px] lg:h-[700px] rounded-full items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, transparent 70%)",
                  }}
                >
                  <span className="font-display text-[200px] font-bold text-white/[0.03] select-none">
                    A
                  </span>
                </div>
              </div>

              {/* Glow halo behind portrait — reduced blur radii for performance */}
              <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] lg:w-[500px] h-[280px] lg:h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(148,163,184,0.08) 0%, transparent 70%)' }} />
                <div className="absolute bottom-1/4 left-1/3 w-[200px] lg:w-[300px] h-[200px] lg:h-[300px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)' }} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        style={{ opacity: indicatorOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/20">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 text-white/30 animate-bounce-subtle" />
      </motion.div>
    </section>
  );
}
