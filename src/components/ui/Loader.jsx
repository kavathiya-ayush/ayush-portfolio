import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const letters = ["A", "Y", "U", "S", "H"];

const letterVariant = {
  hidden: { y: 70, opacity: 0, rotateX: -80 },
  show: (i) => ({
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      delay: 0.12 + i * 0.08,
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const roleVariant = {
  hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.65, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Loader({ onComplete }) {
  const [phase, setPhase] = useState("enter");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase("hold"), 750);
    const exitTimer = setTimeout(() => setPhase("exit"), 1350);
    const doneTimer = setTimeout(() => setDone(true), 1950);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  const handleExitComplete = () => {
    onComplete?.();
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!done && (
        <motion.div
          key="preloader"
          className="preloader-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          {/* Top Half Curtain */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-[#060814] z-20 origin-top border-b border-gold/10"
            animate={
              phase === "exit"
                ? { y: "-100%", transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] } }
                : {}
            }
          />

          {/* Bottom Half Curtain */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[#060814] z-20 origin-bottom border-t border-gold/10"
            animate={
              phase === "exit"
                ? { y: "100%", transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] } }
                : {}
            }
          />

          {/* Center Brand Identity Content */}
          <div className="relative z-30 flex flex-col items-center justify-center gap-5">
            {/* Ambient Gold Glow Core */}
            <div className="absolute w-[280px] h-[280px] rounded-full bg-gold/[0.08] blur-[70px] pointer-events-none" />

            {/* Letter Reveal */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-hidden perspective-[800px]">
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariant}
                  initial="hidden"
                  animate="show"
                  className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl text-white inline-block"
                  style={{ transformOrigin: "bottom center" }}
                >
                  {letter}
                </motion.span>
              ))}
              <motion.span
                custom={5}
                variants={letterVariant}
                initial="hidden"
                animate="show"
                className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl text-gold-light inline-block"
                style={{ transformOrigin: "bottom center" }}
              >
                .
              </motion.span>
            </div>

            {/* Role & Academic Status */}
            <motion.p
              variants={roleVariant}
              initial="hidden"
              animate="show"
              className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-gold-light/70"
            >
              Semester 6 • Software Engineer
            </motion.p>

            {/* Horizontal Shimmer Bar */}
            <motion.div
              className="w-32 sm:w-48 h-[2px] mt-2 rounded-full overflow-hidden"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background:
                  "linear-gradient(90deg, transparent, #F3D082, #38BDF8, transparent)",
                transformOrigin: "center",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
