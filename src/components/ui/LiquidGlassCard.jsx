import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePerformance } from "../../context/PerformanceContext";

/**
 * Apple iOS / visionOS style Liquid Glass Card
 * - Interactive 3D perspective tilt
 * - Cursor-following spotlight reflection
 * - Specular bevel highlights
 * - Automatic low-end device optimization
 */
export default function LiquidGlassCard({
  children,
  className = "",
  glowColor = "gold", // gold | sapphire
  variant = "default", // default | gold | sapphire
  interactive = true,
  onClick,
  ...rest
}) {
  const { isEcoMode } = usePerformance();
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coords for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for buttery smooth tilt
  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current || isEcoMode) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Set CSS variables for spotlight gradient
    cardRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
    cardRef.current.style.setProperty("--mouse-y", `${mouseY}px`);

    // Normalized [-0.5, 0.5] for tilt
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const glowClass =
    glowColor === "sapphire"
      ? "hover:border-sapphire-light/40 hover:shadow-glass-sapphire"
      : "hover:border-gold-light/40 hover:shadow-glass-gold";

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...rest}
      style={
        !isEcoMode && interactive
          ? {
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }
          : undefined
      }
      className={`group relative liquid-glass rounded-2xl transition-all duration-300 spotlight-wrapper ${glowClass} ${className}`}
    >
      {/* Top Specular Rim Reflection */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-2xl z-10" />

      {/* Subtle corner light flare */}
      <div
        className={`pointer-events-none absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl transition-opacity duration-500 ${
          glowColor === "sapphire"
            ? "bg-sapphire-light/[0.08]"
            : "bg-gold-light/[0.08]"
        } ${isHovered ? "opacity-100" : "opacity-30"}`}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
