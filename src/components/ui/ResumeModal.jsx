import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, CheckCircle2, GraduationCap, Award, ExternalLink } from "lucide-react";
import { usePerformance } from "../../context/PerformanceContext";

export default function ResumeModal() {
  const { isResumeOpen, setIsResumeOpen, showToast } = usePerformance();

  if (!isResumeOpen) return null;

  const handleDownload = () => {
    showToast("CV download initiated ✓");
    // Creates a virtual link to download or open
    const link = document.createElement("a");
    link.href = "mailto:shivamsoftwaresolutions.in@gmail.com?subject=Internship Opportunity - Ayush Kavathiya&body=Hi Ayush, we reviewed your portfolio and would like to invite you for an interview.";
    link.click();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-obsidian/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto liquid-glass rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl hide-scrollbar"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold/15 text-gold-light border border-gold/25">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                  Ayush Kavathiya — Resume
                </h3>
                <p className="text-xs sm:text-sm font-mono text-gold-light/80">
                  Semester 6 CS • Available for Internship
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsResumeOpen(false)}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Summary Grid */}
          <div className="mt-6 space-y-6 text-sm text-white/70">
            {/* Academic Snapshot */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-gold-light font-semibold font-display">
                <GraduationCap className="w-4 h-4" />
                <span>Education & Track</span>
              </div>
              <p className="text-white/80">
                <strong>B.Tech in Computer Science & Engineering</strong> — Semester 6 (Pre-Final Year)
              </p>
              <p className="text-xs text-white/50 font-mono">
                Core Coursework: Data Structures & Algorithms, Database Management Systems (DBMS), Operating Systems, Computer Networks, Software Engineering.
              </p>
            </div>

            {/* Target Internship Focus */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-sapphire-light font-semibold font-display">
                <Award className="w-4 h-4" />
                <span>Target Roles & Availability</span>
              </div>
              <p className="text-white/80">
                <strong>Software Engineering Intern / Full Stack Developer Intern / Mobile Dev Intern</strong>
              </p>
              <p className="text-xs text-white/50">
                Availability: Immediate / Summer / Fall 2026–2027. Open to remote, hybrid, or on-site opportunities.
              </p>
            </div>

            {/* Core Competencies */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-gold/70 mb-3">
                Key Technical Strengths
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  "React, Next.js, TypeScript",
                  "Node.js, Express, REST APIs",
                  "Python (Desktop & Automation)",
                  "Android (Java / Kotlin)",
                  "MySQL, PostgreSQL, SQLite",
                  "Tailwind CSS, Framer Motion",
                  "Git, GitHub Actions, Linux",
                  "Real-time WebSockets & Chat",
                ].map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-light shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipped Systems */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-gold/70 mb-3">
                Verified Production Systems
              </h4>
              <ul className="space-y-2 text-xs text-white/60">
                <li className="flex items-start gap-2">
                  <span className="text-gold-light font-bold">1.</span>
                  <span><strong>Chat Wala:</strong> WhatsApp-inspired real-time web application with zero-friction email auth and live messaging.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-light font-bold">2.</span>
                  <span><strong>RedCell Connect:</strong> Multi-hospital blood bank management system with inventory tracking & role access.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-light font-bold">3.</span>
                  <span><strong>Omni Tool Convertor:</strong> Native Windows desktop utility with PDF-to-Excel CA banking parse engines.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-amber text-obsidian font-semibold text-sm hover:shadow-glow-gold transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              Direct Contact & Request PDF
            </button>
            <a
              href="mailto:shivamsoftwaresolutions.in@gmail.com"
              className="px-6 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/80 hover:text-white hover:bg-white/[0.1] font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Email Ayush</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

