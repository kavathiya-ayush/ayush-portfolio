import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking a link
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header className="fixed top-4 inset-x-4 sm:inset-x-8 z-[90]">
        <nav className="max-w-6xl mx-auto flex items-center justify-between rounded-2xl void-card-sm px-6 py-3">
          <a
            href="#home"
            className="font-display font-semibold text-white tracking-tight text-lg"
          >
            Ayush<span className="text-accent-emerald">.</span>
          </a>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.filter(l => l.href !== "#home").map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-white/40 hover:text-white transition-colors duration-300"
              >
                {l.label}
              </a>
            ))}
          </div>

          <a
            href="#contact"
            className="hidden md:block rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-2 text-sm text-white/60 hover:text-white hover:border-accent-emerald/30 transition-colors duration-300"
          >
            Hire Me
          </a>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white/60 hover:text-white transition-colors p-1"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-[100] bg-void/90 flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-7 right-10 text-white/60 hover:text-white bg-white/5 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center gap-8">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={handleLinkClick}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="font-display text-3xl font-semibold text-white/70 hover:text-white transition-colors"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={handleLinkClick}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.1, duration: 0.4 }}
                className="mt-4 rounded-xl bg-accent-emerald/20 border border-accent-emerald/30 px-8 py-3 text-lg font-medium text-accent-emerald hover:bg-accent-emerald/30 transition-colors duration-300"
              >
                Hire Me
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
