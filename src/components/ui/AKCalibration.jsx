import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SESSION_KEY = "ak_calibration_seen";

/**
 * Evaluates synchronously whether AK Calibration should run on initial mount.
 * Skips immediately for:
 * - Repeat visits/refreshes in the same browser session
 * - prefers-reduced-motion: reduce
 * - Direct section hash links (e.g., #work, #contact)
 * - Browser back/forward history restoration
 */
export function shouldRunAKCalibration() {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    if (window.location.hash && window.location.hash !== "#home") return false;
    const navEntries = performance.getEntriesByType?.("navigation");
    if (navEntries?.[0]?.type === "back_forward") return false;
    if (sessionStorage.getItem(SESSION_KEY) === "1") return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * AK CALIBRATION — Branded ~580ms Opening Sequence (Hard limit < 800ms)
 * Shares the exact AK monogram + twin orbital rings + champagne light particle
 * visual DNA with The Orbital Lens cursor and The Project Observatory index.
 */
export default function AKCalibration({ active, onRevealHero, onComplete }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!active) return;

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Ignore storage access errors in private contexts
    }

    // Coordinate Hero entrance right as orbital ring begins expanding (430ms)
    const revealTimer = window.setTimeout(() => {
      setExiting(true);
      onRevealHero?.();
    }, 430);

    // Unmount cleanly well within the 800ms hard cap (640ms total)
    const doneTimer = window.setTimeout(() => {
      onComplete?.();
    }, 640);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(doneTimer);
    };
  }, [active, onRevealHero, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="ak-calibration"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.21, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#0B0B0D] px-6 select-none pointer-events-none overflow-hidden"
        >
          {/* Central AK Monogram + Twin Orbital Rings + Orbiting Champagne Particle */}
          <motion.div
            initial={{ scale: 0.86, opacity: 0 }}
            animate={
              exiting
                ? { scale: 1.55, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            transition={{
              duration: exiting ? 0.22 : 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center"
          >
            <svg
              viewBox="0 0 120 120"
              className="absolute inset-0 w-full h-full overflow-visible"
            >
              {/* Outer broken orbital arc + single champagne particle */}
              <motion.g
                initial={{ rotate: -85, opacity: 0 }}
                animate={{ rotate: 195, opacity: 1 }}
                transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "60px 60px" }}
              >
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="rgba(244, 241, 234, 0.28)"
                  strokeWidth="1"
                  strokeDasharray="138 42 78 82"
                  strokeLinecap="round"
                />
                <circle cx="60" cy="6" r="2.6" fill="#DEC492" />
              </motion.g>

              {/* Inner counter-rotating orbital arc */}
              <motion.g
                initial={{ rotate: 75, opacity: 0 }}
                animate={{ rotate: -115, opacity: 1 }}
                transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "60px 60px" }}
              >
                <circle
                  cx="60"
                  cy="60"
                  r="39"
                  fill="none"
                  stroke="rgba(201, 169, 110, 0.55)"
                  strokeWidth="1"
                  strokeDasharray="68 48 52 78"
                  strokeLinecap="round"
                />
              </motion.g>
            </svg>

            {/* AK Monogram */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="font-serif italic text-3xl sm:text-4xl font-light text-champagne-pale tracking-tight"
            >
              AK
            </motion.span>
          </motion.div>

          {/* Fine Horizontal Registration Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={
              exiting
                ? { scaleX: 1.2, opacity: 0 }
                : { scaleX: 1, opacity: 1 }
            }
            transition={{
              duration: 0.24,
              delay: exiting ? 0 : 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-7 w-48 sm:w-64 h-px bg-gradient-to-r from-transparent via-champagne/70 to-transparent"
          />

          {/* Editorial Identity Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={exiting ? { opacity: 0, y: -4 } : { opacity: 1, y: 0 }}
            transition={{
              duration: 0.22,
              delay: exiting ? 0 : 0.16,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-4 text-center space-y-1.5"
          >
            <p className="font-serif text-lg sm:text-xl tracking-[0.22em] text-porcelain font-light uppercase">
              Ayush Kavathiya
            </p>
            <p className="font-mono text-[10.5px] tracking-[0.24em] text-champagne-light uppercase">
              Software &amp; Web Developer
            </p>
            <p className="font-mono text-[10px] tracking-[0.22em] text-stone-dark uppercase">
              Personal Engineering Portfolio
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

