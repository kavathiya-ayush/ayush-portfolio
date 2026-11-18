import { useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  X,
  Download,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Github,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import {
  useOverlayState,
  usePerformanceActions,
} from "../../context/PerformanceContext";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { playTactileClick } from "../../utils/audio";
import { profile, projects, stackCategories } from "../../data/portfolio";

/**
 * RECRUITER FAST PASS — 60-Second Executive Snapshot Overlay
 * - Triggered via "Quick Overview" in Navbar without moving page scroll
 * - Focus-trapped Apple Liquid Glass dialog with Escape close & focus restoration
 */
export default function RecruiterFastPassModal() {
  const { isFastPassOpen } = useOverlayState();
  const { setIsFastPassOpen, setIsResumeOpen, showToast } = usePerformanceActions();
  const shouldReduceMotion = useReducedMotion();
  const [copiedField, setCopiedField] = useState(null);
  const dialogRef = useRef(null);

  const handleClose = () => setIsFastPassOpen(false);
  useFocusTrap(isFastPassOpen, dialogRef, handleClose);

  const featuredProjects = projects.filter((p) => p.featured);

  const handleCopy = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      playTactileClick("success");
      showToast(`Copied ${label}: ${value}`);
      setTimeout(() => setCopiedField(null), 2200);
    } catch {
      showToast(`${label}: ${value}`);
    }
  };

  return (
    <AnimatePresence>
      {isFastPassOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="fast-pass-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          className="fixed inset-0 z-[155] flex items-center justify-center p-3 sm:p-6 bg-obsidian/85 backdrop-blur-md"
        >
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 14 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.97, y: 10 }
            }
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="liquid-glass-modal relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-5 sm:p-8 hide-scrollbar outline-none"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-porcelain/12">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-champagne-light">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Quick Overview — Recruiter Fast Pass</span>
                </div>
                <h2
                  id="fast-pass-title"
                  className="font-serif text-3xl sm:text-4xl font-light text-porcelain"
                >
                  {profile.name}
                </h2>
                <p className="font-mono text-xs text-stone">
                  {profile.role} · {profile.degree}
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                data-cursor="magnetic"
                aria-label="Close Quick Overview"
                className="p-2 rounded-full border border-porcelain/15 text-stone hover:text-porcelain hover:border-champagne/45 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Availability & Summary Strip */}
            <div className="mt-5 p-4 rounded-xl bg-obsidian/70 border border-champagne/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-champagne-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-champagne-light" />
                  <span>{profile.availability}</span>
                </div>
                <p className="text-xs sm:text-sm text-porcelain/85 font-light leading-relaxed">
                  {profile.degreeFull} · Languages: {profile.languages.join(", ")}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href={profile.resumePath}
                  download={profile.resumeDownloadName}
                  data-cursor="magnetic"
                  onClick={() => {
                    playTactileClick("success");
                    showToast(`Downloading ${profile.resumeDownloadName}`);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-porcelain text-obsidian px-4 py-2 text-xs font-semibold hover:bg-champagne-pale transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Resume PDF</span>
                </a>
                <button
                  type="button"
                  data-cursor="magnetic"
                  onClick={() => {
                    handleClose();
                    setIsResumeOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-porcelain/15 hover:border-champagne/45 px-3.5 py-2 text-xs font-mono text-porcelain/90 hover:text-champagne-light transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View PDF</span>
                </button>
              </div>
            </div>

            {/* Top Featured Projects */}
            <div className="mt-6 space-y-3">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-champagne">
                Strongest Shipped Projects
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featuredProjects.map((project) => (
                  <div
                    key={project.slug}
                    className="p-4 rounded-xl bg-obsidian-elevated/90 border border-porcelain/10 flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-serif text-xl text-porcelain">
                          {project.title}
                        </span>
                        <span className="font-mono text-[10.5px] text-champagne/90">
                          {project.category}
                        </span>
                      </div>
                      <p className="text-xs text-stone leading-relaxed font-light">
                        {project.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-porcelain/[0.08] font-mono text-[11px]">
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="magnetic"
                        className="inline-flex items-center gap-1 text-porcelain/90 hover:text-champagne-light transition-colors"
                      >
                        {project.isDesktop ? (
                          <Download className="w-3 h-3" />
                        ) : (
                          <ExternalLink className="w-3 h-3" />
                        )}
                        <span>{project.isDesktop ? "Download" : "Live Demo"}</span>
                      </a>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="magnetic"
                        className="inline-flex items-center gap-1 text-stone hover:text-porcelain transition-colors"
                      >
                        <Github className="w-3 h-3" />
                        <span>Code</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Toolkit Compact Matrix */}
            <div className="mt-6 space-y-3">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-champagne">
                Technical Toolkit
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {stackCategories.map((group) => (
                  <div
                    key={group.id}
                    className="p-3.5 rounded-xl bg-obsidian/60 border border-porcelain/[0.09] space-y-1"
                  >
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-dark block">
                      {group.category}
                    </span>
                    <p className="text-porcelain/90 font-mono text-[11.5px] leading-relaxed">
                      {group.items.map((i) => i.name).join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Contact & Copy-to-Clipboard Actions */}
            <div className="mt-6 pt-5 border-t border-porcelain/12 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  data-cursor="magnetic"
                  onClick={() => handleCopy(profile.email, "Email")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-porcelain/15 hover:border-champagne/45 px-3.5 py-2 font-mono text-[11px] text-porcelain/90 hover:text-champagne-light transition-colors"
                >
                  {copiedField === "Email" ? (
                    <Check className="w-3.5 h-3.5 text-champagne-light" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-champagne" />
                  )}
                  <span>{profile.email}</span>
                </button>

                <button
                  type="button"
                  data-cursor="magnetic"
                  onClick={() => handleCopy(profile.phone, "Phone")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-porcelain/15 hover:border-champagne/45 px-3.5 py-2 font-mono text-[11px] text-porcelain/90 hover:text-champagne-light transition-colors"
                >
                  {copiedField === "Phone" ? (
                    <Check className="w-3.5 h-3.5 text-champagne-light" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-champagne" />
                  )}
                  <span>{profile.phone}</span>
                </button>
              </div>

              <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.16em]">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="magnetic"
                  className="inline-flex items-center gap-1 text-stone hover:text-porcelain transition-colors"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="magnetic"
                  className="inline-flex items-center gap-1 text-stone hover:text-porcelain transition-colors"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

