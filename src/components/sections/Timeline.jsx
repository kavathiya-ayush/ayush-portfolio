import { motion } from "framer-motion";
import { GraduationCap, Calendar, Sparkles, CheckCircle2 } from "lucide-react";
import LiquidGlassCard from "../ui/LiquidGlassCard";
import { timelineEvents } from "../../data/portfolio";

export default function Timeline() {
  return (
    <section id="journey" className="relative px-6 py-20 lg:py-28 w-full scroll-mt-28">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-left mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-gold/25 text-xs font-mono text-gold-light mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic & Development Path</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.08]">
            Semester 6 Journey, <br />
            <span className="text-white/30">Milestones & Growth.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/50 max-w-xl">
            A chronological timeline of hands-on software development alongside rigorous Computer Science engineering coursework.
          </p>
        </motion.div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l border-white/10 space-y-10 sm:space-y-12">
          {timelineEvents.map((event, idx) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative"
            >
              {/* Glowing Timeline Node */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 ${
                  event.badgeColor === "gold"
                    ? "bg-gold-light border-obsidian shadow-glow-gold"
                    : "bg-sapphire-light border-obsidian shadow-glow-sapphire"
                }`}
              />

              <LiquidGlassCard
                glowColor={event.badgeColor}
                className="p-5 sm:p-7"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-gold-light">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{event.period}</span>
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                      event.badgeColor === "gold"
                        ? "bg-gold/10 text-gold-light border-gold/30"
                        : "bg-sapphire/10 text-sapphire-light border-sapphire/30"
                    }`}
                  >
                    {event.tag}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                  {event.title}
                </h3>
                <p className="text-xs sm:text-sm font-mono text-white/40 mb-3">
                  {event.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                  {event.description}
                </p>
              </LiquidGlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

