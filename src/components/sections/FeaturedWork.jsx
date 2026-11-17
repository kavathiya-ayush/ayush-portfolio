import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Github,
  ArrowUpRight,
  AlertTriangle,
  X,
  Info,
  Download,
  Copy,
  Check,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import LiquidGlassCard from "../ui/LiquidGlassCard";
import { projects, projectCategories } from "../../data/portfolio";
import { usePerformance } from "../../context/PerformanceContext";

export default function FeaturedWork() {
  const { showToast } = usePerformance();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeProject, setActiveProject] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Filter projects by active tab
  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [filteredProjects]);

  const copyCredentials = (creds, title, e) => {
    e.stopPropagation();
    const str = `Username: ${creds.username}\nPassword: ${creds.password}`;
    navigator.clipboard.writeText(str);
    setCopiedKey(title);
    showToast(`Copied demo login for ${title} ✓`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <section id="work" className="relative px-6 py-20 lg:py-32 w-full">
      {/* ── Section Header & Filter Tabs ── */}
      <div className="max-w-6xl mx-auto mb-10 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-gold/25 text-xs font-mono text-gold-light mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Systems</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08]">
            Selected Systems, <br />
            <span className="text-white/30">Shipped End-to-End.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/50 max-w-xl">
            Each project is an active, production-grade deployment built to solve real operational problems.
          </p>
        </motion.div>

        {/* Category Filter Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {projectCategories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-gold-light bg-gold/15 border border-gold/40 shadow-glass-gold"
                    : "text-white/60 bg-white/[0.03] border border-white/[0.06] hover:text-white hover:bg-white/[0.07]"
                }`}
              >
                <span>{category}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gold-light rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Project Grid / Horizontal Scroll for Mobile ── */}
      <div className="max-w-6xl mx-auto">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-md:flex max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:-mx-6 max-md:px-6 max-md:pb-6 hide-scrollbar"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => {
              const isCopied = copiedKey === project.title;
              return (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="max-md:w-[86vw] max-md:snap-center shrink-0 flex flex-col"
                >
                  <LiquidGlassCard
                    data-cursor="project"
                    glowColor={project.accentColor}
                    className="p-6 sm:p-8 flex flex-col h-full cursor-pointer group"
                    onClick={() => setActiveProject(project)}
                  >
                    {/* Top Application Window Bar */}
                    <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.07]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400/70 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70 inline-block" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.05] border border-white/[0.08] text-gold-light">
                          {project.category}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-gold-light group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="font-display font-bold text-2xl text-white group-hover:text-gold-light transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs font-mono text-white/40 mt-1 mb-4">
                      {project.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-white/60 leading-relaxed mb-5">
                      {project.description}
                    </p>

                    {/* Architecture Highlights */}
                    {project.highlights && (
                      <div className="space-y-1.5 mb-6 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        {project.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-white/70">
                            <span className="text-gold-light font-bold mt-0.5">•</span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/[0.03] border border-white/[0.06] text-white/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 text-xs">
                      {project.credentials ? (
                        <button
                          onClick={(e) => copyCredentials(project.credentials, project.title, e)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/25 text-gold-light hover:bg-gold/20 transition-all font-mono"
                          title="Click to copy demo credentials"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? "Copied!" : "Copy Demo Login"}</span>
                        </button>
                      ) : (
                        <span className="text-white/40 font-mono text-[11px]">
                          {project.isDesktop ? "Windows Native Tool" : "Public Web Deployment"}
                        </span>
                      )}

                      <div className="flex items-center gap-3">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-white/40 hover:text-white p-1 transition-colors"
                          title="View Source on GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 font-semibold text-gold-light hover:underline"
                        >
                          <span>{project.isDesktop ? "Download" : "Live Demo"}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </LiquidGlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Upgraded Details Modal ── */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 sm:p-6 bg-obsidian/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto liquid-glass rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl hide-scrollbar"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-gold/15 text-gold-light border border-gold/30">
                  {activeProject.category}
                </span>
                <span className="text-xs font-mono text-white/40">Verified Architecture</span>
              </div>

              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-1">
                {activeProject.title}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-gold-light/80 mb-6">
                {activeProject.subtitle}
              </p>

              <div className="space-y-5 text-sm text-white/70">
                <p className="leading-relaxed">{activeProject.description}</p>

                {/* Architecture Highlights */}
                {activeProject.highlights && (
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-gold-light font-semibold">
                      Key Technical Feats
                    </h4>
                    <ul className="space-y-1.5 text-xs text-white/80">
                      {activeProject.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-gold-light font-bold mt-0.5">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Host Specific Notices */}
                {activeProject.warningType === "infinity" && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-white/80 space-y-2">
                    <div className="flex items-center gap-2 text-red-400 font-semibold">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Free Hosting Notice (InfinityFree)</span>
                    </div>
                    <p className="text-white/60 leading-relaxed">
                      Hosted on a free server tier. Some browsers may flag free domains. Click "Proceed to Website", then click "Details" and "Visit this unsafe site" to access.
                    </p>
                  </div>
                )}

                {/* Demo Credentials */}
                {activeProject.credentials && (
                  <div className="p-4 rounded-2xl bg-gold/10 border border-gold/25 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-gold-light">
                        Demo Credentials:
                      </span>
                      <button
                        onClick={(e) =>
                          copyCredentials(activeProject.credentials, activeProject.title, e)
                        }
                        className="text-xs font-mono text-gold-light hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Login</span>
                      </button>
                    </div>
                    <div className="text-xs font-mono text-white/90">
                      Username:{" "}
                      <code className="px-1.5 py-0.5 rounded bg-black/40 text-gold-light">
                        {activeProject.credentials.username}
                      </code>{" "}
                      | Password:{" "}
                      <code className="px-1.5 py-0.5 rounded bg-black/40 text-gold-light">
                        {activeProject.credentials.password}
                      </code>
                    </div>
                  </div>
                )}

                {/* Info Text */}
                {activeProject.infoText && (
                  <div className="p-4 rounded-2xl bg-sapphire/10 border border-sapphire/20 text-xs text-white/80 leading-relaxed">
                    {activeProject.infoText}
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveProject(null)}
                  className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white/60 hover:text-white font-medium text-sm transition-colors"
                >
                  Close
                </button>
                <a
                  href={activeProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-5 rounded-xl bg-white/[0.05] border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub Source
                </a>
                <a
                  href={activeProject.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-gold to-gold-amber text-obsidian font-bold text-sm hover:shadow-glow-gold transition-all flex items-center justify-center gap-2"
                >
                  {activeProject.isDesktop ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                  <span>{activeProject.isDesktop ? "Download .exe" : "Launch System"}</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
