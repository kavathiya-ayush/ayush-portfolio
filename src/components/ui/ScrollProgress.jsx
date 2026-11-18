import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

const SUPPORTS_CSS_SCROLL_TIMELINE =
  typeof window !== "undefined" &&
  typeof CSS !== "undefined" &&
  CSS.supports("animation-timeline", "scroll()");

/**
 * Fallback Motion-driven progress bar — mounted ONLY when native CSS scroll-driven
 * animations are unsupported or prefers-reduced-motion requires linear scroll progress.
 */
function MotionScrollProgressFallback({ shouldReduceMotion }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001,
  });

  if (shouldReduceMotion) {
    return (
      <div
        aria-hidden="true"
        className="fixed top-0 inset-x-0 z-[120] h-[1.5px] pointer-events-none bg-porcelain/[0.04]"
      >
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="h-full w-full origin-left bg-champagne/80"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 inset-x-0 z-[120] h-[1.5px] pointer-events-none bg-porcelain/[0.04]"
    >
      <motion.div
        style={{ scaleX }}
        className="h-full w-full origin-left bg-gradient-to-r from-champagne/40 via-champagne-light to-porcelain/90"
      />
    </div>
  );
}

/**
 * Top Hairline Reading Progress
 * Uses native CSS Scroll-Driven Animations (animation-timeline: scroll()) with ZERO JS scroll
 * listeners on modern engines, cleanly falling back to Framer Motion only when unsupported.
 */
export default function ScrollProgress() {
  const shouldReduceMotion = useReducedMotion();

  if (SUPPORTS_CSS_SCROLL_TIMELINE && !shouldReduceMotion) {
    return (
      <div
        aria-hidden="true"
        className="fixed top-0 inset-x-0 z-[120] h-[1.5px] pointer-events-none bg-porcelain/[0.04]"
      >
        <div className="h-full w-full bg-gradient-to-r from-champagne/40 via-champagne-light to-porcelain/90 native-scroll-progress" />
      </div>
    );
  }

  return <MotionScrollProgressFallback shouldReduceMotion={shouldReduceMotion} />;
}
