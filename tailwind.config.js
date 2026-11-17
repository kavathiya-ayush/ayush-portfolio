/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // ── Pure Luxury Palette: Royal Obsidian, Champagne Gold & Liquid Sapphire ──
      colors: {
        // Deep obsidian canvas with rich indigo/prussian undertones
        obsidian: {
          DEFAULT: "#060814",
          50: "#0A0E24",
          100: "#101636",
          200: "#18204B",
          300: "#222D68",
          400: "#2F3D8C",
        },
        // Backward-compatibility alias for void
        void: {
          DEFAULT: "#060814",
          50: "#0A0E24",
          100: "#101636",
          200: "#18204B",
          300: "#222D68",
          400: "#2F3D8C",
        },
        // Refined Champagne Gold & Warm Amber
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F3D082",
          amber: "#E5A93C",
          shimmer: "#FFF3D6",
          dim: "rgba(212, 175, 55, 0.12)",
          glow: "rgba(212, 175, 55, 0.35)",
        },
        // Liquid Sapphire & Electric Cyan
        sapphire: {
          DEFAULT: "#2563EB",
          light: "#38BDF8",
          deep: "#0B1536",
          dim: "rgba(56, 189, 248, 0.12)",
          glow: "rgba(56, 189, 248, 0.35)",
        },
        // Backward-compatibility alias for accent
        accent: {
          gold: "#D4AF37",
          "gold-bright": "#F3D082",
          "gold-dim": "rgba(212, 175, 55, 0.15)",
          emerald: "#D4AF37", // smoothly redirects legacy emerald calls to champagne gold
          "emerald-bright": "#F3D082",
          "emerald-dim": "rgba(212, 175, 55, 0.15)",
          slate: "#38BDF8",
          "slate-dim": "rgba(56, 189, 248, 0.15)",
        },
        // Apple iOS & visionOS Liquid Glass Surface Values
        glass: {
          50: "rgba(255, 255, 255, 0.03)",
          100: "rgba(255, 255, 255, 0.06)",
          200: "rgba(255, 255, 255, 0.10)",
          border: "rgba(255, 255, 255, 0.09)",
          "border-hover": "rgba(212, 175, 55, 0.4)",
          "border-sapphire": "rgba(56, 189, 248, 0.4)",
          specular: "rgba(255, 255, 255, 0.25)",
        },
      },

      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Inter'", "sans-serif"],
        display: ["'Space Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },

      fontSize: {
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "0.95" }],
        "10xl": ["10rem", { lineHeight: "0.9" }],
        hero: ["clamp(2.6rem, 6.5vw, 5.8rem)", { lineHeight: "0.95" }],
      },

      backdropBlur: {
        xs: "3px",
        glass: "20px",
        heavy: "36px",
      },

      // ── Specular & Ambient Glow Shadows ──
      boxShadow: {
        "glass-sm":
          "0 1px 0 0 rgba(255, 255, 255, 0.15) inset, 0 10px 30px -10px rgba(0, 0, 0, 0.6)",
        "glass-lg":
          "0 1px 1px 0 rgba(255, 255, 255, 0.22) inset, 0 24px 60px -15px rgba(0, 0, 0, 0.75)",
        "glass-gold":
          "0 1px 1px 0 rgba(243, 208, 130, 0.3) inset, 0 0 40px -10px rgba(212, 175, 55, 0.3)",
        "glass-sapphire":
          "0 1px 1px 0 rgba(56, 189, 248, 0.3) inset, 0 0 40px -10px rgba(56, 189, 248, 0.3)",
        "void-sm":
          "0 1px 0 0 rgba(255, 255, 255, 0.08) inset, 0 8px 24px -12px rgba(0, 0, 0, 0.7)",
        "void-lg":
          "0 1px 0 0 rgba(255, 255, 255, 0.12) inset, 0 24px 60px -20px rgba(0, 0, 0, 0.8)",
        "glow-gold":
          "0 0 0 1px rgba(212, 175, 55, 0.3), 0 0 40px -8px rgba(212, 175, 55, 0.35)",
        "glow-gold-lg":
          "0 0 0 1px rgba(212, 175, 55, 0.45), 0 0 80px -10px rgba(212, 175, 55, 0.5)",
        "glow-sapphire":
          "0 0 0 1px rgba(56, 189, 248, 0.3), 0 0 40px -8px rgba(56, 189, 248, 0.35)",
        "glow-mixed":
          "0 0 30px -8px rgba(212, 175, 55, 0.3), 0 0 30px -8px rgba(56, 189, 248, 0.25)",
      },

      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
        "mesh-luxury":
          "radial-gradient(60% 50% at 20% 20%, rgba(212, 175, 55, 0.12) 0%, transparent 60%), radial-gradient(50% 50% at 80% 25%, rgba(56, 189, 248, 0.1) 0%, transparent 60%), radial-gradient(70% 60% at 50% 100%, rgba(99, 102, 241, 0.08) 0%, transparent 60%)",
        "gold-shimmer":
          "linear-gradient(135deg, #F3D082 0%, #D4AF37 50%, #FFF2D1 100%)",
      },

      keyframes: {
        antigravity: {
          "0%, 100%": { transform: "translate3d(0, 0px, 0)" },
          "50%": { transform: "translate3d(0, -10px, 0)" },
        },
        "border-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)", opacity: "0.6" },
          "50%": { transform: "translate3d(0, 6px, 0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
      },

      animation: {
        antigravity: "antigravity 8s ease-in-out infinite",
        "antigravity-slow": "antigravity 11s ease-in-out infinite",
        "border-spin": "border-spin 6s linear infinite",
        "bounce-subtle": "bounce-subtle 2.5s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
