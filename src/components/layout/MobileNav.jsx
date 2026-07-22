import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Wrench, Briefcase, Layers, Mail } from "lucide-react";

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "services", icon: Wrench, label: "Services" },
  { id: "work", icon: Briefcase, label: "Work" },
  { id: "stack", icon: Layers, label: "Stack" },
  { id: "contact", icon: Mail, label: "Contact" },
];

export default function MobileNav() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that is intersecting the most (or simply intersecting)
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5, // 50% of the section needs to be visible
      }
    );

    // Observe all sections
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
      <div className="flex items-center justify-between gap-1 p-2 rounded-2xl bg-[#0F0F1A]/80 backdrop-blur-md border border-white/10 shadow-void-lg">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-12 rounded-xl transition-colors duration-300 ${
                isActive ? "text-accent-emerald" : "text-white/40 hover:text-white/80"
              }`}
            >
              <Icon className="w-5 h-5 mb-1 z-10" />
              
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/[0.04] rounded-xl border border-white/[0.06] -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent-emerald shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
