import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X, Download, Zap, Volume2, VolumeX } from "lucide-react";
import {
  useActiveSection,
  useOverlayState,
  usePerformanceActions,
} from "../../context/PerformanceContext";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { playTactileClick } from "../../utils/audio";
import { loadResumeModal, loadFastPassModal } from "../../utils/prefetch";
import Magnetic from "../ui/Magnetic";
import { profile } from "../../data/portfolio";

const navLinks = [
  { id: "about", href: "#about", label: "About" },
  { id: "work", href: "#work", label: "Work" },
  { id: "terminal", href: "#terminal", label: "Terminal" },
  { id: "skills", href: "#skills", label: "Toolkit" },
  { id: "journey", href: "#journey", label: "Journey" },
  { id: "contact", href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const shouldReduceMotion = useReducedMotion();
  const navRef = useRef(null);
  const drawerRef = useRef(null);
  const navRectRef = useRef(null);
  const glassRafRef = useRef(null);
  const glassCoordsRef = useRef({ x: 0, y: 0 });
  const isScrolledRef = useRef(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const activeSection = useActiveSection();
  const { isProjectOverlayOpen, soundEnabled } = useOverlayState();
  const { setIsResumeOpen, setIsFastPassOpen, toggleSound } = usePerformanceActions();

  useFocusTrap(mobileSheetOpen, drawerRef, () => setMobileSheetOpen(false));

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 36;
      if (next !== isScrolledRef.current) {
        isScrolledRef.current = next;
        setIsScrolled(next);
      }
    };
    const onResize = () => {
      navRectRef.current = null;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (glassRafRef.current !== null) {
        window.cancelAnimationFrame(glassRafRef.current);
      }
    };
  }, []);

  const handleNavPointerEnter = () => {
    if (navRef.current) {
      navRectRef.current = navRef.current.getBoundingClientRect();
    }
  };

  const handleNavPointerLeave = () => {
    navRectRef.current = null;
  };

  const handleNavPointerMove = (e) => {
    if (!navRef.current) return;
    const rect = navRectRef.current || navRef.current.getBoundingClientRect();
    navRectRef.current = rect;
    glassCoordsRef.current.x = e.clientX - rect.left;
    glassCoordsRef.current.y = e.clientY - rect.top;

    if (glassRafRef.current === null) {
      glassRafRef.current = window.requestAnimationFrame(() => {
        glassRafRef.current = null;
        if (navRef.current) {
          navRef.current.style.setProperty("--glass-x", `${glassCoordsRef.current.x}px`);
          navRef.current.style.setProperty("--glass-y", `${glassCoordsRef.current.y}px`);
        }
      });
    }
  };

  return (
    <>
      <motion.header
        initial={false}
        animate={
          isProjectOverlayOpen
            ? { y: shouldReduceMotion ? 0 : -88, opacity: 0 }
            : { y: 0, opacity: 1 }
        }
        transition={{
          duration: shouldReduceMotion ? 0.14 : 0.36,
          ease: [0.16, 1, 0.3, 1],
        }}
        aria-hidden={isProjectOverlayOpen || undefined}
        className="fixed top-4 inset-x-0 z-[100] px-3 sm:px-6 pointer-events-none flex justify-center"
      >
        <nav
          ref={navRef}
          aria-label="Primary Navigation"
          onPointerEnter={handleNavPointerEnter}
          onPointerLeave={handleNavPointerLeave}
          onPointerMove={handleNavPointerMove}
          className={`liquid-glass-chrome flex items-center justify-between rounded-full transition-[background-color,border-color,box-shadow,padding,gap] duration-500 ${
            isProjectOverlayOpen ? "pointer-events-none" : "pointer-events-auto"
          } ${
            isScrolled
              ? "is-scrolled px-2.5 sm:px-3.5 py-1.5 gap-2 sm:gap-3"
              : "px-3.5 sm:px-5 py-2 gap-3 sm:gap-5"
          }`}
        >
          {/* Specular Top Edge Bevel */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-porcelain/45 to-transparent"
          />

          {/* Monogram (compacts cleanly when scrolled) */}
          <Magnetic strength={0.18} maxOffset={5}>
            <a
              href="#home"
              data-cursor="magnetic"
              onClick={() => playTactileClick("light")}
              className="relative z-10 flex items-center gap-2 shrink-0 group"
              aria-label={`${profile.name} — Home`}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full border border-porcelain/20 bg-porcelain/[0.04] font-serif italic text-sm text-champagne-light group-hover:border-champagne/60 transition-colors">
                {profile.initials}
              </span>
              <span
                className={`font-serif text-base tracking-wide text-porcelain/90 group-hover:text-porcelain transition-colors whitespace-nowrap ${
                  isScrolled ? "hidden" : "hidden lg:inline"
                }`}
              >
                Ayush<span className="text-champagne">.</span>
              </span>
            </a>
          </Magnetic>

          {/* Desktop Editorial Segment Links */}
          <div className="hidden md:flex items-center gap-0.5 relative z-10 px-1 py-0.5 rounded-full bg-porcelain/[0.03] border border-porcelain/[0.07]">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  data-cursor="magnetic"
                  aria-current={isActive ? "location" : undefined}
                  onClick={() => playTactileClick("light")}
                  className={`relative rounded-full text-[11.5px] font-sans tracking-[0.04em] whitespace-nowrap transition-colors duration-200 ${
                    isScrolled ? "px-2.5 py-1.5" : "px-3 py-1.5"
                  } ${
                    isActive
                      ? "text-porcelain font-medium"
                      : "text-stone hover:text-porcelain"
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId={shouldReduceMotion ? undefined : "activeNavIndicator"}
                      className="absolute inset-0 rounded-full bg-porcelain/[0.11] border border-porcelain/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right Action Controls (all actions preserved; labels compact gracefully when scrolled) */}
          <div className="relative z-10 flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Recruiter Fast Pass: Quick Overview */}
            <Magnetic strength={0.18} maxOffset={4}>
              <button
                type="button"
                data-cursor="magnetic"
                aria-label="Quick Overview"
                title="Quick Overview — Recruiter Fast Pass"
                onPointerEnter={loadFastPassModal}
                onFocus={loadFastPassModal}
                onClick={() => {
                  playTactileClick("light");
                  setIsFastPassOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-porcelain/15 hover:border-champagne/45 bg-porcelain/[0.04] hover:bg-porcelain/[0.08] text-[11px] font-mono tracking-wide text-porcelain/90 hover:text-champagne-light transition-colors whitespace-nowrap"
              >
                <Zap className="w-3 h-3 text-champagne" />
                <span>{isScrolled ? "Overview" : "Quick Overview"}</span>
              </button>
            </Magnetic>

            <Magnetic strength={0.18} maxOffset={5}>
              <button
                type="button"
                data-cursor="magnetic"
                onPointerEnter={loadResumeModal}
                onFocus={loadResumeModal}
                onClick={() => {
                  playTactileClick("light");
                  setIsResumeOpen(true);
                }}
                className="px-3 py-1.5 rounded-full border border-champagne/35 bg-champagne/[0.08] hover:bg-champagne/[0.16] text-[11px] font-mono tracking-wider text-champagne-light transition-colors whitespace-nowrap"
              >
                Resume
              </button>
            </Magnetic>

            {/* Optional Sound Toggle — Strictly OFF by default */}
            <button
              type="button"
              data-cursor="magnetic"
              onClick={toggleSound}
              aria-pressed={soundEnabled}
              aria-label={soundEnabled ? "Mute interface sounds" : "Enable interface sounds"}
              title={soundEnabled ? "Sound: On (click to mute)" : "Sound: Off (opt-in)"}
              className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-full border border-porcelain/12 text-stone hover:text-porcelain hover:border-champagne/40 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-champagne-light" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>

            <Magnetic strength={0.18} maxOffset={5} className="hidden xl:inline-flex">
              <a
                href="#contact"
                data-cursor="magnetic"
                onClick={() => playTactileClick("light")}
                className="inline-flex items-center gap-1 rounded-full bg-porcelain text-obsidian px-4 py-1.5 text-[11.5px] font-semibold tracking-wide hover:bg-champagne-pale transition-colors whitespace-nowrap"
              >
                <span>Inquire</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </Magnetic>

            {/* Mobile Drawer Trigger */}
            <button
              type="button"
              onClick={() => setMobileSheetOpen((v) => !v)}
              className="md:hidden p-1.5 rounded-full text-porcelain/85 hover:text-porcelain transition-colors"
              aria-label={mobileSheetOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileSheetOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileSheetOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Accessible Mobile Liquid Glass Drawer (Focus-Trapped) */}
      <AnimatePresence>
        {mobileSheetOpen && (
          <motion.div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileSheetOpen(false)}
            className="md:hidden fixed inset-0 z-[130] bg-obsidian/80 backdrop-blur-md flex items-start justify-center pt-20 px-4"
          >
            <motion.div
              ref={drawerRef}
              tabIndex={-1}
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="liquid-glass-modal w-full max-w-sm rounded-2xl p-5 space-y-1 outline-none"
            >
              <div className="flex items-center justify-between px-3 pb-3 mb-1 border-b border-porcelain/10">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-dark">
                  Navigation Index
                </span>
                <button
                  type="button"
                  onClick={() => setMobileSheetOpen(false)}
                  aria-label="Close navigation menu"
                  className="p-1.5 rounded-full border border-porcelain/15 text-stone hover:text-porcelain transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {navLinks.map((link, idx) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileSheetOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-xl text-porcelain/90 hover:bg-porcelain/[0.06] transition-colors"
                >
                  <span className="font-serif text-xl">{link.label}</span>
                  <span className="font-mono text-[11px] text-champagne/85">
                    0{idx + 1}
                  </span>
                </a>
              ))}

              <div className="pt-3 mt-2 border-t border-porcelain/10 grid grid-cols-2 gap-2 px-1">
                <button
                  type="button"
                  onPointerEnter={loadFastPassModal}
                  onClick={() => {
                    setMobileSheetOpen(false);
                    setIsFastPassOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-porcelain/15 bg-porcelain/[0.05] py-2.5 text-xs font-mono text-porcelain"
                >
                  <Zap className="w-3.5 h-3.5 text-champagne" />
                  <span>Overview</span>
                </button>

                <a
                  href={profile.resumePath}
                  download={profile.resumeDownloadName}
                  onClick={() => setMobileSheetOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-champagne/35 bg-champagne/[0.08] py-2.5 text-xs font-mono text-champagne-light"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Resume PDF</span>
                </a>
              </div>

              <div className="pt-2 px-1">
                <button
                  type="button"
                  onClick={toggleSound}
                  aria-pressed={soundEnabled}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-porcelain/12 py-2 text-xs font-mono text-stone hover:text-porcelain transition-colors"
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-champagne-light" />
                      <span>Interface Sound: On</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Interface Sound: Off</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
