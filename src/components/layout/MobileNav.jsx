import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Briefcase, Terminal, Layers, Mail, Sparkles } from "lucide-react";

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "work", icon: Briefcase, label: "Work" },
  { id: "terminal", icon: Terminal, label: "CLI" },
  { id: "skills", icon: Layers, label: "Stack" },
  { id: "contact", icon: Mail, label: "Contact" },
];

export default function MobileNav() {
  const [activeSection, setActiveSection] = useState("home");

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
        rootMargin: "-20% 0px -40% 0px",
        threshold: 0.1,
      }
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="md:hidden fixed bottom-4 inset-x-4 z-[100]"
    >
      <div className="flex items-center justify-between gap-1 p-1.5 rounded-full liquid-glass-dock border border-white/10 shadow-2xl">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-12 rounded-full transition-colors duration-300 ${
                isActive ? "text-gold-light" : "text-white/40 hover:text-white/80"
              }`}
            >
              <Icon className="w-5 h-5 z-10" />
              <span className="text-[9px] font-mono mt-0.5 z-10">{item.label}</span>

              {isActive && (
                <motion.div
                  layoutId="activeTabMobile"
                  className="absolute inset-0 bg-white/[0.08] rounded-full border border-gold/30 -z-10 shadow-glass-gold"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
