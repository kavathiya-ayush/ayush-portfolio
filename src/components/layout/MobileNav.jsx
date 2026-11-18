import { motion, useReducedMotion } from "framer-motion";
import { Home, Briefcase, Terminal, Layers, Mail } from "lucide-react";
import { useActiveSection, useOverlayState } from "../../context/PerformanceContext";

const dockItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "work", icon: Briefcase, label: "Work" },
  { id: "terminal", icon: Terminal, label: "CLI" },
  { id: "skills", icon: Layers, label: "Toolkit" },
  { id: "contact", icon: Mail, label: "Contact" },
];

export default function MobileNav() {
  const activeSection = useActiveSection();
  const { isProjectOverlayOpen } = useOverlayState();
  const shouldReduceMotion = useReducedMotion();

  const handleNavigate = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  return (
    <motion.nav
      initial={false}
      animate={
        isProjectOverlayOpen
          ? { y: shouldReduceMotion ? 0 : 96, opacity: 0 }
          : { y: 0, opacity: 1 }
      }
      transition={{
        duration: shouldReduceMotion ? 0.14 : 0.34,
        ease: [0.16, 1, 0.3, 1],
      }}
      aria-hidden={isProjectOverlayOpen || undefined}
      aria-label="Mobile Navigation Dock"
      className="md:hidden fixed bottom-3.5 inset-x-4 z-[100] pointer-events-none flex justify-center"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div
        className={`liquid-glass-chrome w-full max-w-sm flex items-center justify-between gap-1 p-1.5 rounded-full ${
          isProjectOverlayOpen ? "pointer-events-none" : "pointer-events-auto"
        }`}
      >
        {dockItems.map((item) => {
          const isActive =
            activeSection === item.id ||
            (item.id === "home" && activeSection === "about") ||
            (item.id === "skills" && activeSection === "journey");
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigate(item.id)}
              aria-label={item.label}
              aria-current={isActive ? "location" : undefined}
              className={`relative flex flex-col items-center justify-center flex-1 h-12 rounded-full transition-colors duration-200 ${
                isActive ? "text-champagne-light" : "text-stone hover:text-porcelain"
              }`}
            >
              <Icon className="w-[18px] h-[18px] relative z-10" strokeWidth={1.75} />
              <span className="text-[10.5px] font-mono tracking-wide mt-0.5 relative z-10">
                {item.label}
              </span>

              {isActive && (
                <motion.span
                  layoutId={shouldReduceMotion ? undefined : "activeMobileDock"}
                  className="absolute inset-0 rounded-full bg-porcelain/[0.09] border border-champagne/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}
