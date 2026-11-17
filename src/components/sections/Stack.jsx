import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Layers, CheckCircle2 } from "lucide-react";
import LiquidGlassCard from "../ui/LiquidGlassCard";
import { stackCategories } from "../../data/portfolio";
import { playTactileClick } from "../../utils/audio";

export default function Stack() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...stackCategories.map((c) => c.category)];

  const displayedCategories =
    selectedCategory === "All"
      ? stackCategories
      : stackCategories.filter((c) => c.category === selectedCategory);

  const getProficiencyStyle = (prof) => {
    switch (prof) {
      case "Expert":
        return {
          badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
          bar: "w-full bg-gradient-to-r from-emerald-400 to-teal-300",
          pct: "95%",
        };
      case "Advanced":
        return {
          badge: "bg-gold/15 text-gold-light border-gold/30 shadow-glass-gold",
          bar: "w-[85%] bg-gradient-to-r from-gold to-gold-amber",
          pct: "88%",
        };
      default:
        return {
          badge: "bg-sapphire/15 text-sapphire-light border-sapphire/30",
          bar: "w-[72%] bg-gradient-to-r from-sapphire to-sapphire-light",
          pct: "75%",
        };
    }
  };

  return (
    <section id="skills" className="relative px-6 py-20 lg:py-28 w-full scroll-mt-28">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-gold/25 text-xs font-mono text-gold-light mb-3 shadow-glass-gold">
            <Layers className="w-3.5 h-3.5" />
            <span>Technical Arsenal</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08]">
            Core Stack & <br />
            <span className="text-white/30">Engineering Depth.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/50 max-w-xl">
            A comprehensive breakdown of tools, frameworks, and Computer Science fundamentals I apply across production environments.
          </p>

          {/* Apple visionOS Segment Filter Tabs */}
          <div className="mt-8 inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl liquid-glass border border-white/10 shadow-lg">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    playTactileClick("light");
                    setSelectedCategory(cat);
                  }}
                  className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-white font-semibold" : "text-white/60 hover:text-white"
                  }`}
                >
                  <span className="relative z-10">{cat}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeStackCategoryPill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/25 to-gold-amber/20 border border-gold/40 shadow-glass-gold -z-0"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Categorized Grid */}
        <div className="space-y-12">
          <AnimatePresence mode="popLayout">
            {displayedCategories.map((group) => (
              <motion.div
                key={group.category}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="space-y-5"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
                      {group.category}
                    </h3>
                    <p className="text-xs font-mono text-white/45 mt-0.5">{group.description}</p>
                  </div>
                  <span className="text-[11px] font-mono text-gold-light/90 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
                    {group.items.length} technologies
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((skill) => {
                    const Icon = skill.icon;
                    const { badge, bar, pct } = getProficiencyStyle(skill.proficiency);
                    return (
                      <LiquidGlassCard
                        key={skill.name}
                        className="p-5 flex items-start gap-4 group"
                        glowColor="gold"
                      >
                        {/* Apple Squircle Icon Box */}
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-white/[0.08] via-white/[0.04] to-transparent border border-white/15 flex items-center justify-center shrink-0 shadow-glass-sm group-hover:scale-105 group-hover:border-gold/40 transition-all duration-300">
                          <Icon className="w-5 h-5 text-gold-light group-hover:text-white transition-colors" />
                        </div>

                        {/* Skill Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-display font-semibold text-white text-base tracking-tight truncate group-hover:text-gold-light transition-colors">
                              {skill.name}
                            </h4>
                            <span
                              className={`text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full border shrink-0 ${badge}`}
                            >
                              {skill.proficiency}
                            </span>
                          </div>

                          <p className="text-xs text-white/55 mt-1.5 leading-relaxed font-sans line-clamp-2">
                            {skill.desc}
                          </p>

                          {/* Apple VisionOS Micro-Level Progress Bar */}
                          <div className="mt-3.5 flex items-center gap-2">
                            <div className="h-1 flex-1 rounded-full bg-white/[0.08] overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${bar}`}
                              />
                            </div>
                            <span className="text-[9px] font-mono text-white/40">{pct}</span>
                          </div>
                        </div>
                      </LiquidGlassCard>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Computer Science Fundamentals Pill Banner */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-16 p-6 sm:p-8 rounded-3xl liquid-glass border border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Ambient Specular Bevel */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold-light/40 to-transparent" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <span className="text-xs font-mono text-gold-light uppercase tracking-wider block mb-1">
                Semester 6 Foundations
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                Computer Science Academic Grounding
              </h3>
              <p className="text-xs sm:text-sm text-white/50 mt-1 max-w-xl">
                Rigorous coursework and theoretical mastery applied directly to write efficient, bug-resistant software.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 max-w-md">
              {[
                "Data Structures & Algorithms",
                "Relational DBMS & ACID",
                "Operating Systems & Memory",
                "Computer Networks & Sockets",
                "Clean Architecture & OOP",
                "Git Flow & Version Control",
              ].map((subject) => (
                <span
                  key={subject}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-white/80 hover:border-gold/30 hover:text-white transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-light shrink-0" />
                  <span>{subject}</span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
