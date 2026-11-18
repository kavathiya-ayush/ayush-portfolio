import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  FileText,
  Download,
  Check,
  AlertCircle,
  Copy,
} from "lucide-react";
import { usePerformanceActions } from "../../context/PerformanceContext";
import { playTactileClick } from "../../utils/audio";
import { loadResumeModal } from "../../utils/prefetch";
import Magnetic from "../ui/Magnetic";
import { profile } from "../../data/portfolio";

const directChannels = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    external: false,
    copyable: true,
  },
  {
    label: "Phone",
    value: profile.phone,
    href: profile.phoneHref,
    external: false,
    copyable: true,
  },
  {
    label: "LinkedIn",
    value: profile.linkedinHandle,
    href: profile.linkedin,
    external: true,
    copyable: false,
  },
  {
    label: "GitHub",
    value: profile.githubHandle,
    href: profile.github,
    external: true,
    copyable: false,
  },
];

export default function Contact() {
  const shouldReduceMotion = useReducedMotion();
  const { showToast, setIsResumeOpen } = usePerformanceActions();

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    message: "",
    honey: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedLabel, setCopiedLabel] = useState(null);

  const handleFieldChange = (field) => (e) => {
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (status === "error") {
      setStatus("idle");
      setErrorMsg("");
    }
  };

  const handleCopyChannel = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedLabel(label);
      playTactileClick("success");
      showToast(`Copied ${label}: ${value}`);
      setTimeout(() => setCopiedLabel(null), 2200);
    } catch {
      showToast(`${label}: ${value}`);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    const trimmedName = formValues.name.trim();
    const trimmedEmail = formValues.email.trim();
    const trimmedMessage = formValues.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setStatus("error");
      setErrorMsg("Please fill out your name, email address, and message.");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${profile.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            message: trimmedMessage,
            _subject: `Portfolio Inquiry from ${trimmedName}`,
            _template: "table",
            _honey: formValues.honey,
          }),
        }
      );

      const payload = await response.json().catch(() => null);
      const isConfirmed =
        response.ok &&
        (payload?.success === "true" || payload?.success === true);

      if (isConfirmed) {
        setStatus("sent");
        setFormValues({ name: "", email: "", message: "", honey: "" });
        playTactileClick("success");
        showToast("Message delivered — Ayush will respond shortly");
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        const serverDetail =
          typeof payload?.message === "string" && payload.message.trim()
            ? payload.message.trim()
            : "Delivery could not be confirmed right now. Your message is still preserved below—please retry or send via email directly.";
        setErrorMsg(serverDetail);
        showToast("Delivery not confirmed — your draft is preserved");
      }
    } catch {
      setStatus("error");
      setErrorMsg(
        "Network error while reaching the form service. Your draft has been preserved—please retry or email directly."
      );
      showToast("Network error — your draft is preserved");
    }
  }

  const fallbackMailto = `mailto:${profile.email}?subject=${encodeURIComponent(
    formValues.name ? `Portfolio Inquiry from ${formValues.name}` : "Portfolio Inquiry"
  )}&body=${encodeURIComponent(formValues.message || "")}`;

  return (
    <section
      id="contact"
      className="relative px-5 sm:px-10 py-24 sm:py-32 lg:py-40 scroll-mt-24 border-t border-porcelain/[0.08]"
    >
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-start">
          {/* ── Left Closing Chapter Copy & Direct Directory (5 cols) ── */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-champagne">
                <span>06</span>
                <span className="w-8 h-px bg-champagne/45" />
                <span>Correspondence</span>
              </div>

              <h2 className="font-serif text-editorial-lg font-light text-porcelain">
                Let&apos;s build <br />
                <span className="italic text-champagne-pale">something useful.</span>
              </h2>

              <p className="text-sm sm:text-[15px] text-stone leading-[1.75] font-light max-w-md">
                {profile.degree} — looking forward to my first industry work
                experience and open to software &amp; web developer internships.
              </p>
            </div>

            {/* Direct Hairline Contact Directory with Copy-to-Clipboard Actions */}
            <div className="border-t border-porcelain/[0.1] divide-y divide-porcelain/[0.08]">
              {directChannels.map((ch) => (
                <div
                  key={ch.label}
                  className="py-4 flex items-center justify-between gap-3"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-dark shrink-0">
                    {ch.label}
                  </span>

                  <div className="flex items-center gap-2 min-w-0">
                    <a
                      href={ch.href}
                      target={ch.external ? "_blank" : undefined}
                      rel={ch.external ? "noopener noreferrer" : undefined}
                      data-cursor="magnetic"
                      className="group inline-flex items-center gap-1.5 text-xs sm:text-sm text-porcelain/90 hover:text-champagne-light transition-colors truncate"
                    >
                      <span className="truncate">{ch.value}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-stone-dark group-hover:text-champagne-light group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none transition-all" />
                    </a>

                    {ch.copyable && (
                      <button
                        type="button"
                        data-cursor="magnetic"
                        onClick={() => handleCopyChannel(ch.value, ch.label)}
                        aria-label={`Copy ${ch.label}: ${ch.value}`}
                        title={`Copy ${ch.label}`}
                        className="shrink-0 p-1.5 rounded-full border border-porcelain/12 text-stone hover:text-champagne-light hover:border-champagne/45 transition-colors"
                      >
                        {copiedLabel === ch.label ? (
                          <Check className="w-3.5 h-3.5 text-champagne-light" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Real PDF View & Download Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Magnetic strength={0.18} maxOffset={5}>
                <button
                  type="button"
                  data-cursor="magnetic"
                  onPointerEnter={loadResumeModal}
                  onFocus={loadResumeModal}
                  onClick={() => {
                    playTactileClick("light");
                    setIsResumeOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-champagne/35 bg-champagne/[0.06] hover:bg-champagne/[0.14] px-5 py-3 text-xs font-mono tracking-wider text-champagne-light transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Resume PDF</span>
                </button>
              </Magnetic>

              <Magnetic strength={0.18} maxOffset={5}>
                <a
                  href={profile.resumePath}
                  download={profile.resumeDownloadName}
                  data-cursor="magnetic"
                  onClick={() => {
                    playTactileClick("success");
                    showToast(`Downloading ${profile.resumeDownloadName}`);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-porcelain/15 hover:border-champagne/45 px-5 py-3 text-xs font-mono tracking-wider text-porcelain/90 hover:text-champagne-light transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </Magnetic>
            </div>
          </motion.div>

          {/* ── Right Architectural Contact Form (7 cols) ── */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: shouldReduceMotion ? 0.2 : 0.75,
              delay: shouldReduceMotion ? 0 : 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="lg:col-span-7 bg-obsidian-elevated border border-porcelain/[0.1] p-7 sm:p-11"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-6 mb-8 border-b border-porcelain/[0.08] font-mono text-[11px] uppercase tracking-[0.18em] text-stone-dark">
              <span>Direct Inquiry Form</span>
              <span className="text-champagne/90 normal-case tracking-normal">
                {profile.email}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              <input
                type="text"
                name="_honey"
                tabIndex={-1}
                autoComplete="off"
                value={formValues.honey}
                onChange={handleFieldChange("honey")}
                className="hidden"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="group relative">
                  <label
                    htmlFor="contact-name"
                    className="block font-mono text-[11px] uppercase tracking-[0.18em] text-stone-dark group-focus-within:text-champagne transition-colors mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    required
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleFieldChange("name")}
                    placeholder="Your name"
                    className="w-full bg-transparent border-b border-porcelain/15 focus:border-champagne py-3 text-sm text-porcelain placeholder:text-stone-dark/80 outline-none transition-colors duration-300"
                  />
                </div>

                <div className="group relative">
                  <label
                    htmlFor="contact-email"
                    className="block font-mono text-[11px] uppercase tracking-[0.18em] text-stone-dark group-focus-within:text-champagne transition-colors mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    required
                    type="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleFieldChange("email")}
                    placeholder="you@company.com"
                    className="w-full bg-transparent border-b border-porcelain/15 focus:border-champagne py-3 text-sm text-porcelain placeholder:text-stone-dark/80 outline-none transition-colors duration-300"
                  />
                </div>
              </div>

              <div className="group relative">
                <label
                  htmlFor="contact-message"
                  className="block font-mono text-[11px] uppercase tracking-[0.18em] text-stone-dark group-focus-within:text-champagne transition-colors mb-2"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  name="message"
                  rows={4}
                  value={formValues.message}
                  onChange={handleFieldChange("message")}
                  placeholder="Share internship details, project context, or a brief introduction..."
                  className="w-full bg-transparent border-b border-porcelain/15 focus:border-champagne py-3 text-sm text-porcelain placeholder:text-stone-dark/80 outline-none transition-colors duration-300 resize-none"
                />
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="p-4 rounded-xl border border-champagne/30 bg-champagne/[0.05] text-xs space-y-2"
                >
                  <div className="flex items-start gap-2 text-champagne-light leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                  <a
                    href={fallbackMailto}
                    data-cursor="magnetic"
                    className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-porcelain hover:text-champagne-light underline"
                  >
                    <span>Send this draft via your email client</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Magnetic strength={0.18} maxOffset={5}>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    data-cursor="magnetic"
                    className="inline-flex items-center justify-center gap-2.5 rounded-full bg-porcelain text-obsidian px-7 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wide hover:bg-champagne-pale transition-colors disabled:opacity-60"
                  >
                    {status === "idle" || status === "error" ? (
                      <>
                        <span>Send Message</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </>
                    ) : null}
                    {status === "sending" && <span>Sending...</span>}
                    {status === "sent" && (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Delivered</span>
                      </>
                    )}
                  </button>
                </Magnetic>

                <span className="font-mono text-[11px] text-stone-dark">
                  Replies directly to your email
                </span>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
