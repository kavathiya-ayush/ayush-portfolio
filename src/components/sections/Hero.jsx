import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ChevronDown, ArrowUpRight, FileText, Sparkles, GraduationCap, ShieldCheck, Zap } from "lucide-react";
import { usePerformance } from "../../context/PerformanceContext";
import { playTactileClick } from "../../utils/audio";

const textLine = {
  hidden: { opacity: 0, y: 35, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero({ heroReady }) {
  const { isEcoMode, setIsResumeOpen } = usePerformance();
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  // 3D Perspective Tilt for the Portrait Sculpture
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]), {
    stiffness: 260,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]), {
    stiffness: 260,
    damping: 25,
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current || isEcoMode) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Scroll parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const portraitY = useTransform(scrollYProgress, [0, 1], [0, isEcoMode ? 0 : -80]);
  const portraitOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.1]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-[92svh] flex items-center justify-center pt-24 sm:pt-28 pb-12 sm:pb-16"
    >
      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
          
          {/* ── LEFT COLUMN: High-Fashion Tech Editorial ── */}
          <div className="flex-1 flex flex-col justify-center max-w-2xl text-left">
            <motion.div
              initial="hidden"
              animate={heroReady ? "show" : "hidden"}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
              }}
            >
              {/* Dynamic Island Status Pill */}
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full apple-liquid-card px-3.5 py-1 text-xs font-mono text-gold-light mb-4 shadow-glass-gold"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ring-2 ring-emerald-400/40" />
                <span className="tracking-wide">Pre-Final Year CS • Semester 6</span>
                <span className="text-white/20">|</span>
                <span className="text-white/80 hidden xs:inline">Open for SDE Intern</span>
                <Sparkles className="w-3.5 h-3.5 text-gold-light" />
              </motion.div>

              {/* Massive Editorial Name */}
              <div className="flex flex-col tracking-tight leading-none mb-3">
                <div className="overflow-hidden">
                  <motion.h1
                    variants={textLine}
                    className="font-display font-extrabold text-[2.8rem] sm:text-5xl md:text-6xl lg:text-[4.6rem] tracking-tight text-white leading-[0.95]"
                  >
                    AYUSH
                  </motion.h1>
                </div>
                <div className="overflow-hidden mt-1">
                  <motion.h1
                    variants={textLine}
                    className="font-display font-extrabold text-[2.8rem] sm:text-5xl md:text-6xl lg:text-[4.6rem] tracking-tight shimmer-text-gold leading-[0.95]"
                  >
                    KAVATHIYA.
                  </motion.h1>
                </div>
              </div>

              {/* Sub-Headline & Pitch */}
              <motion.p
                variants={fadeUp}
                className="text-base sm:text-lg lg:text-xl text-white/90 font-medium leading-relaxed max-w-xl"
              >
                Full-Stack Software Engineer & Multi-Platform Systems Builder.
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="mt-2 text-xs sm:text-sm text-white/55 leading-relaxed max-w-lg font-light"
              >
                Building production-grade web services, native Android mobile apps, and Python desktop automation utilities engineered for speed and reliability.
              </motion.p>

              {/* ── Apple VisionOS Spatial Metrics Capsule ── */}
              <motion.div
                variants={fadeUp}
                className="mt-5 p-1.5 rounded-2xl apple-liquid-card max-w-xl shadow-glass-sm"
              >
                <div className="grid grid-cols-3 divide-x divide-white/[0.08] text-center">
                  <div className="p-2 sm:p-2.5">
                    <div className="font-display font-extrabold text-2xl sm:text-3xl text-gold-light">
                      4+
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-mono text-white/50 mt-0.5">
                      Live Systems
                    </div>
                    <div className="mt-0.5 text-[9px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                      ● 100% Deployed
                    </div>
                  </div>

                  <div className="p-2 sm:p-2.5">
                    <div className="font-display font-extrabold text-2xl sm:text-3xl text-sapphire-light">
                      3
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-mono text-white/50 mt-0.5">
                      Platforms
                    </div>
                    <div className="mt-0.5 text-[9px] font-mono text-white/40 uppercase tracking-wider">
                      Web • App • PC
                    </div>
                  </div>

                  <div className="p-2 sm:p-2.5">
                    <div className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                      Sem 6
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-mono text-white/50 mt-0.5">
                      B.Tech CS
                    </div>
                    <div className="mt-0.5 text-[9px] font-mono text-gold-light/90 uppercase tracking-wider">
                      Summer / Fall '26
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ── Apple Liquid Glass CTAs (Always Visible Above Fold) ── */}
              <motion.div
                variants={fadeUp}
                className="mt-6 flex flex-wrap items-center gap-3"
              >
                <motion.a
                  href="#work"
                  onClick={() => playTactileClick("light")}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative inline-flex items-center gap-2 rounded-xl apple-liquid-gold-button px-5 py-3 text-sm font-bold text-gold-light tracking-wide hover:brightness-110 transition-all overflow-hidden"
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out" />
                  <span className="relative z-10 text-white font-semibold">Explore Featured Systems</span>
                  <ArrowUpRight className="w-4 h-4 text-gold-light relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </motion.a>

                <motion.button
                  onClick={() => {
                    playTactileClick("success");
                    setIsResumeOpen(true);
                  }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-xl apple-liquid-glass-button px-4 py-3 text-sm font-semibold text-white/90 hover:text-white hover:border-gold/40 transition-all shadow-glass-sm"
                >
                  <FileText className="w-4 h-4 text-gold-light" />
                  <span>Interactive CV</span>
                </motion.button>

                <motion.a
                  href="#terminal"
                  onClick={() => playTactileClick("light")}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-3 text-xs font-mono text-white/50 hover:text-white transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-sapphire-light" />
                  <span>Terminal CLI</span>
                </motion.a>
              </motion.div>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN: Spatial VisionOS Glass Portrait Rig ── */}
          <motion.div
            style={{ y: portraitY, opacity: portraitOpacity }}
            className="flex-1 flex items-center justify-center relative w-full max-w-[380px] lg:max-w-[440px]"
          >
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={
                !isEcoMode
                  ? {
                      rotateX,
                      rotateY,
                      transformStyle: "preserve-3d",
                    }
                  : undefined
              }
              className="relative w-full aspect-[4/5] rounded-[2rem] apple-liquid-card p-3 shadow-2xl transition-all duration-300"
            >
              {/* Backlight Atmospheric Volumetric Aura */}
              <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-tr from-gold/30 via-sapphire/25 to-transparent blur-3xl opacity-90" />

              {/* Frameless Fluid Photo Canvas */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-white/[0.04] to-obsidian/90 border border-white/10 flex items-center justify-center">
                <img
                  src="/hero-portrait.jpeg"
                  alt="Ayush Kavathiya"
                  className="w-full h-full object-cover object-top filter brightness-[1.03] contrast-[1.04] portrait-mask"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                {/* Fallback Monogram Avatar */}
                <div className="hidden absolute inset-0 items-center justify-center bg-gradient-to-br from-obsidian-100 to-obsidian">
                  <span className="font-display text-8xl font-black text-gold-light/25 select-none">
                    AK
                  </span>
                </div>

                {/* Subtle internal bottom shadow */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent pointer-events-none" />

                {/* ── SAFELY CONTAINED FLOATING SATELLITE CHIPS (NEVER CLIPPED) ── */}
                
                {/* Top Floating Badge */}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl apple-liquid-card border border-gold/40 shadow-glass-gold flex items-center gap-2 backdrop-blur-2xl z-20">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-mono text-white/90 font-medium whitespace-nowrap">
                    WebSocket Real-Time
                  </span>
                </div>

                {/* Bottom-Right Floating Badge */}
                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl apple-liquid-card border border-white/20 shadow-2xl flex items-center gap-1.5 backdrop-blur-2xl z-20">
                  <GraduationCap className="w-3.5 h-3.5 text-gold-light" />
                  <span className="text-[11px] font-mono text-gold-light font-semibold whitespace-nowrap">
                    Sem 6 CS Pre-Final
                  </span>
                </div>

                {/* Bottom-Left Floating Badge */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1.5 rounded-xl apple-liquid-card border border-white/15 text-[10px] font-mono text-sapphire-light flex items-center gap-1 backdrop-blur-xl z-10">
                  <ShieldCheck className="w-3 h-3 text-sapphire-light" />
                  <span>Production Ready</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
