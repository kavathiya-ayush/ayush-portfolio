import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const letters = ["A", "Y", "U", "S", "H"];

const letterVariant = {
  hidden: { y: 80, opacity: 0, rotateX: -90 },
  show: (i) => ({
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      delay: 0.15 + i * 0.08,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const roleVariant = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.7, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Loader({ onComplete }) {
  const [phase, setPhase] = useState("enter");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase("hold"), 800);
    const exitTimer = setTimeout(() => setPhase("exit"), 1400);
    const doneTimer = setTimeout(() => setDone(true), 2100);

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
          {/* Top half */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-[#0F0F1A] z-20 origin-top"
            animate={
              phase === "exit"
                ? { y: "-100%", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }
                : {}
            }
          />

          {/* Bottom half */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0F0F1A] z-20 origin-bottom"
            animate={
              phase === "exit"
                ? { y: "100%", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }
                : {}
            }
          />

          {/* Center content */}
          <div className="relative z-30 flex flex-col items-center justify-center gap-6">
            <div className="absolute w-[300px] h-[300px] rounded-full bg-accent-emerald/[0.06] blur-[100px] pointer-events-none" />

            {/* Letter reveal */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-hidden perspective-[800px]">
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariant}
                  initial="hidden"
                  animate="show"
                  className="font-display font-bold text-6xl sm:text-8xl text-white inline-block"
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
                className="font-display font-bold text-6xl sm:text-8xl text-accent-emerald inline-block"
                style={{ transformOrigin: "bottom center" }}
              >
                .
              </motion.span>
            </div>

            {/* Role text */}
            <motion.p
              variants={roleVariant}
              initial="hidden"
              animate="show"
              className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-white/30"
            >
              Engineer & Creator
            </motion.p>

            {/* Horizontal line */}
            <motion.div
              className="w-32 sm:w-48 h-px mt-4"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.6), transparent)",
                transformOrigin: "center",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
