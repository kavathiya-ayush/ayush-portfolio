import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import LiquidGlassCard from "../ui/LiquidGlassCard";
import { whyHireMe } from "../../data/portfolio";

export default function WhyHireMe() {
  return (
    <section className="relative px-6 py-16 lg:py-24 w-full">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-left mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-gold/25 text-xs font-mono text-gold-light mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recruiter Fast-Track</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08]">
            Why Hire Ayush <br className="hidden sm:inline" />
            <span className="text-white/30">as an Engineering Intern?</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/50 max-w-xl">
            A rapid overview of technical maturity, cross-platform adaptability, and commitment to shipping reliable code from day one.
          </p>
        </motion.div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {whyHireMe.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
              >
                <LiquidGlassCard
                  glowColor={item.color}
                  className="p-6 sm:p-8 h-full flex flex-col justify-between"
                >
                  <div>
                    {/* Top Metric & Icon Bar */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gold-light">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-display font-black text-2xl sm:text-3xl ${
                            item.color === "gold" ? "text-gold-light" : "text-sapphire-light"
                          }`}
                        >
                          {item.stat}
                        </span>
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                          {item.statLabel}
                        </p>
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-xl text-white mb-3 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center gap-1.5 text-xs font-mono text-white/40 group-hover:text-gold-light transition-colors">
                    <span>Verified in projects</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </LiquidGlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

