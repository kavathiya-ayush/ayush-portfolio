import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Global Pointer Environment & Matte Obsidian Canvas
 * - Keeps the viewport matte, editorial, and clean (#0B0B0D)
 * - Drives subtle pointer-following ambient illumination purely via GPU translate3d
 *   on an isolated circular layer (ZERO documentElement style recalc, ZERO full-screen repaint)
 * - Respects prefers-reduced-motion, coarse touch devices, and document.hidden suspension
 */
export default function PointerEnvironment() {
  const shouldReduceMotion = useReducedMotion();
  const glowRef = useRef(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer || shouldReduceMotion) return;

    let rafId = null;
    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.35;

    const flush = () => {
      rafId = null;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
    };

    // Position initial ambient glow at 50vw / 35vh matching original resting state
    flush();

    const onPointerMove = (e) => {
      if (document.hidden) return;
      targetX = e.clientX;
      targetY = e.clientY;
      if (rafId === null) {
        rafId = window.requestAnimationFrame(flush);
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden && rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [shouldReduceMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      style={{ contain: "strict" }}
    >
      {/* Pure Matte Obsidian Base */}
      <div className="absolute inset-0 bg-[#0B0B0D]" />

      {/* Whisper-quiet architectural column hairlines */}
      <div className="hidden lg:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1380px] px-10">
        <div className="h-full w-full border-x border-porcelain/[0.035] relative">
          <div className="absolute inset-y-0 left-1/3 w-px bg-porcelain/[0.02]" />
          <div className="absolute inset-y-0 left-2/3 w-px bg-porcelain/[0.02]" />
        </div>
      </div>

      {/* Restrained top-right warm architectural spill */}
      <div
        className="absolute -top-48 right-[-10%] w-[740px] h-[640px] rounded-full opacity-[0.045]"
        style={{
          background:
            "radial-gradient(circle, rgba(201, 169, 110, 0.9) 0%, rgba(201, 169, 110, 0.15) 45%, transparent 72%)",
        }}
      />

      {/* Pointer-following whisper-quiet ambient illumination (GPU translate3d, zero full-screen repaint) */}
      {!shouldReduceMotion && (
        <div
          ref={glowRef}
          className="hidden md:block absolute -left-[540px] -top-[540px] w-[1080px] h-[1080px] rounded-full"
          style={{
            transform: "translate3d(50vw, 35vh, 0)",
            background:
              "radial-gradient(540px circle at 50% 50%, rgba(201, 169, 110, 0.055), rgba(218, 224, 232, 0.018) 38%, transparent 70%)",
          }}
        />
      )}

      {/* Ultra-fine static filmic grain tile (replaces runtime SVG feTurbulence filter) */}
      <div className="absolute inset-0 bg-grain bg-repeat opacity-[0.028] mix-blend-overlay" />

      {/* Delicate edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 92% 88% at 50% 44%, transparent 62%, rgba(5, 5, 7, 0.62) 100%)",
        }}
      />
    </div>
  );
}
