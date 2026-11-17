import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText, ArrowUpRight } from "lucide-react";
import { usePerformance } from "../../context/PerformanceContext";
import { playTactileClick } from "../../utils/audio";

const links = [
  { href: "#work", label: "Work" },
  { href: "#terminal", label: "Terminal" },
  { href: "#skills", label: "Skills" },
  { href: "#journey", label: "Journey" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const navRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { setIsResumeOpen } = usePerformance();

  // Scroll detection for elevated glass state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Liquid Spotlight Tracking following mouse coords on the glass
  const handleNavMouseMove = (e) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    navRef.current.style.setProperty("--nav-x", `${x}px`);
    navRef.current.style.setProperty("--nav-y", `${y}px`);
  };

  const handleLinkClick = () => {
    playTactileClick("light");
    setIsOpen(false);
  };

  return (
    <>
      <header className="fixed top-4 inset-x-0 z-[100] px-4 pointer-events-none flex justify-center">
        <nav
          ref={navRef}
          onMouseMove={handleNavMouseMove}
          className={`w-auto flex items-center justify-between gap-4 sm:gap-6 rounded-full apple-liquid-nav px-4 sm:px-5 py-2 pointer-events-auto transition-all duration-300 ${
            isScrolled ? "is-scrolled" : ""
          }`}
        >
          {/* Top Specular Hairline Highlight (Apple Glass Bevel) */}
          <div className="pointer-events-none absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full z-10" />

          {/* ── Brand Monogram (VisionOS Frosted Lens) ── */}
          <a
            href="#home"
            onClick={() => playTactileClick("light")}
            className="flex items-center gap-2 font-display font-bold text-white tracking-tight text-sm sm:text-base group shrink-0 relative z-10"
          >
            <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-white/20 via-gold/15 to-white/5 text-gold-light border border-white/25 text-xs font-mono group-hover:scale-105 transition-transform shadow-glass-gold">
              <span>AK</span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-obsidian animate-pulse" />
            </div>
            <span className="tracking-tight hidden xs:inline text-white/90 group-hover:text-white transition-colors">
              Ayush<span className="text-gold-light">.</span>
            </span>
          </a>

          {/* ── Apple iOS 18 Sliding Segment Control (Never wraps) ── */}
          <div
            onMouseLeave={() => setHoveredIdx(null)}
            className="hidden md:flex items-center gap-1 relative px-1 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08]"
          >
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onMouseEnter={() => {
                  setHoveredIdx(i);
                  playTactileClick("light");
                }}
                onClick={handleLinkClick}
                className={`relative px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors duration-200 tracking-wide z-10 ${
                  hoveredIdx === i ? "text-white font-semibold" : "text-white/70 hover:text-white"
                }`}
              >
                <span>{l.label}</span>
                {hoveredIdx === i && (
                  <motion.div
                    layoutId="appleNavSegmentPill"
                    className="absolute inset-0 rounded-full bg-white/[0.16] border border-white/25 shadow-sm backdrop-blur-md -z-10"
                    transition={{ type: "spring", stiffness: 480, damping: 32 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* ── Right Controls: Resume & Hire Me CTA ── */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 relative z-10">
            {/* Quick Resume Button */}
            <button
              onClick={() => {
                playTactileClick("success");
                setIsResumeOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-gradient-to-r from-gold/25 to-gold-amber/20 hover:from-gold/35 hover:to-gold-amber/30 border border-gold/45 text-xs font-semibold text-gold-light transition-all duration-200 shadow-glass-gold active:scale-95 whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>

            {/* Apple VisionOS Primary Action Button */}
            <a
              href="#contact"
              onClick={() => playTactileClick("light")}
              className="inline-flex items-center gap-1 rounded-full bg-white text-obsidian px-3.5 py-1 sm:px-4 sm:py-1.5 text-xs font-bold hover:bg-gold-light hover:shadow-glow-gold transition-all duration-200 active:scale-95 whitespace-nowrap"
            >
              <span>Hire Me</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden text-white/80 hover:text-white p-1 rounded-full"
              onClick={() => {
                playTactileClick("light");
                setIsOpen(true);
              }}
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 z-[120] bg-obsidian/90 backdrop-blur-3xl flex flex-col items-center justify-center p-6"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-white/60 hover:text-white bg-white/5 rounded-full p-2.5 border border-white/10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-8 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-xs font-mono text-gold-light mb-2">
                Semester 6 CS • Open for Internships
              </span>
              <h3 className="font-display font-bold text-2xl text-white">
                Ayush Kavathiya
              </h3>
            </div>

            <div className="flex flex-col items-center gap-5 w-full max-w-xs">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={handleLinkClick}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                  className="font-display text-2xl font-semibold text-white/80 hover:text-gold-light transition-colors"
                >
                  {l.label}
                </motion.a>
              ))}

              <motion.button
                onClick={() => {
                  setIsOpen(false);
                  setIsResumeOpen(true);
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white font-medium text-sm"
              >
                <FileText className="w-4 h-4 text-gold-light" />
                <span>View Full Resume</span>
              </motion.button>

              <motion.a
                href="#contact"
                onClick={handleLinkClick}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42 }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-gold to-gold-amber text-obsidian text-center font-bold tracking-wide shadow-glow-gold"
              >
                Hire Me for Internship
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
