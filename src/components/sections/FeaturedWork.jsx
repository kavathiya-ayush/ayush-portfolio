import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight, AlertTriangle, X, Info, Download } from "lucide-react";

import { projects } from "../../data/portfolio";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

function ProjectCard({ project, index, onOpenWarning }) {
  return (
    <motion.div
      layoutId={`project-${project.title}`}
      variants={cardVariant}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative rounded-2xl void-card overflow-hidden max-md:min-w-[75vw] max-md:snap-center cursor-pointer flex flex-col"
      style={{
        animation: `antigravity 10s ease-in-out ${index * 1.5}s infinite`,
      }}
      onClick={() => onOpenWarning(project)}
    >
      {/* Gradient header — project screenshot placeholder */}
      <motion.div
        layoutId={`header-${project.title}`}
        className={`relative h-56 bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden shrink-0`}
      >
        <div className="absolute inset-0 bg-grain opacity-[0.1] mix-blend-overlay" />
        <span className="font-display text-3xl font-bold text-white/[0.06] group-hover:text-white/[0.12] transition-colors duration-500 text-center px-4">
          {project.title}
        </span>

        {/* Tech overlay on hover */}
        <div className="absolute inset-0 flex flex-wrap content-end gap-2 p-4 bg-void/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-400">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/[0.08] border border-white/[0.08] px-3 py-1 text-xs font-mono text-accent-emerald/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="p-6 lg:p-10 flex flex-col grow">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold text-white">
            {project.title}
          </h3>
          <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-accent-emerald transition-colors duration-300 shrink-0 mt-1" />
        </div>

        <p className="mt-4 text-base text-white/40 leading-relaxed">
          {project.description}
        </p>

        {/* Static tag row */}
        <div className="mt-4 flex flex-wrap gap-1.5 mb-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white/[0.03] px-3 py-1 text-xs font-mono text-white/30"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-5 border-t border-white/[0.04] pt-6">
          {project.warningType || project.isDesktop || window.innerWidth < 768 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenWarning(project);
              }}
              className="inline-flex items-center gap-1.5 text-base text-white/50 hover:text-accent-slate transition-colors duration-300 z-10 relative"
            >
              {project.isDesktop && window.innerWidth >= 768 ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
              {window.innerWidth < 768 ? "View Details" : project.isDesktop ? "Download App" : "Live Demo"}
            </button>
          ) : (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-base text-white/50 hover:text-accent-slate transition-colors duration-300 z-10 relative"
            >
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </a>
          )}

          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-base text-white/50 hover:text-accent-emerald transition-colors duration-300 z-10 relative"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedWork() {
  const [activeProject, setActiveProject] = useState(null);

  return (
    <section id="work" className="relative px-6 py-20 lg:py-32 w-full">
      {/* Modal View */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center md:p-4 bg-void/90 md:bg-void/80 backdrop-blur-md"
          >
            <motion.div
              layoutId={`project-${activeProject.title}`}
              className="relative w-full md:max-w-lg p-6 lg:p-8 max-md:pt-12 max-md:h-[100dvh] max-md:rounded-none md:rounded-2xl void-card border-none md:border md:border-white/[0.08] shadow-2xl max-md:overflow-y-auto flex flex-col"
            >
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-10 bg-white/5 p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Mobile-only header image mimicking the card */}
              <div className="md:hidden -mx-6 -mt-12 mb-6 relative h-48 flex items-center justify-center shrink-0">
                <motion.div
                  layoutId={`header-${activeProject.title}`}
                  className={`absolute inset-0 bg-gradient-to-br ${activeProject.gradient}`}
                />
                <div className="absolute inset-0 bg-grain opacity-[0.1] mix-blend-overlay" />
                <span className="relative z-10 font-display text-2xl font-bold text-white/80 text-center px-4">
                  {activeProject.title}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                {!activeProject.warningType && !activeProject.isDesktop && (
                   <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full shrink-0 bg-white/5 border border-white/10 text-white/60">
                     <Info className="w-6 h-6" />
                   </div>
                )}
                {activeProject.warningType === 'infinity' && (
                  <div className="flex items-center justify-center w-12 h-12 rounded-full shrink-0 bg-red-500/10 border border-red-500/20 text-red-500">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                )}
                {activeProject.warningType === 'vercel' && (
                  <div className="flex items-center justify-center w-12 h-12 rounded-full shrink-0 bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Info className="w-6 h-6" />
                  </div>
                )}
                {activeProject.isDesktop && (
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full shrink-0 bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald">
                    <Download className="w-6 h-6" />
                  </div>
                )}
                <h3 className="font-display text-2xl font-bold text-white md:block hidden">
                  {activeProject.warningType ? 'Notice' : activeProject.isDesktop ? 'Download Application' : 'Project Details'}
                </h3>
                <h3 className="font-display text-2xl font-bold text-white md:hidden">
                  Details
                </h3>
              </div>

              {/* Mobile description */}
              <p className="md:hidden text-white/70 leading-relaxed mb-6">
                {activeProject.description}
              </p>

              {activeProject.warningType === 'infinity' && (
                <>
                  <p className="text-white/60 mb-4 leading-relaxed">
                    This project is hosted on <strong>InfinityFree</strong>. Browsers like Google Chrome often incorrectly flag these free hosting domains as deceptive or dangerous.
                  </p>

                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-4">
                    <p className="text-sm text-white/50 leading-relaxed">
                      <strong>How to access the site:</strong><br />
                      1. Click "Proceed to Website" below.<br />
                      2. If you see a red warning screen, click <strong>"Details"</strong>.<br />
                      3. Click <strong>"this unsafe site"</strong> at the bottom.
                    </p>
                  </div>
                </>
              )}

              {activeProject.warningType === 'vercel' && (
                <p className="text-white/60 mb-6 leading-relaxed">
                  This project was originally built with a PHP database backend but is currently hosted on <strong>Vercel</strong> for demonstration purposes. Because Vercel does not support native databases like this, the application is in <strong>view-only mode</strong>. Data operations like saving or editing will not work.
                </p>
              )}

              {activeProject.isDesktop && (
                <div className="bg-accent-slate/10 border border-accent-slate/20 rounded-xl p-4 mb-6">
                  <p className="text-white/80 leading-relaxed mb-2 font-display font-semibold">
                    Windows Desktop Application (.exe)
                  </p>
                  <p className="text-sm text-white/60 leading-relaxed">
                    This is a native Windows application built in Python. Clicking the download button will take you to Google Drive where you can securely download the <code>.exe</code> file. You will need a Windows PC to run this application.
                  </p>
                </div>
              )}

              {/* Highlighted Credentials */}
              {activeProject.credentials && (
                <div className="bg-accent-emerald/10 border border-accent-emerald/20 rounded-xl p-4 mb-8">
                  <p className="text-sm font-mono text-accent-emerald/90 leading-relaxed">
                    <span className="font-bold text-accent-emerald">Demo Credentials:</span><br />
                    Username: <span className="text-white bg-black/20 px-1.5 py-0.5 rounded select-all">{activeProject.credentials.username}</span><br />
                    Password: <span className="text-white bg-black/20 px-1.5 py-0.5 rounded select-all">{activeProject.credentials.password}</span>
                  </p>
                </div>
              )}

              <div className="mt-auto md:mt-0 flex flex-wrap gap-4 pt-6">
                <button
                  onClick={() => setActiveProject(null)}
                  className="flex-1 py-3 px-4 rounded-xl border border-white/[0.08] text-white/60 hover:bg-white/[0.03] hover:text-white transition-all font-semibold max-md:order-2"
                >
                  Close
                </button>
                <a
                  href={activeProject.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 text-center py-3 px-4 rounded-xl transition-all font-semibold max-md:order-1 flex items-center justify-center gap-2 ${activeProject.warningType === 'infinity' ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30' : 'bg-accent-emerald/20 border border-accent-emerald/30 text-accent-emerald hover:bg-accent-emerald/30'}`}
                >
                  {activeProject.isDesktop && <Download className="w-4 h-4" />}
                  {activeProject.isDesktop ? "Download .exe" : "Proceed to Website"}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl mx-auto mb-12 md:mb-20"
      >
        <p className="font-mono text-xs text-accent-emerald/60 tracking-[0.25em] uppercase mb-4">
          Featured Work
        </p>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white max-w-3xl leading-[1.05]">
          Selected projects,
          <br />
          <span className="text-white/20">shipped end to end.</span>
        </h2>
      </motion.div>

      {/* Container - Horizontal snap on mobile, grid on desktop */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-6xl mx-auto flex overflow-x-auto snap-x snap-mandatory pb-8 gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:pb-0 hide-scrollbar"
      >
        {projects.map((project, i) => (
          <ProjectCard
            key={project.title}
            project={project}
            index={i}
            onOpenWarning={setActiveProject}
          />
        ))}
      </motion.div>
    </section>
  );
}
