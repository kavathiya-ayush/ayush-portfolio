import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, RotateCcw, ZoomIn, Move } from "lucide-react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { playTactileClick } from "../../utils/audio";

const ZOOM_LEVELS = [1, 1.5, 2];

/**
 * SCREEN INSPECTOR — Fullscreen Zoomable & Pannable Screenshot Viewer
 * - Preserves full 1920x1080 screenshot aspect ratio with object-contain
 * - Zero React re-renders during drag panning (rAF-coalesced direct transform on imgRef)
 * - Supports 1x, 1.5x, 2x zoom, Reset, drag/touch pan, arrow-key pan, and Escape close
 * - Transforms Orbital Lens into a subtle inspection reticle via data-cursor="inspect"
 */
export default function ScreenInspector({ project, totalProjects = 6, onClose }) {
  const shouldReduceMotion = useReducedMotion();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dialogRef = useRef(null);
  const stageRef = useRef(null);
  const imgRef = useRef(null);
  const panRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const stageBoundsRef = useRef({ width: 0, height: 0 });
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const dragRafRef = useRef(null);
  const isDraggingRef = useRef(false);

  useFocusTrap(Boolean(project), dialogRef, onClose);

  const applyDomTransform = useCallback((x, y, z, instant = false) => {
    const img = imgRef.current;
    if (!img) return;
    img.style.transition =
      instant || shouldReduceMotion
        ? "none"
        : "transform 0.26s cubic-bezier(0.16, 1, 0.3, 1)";
    img.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${z})`;
  }, [shouldReduceMotion]);

  useEffect(() => {
    panRef.current = { x: 0, y: 0 };
    zoomRef.current = 1;
    isDraggingRef.current = false;
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
    if (dragRafRef.current !== null) {
      window.cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = null;
    }
  }, [project?.slug]);

  useEffect(() => {
    return () => {
      if (dragRafRef.current !== null) {
        window.cancelAnimationFrame(dragRafRef.current);
      }
    };
  }, []);

  // Clamp pan within reasonable bounds relative to container & zoom
  const clampPan = (nextX, nextY, nextZoom) => {
    if (nextZoom <= 1) return { x: 0, y: 0 };
    let { width, height } = stageBoundsRef.current;
    if ((!width || !height) && stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      stageBoundsRef.current = { width, height };
    }
    const maxX = ((nextZoom - 1) * width) / 2;
    const maxY = ((nextZoom - 1) * height) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, nextX)),
      y: Math.max(-maxY, Math.min(maxY, nextY)),
    };
  };

  const applyZoom = (nextZoom) => {
    playTactileClick("light");
    if (stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      stageBoundsRef.current = { width: rect.width, height: rect.height };
    }
    const clamped = clampPan(panRef.current.x, panRef.current.y, nextZoom);
    panRef.current = clamped;
    zoomRef.current = nextZoom;
    setZoom(nextZoom);
    setPan(clamped);
    applyDomTransform(clamped.x, clamped.y, nextZoom, false);
  };

  const handleReset = () => {
    playTactileClick("light");
    panRef.current = { x: 0, y: 0 };
    zoomRef.current = 1;
    setZoom(1);
    setPan({ x: 0, y: 0 });
    applyDomTransform(0, 0, 1, false);
  };

  const handlePointerDown = (e) => {
    if (zoomRef.current <= 1) return;
    e.preventDefault();
    if (stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      stageBoundsRef.current = { width: rect.width, height: rect.height };
    }
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || zoomRef.current <= 1) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    panRef.current = clampPan(
      dragStartRef.current.panX + dx,
      dragStartRef.current.panY + dy,
      zoomRef.current
    );

    if (dragRafRef.current === null) {
      dragRafRef.current = window.requestAnimationFrame(() => {
        dragRafRef.current = null;
        applyDomTransform(
          panRef.current.x,
          panRef.current.y,
          zoomRef.current,
          true
        );
      });
    }
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    if (dragRafRef.current !== null) {
      window.cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = null;
    }
    applyDomTransform(panRef.current.x, panRef.current.y, zoomRef.current, true);
    setPan({ ...panRef.current });
  };

  const handleDoubleClick = () => {
    const next = zoom === 1 ? 1.5 : zoom === 1.5 ? 2 : 1;
    applyZoom(next);
  };

  const handleStageKeyDown = (e) => {
    if (zoom <= 1) return;
    const step = 48;
    let next = null;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      next = clampPan(panRef.current.x + step, panRef.current.y, zoom);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next = clampPan(panRef.current.x - step, panRef.current.y, zoom);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      next = clampPan(panRef.current.x, panRef.current.y + step, zoom);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      next = clampPan(panRef.current.x, panRef.current.y - step, zoom);
    }
    if (next) {
      panRef.current = next;
      setPan(next);
      applyDomTransform(next.x, next.y, zoom, false);
    }
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="screen-inspector-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[180] flex flex-col bg-[#08080A]/96 backdrop-blur-xl p-3 sm:p-6"
        >
          <div
            ref={dialogRef}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[1440px] mx-auto flex-1 min-h-0 flex flex-col gap-3 sm:gap-4 outline-none"
          >
            {/* Top Inspector Control Bar */}
            <div className="liquid-glass-chrome rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-champagne shrink-0">
                  Plate {project.index} / 0{totalProjects}
                </span>
                <span className="text-porcelain/20 hidden sm:inline">|</span>
                <h3
                  id="screen-inspector-title"
                  className="font-serif text-lg sm:text-xl font-light text-porcelain truncate"
                >
                  {project.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {/* Zoom Level Controls */}
                <div
                  role="group"
                  aria-label="Zoom level"
                  className="inline-flex items-center rounded-full border border-porcelain/15 bg-obsidian/80 p-0.5 font-mono text-[11px]"
                >
                  {ZOOM_LEVELS.map((level) => {
                    const active = zoom === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        aria-pressed={active}
                        data-cursor="magnetic"
                        onClick={() => applyZoom(level)}
                        className={`px-3 py-1 rounded-full transition-colors ${
                          active
                            ? "bg-porcelain text-obsidian font-semibold"
                            : "text-stone hover:text-porcelain"
                        }`}
                      >
                        {level}×
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  data-cursor="magnetic"
                  onClick={handleReset}
                  disabled={zoom === 1 && pan.x === 0 && pan.y === 0}
                  aria-label="Reset zoom and position"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-porcelain/15 text-[11px] font-mono text-stone hover:text-porcelain hover:border-champagne/45 disabled:opacity-35 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>

                <button
                  type="button"
                  data-cursor="magnetic"
                  onClick={onClose}
                  aria-label="Close Screen Inspector"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-champagne/40 bg-champagne/[0.1] hover:bg-champagne/[0.2] text-[11px] font-mono text-champagne-light transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close</span>
                </button>
              </div>
            </div>

            {/* Interactive Inspection Viewport */}
            <div
              ref={stageRef}
              tabIndex={0}
              data-cursor="inspect"
              onKeyDown={handleStageKeyDown}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onDoubleClick={handleDoubleClick}
              aria-label={`Screenshot viewport for ${project.title}. Zoom ${zoom}x. ${
                zoom > 1 ? "Drag or use arrow keys to pan." : "Select 1.5x or 2x to zoom."
              }`}
              className={`relative flex-1 min-h-0 rounded-2xl overflow-hidden bg-[#0B0B0D] border border-porcelain/[0.12] flex items-center justify-center select-none touch-none ${
                zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""
              }`}
            >
              <img
                ref={imgRef}
                src={project.screenshot}
                alt={project.screenshotCaption || `${project.title} full screenshot`}
                width={project.screenshotWidth || 1920}
                height={project.screenshotHeight || 1080}
                decoding="async"
                draggable={false}
                style={{
                  transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                  transition:
                    isDragging || shouldReduceMotion
                      ? "none"
                      : "transform 0.26s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                className="max-w-full max-h-full w-auto h-auto object-contain pointer-events-none"
              />
            </div>

            {/* Bottom Caption & Interaction Hint */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-2 font-mono text-[11px] text-stone shrink-0">
              <span>{project.screenshotCaption || project.subtitle}</span>
              <span className="inline-flex items-center gap-2 text-stone-dark">
                {zoom > 1 ? (
                  <>
                    <Move className="w-3.5 h-3.5 text-champagne" />
                    <span>Drag or arrow keys to pan · Esc to close</span>
                  </>
                ) : (
                  <>
                    <ZoomIn className="w-3.5 h-3.5 text-champagne" />
                    <span>Double-click or use 1.5× / 2× to zoom · Esc to close</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
