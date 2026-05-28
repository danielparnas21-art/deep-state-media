import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm off-white editorial canvas — the resting state of the brand.
        paper: {
          DEFAULT: "#FBFAF6",
          100: "#F4F1EA",
          200: "#EBE7DC",
          300: "#DED9CB",
        },
        // Warm neutral gray — dark end is body text, light end is reversed type.
        ink: {
          50:  "#F6F4EF",
          100: "#E8E4DB",
          200: "#CFC9BC",
          300: "#A8A294",
          400: "#7C7669",
          500: "#5A554B",
          600: "#423E36",
          700: "#2C2924",
          800: "#1C1A16",
          900: "#14120E",
          950: "#0B0A07",
        },
        // Deep ink-blue — the primary identity accent (links, rules, dark features).
        navy: {
          50:  "#EDF1F8",
          100: "#D5E0F0",
          200: "#AABFE0",
          300: "#7796C7",
          400: "#456EA8",
          500: "#284F86",
          600: "#1C3C6B",
          700: "#152D52",
          800: "#0F2140",
          900: "#0A172E",
          950: "#060F20",
        },
        // Warm editorial red — reserved for CTAs, breaking tags, the wordmark mark.
        signal: {
          50:  "#FBEAE7",
          100: "#F6CFC8",
          200: "#EDA79B",
          300: "#E27E6D",
          400: "#D85844",
          500: "#C8392A", // primary CTA red
          600: "#AC2E22",
          700: "#8A241B",
          800: "#641A14",
          900: "#42110D",
        },
        bone: "#EEEAE0",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "hero": ["clamp(3rem, 8.5vw, 8rem)", { lineHeight: "1.0", letterSpacing: "-0.02em" }],
        "title": ["clamp(2rem, 5vw, 4rem)", { lineHeight: "1.04", letterSpacing: "-0.02em" }],
        "headline": ["clamp(1.6rem, 3vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "deck": ["clamp(1.125rem, 1.6vw, 1.45rem)", { lineHeight: "1.45", letterSpacing: "-0.005em" }],
        "kicker": ["0.72rem", { lineHeight: "1", letterSpacing: "0.2em" }],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      maxWidth: {
        measure: "66ch",
        prose: "70ch",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      animation: {
        "marquee": "marquee 50s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
