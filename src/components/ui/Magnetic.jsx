import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

const IS_FINE_POINTER =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches;

const SPRING_CFG = { stiffness: 320, damping: 22, mass: 0.4 };

function MagneticActive({ children, className, strength, maxOffset }) {
  const ref = useRef(null);
  const rectRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, SPRING_CFG);
  const springY = useSpring(y, SPRING_CFG);

  const handlePointerEnter = (e) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    rectRef.current = ref.current.getBoundingClientRect();
  };

  const handlePointerMove = (e) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = rectRef.current || ref.current.getBoundingClientRect();
    rectRef.current = rect;
    const relX = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const relY = (e.clientY - (rect.top + rect.height / 2)) * strength;
    x.set(Math.max(-maxOffset, Math.min(maxOffset, relX)));
    y.set(Math.max(-maxOffset, Math.min(maxOffset, relY)));
  };

  const handlePointerLeave = () => {
    rectRef.current = null;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY }}
      className={`inline-flex ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * Subtle Magnetic Coupling Wrapper
 * - Caches getBoundingClientRect() on pointerenter (eliminates forced layout reads per mousemove)
 * - Short-circuits on touch-only & reduced-motion devices without allocating idle MotionValues/springs
 */
export default function Magnetic({
  children,
  className = "",
  strength = 0.22,
  maxOffset = 7,
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion || !IS_FINE_POINTER) {
    return <div className={`inline-flex ${className}`}>{children}</div>;
  }

  return (
    <MagneticActive
      className={className}
      strength={strength}
      maxOffset={maxOffset}
    >
      {children}
    </MagneticActive>
  );
}
