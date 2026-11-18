import { useEffect, useState, useCallback, useRef, lazy, Suspense } from "react";
import { MotionConfig } from "framer-motion";
import {
  PerformanceProvider,
  usePerformanceActions,
  useOverlayState,
} from "./context/PerformanceContext";
import PointerEnvironment from "./components/ui/PointerEnvironment";
import ScrollProgress from "./components/ui/ScrollProgress";
import AKCalibration, { shouldRunAKCalibration } from "./components/ui/AKCalibration";
import Toast from "./components/ui/Toast";
import Navbar from "./components/layout/Navbar";
import MobileNav from "./components/layout/MobileNav";
import Hero from "./components/sections/Hero";
import WhyHireMe from "./components/sections/WhyHireMe";
import FeaturedWork from "./components/sections/FeaturedWork";
import Stack from "./components/sections/Stack";
import Timeline from "./components/sections/Timeline";
import Contact from "./components/sections/Contact";
import { profile } from "./data/portfolio";
import {
  loadResumeModal,
  loadFastPassModal,
  loadInteractiveTerminal,
} from "./utils/prefetch";

const CustomCursor = lazy(() => import("./components/ui/CustomCursor"));
const ResumeModal = lazy(loadResumeModal);
const RecruiterFastPassModal = lazy(loadFastPassModal);
const InteractiveTerminal = lazy(loadInteractiveTerminal);

const TRACKED_SECTIONS = [
  "home",
  "about",
  "work",
  "terminal",
  "skills",
  "journey",
  "contact",
];

/**
 * Mounts CustomCursor chunk ONLY on fine-pointer non-reduced-motion devices.
 * Mobile smartphones never download or parse CustomCursor JavaScript.
 */
function DesktopCursorHost() {
  const [eligible, setEligible] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEligible(fine.matches && !reduced.matches);
    fine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  if (!eligible) return null;
  return (
    <Suspense fallback={null}>
      <CustomCursor />
    </Suspense>
  );
}

/**
 * Isolated Modal Host so opening/closing Resume or Recruiter Fast Pass
 * never re-renders the main portfolio sections.
 */
function LazyModalHost() {
  const { isResumeOpen, isFastPassOpen } = useOverlayState();
  const [resumeMounted, setResumeMounted] = useState(false);
  const [fastPassMounted, setFastPassMounted] = useState(false);

  useEffect(() => {
    if (isResumeOpen && !resumeMounted) setResumeMounted(true);
  }, [isResumeOpen, resumeMounted]);

  useEffect(() => {
    if (isFastPassOpen && !fastPassMounted) setFastPassMounted(true);
  }, [isFastPassOpen, fastPassMounted]);

  return (
    <>
      {resumeMounted && (
        <Suspense fallback={null}>
          <ResumeModal />
        </Suspense>
      )}
      {fastPassMounted && (
        <Suspense fallback={null}>
          <RecruiterFastPassModal />
        </Suspense>
      )}
    </>
  );
}

/**
 * Lazy-mounted Terminal section that preserves exact anchor target & vertical height
 * (CLS = 0) and loads well before entering the viewport (or immediately on /#terminal).
 */
function DeferredTerminalSection() {
  const anchorRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.location.hash === "#terminal";
  });

  useEffect(() => {
    if (shouldLoad) return;
    const node = anchorRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "700px 0px" }
    );
    observer.observe(node);

    // Also prefetch chunk during idle time so navigating directly via navbar is instant
    let idleId = null;
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(() => loadInteractiveTerminal(), {
        timeout: 3000,
      });
    }

    return () => {
      observer.disconnect();
      if (idleId !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [shouldLoad]);

  if (shouldLoad) {
    return (
      <Suspense
        fallback={
          <section
            id="terminal"
            aria-label="Interactive Console"
            className="relative px-5 sm:px-10 py-24 sm:py-32 scroll-mt-24 border-t border-porcelain/[0.08] min-h-[720px]"
          />
        }
      >
        <InteractiveTerminal />
      </Suspense>
    );
  }

  return (
    <section
      ref={anchorRef}
      id="terminal"
      aria-label="Interactive Console"
      className="relative px-5 sm:px-10 py-24 sm:py-32 scroll-mt-24 border-t border-porcelain/[0.08] min-h-[720px]"
    />
  );
}

function PortfolioShell() {
  // Subscribes ONLY to stable actions -> scrolling across sections triggers 0 root re-renders
  const { setActiveSection } = usePerformanceActions();
  const [calibrationActive, setCalibrationActive] = useState(() =>
    shouldRunAKCalibration()
  );
  const [heroReady, setHeroReady] = useState(() => !shouldRunAKCalibration());

  const handleRevealHero = useCallback(() => setHeroReady(true), []);
  const handleCalibrationComplete = useCallback(() => {
    setCalibrationActive(false);
    setHeroReady(true);
  }, []);

  // Respect direct valid section anchor URLs (e.g. /#work, /#contact);
  // open cleanly at the top on cold loads with no hash or #home
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const hashId = window.location.hash.replace(/^#/, "");
    if (hashId && hashId !== "home" && TRACKED_SECTIONS.includes(hashId)) {
      const target = document.getElementById(hashId);
      if (target) {
        setActiveSection(hashId);
        const scrollToTarget = () => {
          target.scrollIntoView({ behavior: "instant", block: "start" });
        };
        requestAnimationFrame(() => {
          scrollToTarget();
          requestAnimationFrame(scrollToTarget);
        });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [setActiveSection]);

  // Section-aware active navigation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-28% 0px -52% 0px",
        threshold: 0,
      }
    );

    TRACKED_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [setActiveSection]);

  return (
    <div className="relative bg-obsidian text-porcelain min-h-screen selection:bg-champagne/30 selection:text-porcelain">
      {/* Global Matte Canvas & GPU-Composited Pointer Light Field */}
      <PointerEnvironment />

      {/* Signature Precision Pointer: The Orbital Lens (loaded only on desktop fine-pointer) */}
      <DesktopCursorHost />

      {/* Top Hairline Reading Progress */}
      <ScrollProgress />

      {/* Branded AK Calibration Opening Sequence (< 650ms, once per session) */}
      <AKCalibration
        active={calibrationActive}
        onRevealHero={handleRevealHero}
        onComplete={handleCalibrationComplete}
      />

      {/* Liquid Glass Floating Navigation & Overlays */}
      <Navbar />
      <MobileNav />
      <Toast />
      <LazyModalHost />

      {/* Continuous Editorial Scroll Experience */}
      <main className="relative z-10">
        <Hero heroReady={heroReady} />
        <WhyHireMe />
        <FeaturedWork />
        <DeferredTerminalSection />
        <Stack />
        <Timeline />
        <Contact />
      </main>

      {/* Sophisticated Editorial Footer */}
      <footer className="relative z-10 border-t border-porcelain/[0.09] px-5 sm:px-10 pt-12 pb-28 md:pb-12">
        <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-1.5">
            <a
              href="#home"
              data-cursor="magnetic"
              className="font-serif text-2xl font-light text-porcelain hover:text-champagne-pale transition-colors"
            >
              {profile.name}
              <span className="text-champagne">.</span>
            </a>
            <p className="font-mono text-[11px] text-stone-dark">
              {profile.role} · {profile.degree}
            </p>
          </div>

          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-stone"
          >
            <a href="#work" data-cursor="magnetic" className="hover:text-porcelain transition-colors">
              Work
            </a>
            <a href="#about" data-cursor="magnetic" className="hover:text-porcelain transition-colors">
              About
            </a>
            <a href="#skills" data-cursor="magnetic" className="hover:text-porcelain transition-colors">
              Toolkit
            </a>
            <a
              href={profile.resumePath}
              download={profile.resumeDownloadName}
              data-cursor="magnetic"
              className="hover:text-porcelain transition-colors"
            >
              Resume PDF
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="magnetic"
              className="hover:text-porcelain transition-colors"
            >
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="magnetic"
              className="hover:text-porcelain transition-colors"
            >
              LinkedIn
            </a>
          </nav>

          <p className="font-mono text-[11px] text-stone-dark">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <PerformanceProvider>
        <PortfolioShell />
      </PerformanceProvider>
    </MotionConfig>
  );
}
