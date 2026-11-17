import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PerformanceProvider } from "./context/PerformanceContext";
import LiquidAuroraBackground from "./components/ui/LiquidAuroraBackground";
import CustomCursor from "./components/ui/CustomCursor";
import Loader from "./components/ui/Loader";
import Toast from "./components/ui/Toast";
import ResumeModal from "./components/ui/ResumeModal";
import Navbar from "./components/layout/Navbar";
import MobileNav from "./components/layout/MobileNav";
import Hero from "./components/sections/Hero";
import WhyHireMe from "./components/sections/WhyHireMe";
import InteractiveTerminal from "./components/ui/InteractiveTerminal";
import FeaturedWork from "./components/sections/FeaturedWork";
import Stack from "./components/sections/Stack";
import Timeline from "./components/sections/Timeline";
import Contact from "./components/sections/Contact";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [heroReady, setHeroReady] = useState(false);

  const handleLoaderComplete = () => {
    setLoading(false);
    setTimeout(() => setHeroReady(true), 50);
  };

  return (
    <PerformanceProvider>
      {/* ── Apple Liquid Magnetic Custom Cursor ── */}
      <CustomCursor />

      {/* ── Dynamic Island Toast & In-Browser Resume Modal ── */}
      <Toast />
      <ResumeModal />

      {/* ── Entrance Preloader ── */}
      <Loader onComplete={handleLoaderComplete} />

      {/* ── Luxury Site Shell with Luminous Fluid Liquid Aurora ── */}
      <div className="relative bg-obsidian min-h-screen overflow-x-hidden selection:bg-gold/30 selection:text-gold-light">
        {/* Dynamic Luminous Fluid Liquid Aurora Background */}
        <LiquidAuroraBackground />

        {/* ── Apple VisionOS Floating Liquid Dock Navbar ── */}
        <AnimatePresence>
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Navbar />
              <MobileNav />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main Structured Sections ── */}
        <main className="relative z-10 scroll-smooth">
          {/* Hero: Spatial VisionOS Rig & Sem 6 Callout */}
          <Hero heroReady={heroReady} />

          {/* Recruiter Fast-Track: Why Hire Ayush */}
          <WhyHireMe />

          {/* Interactive Developer Playground */}
          <InteractiveTerminal />

          {/* Flagship Production Systems */}
          <FeaturedWork />

          {/* Categorized Technical Arsenal */}
          <Stack />

          {/* Academic & Engineering Journey */}
          <Timeline />

          {/* Luxury Contact Suite */}
          <Contact />
        </main>

        {/* ── High-Luxury Footer ── */}
        <footer className="relative z-10 border-t border-white/[0.08] px-6 py-10 text-center text-xs text-white/40 font-mono space-y-2 pb-24 md:pb-10">
          <p className="flex items-center justify-center gap-2">
            <span>Designed & Engineered with Apple iOS & visionOS Liquid Glass Aesthetics</span>
          </p>
          <p className="text-white/20">
            © {new Date().getFullYear()} Ayush Kavathiya — B.Tech Computer Science (Semester 6).
          </p>
        </footer>
      </div>
    </PerformanceProvider>
  );
}
