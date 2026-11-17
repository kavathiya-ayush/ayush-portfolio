import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Send, Phone, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import LiquidGlassCard from "../ui/LiquidGlassCard";
import { usePerformance } from "../../context/PerformanceContext";

const socials = [
  { icon: Mail, label: "Email", value: "shivamsoftwaresolutions.in@gmail.com", href: "mailto:shivamsoftwaresolutions.in@gmail.com", color: "gold" },
  { icon: Phone, label: "Phone", value: "+91 9227098500", href: "tel:9227098500", color: "sapphire" },
  { icon: Linkedin, label: "LinkedIn", value: "ayush-kavathiya", href: "https://www.linkedin.com/in/ayush-kavathiya-223844396/", color: "sapphire" },
  { icon: Github, label: "GitHub", value: "kavathiya-ayush", href: "https://github.com/kavathiya-ayush/", color: "gold" },
];

export default function Contact() {
  const { showToast, setIsResumeOpen } = usePerformance();
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.target);

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/shivamsoftwaresolutions.in@gmail.com",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        setStatus("sent");
        e.target.reset();
        showToast("🎉 Message sent successfully! Ayush will reply shortly.");
      } else {
        setStatus("idle");
        showToast("Could not send message. Please email directly.");
      }
    } catch (error) {
      setStatus("idle");
      showToast("Network error. Please email directly.");
    }

    setTimeout(() => setStatus("idle"), 4000);
  }

  return (
    <section id="contact" className="relative px-6 py-20 lg:py-32 w-full scroll-mt-28">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-gold/25 text-xs font-mono text-gold-light mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connect & Collaborate</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08]">
            Let's Discuss Internships, <br />
            <span className="text-white/30">Roles & Architecture.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/50 max-w-xl">
            Currently in Semester 6 B.Tech Computer Science and actively interviewing for Software Engineering and Full-Stack Internships.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8">
          {/* Left Column: Direct Links & Resume Trigger */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {socials.map(({ icon: Icon, label, value, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-3.5 p-4 rounded-2xl liquid-glass border border-white/10 hover:border-gold/40 hover:shadow-glass-gold transition-all duration-300"
                >
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gold-light group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-white/40">{label}</p>
                    <p className="text-sm font-medium text-white/90 truncate group-hover:text-gold-light transition-colors">
                      {value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Resume Callout Card */}
            <div className="p-6 rounded-2xl liquid-glass border border-gold/30 space-y-3 bg-gold/[0.03]">
              <div className="flex items-center gap-2 text-gold-light font-display font-semibold text-sm">
                <FileText className="w-4 h-4" />
                <span>Want to see my credentials first?</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Review my academic transcript, coursework, verified achievements, and complete resume breakdown.
              </p>
              <button
                onClick={() => setIsResumeOpen(true)}
                className="w-full py-2.5 rounded-xl bg-gold/15 border border-gold/30 text-gold-light hover:bg-gold/25 font-semibold text-xs transition-colors"
              >
                Open In-Browser Resume
              </button>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <LiquidGlassCard className="p-6 sm:p-10" glowColor="gold">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono text-white/40 mb-2">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    placeholder="Recruiter / Tech Lead"
                    className="w-full rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/40 mb-2">
                    Your Email
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="recruiting@company.com"
                    className="w-full rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-white/40 mb-2">
                  Message / Role Details
                </label>
                <textarea
                  required
                  name="message"
                  rows={4}
                  placeholder="Hi Ayush, we have an internship opening for Summer/Fall and would love to connect..."
                  className="w-full rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-all duration-200 resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
                disabled={status !== "idle"}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-gold to-gold-amber text-obsidian font-bold text-sm sm:text-base shadow-glow-gold hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {status === "idle" && (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Ayush</span>
                  </>
                )}
                {status === "sending" && "Transmitting message…"}
                {status === "sent" && "Delivered ✓"}
              </motion.button>
            </form>
          </LiquidGlassCard>
        </div>
      </div>
    </section>
  );
}
