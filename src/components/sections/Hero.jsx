import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight, FileText, Github, Linkedin, Mail } from "lucide-react";
import { usePerformanceActions } from "../../context/PerformanceContext";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { playTactileClick } from "../../utils/audio";
import { loadResumeModal } from "../../utils/prefetch";
import Magnetic from "../ui/Magnetic";
import { profile } from "../../data/portfolio";

const REVEAL_LINE_REDUCED = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { duration: 0 } },
};
const REVEAL_LINE_FULL = {
  hidden: { y: "105%", opacity: 0 },
  show: (delay = 0) => ({
    y: "0%",
    opacity: 1,
    transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

const FADE_REDUCED = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { duration: 0 } },
};
const FADE_FULL = {
  hidden: { opacity: 0, y: 14 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero({ heroReady = true }) {
  const { setIsResumeOpen } = usePerformanceActions();
  const shouldReduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Subtle cinematic parallax on the full-bleed background banner
  const bannerY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, shouldReduceMotion ? 0 : -48]
  );
  const bannerScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, shouldReduceMotion ? 1 : 1.045]
  );
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, shouldReduceMotion ? 0 : 24]
  );

  const revealLine = shouldReduceMotion ? REVEAL_LINE_REDUCED : REVEAL_LINE_FULL;
  const fadeEditorial = shouldReduceMotion ? FADE_REDUCED : FADE_FULL;
  const revealTarget = heroReady ? "show" : "hidden";

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden pt-24 sm:pt-24 lg:pt-24 pb-24 md:pb-10 lg:pb-7 px-5 sm:px-10"
    >
      {/* ── DESKTOP FULL-BLEED CINEMATIC HERO BANNER BACKGROUND (mounted only >= 1024px) ── */}
      {isDesktop && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
          >
            <motion.div
              style={
                shouldReduceMotion
                  ? undefined
                  : { y: bannerY, scale: bannerScale }
              }
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
              animate={
                heroReady
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: shouldReduceMotion ? 1 : 1.03 }
              }
              transition={{ duration: shouldReduceMotion ? 0.2 : 1.05, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-y-0 left-[14%] xl:left-[18%] right-0"
            >
              <picture className="block w-full h-full">
                <source srcSet="/hero-banner.avif" type="image/avif" />
                <source srcSet="/hero-banner.webp" type="image/webp" />
                <img
                  src="/hero-banner.jpg"
                  alt=""
                  width={1536}
                  height={1024}
                  fetchPriority="high"
                  decoding="async"
                  loading="eager"
                  className="w-full h-full object-cover object-[56%_14%]"
                />
              </picture>
            </motion.div>

            {/* Silky Left-to-Right Editorial Obsidian Scrim for crisp typography legibility */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, #0B0B0D 0%, #0B0B0D 25%, rgba(11,11,13,0.92) 38%, rgba(11,11,13,0.48) 52%, rgba(11,11,13,0.08) 68%, rgba(11,11,13,0.06) 88%, rgba(11,11,13,0.55) 100%)",
              }}
            />

            {/* Top Navbar Clearance & Bottom Seamless Transition Masks */}
            <div
              className="absolute inset-x-0 top-0 h-32"
              style={{
                background:
                  "linear-gradient(180deg, rgba(11,11,13,0.78) 0%, rgba(11,11,13,0.22) 55%, transparent 100%)",
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-44"
              style={{
                background:
                  "linear-gradient(0deg, #0B0B0D 0%, rgba(11,11,13,0.88) 28%, rgba(11,11,13,0.35) 65%, transparent 100%)",
              }}
            />
          </div>

          {/* Subtle Optical Loupe Hover Zone over Desktop Portrait Area */}
          <div
            aria-hidden="true"
            data-cursor="image"
            className="absolute top-24 bottom-24 right-14 w-[42%] z-[5]"
          />

          {/* Right-Edge Vertical Editorial Metadata (Desktop) */}
          <motion.div
            aria-hidden="true"
            variants={fadeEditorial}
            custom={0.46}
            initial="hidden"
            animate={revealTarget}
            className="hidden xl:flex items-center gap-3 absolute right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none select-none"
            style={{ writingMode: "vertical-rl" }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-stone-dark/75">
              Developer · Creator · Learner
            </span>
          </motion.div>
        </>
      )}

      {/* ── MAIN FOREGROUND EDITORIAL CONTENT ── */}
      <div className="relative z-10 w-full max-w-[1320px] mx-auto flex-1 flex flex-col justify-between">
        {/* Main Hero Left Content Column */}
        <motion.div
          style={shouldReduceMotion ? undefined : { y: contentY }}
          className="my-auto py-3 sm:py-6 lg:py-4 max-w-xl xl:max-w-[600px]"
        >
          {/* Minimalist CLI Prompt Tag */}
          <motion.div
            variants={fadeEditorial}
            custom={0.05}
            initial="hidden"
            animate={revealTarget}
            className="inline-flex items-center gap-2 font-mono text-[11.5px] sm:text-xs text-stone-dark tracking-wider mb-3.5 sm:mb-4"
          >
            <span className="text-champagne/75">&gt;</span>
            <span className="text-stone">portfolio.exe --open</span>
            <span
              aria-hidden="true"
              className={`inline-block w-1.5 h-3.5 bg-champagne-light/85 ${
                shouldReduceMotion ? "" : "animate-caret-blink"
              }`}
            />
          </motion.div>

          {/* Availability Capsule */}
          <motion.div
            variants={fadeEditorial}
            custom={0.1}
            initial="hidden"
            animate={revealTarget}
            className="mb-5 sm:mb-6"
          >
            <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-porcelain/15 bg-obsidian/75 backdrop-blur-md font-mono text-[11px] tracking-wide text-porcelain/90">
              <span
                className={`w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)] ${
                  shouldReduceMotion ? "" : "animate-pulse"
                }`}
              />
              <span>{profile.availability}</span>
            </span>
          </motion.div>

          {/* Editorial Italic Greeting + Hairline */}
          <motion.div
            variants={fadeEditorial}
            custom={0.15}
            initial="hidden"
            animate={revealTarget}
            className="flex items-center gap-4 mb-2"
          >
            <span className="font-serif italic text-xl sm:text-2xl text-porcelain/80 font-light">
              Hi, I&apos;m
            </span>
            <span
              aria-hidden="true"
              className="w-20 sm:w-28 h-px bg-gradient-to-r from-champagne/75 to-transparent"
            />
          </motion.div>

          {/* Oversized Stacked Cormorant Garamond Name */}
          <h1 className="font-serif text-[clamp(3.35rem,7.8vw,6.8rem)] leading-[0.94] tracking-[-0.02em] font-normal select-none">
            <span className="block overflow-hidden pb-1">
              <motion.span
                variants={revealLine}
                custom={0.18}
                initial="hidden"
                animate={revealTarget}
                className="block text-porcelain"
              >
                Ayush
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span
                variants={revealLine}
                custom={0.26}
                initial="hidden"
                animate={revealTarget}
                className="block bg-gradient-to-r from-champagne-pale via-champagne to-[#A88246] bg-clip-text text-transparent"
              >
                Kavathiya
              </motion.span>
            </span>
          </h1>

          {/* Role Subtitle + Hairline Rule */}
          <motion.div
            variants={fadeEditorial}
            custom={0.34}
            initial="hidden"
            animate={revealTarget}
            className="mt-4 sm:mt-5 space-y-4"
          >
            <p className="font-sans text-xs sm:text-[13px] uppercase tracking-[0.28em] text-porcelain/85 font-normal">
              {profile.role}
            </p>
            <div className="w-56 sm:w-72 h-px bg-gradient-to-r from-porcelain/25 via-champagne/40 to-transparent" />
          </motion.div>

          {/* Concise Factual Introduction */}
          <motion.div
            variants={fadeEditorial}
            custom={0.4}
            initial="hidden"
            animate={revealTarget}
            className="mt-5 space-y-1 text-sm sm:text-[15.5px] text-porcelain/80 font-light leading-relaxed max-w-md"
          >
            <p>
              {profile.degreeShort} · {profile.university}
            </p>
            <p className="text-stone">
              Building practical web platforms, databases &amp; desktop software
            </p>
          </motion.div>

          {/* Luxury Ringed Pill Action Row */}
          <motion.div
            variants={fadeEditorial}
            custom={0.46}
            initial="hidden"
            animate={revealTarget}
            className="mt-7 sm:mt-9 flex flex-wrap items-center gap-3.5 sm:gap-4"
          >
            <Magnetic strength={0.22} maxOffset={6}>
              <a
                href="#work"
                data-cursor="magnetic"
                onClick={() => playTactileClick("light")}
                className="group relative inline-flex items-center gap-3 rounded-full border border-champagne/75 bg-obsidian/80 hover:bg-champagne/[0.14] px-6 py-3 text-xs sm:text-[13.5px] font-medium text-porcelain tracking-wide shadow-[0_0_30px_-8px_rgba(201,169,110,0.5)] hover:shadow-[0_0_36px_-6px_rgba(201,169,110,0.68)] transition-all duration-300"
              >
                <span>Explore My Work</span>
                <span className="flex items-center justify-center w-6 h-6 rounded-full border border-champagne/60 text-champagne-light group-hover:bg-champagne group-hover:text-obsidian transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
                </span>
              </a>
            </Magnetic>

            <Magnetic strength={0.2} maxOffset={6}>
              <button
                type="button"
                data-cursor="magnetic"
                onPointerEnter={loadResumeModal}
                onFocus={loadResumeModal}
                onClick={() => {
                  playTactileClick("light");
                  setIsResumeOpen(true);
                }}
                className="inline-flex items-center gap-2.5 rounded-full border border-porcelain/22 hover:border-champagne/55 bg-obsidian/65 hover:bg-obsidian-elevated px-6 py-3 text-xs sm:text-[13.5px] font-medium text-porcelain/90 hover:text-champagne-light transition-all duration-300"
              >
                <span>View Resume</span>
                <FileText className="w-3.5 h-3.5 text-champagne" />
              </button>
            </Magnetic>
          </motion.div>

          {/* Minimalist Hairline-Divided Social Row */}
          <motion.div
            variants={fadeEditorial}
            custom={0.52}
            initial="hidden"
            animate={revealTarget}
            className="mt-6 sm:mt-7 flex items-center gap-4 text-porcelain/75"
          >
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="magnetic"
              aria-label="GitHub Profile"
              className="p-1.5 hover:text-champagne-light transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <span aria-hidden="true" className="w-px h-4 bg-porcelain/15" />
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="magnetic"
              aria-label="LinkedIn Profile"
              className="p-1.5 hover:text-champagne-light transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <span aria-hidden="true" className="w-px h-4 bg-porcelain/15" />
            <a
              href={`mailto:${profile.email}`}
              data-cursor="magnetic"
              aria-label={`Email ${profile.email}`}
              className="p-1.5 hover:text-champagne-light transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>

        {/* ── MOBILE SEAMLESS FULL-BLEED HERO BANNER (mounted only < 1024px) ── */}
        {!isDesktop && (
          <motion.div
            variants={fadeEditorial}
            custom={0.35}
            initial="hidden"
            animate={revealTarget}
            className="relative -mx-5 sm:-mx-10 mt-6 mb-2 overflow-hidden"
          >
            <div className="relative aspect-[3/2] w-full bg-[#0B0B0D]">
              <picture className="block w-full h-full">
                <source srcSet="/hero-banner-mobile.avif" type="image/avif" />
                <source srcSet="/hero-banner-mobile.webp" type="image/webp" />
                <img
                  src="/hero-banner.jpg"
                  alt={`${profile.name} — ${profile.role}`}
                  width={960}
                  height={640}
                  fetchPriority="high"
                  decoding="async"
                  loading="eager"
                  className="w-full h-full object-cover object-[54%_18%]"
                />
              </picture>
              {/* Seamless top & bottom obsidian feathers */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0B0B0D] to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/60 to-transparent"
              />
            </div>
          </motion.div>
        )}

        {/* ── Bottom Editorial Scroll Prompt with Signature Orbital Ring ── */}
        <motion.div
          variants={fadeEditorial}
          custom={0.56}
          initial="hidden"
          animate={revealTarget}
          className="flex items-center justify-between pt-4"
        >
          <a
            href="#about"
            data-cursor="magnetic"
            className="group inline-flex items-center gap-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-stone hover:text-champagne-light transition-colors"
          >
            <span>Scroll to explore</span>
            <span
              aria-hidden="true"
              className="w-12 sm:w-16 h-px bg-porcelain/20 group-hover:bg-champagne/60 transition-colors"
            />
            <span
              aria-hidden="true"
              className="w-4 h-4 rounded-full border border-champagne/60 flex items-center justify-center group-hover:scale-110 transition-transform motion-reduce:transform-none"
            >
              <span className="w-1 h-1 rounded-full bg-champagne-light" />
            </span>
          </a>

          <span className="hidden sm:inline font-mono text-[10.5px] uppercase tracking-[0.2em] text-stone-dark">
            {profile.location} · {profile.languages.join(" / ")}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
