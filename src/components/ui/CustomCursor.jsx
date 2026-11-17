import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Terminal } from "lucide-react";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState("default"); // 'default' | 'hover' | 'project' | 'terminal'
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Exact mouse coords (for the instant center dot)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth trailing spring coords (for the outer liquid lens)
  const springConfig = { damping: 26, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only enable on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
      setIsTouchDevice(false);
    } else {
      return;
    }

    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Detect element under cursor for intelligent morphing
      const target = e.target;
      if (!target) return;

      const projectCard = target.closest('[data-cursor="project"]');
      const terminalEl = target.closest('[data-cursor="terminal"]');
      const interactiveEl = target.closest('button, a, input, textarea, [role="button"]');

      if (projectCard) {
        setCursorType("project");
      } else if (terminalEl) {
        setCursorType("terminal");
      } else if (interactiveEl) {
        setCursorType("hover");
      } else {
        setCursorType("default");
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* ── 1. Instant Precision Inner Dot ── */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 0.6 : cursorType === "hover" ? 1.4 : 1,
        }}
        transition={{ duration: 0.15 }}
        className="fixed w-2.5 h-2.5 rounded-full bg-gold-light shadow-glow-gold pointer-events-none z-20"
      />

      {/* ── 2. Fluid Liquid Trailing Lens (Morphs based on hover target) ── */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isClicking
            ? 0.85
            : cursorType === "project"
            ? 1.7
            : cursorType === "terminal"
            ? 1.5
            : cursorType === "hover"
            ? 1.45
            : 1,
          width: cursorType === "project" ? 52 : cursorType === "terminal" ? 48 : 38,
          height: cursorType === "project" ? 52 : cursorType === "terminal" ? 48 : 38,
          borderColor:
            cursorType === "hover" || cursorType === "project"
              ? "rgba(243, 208, 130, 0.6)"
              : cursorType === "terminal"
              ? "rgba(56, 189, 248, 0.6)"
              : "rgba(255, 255, 255, 0.3)",
          backgroundColor:
            cursorType === "project"
              ? "rgba(212, 175, 55, 0.12)"
              : cursorType === "terminal"
              ? "rgba(56, 189, 248, 0.1)"
              : cursorType === "hover"
              ? "rgba(243, 208, 130, 0.08)"
              : "rgba(255, 255, 255, 0.03)",
        }}
        transition={{ type: "spring", stiffness: 380, damping: 25 }}
        className="fixed rounded-full border border-white/30 backdrop-blur-[4px] shadow-glass-sm flex items-center justify-center pointer-events-none z-10"
      >
        {/* Subtle Specular Top Arc on the outer lens */}
        <div className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full" />

        {/* Morphing Symbol inside the glass ring */}
        {cursorType === "project" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-gold-light"
          >
            <ArrowUpRight className="w-4 h-4" />
          </motion.div>
        )}

        {cursorType === "terminal" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-sapphire-light text-[10px] font-mono font-bold"
          >
            &gt;_
          </motion.div>
        )}
      </motion.div>

      {/* ── 3. Ambient Liquid Light Glow Follower ── */}
      <motion.div
        animate={{
          opacity: isVisible ? (cursorType === "hover" || cursorType === "project" ? 0.35 : 0.2) : 0,
        }}
        transition={{ duration: 0.3 }}
        className="fixed w-[280px] h-[280px] rounded-full blur-[80px] pointer-events-none -z-10"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            cursorType === "terminal"
              ? "radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(243, 208, 130, 0.25) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
