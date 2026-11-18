import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ExternalLink, FileText } from "lucide-react";
import {
  useOverlayState,
  usePerformanceActions,
} from "../../context/PerformanceContext";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { playTactileClick } from "../../utils/audio";
import { profile, projects, stackCategories } from "../../data/portfolio";

export default function ResumeModal() {
  const { isResumeOpen } = useOverlayState();
  const { setIsResumeOpen, showToast } = usePerformanceActions();
  const [viewMode, setViewMode] = useState("pdf"); // 'pdf' | 'summary'
  const dialogRef = useRef(null);

  const handleClose = () => setIsResumeOpen(false);
  useFocusTrap(isResumeOpen, dialogRef, handleClose);

  const allSkillsList = stackCategories.flatMap((cat) =>
    cat.items.map((item) => item.name)
  );

  return (
    <AnimatePresence>
      {isResumeOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-obsidian/85 backdrop-blur-md"
        >
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="liquid-glass-modal relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl p-5 sm:p-7 outline-none"
          >
            {/* Header Bar */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-porcelain/10 shrink-0">
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-champagne-light mb-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Curriculum Vitae — PDF Document</span>
                </div>
                <h3
                  id="resume-modal-title"
                  className="font-serif text-2xl sm:text-3xl font-light text-porcelain tracking-tight"
                >
                  {profile.name}
                </h3>
                <p className="mt-0.5 font-mono text-[11px] text-stone">
                  {profile.degreeFull}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* View Toggle: Actual PDF vs Synchronized Text Overview */}
                <div
                  role="group"
                  aria-label="Resume view mode"
                  className="inline-flex items-center rounded-full border border-porcelain/12 bg-obsidian/60 p-0.5 font-mono text-[10.5px]"
                >
                  <button
                    type="button"
                    data-cursor="magnetic"
                    aria-pressed={viewMode === "pdf"}
                    onClick={() => setViewMode("pdf")}
                    className={`px-3 py-1 rounded-full transition-colors ${
                      viewMode === "pdf"
                        ? "bg-porcelain text-obsidian font-medium"
                        : "text-stone hover:text-porcelain"
                    }`}
                  >
                    PDF
                  </button>
                  <button
                    type="button"
                    data-cursor="magnetic"
                    aria-pressed={viewMode === "summary"}
                    onClick={() => setViewMode("summary")}
                    className={`px-3 py-1 rounded-full transition-colors ${
                      viewMode === "summary"
                        ? "bg-porcelain text-obsidian font-medium"
                        : "text-stone hover:text-porcelain"
                    }`}
                  >
                    Overview
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  data-cursor="magnetic"
                  className="p-2 rounded-full border border-porcelain/15 text-stone hover:text-porcelain hover:border-champagne/45 transition-colors"
                  aria-label="Close resume viewer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body: Actual Embedded PDF or Synchronized Summary */}
            <div className="mt-5 flex-1 min-h-0 overflow-y-auto hide-scrollbar">
              {viewMode === "pdf" ? (
                <div className="space-y-3">
                  <div className="w-full h-[58vh] sm:h-[64vh] rounded-xl overflow-hidden border border-porcelain/12 bg-[#141418]">
                    <object
                      data={`${profile.resumePath}#view=FitH`}
                      type="application/pdf"
                      aria-label={`${profile.name} Resume PDF`}
                      className="w-full h-full"
                    >
                      {/* Clean fallback for browsers that block inline PDF embeds (e.g., iOS Safari) */}
                      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                        <FileText className="w-9 h-9 text-champagne" />
                        <div className="space-y-1 max-w-sm">
                          <p className="font-serif text-2xl text-porcelain">
                            Resume PDF Ready
                          </p>
                          <p className="text-xs text-stone leading-relaxed">
                            Your browser prefers opening PDF documents directly in a separate viewer. Use the actions below to open or download the full 3-page PDF.
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                          <a
                            href={profile.resumePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-porcelain text-obsidian px-5 py-2.5 text-xs font-semibold"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open PDF</span>
                          </a>
                          <a
                            href={profile.resumePath}
                            download={profile.resumeDownloadName}
                            className="inline-flex items-center gap-2 rounded-full border border-champagne/40 px-5 py-2.5 text-xs font-mono text-champagne-light"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    </object>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-sm text-stone pr-1">
                  <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-6 pb-5 border-b border-porcelain/[0.08]">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-champagne">
                      Education
                    </span>
                    <div className="space-y-1">
                      <p className="text-porcelain font-medium">
                        Bachelor of Computer Applications (BCA)
                      </p>
                      <p className="text-xs text-stone">
                        {profile.university} · {profile.studyPeriod}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-6 pb-5 border-b border-porcelain/[0.08]">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-champagne">
                      Profile
                    </span>
                    <div className="space-y-2 text-xs leading-relaxed">
                      <p className="text-porcelain/85">{profile.summary}</p>
                      <p>
                        <span className="text-stone-dark font-mono uppercase text-[10px] mr-2">
                          Languages:
                        </span>
                        <span className="text-porcelain/80">
                          {profile.languages.join(", ")}
                        </span>
                      </p>
                      <p>
                        <span className="text-stone-dark font-mono uppercase text-[10px] mr-2">
                          Strengths:
                        </span>
                        <span className="text-porcelain/80">
                          {profile.primarySkills.join(" · ")}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-6 pb-5 border-b border-porcelain/[0.08]">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-champagne">
                      Skills
                    </span>
                    <p className="text-xs text-porcelain/80 leading-relaxed font-mono">
                      {allSkillsList.join(" · ")}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-6">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-champagne">
                      Projects
                    </span>
                    <ul className="space-y-3">
                      {projects.map((item) => (
                        <li key={item.title} className="space-y-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-porcelain font-medium text-xs sm:text-sm">
                              {item.index}. {item.title}
                            </span>
                            <span className="font-mono text-[10px] text-stone-dark">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-xs text-stone leading-relaxed">
                            {item.subtitle}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Real PDF Actions */}
            <div className="mt-5 pt-5 border-t border-porcelain/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={profile.resumePath}
                  download={profile.resumeDownloadName}
                  data-cursor="magnetic"
                  onClick={() => {
                    playTactileClick("success");
                    showToast(`Downloading ${profile.resumeDownloadName}`);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-porcelain text-obsidian text-xs font-semibold tracking-wide hover:bg-champagne-pale transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Resume PDF</span>
                </a>

                <a
                  href={profile.resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="magnetic"
                  onClick={() => playTactileClick("light")}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-porcelain/15 hover:border-champagne/45 text-xs font-mono text-porcelain/90 hover:text-champagne-light transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in New Tab</span>
                </a>
              </div>

              <span className="font-mono text-[10.5px] text-stone-dark hidden sm:inline">
                {profile.email}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
