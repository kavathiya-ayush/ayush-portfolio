import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Send, Phone } from "lucide-react";

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/kavathiya-ayush/" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/ayush-kavathiya-223844396/" },
  { icon: Mail, label: "Email", href: "mailto:shivamsoftwaresolutions.in@gmail.com" },
  { icon: Phone, label: "Phone", href: "tel:9227098500" },
];

export default function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    // Grab form data
    const formData = new FormData(e.target);

    try {
      // Using FormSubmit.co for direct email delivery without an account
      const response = await fetch("https://formsubmit.co/ajax/shivamsoftwaresolutions.in@gmail.com", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setStatus("sent");
        e.target.reset(); // Clear the form
      } else {
        setStatus("idle");
        alert("Oops! There was a problem submitting your form");
      }
    } catch (error) {
      setStatus("idle");
      alert("Oops! There was a problem submitting your form");
    }

    setTimeout(() => setStatus("idle"), 3000);
  }

  return (
    <section id="contact" className="relative px-6 max-md:py-8 py-20 lg:py-32 w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl mx-auto"
      >
        <p className="font-mono text-xs text-accent-emerald/60 tracking-[0.25em] uppercase mb-4">
          Contact
        </p>
        <h2 className="font-display text-3xl sm:text-5xl lg:text-7xl font-bold text-white max-w-3xl mb-8 lg:mb-16 leading-[1.05]">
          Let's build something
          <br />
          <span className="text-white/20">worth shipping.</span>
        </h2>

        <div className="grid md:grid-cols-[1fr_1.4fr] gap-8">
          {/* Social / direct links */}
          <div className="flex md:flex-col gap-4">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-3 rounded-2xl void-card-sm px-6 py-5 hover:shadow-glow-slate transition-shadow duration-300"
              >
                <Icon className="w-6 h-6 text-white/40 group-hover:text-accent-slate transition-colors duration-300" />
                <span className="text-sm text-white/50 group-hover:text-white transition-colors duration-300">
                  {label}
                </span>
              </a>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="void-card rounded-2xl p-8 lg:p-12 space-y-5 lg:space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono text-white/30 mb-2">
                  Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  className="w-full rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3 lg:px-5 lg:py-4 text-sm lg:text-base text-white placeholder:text-white/15 focus:border-accent-slate/50 outline-none transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-white/30 mb-2">
                  Email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="jane@company.com"
                  className="w-full rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3 lg:px-5 lg:py-4 text-sm lg:text-base text-white placeholder:text-white/15 focus:border-accent-slate/50 outline-none transition-colors duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-white/30 mb-2">
                Message
              </label>
              <textarea
                required
                name="message"
                rows={4}
                placeholder="What are you building?"
                className="w-full rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3 lg:px-5 lg:py-4 text-sm lg:text-base text-white placeholder:text-white/15 focus:border-accent-slate/50 outline-none transition-colors duration-300 resize-none"
              />
            </div>

            <motion.button
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              disabled={status !== "idle"}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 lg:px-8 lg:py-4 text-sm lg:text-base font-semibold text-void hover:shadow-glow-emerald transition-shadow duration-300 disabled:opacity-60"
            >
              {status === "idle" && (
                <>
                  <Send className="w-4 h-4" /> Send Message
                </>
              )}
              {status === "sending" && "Sending…"}
              {status === "sent" && "Message sent ✓"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
