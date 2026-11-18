import { motion, AnimatePresence } from "framer-motion";
import { useToastMessage } from "../../context/PerformanceContext";

export default function Toast() {
  const toastMessage = useToastMessage();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] pointer-events-none px-4"
        >
          <div className="liquid-glass-chrome flex items-center gap-3 px-5 py-2.5 rounded-full text-xs sm:text-sm font-sans text-porcelain">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne-light shrink-0" />
            <span className="tracking-wide">{toastMessage}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
