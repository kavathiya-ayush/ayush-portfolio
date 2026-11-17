import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePerformance } from "../../context/PerformanceContext";

export default function LiquidAuroraBackground() {
  const { isEcoMode } = usePerformance();

  // Subtle interactive parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 40, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 22 });

  useEffect(() => {
    if (isEcoMode) return;
    const handleMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 60;
      const y = (e.clientY / innerHeight - 0.5) * 60;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [isEcoMode, mouseX, mouseY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Deep Luxury Obsidian Base */}
      <div className="absolute inset-0 bg-[#060814]" />

      {/* ── Dynamic Fluid Liquid Aurora Mesh ── */}
      <motion.div
        style={!isEcoMode ? { x: springX, y: springY } : undefined}
        className="absolute inset-0"
      >
        {/* Orb 1: Upper Center (Directly Under the Floating Navbar Dock) */}
        <div
          className="absolute -top-[12%] left-[25%] sm:left-[32%] w-[680px] h-[520px] rounded-full blur-[110px] opacity-80 mix-blend-screen animate-pulse-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(168, 85, 247, 0.32) 0%, rgba(56, 189, 248, 0.22) 50%, transparent 75%)",
            animationDuration: "8s",
          }}
        />

        {/* Orb 2: Champagne Gold & Honey Amber (Behind Hero Left Typography) */}
        <div
          className="absolute top-[8%] left-[8%] sm:left-[12%] w-[720px] h-[720px] rounded-full blur-[125px] opacity-80 mix-blend-screen animate-pulse-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(243, 208, 130, 0.32) 0%, rgba(217, 119, 6, 0.18) 55%, transparent 75%)",
            animationDuration: "10s",
            animationDelay: "1.5s",
          }}
        />

        {/* Orb 3: Royal Sapphire & Indigo (Behind Spatial Portrait Rig) */}
        <div
          className="absolute top-[12%] right-[5%] sm:right-[10%] w-[780px] h-[780px] rounded-full blur-[130px] opacity-85 mix-blend-screen animate-pulse-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(59, 130, 246, 0.22) 50%, transparent 75%)",
            animationDuration: "12s",
            animationDelay: "3s",
          }}
        />

        {/* Orb 4: Rose Gold & Amber Glow (Mid-Section Illumination) */}
        <div
          className="absolute top-[48%] -left-[10%] w-[680px] h-[680px] rounded-full blur-[120px] opacity-70 mix-blend-screen animate-pulse-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(251, 191, 36, 0.24) 0%, rgba(244, 63, 94, 0.16) 55%, transparent 75%)",
            animationDuration: "11s",
            animationDelay: "2s",
          }}
        />
      </motion.div>

      {/* Subtle organic filmic grain */}
      <div className="absolute inset-0 bg-grain opacity-[0.035] mix-blend-overlay" />

      {/* Subtle peripheral vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 95% 90% at 50% 45%, transparent 60%, rgba(6, 8, 20, 0.65) 100%)",
        }}
      />
    </div>
  );
}
