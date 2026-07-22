import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./components/ui/Loader";
import Navbar from "./components/layout/Navbar";
import MobileNav from "./components/layout/MobileNav";
import Hero from "./components/sections/Hero";
import Services from "./components/sections/Services";
import FeaturedWork from "./components/sections/FeaturedWork";
import Stack from "./components/sections/Stack";
import Contact from "./components/sections/Contact";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [heroReady, setHeroReady] = useState(false);

  const handleLoaderComplete = () => {
    setLoading(false);
    setTimeout(() => setHeroReady(true), 50);
  };

  return (
    <>
      {/* Preloader */}
      <Loader onComplete={handleLoaderComplete} />

      {/* Site shell */}
      <div className="relative bg-void min-h-screen overflow-x-hidden">
        {/* Fixed ambient background */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent-emerald/[0.04] blur-[140px]" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent-slate/[0.03] blur-[140px]" />
          <div className="absolute inset-0 bg-grain opacity-[0.02] mix-blend-overlay" />
        </div>

        {/* Navbar — delayed entrance */}
        <AnimatePresence>
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Navbar />
              <MobileNav />
            </motion.div>
          )}
        </AnimatePresence>

        <main className="relative z-10 max-md:h-[100dvh] max-md:overflow-y-auto max-md:snap-y max-md:snap-mandatory scroll-smooth">
          <div className="max-md:min-h-[100dvh] max-md:snap-start max-md:flex max-md:items-center max-md:justify-center">
            <Hero heroReady={heroReady} />
          </div>
          <div className="max-md:min-h-[100dvh] max-md:snap-start max-md:flex max-md:items-center max-md:justify-center">
            <Services />
          </div>
          <div className="max-md:min-h-[100dvh] max-md:snap-start max-md:flex max-md:items-center max-md:justify-center">
            <FeaturedWork />
          </div>
          <div className="max-md:min-h-[100dvh] max-md:snap-start max-md:flex max-md:items-center max-md:justify-center">
            <Stack />
          </div>
          <div className="max-md:min-h-[100dvh] max-md:snap-start max-md:flex max-md:items-center max-md:justify-center max-md:flex-col">
            <Contact />
            <footer className="md:hidden relative z-10 border-t border-white/[0.04] px-6 py-8 w-full text-center text-xs text-white/20 font-mono mt-auto">
              © {new Date().getFullYear()} Ayush — built with React, Tailwind & Framer Motion
            </footer>
          </div>
        </main>

        <footer className="hidden md:block relative z-10 border-t border-white/[0.04] px-6 py-8 text-center text-xs text-white/20 font-mono">
          © {new Date().getFullYear()} Ayush — built with React, Tailwind
          {"&"} Framer Motion
        </footer>
      </div>
    </>
  );
}
