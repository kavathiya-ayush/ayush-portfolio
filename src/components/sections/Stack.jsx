import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { stackCategories, bcaFoundations, profile } from "../../data/portfolio";
import { playTactileClick } from "../../utils/audio";

function slugifyTab(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

const STACK_CATEGORY_NAMES = ["All", ...stackCategories.map((c) => c.category)];

export default function Stack() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeSkillName, setActiveSkillName] = useState("React");
  const tabRefs = useRef([]);

  const categories = STACK_CATEGORY_NAMES;

  const allSkillsMap = useMemo(() => {
    const map = new Map();
    stackCategories.forEach((group) => {
      group.items.forEach((item) => {
        map.set(item.name, { ...item, category: group.category });
      });
    });
    return map;
  }, []);

  const displayedCategories = useMemo(
    () =>
      selectedCategory === "All"
        ? stackCategories
        : stackCategories.filter((c) => c.category === selectedCategory),
    [selectedCategory]
  );

  const activeSkill = allSkillsMap.get(activeSkillName) || stackCategories[0].items[0];
  const relatedSet = useMemo(() => new Set(activeSkill?.related || []), [activeSkill]);
  const activeTabId = `stack-tab-${slugifyTab(selectedCategory)}`;

  const handleTabKeyDown = (e, idx) => {
    const lastIdx = categories.length - 1;
    let nextIdx = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      nextIdx = idx === lastIdx ? 0 : idx + 1;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      nextIdx = idx === 0 ? lastIdx : idx - 1;
    } else if (e.key === "Home") {
      nextIdx = 0;
    } else if (e.key === "End") {
      nextIdx = lastIdx;
    }

    if (nextIdx !== null) {
      e.preventDefault();
      setSelectedCategory(categories[nextIdx]);
      tabRefs.current[nextIdx]?.focus();
    }
  };

  return (
    <section
      id="skills"
      className="relative px-5 sm:px-10 py-24 sm:py-28 lg:py-32 scroll-mt-24 border-t border-porcelain/[0.07]"
    >
      <div className="max-w-[1320px] mx-auto">
        {/* ── Section Heading ── */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="pb-12 sm:pb-16 border-b border-porcelain/[0.1] flex flex-col lg:flex-row lg:items-end justify-between gap-6"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-champagne">
              <span>04</span>
              <span className="w-8 h-px bg-champagne/45" />
              <span>Technical Index</span>
            </div>

            <h2 className="font-serif text-editorial-lg font-light text-porcelain">
              Engineering <span className="italic text-champagne-pale">Toolkit.</span>
            </h2>
          </div>

          <p className="text-sm text-stone max-w-md font-light leading-relaxed">
            Hover, focus, or select any technology in the index to inspect how it is applied and highlight related tools across the stack.
          </p>
        </motion.div>

        {/* ── Asymmetric 12-Column Interactive Index ── */}
        <div className="pt-12 sm:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Sticky Filter & Live Focus Readout (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-10">
            {/* WAI-ARIA Compliant Vertical Editorial Category Selector */}
            <div className="space-y-2">
              <p
                id="stack-filter-label"
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-dark mb-3"
              >
                Index Filter
              </p>
              <div
                role="tablist"
                aria-labelledby="stack-filter-label"
                className="flex flex-wrap lg:flex-col gap-1.5"
              >
                {categories.map((cat, idx) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      ref={(el) => {
                        tabRefs.current[idx] = el;
                      }}
                      id={`stack-tab-${slugifyTab(cat)}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls="stack-tabpanel"
                      tabIndex={isActive ? 0 : -1}
                      data-cursor="magnetic"
                      onKeyDown={(e) => handleTabKeyDown(e, idx)}
                      onClick={() => {
                        playTactileClick("light");
                        setSelectedCategory(cat);
                      }}
                      className={`group flex items-center justify-between text-left px-3.5 py-2.5 rounded-lg lg:rounded-none lg:px-0 lg:py-2 lg:border-b transition-colors duration-200 ${
                        isActive
                          ? "bg-porcelain/[0.06] lg:bg-transparent lg:border-champagne text-porcelain"
                          : "border-porcelain/[0.08] text-stone hover:text-porcelain"
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-sans tracking-wide">
                        {cat}
                      </span>
                      <span
                        className={`hidden lg:inline-block w-1.5 h-1.5 rounded-full transition-opacity ${
                          isActive ? "bg-champagne opacity-100" : "opacity-0"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Technology Focus Readout */}
            <div
              aria-live="polite"
              className="p-6 sm:p-7 bg-obsidian-elevated border border-porcelain/[0.1] space-y-4"
            >
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-champagne">
                <span>Selected Entry</span>
                <span className="text-stone-dark">{activeSkill?.category}</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSkill?.name}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: shouldReduceMotion ? 0.12 : 0.22 }}
                  className="space-y-3"
                >
                  <h3 className="font-serif text-3xl font-light text-porcelain">
                    {activeSkill?.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone leading-[1.7] font-light">
                    {activeSkill?.context}
                  </p>
                  {activeSkill?.related?.length > 0 && (
                    <div className="pt-3 border-t border-porcelain/[0.08]">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-stone-dark mb-2">
                        Paired Frequently With
                      </span>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-champagne-light/90">
                        {activeSkill.related.map((rel) => (
                          <button
                            key={rel}
                            type="button"
                            data-cursor="magnetic"
                            onClick={() => setActiveSkillName(rel)}
                            className="hover:underline"
                          >
                            {rel}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Typographic Hairline Ledger (Tabpanel — 7 cols) */}
          <div
            id="stack-tabpanel"
            role="tabpanel"
            aria-labelledby={activeTabId}
            className="lg:col-span-7 space-y-12"
          >
            <AnimatePresence mode="popLayout">
              {displayedCategories.map((group) => (
                <motion.div
                  key={group.id}
                  layout={!shouldReduceMotion}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                  transition={{ duration: shouldReduceMotion ? 0.15 : 0.35 }}
                  className="space-y-3"
                >
                  {/* Group Subheader */}
                  <div className="flex items-baseline justify-between pb-3 border-b border-porcelain/[0.14]">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] text-champagne">
                        {group.index}
                      </span>
                      <h3 className="font-serif text-2xl sm:text-[26px] font-light text-porcelain">
                        {group.category}
                      </h3>
                    </div>
                    <span className="hidden sm:inline font-mono text-[10.5px] text-stone-dark">
                      {group.items.length} entries
                    </span>
                  </div>

                  {/* Interactive Hairline Skill Rows */}
                  <div className="divide-y divide-porcelain/[0.08]">
                    {group.items.map((skill) => {
                      const isSelected = activeSkill?.name === skill.name;
                      const isRelated = relatedSet.has(skill.name);
                      return (
                        <button
                          key={skill.name}
                          type="button"
                          onMouseEnter={() => setActiveSkillName(skill.name)}
                          onFocus={() => setActiveSkillName(skill.name)}
                          onClick={() => {
                            playTactileClick("light");
                            setActiveSkillName(skill.name);
                          }}
                          data-cursor="magnetic"
                          className={`group w-full text-left py-4 sm:py-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6 transition-[padding-left,border-color,color] duration-300 ${
                            isSelected
                              ? "pl-3 border-l border-champagne"
                              : isRelated
                              ? "pl-2 border-l border-champagne/40"
                              : "pl-0"
                          }`}
                        >
                          <div className="flex items-center gap-3 shrink-0">
                            <span
                              className={`font-sans text-base sm:text-lg tracking-tight transition-colors duration-200 ${
                                isSelected
                                  ? "text-champagne-pale font-medium"
                                  : isRelated
                                  ? "text-porcelain"
                                  : "text-porcelain/80 group-hover:text-porcelain"
                              }`}
                            >
                              {skill.name}
                            </span>
                            {isRelated && !isSelected && (
                              <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-champagne/80">
                                linked
                              </span>
                            )}
                          </div>

                          <span className="text-xs text-stone-dark sm:text-right leading-relaxed max-w-sm group-hover:text-stone transition-colors">
                            {skill.context}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Obsidian Atelier Academic Grounding Plate ── */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 sm:mt-20 relative bg-obsidian-elevated border border-porcelain/[0.11]"
        >
          {/* Architectural Corner Registration Marks */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-px -left-px w-3.5 h-3.5 border-t border-l border-champagne/60"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-px -right-px w-3.5 h-3.5 border-t border-r border-champagne/60"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-px -left-px w-3.5 h-3.5 border-b border-l border-champagne/60"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-px -right-px w-3.5 h-3.5 border-b border-r border-champagne/60"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Identity Anchor (4 cols) */}
            <div className="lg:col-span-4 p-7 sm:p-9 border-b lg:border-b-0 lg:border-r border-porcelain/[0.09] flex flex-col justify-between gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-champagne">
                  <span>BCA Coursework</span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl font-light text-porcelain leading-[1.08]">
                  Academic <span className="italic text-champagne-pale">Grounding.</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone font-light leading-relaxed pt-1">
                  Core foundations studied at {profile.university} ({profile.studyPeriod}) and applied directly across shipped web and desktop software.
                </p>
              </div>

              <div className="pt-5 border-t border-porcelain/[0.08] space-y-1.5 font-mono text-[11px]">
                <span className="block uppercase tracking-[0.18em] text-stone-dark">
                  Languages Spoken
                </span>
                <p className="text-porcelain/90 tracking-wide">
                  {profile.languages.join("  ·  ")}
                </p>
              </div>
            </div>

            {/* Right 2x3 Hairline-Ruled Foundation Matrix (8 cols) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-porcelain/[0.08]">
              {bcaFoundations.map((item) => (
                <div
                  key={item.index}
                  className="group bg-obsidian-elevated p-6 sm:p-7 flex flex-col justify-between gap-4 transition-colors duration-300 hover:bg-[#16161B]"
                >
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-champagne tracking-[0.18em]">
                      {item.index}
                    </span>
                    <span
                      aria-hidden="true"
                      className="w-1.5 h-1.5 rotate-45 border border-porcelain/25 group-hover:border-champagne group-hover:bg-champagne/30 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-serif text-xl font-normal text-porcelain group-hover:text-champagne-pale transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-stone font-light leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
