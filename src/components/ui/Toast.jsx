import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { usePerformance } from "../../context/PerformanceContext";

export default function Toast() {
  const { toastMessage } = usePerformance();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 450, damping: 30 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] pointer-events-none"
        >
          <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full liquid-glass-dock border border-gold/30 shadow-2xl text-xs md:text-sm font-medium text-white/90 backdrop-blur-xl">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gold/20 text-gold-light">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span>{toastMessage}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

