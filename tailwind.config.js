/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#0B0B0D",
          elevated: "#121215",
          surface: "#18181C",
          muted: "#222228",
        },
        porcelain: {
          DEFAULT: "#F4F1EA",
          soft: "#DDD8CE",
        },
        stone: {
          DEFAULT: "#B5B0A6",
          dark: "#948F86",
        },
        champagne: {
          DEFAULT: "#C9A96E",
          light: "#DEC492",
          pale: "#EAD9B6",
          dim: "rgba(201, 169, 110, 0.12)",
          line: "rgba(201, 169, 110, 0.32)",
        },
        silver: {
          rim: "rgba(218, 224, 232, 0.16)",
        },
      },

      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },

      fontSize: {
        "editorial-xl": [
          "clamp(3.15rem, 8.2vw, 7.6rem)",
          { lineHeight: "0.93", letterSpacing: "-0.025em" },
        ],
        "editorial-lg": [
          "clamp(2.25rem, 5.2vw, 4.75rem)",
          { lineHeight: "1.02", letterSpacing: "-0.02em" },
        ],
        "editorial-md": [
          "clamp(1.65rem, 3vw, 2.65rem)",
          { lineHeight: "1.12", letterSpacing: "-0.015em" },
        ],
      },

      boxShadow: {
        "glass-chrome":
          "0 20px 50px -15px rgba(0, 0, 0, 0.72), inset 0 1px 0 0 rgba(255, 255, 255, 0.22), inset 0 -1px 0 0 rgba(201, 169, 110, 0.12)",
        "glass-modal":
          "0 36px 90px -20px rgba(0, 0, 0, 0.85), inset 0 1px 0 0 rgba(255, 255, 255, 0.18), inset 0 -1px 0 0 rgba(201, 169, 110, 0.1)",
        "champagne-subtle": "0 0 32px -12px rgba(201, 169, 110, 0.35)",
      },

      backgroundImage: {
        grain: "url('/grain.webp')",
      },

      keyframes: {
        "caret-blink": {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "orbital-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },

      animation: {
        "caret-blink": "caret-blink 1.05s steps(1) infinite",
        "orbital-spin": "orbital-spin 14s linear infinite",
      },
    },
  },
  plugins: [],
};
