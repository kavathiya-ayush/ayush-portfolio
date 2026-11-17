import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Layers, CheckCircle2 } from "lucide-react";
import LiquidGlassCard from "../ui/LiquidGlassCard";
import { stackCategories } from "../../data/portfolio";

export default function Stack() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...stackCategories.map((c) => c.category)];

  const displayedCategories =
    selectedCategory === "All"
      ? stackCategories
      : stackCategories.filter((c) => c.category === selectedCategory);

  return (
    <section id="skills" className="relative px-6 py-20 lg:py-28 w-full">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-gold/25 text-xs font-mono text-gold-light mb-3">
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

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-gold-light bg-gold/15 border border-gold/40 shadow-glass-gold"
                      : "text-white/60 bg-white/[0.03] border border-white/[0.06] hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Categorized Grid */}
        <div className="space-y-10">
          <AnimatePresence mode="popLayout">
            {displayedCategories.map((group) => (
              <motion.div
                key={group.category}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="font-display font-bold text-xl text-white">
                    {group.category}
                  </h3>
                  <p className="text-xs font-mono text-white/40">{group.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((skill) => {
                    const Icon = skill.icon;
                    return (
                      <LiquidGlassCard
                        key={skill.name}
                        className="p-4 sm:p-5 flex items-start gap-3.5"
                        glowColor="gold"
                      >
                        <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-gold-light shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-display font-semibold text-white text-sm sm:text-base truncate">
                              {skill.name}
                            </h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gold/10 text-gold-light border border-gold/20 shrink-0">
                              {skill.proficiency}
                            </span>
                          </div>
                          <p className="text-xs text-white/50 mt-1 leading-snug">
                            {skill.desc}
                          </p>
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
          className="mt-14 p-6 sm:p-8 rounded-3xl liquid-glass border border-white/10"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-white/70"
                >
                  <CheckCircle2 className="w-3 h-3 text-gold-light shrink-0" />
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
