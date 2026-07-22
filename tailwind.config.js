/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // ── Charcoal + Emerald color system ──
      // Deep charcoal base with a cool blue undertone for depth,
      // paired with clean emerald accents for a modern tech/startup feel.
      colors: {
        void: {
          DEFAULT: "#0F0F1A",
          50: "#141422",
          100: "#1A1A2E",
          200: "#222240",
          300: "#2A2A4A",
          400: "#333355",
        },
        accent: {
          emerald: "#10B981",
          "emerald-bright": "#34D399",
          "emerald-dim": "rgba(16,185,129,0.15)",
          slate: "#94A3B8",
          "slate-dim": "rgba(148,163,184,0.15)",
        },
        glass: {
          50: "rgba(255,255,255,0.03)",
          100: "rgba(255,255,255,0.05)",
          200: "rgba(255,255,255,0.08)",
          border: "rgba(255,255,255,0.07)",
          "border-hover": "rgba(255,255,255,0.16)",
        },
      },

      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },

      fontSize: {
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "0.95" }],
        "10xl": ["10rem", { lineHeight: "0.9" }],
        hero: ["clamp(2.4rem, 6vw, 5.5rem)", { lineHeight: "0.95" }],
      },

      backdropBlur: {
        xs: "2px",
        glass: "20px",
        heavy: "40px",
      },

      // ── Glow elevation — emerald-based ──
      boxShadow: {
        "void-sm":
          "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.7)",
        "void-lg":
          "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 60px -20px rgba(0,0,0,0.8)",
        "glow-emerald":
          "0 0 0 1px rgba(16,185,129,0.25), 0 0 40px -8px rgba(16,185,129,0.35)",
        "glow-emerald-lg":
          "0 0 0 1px rgba(16,185,129,0.35), 0 0 80px -10px rgba(16,185,129,0.45)",
        "glow-slate":
          "0 0 0 1px rgba(148,163,184,0.2), 0 0 30px -6px rgba(148,163,184,0.25)",
        "glow-mixed":
          "0 0 30px -8px rgba(16,185,129,0.25), 0 0 30px -8px rgba(148,163,184,0.2)",
      },

      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
        "mesh-hero":
          "radial-gradient(60% 50% at 15% 20%, rgba(16,185,129,0.12) 0%, transparent 60%), radial-gradient(50% 50% at 85% 25%, rgba(148,163,184,0.08) 0%, transparent 60%), radial-gradient(70% 60% at 50% 100%, rgba(16,185,129,0.06) 0%, transparent 60%)",
        "conic-glow":
          "conic-gradient(from 0deg, #10B981, #94A3B8, #10B981)",
      },

      // ── Keyframes ──
      keyframes: {
        antigravity: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "antigravity-delayed": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "counter-glow": {
          "0%, 100%": { textShadow: "0 0 20px rgba(16,185,129,0.3)" },
          "50%": { textShadow: "0 0 60px rgba(16,185,129,0.6), 0 0 120px rgba(16,185,129,0.2)" },
        },
        "border-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.5" },
          "50%": { transform: "translateY(8px)", opacity: "1" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },

      animation: {
        antigravity: "antigravity 8s ease-in-out infinite",
        "antigravity-slow": "antigravity 10s ease-in-out infinite",
        "antigravity-delayed": "antigravity-delayed 7s ease-in-out 2s infinite",
        "counter-glow": "counter-glow 1.2s ease-in-out infinite",
        "border-spin": "border-spin 6s linear infinite",
        "bounce-subtle": "bounce-subtle 2.5s ease-in-out infinite",
        blink: "blink 1s step-end infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
