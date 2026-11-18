import { useState, useRef, useEffect, useMemo, lazy, Suspense } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Github,
  Download,
  ExternalLink,
  X,
  AlertTriangle,
  Lock,
  Cpu,
  Maximize2,
} from "lucide-react";
import { projects, projectCategories } from "../../data/portfolio";
import { usePerformanceActions } from "../../context/PerformanceContext";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { playTactileClick } from "../../utils/audio";
import {
  loadProjectXRay,
  loadScreenInspector,
  warmDecodeImage,
} from "../../utils/prefetch";
import Magnetic from "../ui/Magnetic";

const ProjectXRay = lazy(loadProjectXRay);
const ScreenInspector = lazy(loadScreenInspector);

function slugifyTab(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/**
 * Error-Only Architectural Fallback Plate
 * Shown ONLY if an actual screenshot fails to load (never flashed during normal loading).
 */
function ErrorFallbackPlate({ project }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-obsidian-elevated space-y-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-champagne">
        Plate {project.index} · {project.category}
      </span>
      <p className="font-serif text-2xl font-light text-porcelain">
        {project.title}
      </p>
      <p className="font-mono text-[11px] text-stone-dark max-w-sm">
        {project.subtitle}
      </p>
    </div>
  );
}

/**
 * Uncropped 16:9 (1920x1080) Screenshot Stage
 * - object-contain on matte #0B0B0D preserves 100% of every software screenshot
 * - Neutral matte loading placeholder during decode (zero schematic flash)
 * - Architectural fallback renders strictly on genuine load error
 */
function ObservatoryStageImage({ project, shouldEagerLoad, shouldReduceMotion, onOpenModal }) {
  const [loadedSrc, setLoadedSrc] = useState(null);
  const [failedSrc, setFailedSrc] = useState(null);

  const isFailed = failedSrc === project.screenshot;
  const isLoaded = loadedSrc === project.screenshot;

  return (
    <div
      role="button"
      tabIndex={0}
      data-cursor="project"
      onClick={() => {
        playTactileClick("light");
        onOpenModal(project, "product");
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenModal(project, "product");
        }
      }}
      aria-label={`Open engineering case study for ${project.title}`}
      className="observatory-stage-viewport group relative aspect-video w-full overflow-hidden bg-[#0B0B0D] select-none"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={project.slug}
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, clipPath: "inset(0 0 0 4%)" }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, clipPath: "inset(0 0 0 0%)" }
          }
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.14 : 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full flex items-center justify-center bg-[#0B0B0D]"
        >
          {/* Neutral matte placeholder while image decodes */}
          {!isLoaded && !isFailed && (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[#0E0E12] flex items-center justify-center"
            >
              <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-stone-dark/70">
                Loading Plate {project.index}
              </span>
            </div>
          )}

          {isFailed ? (
            <ErrorFallbackPlate project={project} />
          ) : (
            <img
              src={project.screenshot}
              alt={project.screenshotCaption || `${project.title} screenshot`}
              width={project.screenshotWidth || 1920}
              height={project.screenshotHeight || 1080}
              loading={shouldEagerLoad ? "eager" : "lazy"}
              fetchPriority={shouldEagerLoad ? "high" : "low"}
              decoding="async"
              onLoad={() => setLoadedSrc(project.screenshot)}
              onError={() => setFailedSrc(project.screenshot)}
              className={`w-full h-full object-contain transition-opacity duration-300 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Delicate specular top edge highlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-porcelain/20 to-transparent z-10"
      />
    </div>
  );
}

/**
 * Screenshot Preview Block inside Case-Study Modal with Inspect Screen trigger
 */
function ModalScreenshotSlot({ project, onInspect }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="space-y-3">
      {!failed ? (
        <figure className="overflow-hidden rounded-xl border border-porcelain/12 bg-[#0B0B0D]">
          <div className="relative aspect-video w-full bg-[#0B0B0D]">
            <img
              src={project.screenshot}
              alt={project.screenshotCaption || `${project.title} application screenshot`}
              width={project.screenshotWidth || 1920}
              height={project.screenshotHeight || 1080}
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
              className="w-full h-full object-contain"
            />
          </div>
          <figcaption className="px-4 py-2.5 border-t border-porcelain/10 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[11px] text-stone">
              {project.screenshotCaption}
            </span>
            <button
              type="button"
              data-cursor="magnetic"
              onClick={() => {
                playTactileClick("light");
                onInspect(project);
              }}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-champagne-light hover:underline"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Inspect Screen</span>
            </button>
          </figcaption>
        </figure>
      ) : (
        <div className="p-4 rounded-xl border border-porcelain/10 bg-obsidian/60 text-xs text-stone leading-relaxed">
          Preview image unavailable. Switch to <strong className="text-porcelain">Architecture View</strong> above to inspect the system topology.
        </div>
      )}
    </div>
  );
}

/**
 * Miniature Orbital Indicator shared with AK Calibration & The Orbital Lens
 */
function OrbitalRowMarker({ active, shouldReduceMotion }) {
  return (
    <span
      aria-hidden="true"
      className="relative flex items-center justify-center w-5 h-5 shrink-0"
    >
      {active ? (
        <motion.span
          layoutId={shouldReduceMotion ? undefined : "observatoryActiveOrbit"}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          className="relative flex items-center justify-center w-5 h-5"
        >
          <span className="absolute inset-0 rounded-full border border-champagne/75 border-dashed" />
          <span className="w-1.5 h-1.5 rounded-full bg-champagne-light shadow-[0_0_8px_rgba(201,169,110,0.85)]" />
        </motion.span>
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-porcelain/20 group-hover:bg-champagne/50 transition-colors" />
      )}
    </span>
  );
}

export default function FeaturedWork() {
  const shouldReduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { setIsProjectOverlayOpen } = usePerformanceActions();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedSlug, setSelectedSlug] = useState(projects[0].slug);
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [modalTab, setModalTab] = useState("product"); // 'product' | 'architecture'
  const [inspectedProject, setInspectedProject] = useState(null);
  const [inspectorMounted, setInspectorMounted] = useState(false);
  const [sectionNearViewport, setSectionNearViewport] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.location.hash === "#work";
  });

  const sectionRef = useRef(null);
  const modalRef = useRef(null);
  const tabRefs = useRef([]);
  const indexRowRefs = useRef([]);

  // Prioritize Observatory image decoding only once visitor approaches #work (never competes with Hero LCP)
  useEffect(() => {
    if (sectionNearViewport) return;
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setSectionNearViewport(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSectionNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [sectionNearViewport]);

  // Hide top & mobile navbar cleanly while any Project Case Study or Screen Inspector is open
  useEffect(() => {
    const active = Boolean(activeModalProject || inspectedProject);
    if (inspectedProject && !inspectorMounted) setInspectorMounted(true);
    setIsProjectOverlayOpen(active);
    return () => setIsProjectOverlayOpen(false);
  }, [activeModalProject, inspectedProject, inspectorMounted, setIsProjectOverlayOpen]);

  const closeModal = () => setActiveModalProject(null);
  // Suspend modal focus trap cleanly while fullscreen Screen Inspector sits above it
  useFocusTrap(Boolean(activeModalProject) && !inspectedProject, modalRef, closeModal);

  const filteredProjects = useMemo(
    () =>
      activeCategory === "All"
        ? projects
        : projects.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  // Keep selected project synchronized whenever category filter changes
  useEffect(() => {
    if (!filteredProjects.some((p) => p.slug === selectedSlug) && filteredProjects[0]) {
      setSelectedSlug(filteredProjects[0].slug);
    }
  }, [filteredProjects, selectedSlug]);

  const selectedProject =
    filteredProjects.find((p) => p.slug === selectedSlug) ||
    filteredProjects[0] ||
    projects[0];

  const featuredEntries = useMemo(
    () => filteredProjects.filter((p) => p.featured),
    [filteredProjects]
  );
  const additionalEntries = useMemo(
    () => filteredProjects.filter((p) => !p.featured),
    [filteredProjects]
  );
  const orderedEntries = useMemo(
    () => [...featuredEntries, ...additionalEntries],
    [featuredEntries, additionalEntries]
  );

  // Warm-decode ONLY the adjacent next plate once #work is near viewport (never downloads all 6 upfront)
  useEffect(() => {
    if (!sectionNearViewport || orderedEntries.length < 2) return;
    const activeIdx = orderedEntries.findIndex((p) => p.slug === selectedProject.slug);
    const nextProject = orderedEntries[(activeIdx + 1) % orderedEntries.length];
    if (nextProject?.screenshot) {
      warmDecodeImage(nextProject.screenshot);
    }
  }, [sectionNearViewport, orderedEntries, selectedProject.slug]);

  const openProjectModal = (project, initialView = "product") => {
    loadProjectXRay();
    loadScreenInspector();
    setModalTab(initialView);
    setActiveModalProject(project);
  };

  const activeTabId = `project-tab-${slugifyTab(activeCategory)}`;

  const handleTabKeyDown = (e, idx) => {
    const lastIdx = projectCategories.length - 1;
    let nextIdx = null;
    if (e.key === "ArrowRight") nextIdx = idx === lastIdx ? 0 : idx + 1;
    else if (e.key === "ArrowLeft") nextIdx = idx === 0 ? lastIdx : idx - 1;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = lastIdx;

    if (nextIdx !== null) {
      e.preventDefault();
      setActiveCategory(projectCategories[nextIdx]);
      tabRefs.current[nextIdx]?.focus();
    }
  };

  const handleIndexKeyDown = (e, idx) => {
    const lastIdx = orderedEntries.length - 1;
    let nextIdx = null;
    if (e.key === "ArrowDown") nextIdx = idx === lastIdx ? 0 : idx + 1;
    else if (e.key === "ArrowUp") nextIdx = idx === 0 ? lastIdx : idx - 1;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = lastIdx;

    if (nextIdx !== null) {
      e.preventDefault();
      const target = orderedEntries[nextIdx];
      if (target) {
        setSelectedSlug(target.slug);
        indexRowRefs.current[nextIdx]?.focus();
      }
    }
  };

  const renderDesktopIndexRow = (project, orderedIdx) => {
    const isActive = selectedProject.slug === project.slug;
    return (
      <button
        key={project.slug}
        ref={(el) => {
          indexRowRefs.current[orderedIdx] = el;
        }}
        type="button"
        aria-current={isActive ? "true" : undefined}
        data-cursor="magnetic"
        onMouseEnter={() => {
          warmDecodeImage(project.screenshot);
          setSelectedSlug(project.slug);
        }}
        onFocus={() => {
          warmDecodeImage(project.screenshot);
          setSelectedSlug(project.slug);
        }}
        onClick={() => {
          playTactileClick("light");
          setSelectedSlug(project.slug);
        }}
        onKeyDown={(e) => handleIndexKeyDown(e, orderedIdx)}
        className={`group w-full text-left py-4 px-4 border-b border-porcelain/[0.08] flex items-center justify-between gap-4 transition-colors duration-200 ${
          isActive
            ? "bg-obsidian-elevated border-l-2 border-l-champagne"
            : "hover:bg-porcelain/[0.025] border-l-2 border-l-transparent"
        }`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <OrbitalRowMarker active={isActive} shouldReduceMotion={shouldReduceMotion} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em]">
              <span className={isActive ? "text-champagne-light" : "text-stone-dark"}>
                {project.index}
              </span>
              <span className="text-stone-dark">·</span>
              <span className="text-stone-dark truncate">{project.category}</span>
            </div>
            <p
              className={`font-serif text-2xl font-light tracking-tight truncate transition-colors mt-0.5 ${
                isActive
                  ? "text-champagne-pale"
                  : "text-porcelain/85 group-hover:text-porcelain"
              }`}
            >
              {project.title}
            </p>
          </div>
        </div>

        <span
          className={`font-mono text-[11px] shrink-0 transition-colors ${
            isActive ? "text-champagne-light" : "text-stone-dark"
          }`}
        >
          {project.year}
        </span>
      </button>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative px-5 sm:px-10 py-24 sm:py-28 lg:py-36 scroll-mt-24 border-t border-porcelain/[0.08]"
    >
      <div className="max-w-[1320px] mx-auto">
        {/* ── Editorial Section Header + WAI-ARIA Category Filter Bar ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 sm:pb-12 border-b border-porcelain/[0.1]">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3.5"
          >
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-champagne">
              <span>02</span>
              <span className="w-8 h-px bg-champagne/45" />
              <span>The Project Observatory</span>
            </div>

            <h2 className="font-serif text-editorial-lg font-light text-porcelain">
              Shipped <span className="italic text-champagne-pale">Systems.</span>
            </h2>

            <p className="text-sm sm:text-[15px] text-stone max-w-lg font-light leading-relaxed">
              Select any system in the index to inspect its full uncropped screen,
              engineering case study, and interactive <span className="text-porcelain">Project X-Ray</span>.
            </p>
          </motion.div>

          {/* Apple Liquid Glass Segmented Filter Capsule */}
          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="liquid-glass-pill inline-flex flex-wrap items-center gap-1 p-1.5 rounded-2xl sm:rounded-full self-start lg:self-end"
          >
            {projectCategories.map((category, idx) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  id={`project-tab-${slugifyTab(category)}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="projects-tabpanel"
                  tabIndex={isActive ? 0 : -1}
                  data-cursor="magnetic"
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  onClick={() => {
                    playTactileClick("light");
                    setActiveCategory(category);
                  }}
                  className={`relative px-3.5 py-1.5 rounded-full text-[11.5px] font-mono tracking-wide transition-colors duration-200 ${
                    isActive
                      ? "text-obsidian font-medium"
                      : "text-stone hover:text-porcelain"
                  }`}
                >
                  <span className="relative z-10">{category}</span>
                  {isActive && (
                    <motion.span
                      layoutId={shouldReduceMotion ? undefined : "projectFilterPill"}
                      className="absolute inset-0 rounded-full bg-porcelain"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tabpanel: Mount ONLY active Desktop 12-Col OR Mobile 3×2 Observatory ── */}
        <div id="projects-tabpanel" role="tabpanel" aria-labelledby={activeTabId}>
          {isDesktop ? (
          /* ═════════ DESKTOP OBSERVATORY (lg and above) ═════════ */
          <div className="grid grid-cols-12 gap-10 xl:gap-12 items-start pt-10">
            {/* LEFT (5 cols): Compact Editorial Project Index */}
            <div
              aria-label="Project archive index"
              className="lg:col-span-5 border-t border-porcelain/[0.1]"
            >
              {featuredEntries.length > 0 && (
                <div>
                  <div className="flex items-center justify-between py-2.5 px-4 border-b border-porcelain/[0.08] font-mono text-[10.5px] uppercase tracking-[0.2em] text-stone-dark">
                    <span>Featured Systems</span>
                    <span className="text-champagne/80">
                      0{featuredEntries.length}
                    </span>
                  </div>
                  {featuredEntries.map((project, i) =>
                    renderDesktopIndexRow(project, i)
                  )}
                </div>
              )}

              {additionalEntries.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between py-2.5 px-4 border-y border-porcelain/[0.1] bg-obsidian-elevated/40 font-mono text-[10.5px] uppercase tracking-[0.22em] text-champagne">
                    <span>Additional Systems</span>
                    <span className="text-stone-dark">
                      0{additionalEntries.length}
                    </span>
                  </div>
                  {additionalEntries.map((project, i) =>
                    renderDesktopIndexRow(project, featuredEntries.length + i)
                  )}
                </div>
              )}

              <p className="mt-5 px-4 font-mono text-[11px] text-stone-dark">
                Hover, click, or use ↑ / ↓ arrow keys to switch plates.
              </p>
            </div>

            {/* RIGHT (7 cols, height-adaptive sticky): Project Inspection Stage */}
            <div className="observatory-stage lg:col-span-7 flex flex-col gap-6">
              {/* Refined Application / Browser Window Frame */}
              <div className="relative rounded-2xl overflow-hidden bg-obsidian-elevated border border-porcelain/[0.12] shadow-[0_32px_80px_-24px_rgba(0,0,0,0.85)]">
                {/* Window Chrome Header */}
                <div className="flex items-center justify-between gap-4 px-5 py-3 bg-[#101014] border-b border-porcelain/[0.09]">
                  <div className="flex items-center gap-2" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full border border-porcelain/25 bg-porcelain/[0.08]" />
                    <span className="w-2.5 h-2.5 rounded-full border border-porcelain/25 bg-porcelain/[0.08]" />
                    <span className="w-2.5 h-2.5 rounded-full border border-champagne/50 bg-champagne/25" />
                  </div>

                  <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em]">
                    <span className="text-champagne-light">
                      Plate {selectedProject.index} / 0{projects.length}
                    </span>
                    <span className="text-porcelain/20">·</span>
                    <span className="text-stone-dark">{selectedProject.category}</span>
                  </div>

                  <button
                    type="button"
                    data-cursor="magnetic"
                    onPointerEnter={loadScreenInspector}
                    onFocus={loadScreenInspector}
                    onClick={() => {
                      playTactileClick("light");
                      setInspectedProject(selectedProject);
                    }}
                    className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone hover:text-champagne-light transition-colors"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Inspect</span>
                  </button>
                </div>

                {/* Uncropped 16:9 Screenshot Viewport */}
                <ObservatoryStageImage
                  project={selectedProject}
                  shouldEagerLoad={sectionNearViewport}
                  shouldReduceMotion={shouldReduceMotion}
                  onOpenModal={openProjectModal}
                />
              </div>

              {/* Active Project Information Panel */}
              <div
                aria-live="polite"
                className="observatory-stage-info p-6 xl:p-7 rounded-2xl bg-obsidian-elevated border border-porcelain/[0.1] flex flex-col gap-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-champagne">
                      <span>{selectedProject.role}</span>
                      <span>·</span>
                      <span className="text-stone-dark">{selectedProject.year}</span>
                    </div>
                    <h3 className="font-serif text-3xl font-light text-porcelain tracking-tight">
                      {selectedProject.title}
                    </h3>
                    <p className="font-mono text-xs text-stone">
                      {selectedProject.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-porcelain/85 font-light leading-[1.72]">
                  {selectedProject.description}
                </p>

                <p className="font-mono text-[11px] text-stone-dark tracking-wider pt-1 border-t border-porcelain/[0.08]">
                  {selectedProject.tags.join("  ·  ")}
                </p>

                {/* Actions Row */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {selectedProject.live && (
                    <Magnetic strength={0.18} maxOffset={5}>
                      <a
                        href={selectedProject.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="magnetic"
                        onClick={() => playTactileClick("light")}
                        className="inline-flex items-center gap-2 rounded-full bg-porcelain text-obsidian px-5 py-2.5 text-xs font-semibold tracking-wide hover:bg-champagne-pale transition-colors"
                      >
                        {selectedProject.isDesktop ? (
                          <Download className="w-3.5 h-3.5" />
                        ) : (
                          <ExternalLink className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {selectedProject.isDesktop ? "Download Tool" : "Live Preview"}
                        </span>
                      </a>
                    </Magnetic>
                  )}

                  {selectedProject.github && (
                    <Magnetic strength={0.18} maxOffset={5}>
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="magnetic"
                        onClick={() => playTactileClick("light")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-porcelain/15 hover:border-champagne/45 px-4 py-2.5 text-xs font-mono text-porcelain/90 hover:text-champagne-light transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Source</span>
                      </a>
                    </Magnetic>
                  )}

                  <button
                    type="button"
                    data-cursor="magnetic"
                    onClick={() => {
                      playTactileClick("light");
                      openProjectModal(selectedProject, "product");
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-mono transition-colors ${
                      selectedProject.live
                        ? "border border-porcelain/15 hover:border-champagne/45 text-porcelain/90 hover:text-champagne-light"
                        : "bg-porcelain text-obsidian font-semibold hover:bg-champagne-pale"
                    }`}
                  >
                    <span>Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    data-cursor="magnetic"
                    onPointerEnter={loadProjectXRay}
                    onFocus={loadProjectXRay}
                    onClick={() => {
                      playTactileClick("light");
                      openProjectModal(selectedProject, "architecture");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-champagne/35 bg-champagne/[0.08] hover:bg-champagne/[0.16] px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-champagne-light transition-colors"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Architecture X-Ray</span>
                  </button>

                  <button
                    type="button"
                    data-cursor="magnetic"
                    onPointerEnter={loadScreenInspector}
                    onFocus={loadScreenInspector}
                    onClick={() => {
                      playTactileClick("light");
                      setInspectedProject(selectedProject);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-porcelain/12 hover:border-champagne/40 px-3.5 py-2.5 font-mono text-[11px] text-stone hover:text-porcelain transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Inspect Screen</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          ) : (
          /* ═════════ DISTINCT MOBILE OBSERVATORY (< lg) ═════════ */
          <div className="pt-8 space-y-6">
            {/* Compact 3-Column × 2-Row Numbered Project Selectors */}
            <div
              role="group"
              aria-label="Select project plate"
              className="grid grid-cols-3 gap-2"
            >
              {orderedEntries.map((project) => {
                const isActive = selectedProject.slug === project.slug;
                return (
                  <button
                    key={project.slug}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => {
                      playTactileClick("light");
                      setSelectedSlug(project.slug);
                    }}
                    className={`min-h-[62px] p-2.5 rounded-xl border text-left flex flex-col justify-between transition-colors ${
                      isActive
                        ? "border-champagne bg-champagne/[0.12] text-porcelain"
                        : "border-porcelain/[0.11] bg-obsidian-elevated text-stone hover:border-porcelain/25"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`font-mono text-[11px] ${
                          isActive ? "text-champagne-light font-semibold" : "text-stone-dark"
                        }`}
                      >
                        {project.index}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? "bg-champagne-light" : "bg-porcelain/15"
                        }`}
                      />
                    </div>
                    <span className="font-sans text-[11.5px] font-medium truncate leading-tight">
                      {project.shortName || project.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Mobile Preview Window Frame (Uncropped 16:9, Non-Sticky) */}
            <div className="rounded-2xl overflow-hidden bg-obsidian-elevated border border-porcelain/[0.12]">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#101014] border-b border-porcelain/[0.08] font-mono text-[11px]">
                <span className="text-champagne-light uppercase tracking-[0.16em]">
                  Plate {selectedProject.index} / 0{projects.length}
                </span>
                <button
                  type="button"
                  onClick={() => setInspectedProject(selectedProject)}
                  className="inline-flex items-center gap-1 text-stone hover:text-champagne-light uppercase tracking-[0.14em]"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Inspect</span>
                </button>
              </div>

              <ObservatoryStageImage
                project={selectedProject}
                shouldEagerLoad={sectionNearViewport}
                shouldReduceMotion={shouldReduceMotion}
                onOpenModal={openProjectModal}
              />

              {/* Mobile Active Project Info */}
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between font-mono text-[11px] text-champagne">
                    <span>{selectedProject.category}</span>
                    <span className="text-stone-dark">{selectedProject.year}</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-porcelain">
                    {selectedProject.title}
                  </h3>
                  <p className="font-mono text-[11.5px] text-stone">
                    {selectedProject.subtitle}
                  </p>
                </div>

                <p className="text-sm text-porcelain/85 font-light leading-relaxed">
                  {selectedProject.description}
                </p>

                <p className="font-mono text-[11px] text-stone-dark pt-2 border-t border-porcelain/[0.08]">
                  {selectedProject.tags.join("  ·  ")}
                </p>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {selectedProject.live && (
                    <a
                      href={selectedProject.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-porcelain text-obsidian px-4 py-2.5 text-xs font-semibold"
                    >
                      {selectedProject.isDesktop ? (
                        <Download className="w-3.5 h-3.5" />
                      ) : (
                        <ExternalLink className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {selectedProject.isDesktop ? "Download" : "Live Preview"}
                      </span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => openProjectModal(selectedProject, "product")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-porcelain/15 px-4 py-2.5 text-xs font-mono text-porcelain"
                  >
                    <span>Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => openProjectModal(selectedProject, "architecture")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-champagne/35 bg-champagne/[0.08] px-3.5 py-2.5 text-[11px] font-mono uppercase tracking-wider text-champagne-light"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>X-Ray</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* ── Preserved Case Study + Project X-Ray Modal (Focus-Trapped) ── */}
      <AnimatePresence>
        {activeModalProject && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-obsidian/85 backdrop-blur-md"
          >
            <motion.div
              ref={modalRef}
              tabIndex={-1}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.96, y: 14 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.97, y: 10 }
              }
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="liquid-glass-modal relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl p-5 sm:p-8 outline-none"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-porcelain/12 shrink-0">
                <div>
                  <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-champagne mb-1.5">
                    <span>Case Study {activeModalProject.index}</span>
                    <span>·</span>
                    <span>{activeModalProject.category}</span>
                    <span>·</span>
                    <span>{activeModalProject.year}</span>
                  </div>
                  <h3
                    id="project-modal-title"
                    className="font-serif text-3xl sm:text-4xl font-light text-porcelain"
                  >
                    {activeModalProject.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-stone">
                    {activeModalProject.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  data-cursor="magnetic"
                  aria-label="Close project case study"
                  className="p-2 rounded-full border border-porcelain/15 text-stone hover:text-porcelain hover:border-champagne/45 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* PRODUCT VIEW / ARCHITECTURE VIEW Switcher + Inspect Screen */}
              <div className="mt-4 pb-4 border-b border-porcelain/[0.08] flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div
                  role="tablist"
                  aria-label="Project inspection view"
                  className="inline-flex items-center rounded-full border border-porcelain/15 bg-obsidian/70 p-1 font-mono text-[11px] uppercase tracking-[0.14em]"
                >
                  <button
                    id="modal-tab-product"
                    type="button"
                    role="tab"
                    aria-selected={modalTab === "product"}
                    aria-controls="modal-tabpanel-product"
                    data-cursor="magnetic"
                    onClick={() => {
                      playTactileClick("light");
                      setModalTab("product");
                    }}
                    className={`px-4 py-1.5 rounded-full transition-colors ${
                      modalTab === "product"
                        ? "bg-porcelain text-obsidian font-semibold"
                        : "text-stone hover:text-porcelain"
                    }`}
                  >
                    Product View
                  </button>
                  <button
                    id="modal-tab-architecture"
                    type="button"
                    role="tab"
                    aria-selected={modalTab === "architecture"}
                    aria-controls="modal-tabpanel-architecture"
                    data-cursor="magnetic"
                    onClick={() => {
                      playTactileClick("light");
                      setModalTab("architecture");
                    }}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-colors ${
                      modalTab === "architecture"
                        ? "bg-champagne text-obsidian font-semibold"
                        : "text-stone hover:text-porcelain"
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Architecture View</span>
                  </button>
                </div>

                <button
                  type="button"
                  data-cursor="magnetic"
                  onClick={() => {
                    playTactileClick("light");
                    setInspectedProject(activeModalProject);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-porcelain/15 hover:border-champagne/45 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-porcelain/90 hover:text-champagne-light transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-champagne" />
                  <span>Inspect Screen</span>
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="mt-5 flex-1 min-h-0 overflow-y-auto pr-1 hide-scrollbar">
                {modalTab === "product" ? (
                  <div
                    id="modal-tabpanel-product"
                    role="tabpanel"
                    aria-labelledby="modal-tab-product"
                    className="space-y-6 text-sm text-stone"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-obsidian/65 border border-porcelain/10 space-y-2">
                        <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-champagne">
                          01 · Problem
                        </h4>
                        <p className="text-xs sm:text-sm text-porcelain/85 leading-[1.7] font-light">
                          {activeModalProject.caseStudy.problem}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-obsidian/65 border border-porcelain/10 space-y-2">
                        <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-champagne">
                          02 · Solution
                        </h4>
                        <p className="text-xs sm:text-sm text-porcelain/85 leading-[1.7] font-light">
                          {activeModalProject.caseStudy.solution}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-porcelain/[0.08]">
                      <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-champagne">
                        03 · Actual Implementation
                      </h4>
                      <p className="text-xs sm:text-sm text-porcelain/85 leading-[1.75] font-light">
                        {activeModalProject.caseStudy.implementation}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-obsidian-elevated border border-champagne/25 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-champagne">
                          04 · Technical Architecture
                        </h4>
                        <button
                          type="button"
                          data-cursor="magnetic"
                          onClick={() => setModalTab("architecture")}
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-champagne-light hover:underline"
                        >
                          <Cpu className="w-3 h-3" />
                          <span>Open Interactive X-Ray →</span>
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-stone leading-[1.7] font-light">
                        {activeModalProject.caseStudy.architectureSummary}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-champagne">
                        05 · Engineering Challenges
                      </h4>
                      <p className="text-xs sm:text-sm text-porcelain/85 leading-[1.75] font-light">
                        {activeModalProject.caseStudy.challenges}
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-champagne">
                        06 · Screenshots &amp; Demonstration
                      </h4>
                      <ModalScreenshotSlot
                        project={activeModalProject}
                        onInspect={setInspectedProject}
                      />

                      {activeModalProject.warningType === "infinity" && (
                        <div className="p-4 rounded-xl border border-champagne/25 bg-champagne/[0.05] text-xs space-y-1.5">
                          <div className="flex items-center gap-2 text-champagne-light font-mono uppercase tracking-wider text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>Free Hosting Tier Notice</span>
                          </div>
                          <p className="text-stone leading-relaxed">
                            Hosted on InfinityFree. If a browser shows an interstitial notice on free subdomains, choose Details → Visit site to preview the live application.
                          </p>
                        </div>
                      )}

                      {(activeModalProject.demoAccessNote ||
                        activeModalProject.availabilityNote) && (
                        <div className="p-4 rounded-xl border border-porcelain/12 bg-porcelain/[0.03] text-xs space-y-1.5">
                          <div className="flex items-center gap-2 text-porcelain/90 font-mono uppercase tracking-wider text-[11px]">
                            <Lock className="w-3.5 h-3.5 text-champagne shrink-0" />
                            <span>Access &amp; Walkthrough</span>
                          </div>
                          <p className="text-stone leading-relaxed">
                            {activeModalProject.demoAccessNote ||
                              activeModalProject.availabilityNote}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-porcelain/[0.08]">
                      <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-champagne">
                        07 · Lessons Learned
                      </h4>
                      <p className="text-xs sm:text-sm text-porcelain/85 leading-[1.75] font-light">
                        {activeModalProject.caseStudy.lessonsLearned}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    id="modal-tabpanel-architecture"
                    role="tabpanel"
                    aria-labelledby="modal-tab-architecture"
                  >
                    <Suspense
                      fallback={
                        <div className="py-12 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-stone-dark">
                          Loading Architecture Topology…
                        </div>
                      }
                    >
                      <ProjectXRay project={activeModalProject} />
                    </Suspense>
                  </div>
                )}
              </div>

              {/* Modal Footer Links */}
              <div className="mt-5 pt-5 border-t border-porcelain/12 flex flex-wrap items-center gap-3 shrink-0">
                {activeModalProject.live && (
                  <a
                    href={activeModalProject.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="magnetic"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-porcelain text-obsidian px-5 py-3 text-xs font-semibold tracking-wide hover:bg-champagne-pale transition-colors"
                  >
                    {activeModalProject.isDesktop ? (
                      <Download className="w-3.5 h-3.5" />
                    ) : (
                      <ExternalLink className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {activeModalProject.isDesktop
                        ? "Download Utility"
                        : "Open Live System"}
                    </span>
                  </a>
                )}

                {activeModalProject.github && (
                  <a
                    href={activeModalProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="magnetic"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-porcelain/15 hover:border-champagne/45 px-5 py-3 text-xs font-mono text-porcelain/90 hover:text-champagne-light transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub Source</span>
                  </a>
                )}

                {!activeModalProject.live && !activeModalProject.github && (
                  <a
                    href="#contact"
                    onClick={closeModal}
                    data-cursor="magnetic"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-porcelain text-obsidian px-5 py-3 text-xs font-semibold tracking-wide hover:bg-champagne-pale transition-colors"
                  >
                    <span>Request Walkthrough</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fullscreen Screen Inspector (Lazy-loaded on first inspect, preserves exit animation) ── */}
      {(inspectorMounted || inspectedProject) && (
        <Suspense fallback={null}>
          <ScreenInspector
            project={inspectedProject}
            totalProjects={projects.length}
            onClose={() => setInspectedProject(null)}
          />
        </Suspense>
      )}
    </section>
  );
}
