import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const IDLE_PAUSE_MS = 1400;
const BASE_SHELL_SIZE = 86;

const SHELL_SCALE_BY_MODE = {
  project: 86 / BASE_SHELL_SIZE,
  image: 82 / BASE_SHELL_SIZE,
  inspect: 60 / BASE_SHELL_SIZE,
  terminal: 56 / BASE_SHELL_SIZE,
  magnetic: 48 / BASE_SHELL_SIZE,
  default: 40 / BASE_SHELL_SIZE,
  text: 40 / BASE_SHELL_SIZE,
};

const CORE_SPRING = { duration: 0.16, ease: [0.16, 1, 0.3, 1] };
const SHELL_SPRING = { type: "spring", stiffness: 360, damping: 28 };
const PRESS_SPRING = { type: "spring", stiffness: 420, damping: 26 };

/**
 * THE ORBITAL LENS — Signature Precision Pointer Instrument
 * - Single unified requestAnimationFrame physics loop (eliminates dual rAF + 6 Framer Motion spring graphs)
 * - Direct GPU translate3d / rotate / scale transforms on 4 DOM refs (ZERO React re-renders per mousemove)
 * - Caches e.target to skip redundant closest() DOM walks (~95% fewer DOM queries)
 * - Disables glass backdrop-filter when mode hides the glass disc (avoids invisible GPU readbacks)
 * - Automatically pauses its rAF loop to 0% CPU when idle or when document.hidden
 * - Completely disabled with native cursor fallback on touch / coarse / reduced-motion devices
 */
export default function CustomCursor() {
  const shouldReduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState("default");
  const [pressed, setPressed] = useState(false);

  const visibleRef = useRef(false);
  const modeRef = useRef("default");

  const corePosRef = useRef(null);
  const shellPosRef = useRef(null);
  const outerArcRef = useRef(null);
  const innerArcRef = useRef(null);

  useEffect(() => {
    const fineQuery = window.matchMedia("(pointer: fine)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const evaluate = () => {
      const shouldEnable =
        fineQuery.matches && !reducedQuery.matches && !shouldReduceMotion;
      setEnabled(shouldEnable);
      if (shouldEnable) {
        document.body.classList.add("orbital-cursor-active");
      } else {
        document.body.classList.remove("orbital-cursor-active");
      }
    };

    evaluate();
    fineQuery.addEventListener("change", evaluate);
    reducedQuery.addEventListener("change", evaluate);

    return () => {
      document.body.classList.remove("orbital-cursor-active");
      fineQuery.removeEventListener("change", evaluate);
      reducedQuery.removeEventListener("change", evaluate);
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!enabled) return;

    let targetX = -120;
    let targetY = -120;
    let smoothX = -120;
    let smoothY = -120;
    let curStretchX = 1;
    let curStretchY = 1;
    let speedRef = 0;
    let angleDeg = 0;
    let outerDeg = 0;
    let innerDeg = 0;
    let lastMoveTimestamp = 0;
    let lastFrameTime = 0;
    let rafId = null;
    let lastTarget = null;
    let initialized = false;

    const stopLoop = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      lastFrameTime = 0;
    };

    const tick = (now) => {
      if (document.hidden) {
        stopLoop();
        return;
      }

      const dt = lastFrameTime ? Math.min((now - lastFrameTime) / 16.667, 2.5) : 1;
      lastFrameTime = now;

      // Frame-rate-independent exponential smoothing matching original spring inertia
      const posEase = 1 - Math.pow(0.74, dt);
      const stretchEase = 1 - Math.pow(0.76, dt);

      smoothX += (targetX - smoothX) * posEase;
      smoothY += (targetY - smoothY) * posEase;

      speedRef *= Math.pow(0.86, dt);
      const clampedSpeed = Math.min(speedRef, 42);

      outerDeg = (outerDeg + (0.35 + clampedSpeed * 0.14) * dt) % 360;
      innerDeg = (innerDeg - (0.55 + clampedSpeed * 0.1) * dt) % 360;

      let targetSX = 1;
      let targetSY = 1;
      if (modeRef.current === "default" && clampedSpeed > 1.8) {
        const stretch = Math.min(clampedSpeed * 0.0055, 0.18);
        targetSX = 1 + stretch;
        targetSY = 1 - stretch * 0.65;
      }
      curStretchX += (targetSX - curStretchX) * stretchEase;
      curStretchY += (targetSY - curStretchY) * stretchEase;

      if (corePosRef.current) {
        corePosRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      }
      if (shellPosRef.current) {
        shellPosRef.current.style.transform = `translate3d(${smoothX}px, ${smoothY}px, 0) translate(-50%, -50%) rotate(${angleDeg}deg) scale(${curStretchX}, ${curStretchY})`;
      }
      if (outerArcRef.current) {
        outerArcRef.current.style.transform = `rotate(${outerDeg}deg)`;
      }
      if (innerArcRef.current) {
        innerArcRef.current.style.transform = `rotate(${innerDeg}deg)`;
      }

      const posSettled =
        Math.abs(targetX - smoothX) < 0.25 && Math.abs(targetY - smoothY) < 0.25;
      const stretchSettled =
        Math.abs(curStretchX - 1) < 0.004 && Math.abs(curStretchY - 1) < 0.004;

      if (
        now - lastMoveTimestamp > IDLE_PAUSE_MS &&
        clampedSpeed < 0.08 &&
        posSettled &&
        stretchSettled
      ) {
        if (shellPosRef.current) {
          shellPosRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%) rotate(${angleDeg}deg)`;
        }
        rafId = null;
        lastFrameTime = 0;
        return;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    const ensureLoopRunning = () => {
      if (rafId === null && !document.hidden) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const resolveMode = (target) => {
      if (!target || !(target instanceof Element)) return "default";
      if (target.closest('input, textarea, [contenteditable="true"]')) return "text";
      const explicit = target.closest("[data-cursor]");
      if (explicit) {
        const attr = explicit.getAttribute("data-cursor");
        if (attr) return attr;
      }
      if (target.closest('a, button, [role="button"]')) return "magnetic";
      return "default";
    };

    const handlePointerMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      lastMoveTimestamp = performance.now();

      if (initialized) {
        const dx = x - targetX;
        const dy = y - targetY;
        const dist = Math.hypot(dx, dy);
        speedRef = Math.min(speedRef * 0.4 + dist * 0.8, 50);
        if (dist > 1.2) {
          angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
        }
      } else {
        smoothX = x;
        smoothY = y;
        initialized = true;
      }
      targetX = x;
      targetY = y;

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      if (e.target !== lastTarget) {
        lastTarget = e.target;
        const nextMode = resolveMode(e.target);
        if (nextMode !== modeRef.current) {
          modeRef.current = nextMode;
          setMode(nextMode);
        }
      }

      ensureLoopRunning();
    };

    const handlePointerDown = () => {
      lastMoveTimestamp = performance.now();
      setPressed(true);
      ensureLoopRunning();
    };
    const handlePointerUp = () => setPressed(false);
    const handleMouseLeave = () => {
      lastTarget = null;
      visibleRef.current = false;
      setVisible(false);
      stopLoop();
    };
    const handleMouseEnter = () => {
      visibleRef.current = true;
      setVisible(true);
      lastMoveTimestamp = performance.now();
      ensureLoopRunning();
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopLoop();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled]);

  if (!enabled || shouldReduceMotion) return null;

  const isProject = mode === "project";
  const isTerminal = mode === "terminal";
  const isImage = mode === "image";
  const isInspect = mode === "inspect";
  const isMagnetic = mode === "magnetic";
  const isText = mode === "text";

  const showGlassDisc = isProject || isImage || isTerminal || isMagnetic;
  const shellScale = SHELL_SCALE_BY_MODE[mode] ?? SHELL_SCALE_BY_MODE.default;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
      style={{ contain: "strict" }}
    >
      {/* 1. Zero-Latency Precision Reticle Core (rAF translate3d outer + scale inner) */}
      <div
        ref={corePosRef}
        className="fixed top-0 left-0"
        style={{ transform: "translate3d(-120px, -120px, 0) translate(-50%, -50%)" }}
      >
        <motion.div
          style={{ borderRadius: isText ? 1 : 999 }}
          animate={{
            opacity: visible ? (isProject || isTerminal || isImage ? 0.25 : 1) : 0,
            scaleX: isText ? 0.375 : pressed ? 0.55 : isMagnetic ? 1.35 : 1,
            scaleY: isText ? 5 : pressed ? 0.55 : isMagnetic ? 1.35 : 1,
          }}
          transition={CORE_SPRING}
          className="w-1 h-1 bg-champagne-light shadow-[0_0_10px_rgba(201,169,110,0.65)]"
        />
      </div>

      {/* 2. Trailing Orbital Lens Assembly (single unified rAF transform outer) */}
      <div
        ref={shellPosRef}
        className="fixed top-0 left-0 flex items-center justify-center"
        style={{ transform: "translate3d(-120px, -120px, 0) translate(-50%, -50%)" }}
      >
        <motion.div
          animate={{
            opacity: visible ? (isText ? 0.15 : 1) : 0,
            scale: pressed ? 0.82 : 1,
          }}
          transition={PRESS_SPRING}
          className="relative w-[86px] h-[86px] flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: shellScale }}
            transition={SHELL_SPRING}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Optical Liquid Glass Core Disc (mounted only when visible — zero idle backdrop readback) */}
            {showGlassDisc && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{
                  opacity: isProject || isImage || isTerminal ? 1 : 0.55,
                  scale: isProject || isImage || isTerminal ? 1 : 0.85,
                }}
                transition={{ duration: 0.22 }}
                className="absolute inset-1 rounded-full border border-porcelain/15"
                style={{
                  background: isProject
                    ? "radial-gradient(circle at 30% 25%, rgba(201,169,110,0.22), rgba(16,16,20,0.58))"
                    : isImage
                    ? "radial-gradient(circle at 35% 30%, rgba(244,241,234,0.14), rgba(11,11,13,0.22))"
                    : "radial-gradient(circle at 30% 25%, rgba(244,241,234,0.1), rgba(16,16,20,0.45))",
                  backdropFilter: "blur(5px) saturate(140%)",
                  WebkitBackdropFilter: "blur(5px) saturate(140%)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.28), 0 12px 30px -10px rgba(0,0,0,0.7)",
                }}
              />
            )}

            {/* Twin Broken SVG Orbital Arcs + Orbiting Light Particle */}
            <motion.svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full overflow-visible"
              animate={{
                opacity: isProject || isText ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <g ref={outerArcRef} style={{ transformOrigin: "50px 50px" }}>
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  stroke={
                    isMagnetic || isImage
                      ? "rgba(201,169,110,0.72)"
                      : "rgba(244,241,234,0.34)"
                  }
                  strokeWidth="1.25"
                  strokeDasharray="115 35 65 68"
                  strokeLinecap="round"
                />
                <circle
                  cx="50"
                  cy="5"
                  r={isMagnetic ? "2.6" : "2.1"}
                  fill="#DEC492"
                />
              </g>

              <g ref={innerArcRef} style={{ transformOrigin: "50px 50px" }}>
                <circle
                  cx="50"
                  cy="50"
                  r="31"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  stroke={
                    isImage ? "rgba(244,241,234,0.45)" : "rgba(201,169,110,0.34)"
                  }
                  strokeWidth="1"
                  strokeDasharray="52 46 38 60"
                  strokeLinecap="round"
                />
              </g>
            </motion.svg>
          </motion.div>

          {/* Unscaled Crisp Contextual Labels & Reticles */}
          {isProject && (
            <motion.div
              initial={{ opacity: 0, scale: 0.72 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={PRESS_SPRING}
              className="relative z-10 w-[86px] h-[86px] flex items-center justify-center"
            >
              <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-champagne-light" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-champagne-light" />
              <span className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-champagne-light" />
              <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-champagne-light" />
              <span className="font-mono text-[9.5px] tracking-[0.2em] text-porcelain font-medium">
                OPEN ↗
              </span>
            </motion.div>
          )}

          {isTerminal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={PRESS_SPRING}
              className="relative z-10 font-mono text-[11px] font-medium tracking-wider text-champagne-light"
            >
              &gt;_
            </motion.div>
          )}

          {isImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.78 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 360, damping: 26 }}
              className="relative z-10 w-[82px] h-[82px] flex items-center justify-center"
            >
              <span className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-2 bg-champagne-light/60" />
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 w-px h-2 bg-champagne-light/60" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 h-px w-2 bg-champagne-light/60" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 h-px w-2 bg-champagne-light/60" />
              <span className="font-mono text-[8.5px] tracking-[0.22em] text-porcelain/90">
                1:1
              </span>
            </motion.div>
          )}

          {isInspect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="relative z-10 w-[60px] h-[60px] flex items-center justify-center"
            >
              <span className="absolute top-2.5 left-1/2 -translate-x-1/2 w-px h-2.5 bg-champagne-light/80" />
              <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-px h-2.5 bg-champagne-light/80" />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 h-px w-2.5 bg-champagne-light/80" />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 h-px w-2.5 bg-champagne-light/80" />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
