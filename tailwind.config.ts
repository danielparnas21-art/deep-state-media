import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core canvas: deep, near-black with a chromatic shift
        ink: {
          950: "#06070A",
          900: "#0A0B10",
          800: "#101218",
          700: "#171A22",
          600: "#22262F",
          500: "#2D323D",
          400: "#525866",
          300: "#7C8392",
          200: "#A8AEBC",
          100: "#D9DCE3",
          50:  "#F2F3F6",
        },
        // Signal red — the electric accent
        signal: {
          50:  "#FFE9E9",
          100: "#FFC7C7",
          200: "#FF9A9A",
          300: "#FF6D6D",
          400: "#FF4747",
          500: "#FF2D2D", // primary accent
          600: "#E51F1F",
          700: "#B81515",
          800: "#7E0D0D",
          900: "#4A0707",
        },
        // Hazard yellow for archival / redaction accents
        hazard: {
          DEFAULT: "#F5E663",
          dim: "#A89E3F",
        },
        bone: "#EEEAE0",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "hero": ["clamp(3.5rem, 12vw, 11rem)", { lineHeight: "0.88", letterSpacing: "-0.04em" }],
        "title": ["clamp(2.25rem, 6vw, 5.5rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "headline": ["clamp(1.75rem, 3.5vw, 3rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "deck": ["clamp(1.125rem, 1.6vw, 1.5rem)", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        "kicker": ["0.75rem", { lineHeight: "1", letterSpacing: "0.18em" }],
      },
      letterSpacing: {
        tightest: "-0.05em",
      },
      maxWidth: {
        measure: "68ch",
        prose: "72ch",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      animation: {
        "marquee": "marquee 40s linear infinite",
        "pulse-dot": "pulse-dot 1.8s ease-in-out infinite",
        "scanlines": "scanlines 8s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.85)" },
        },
        scanlines: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 100%" },
        },
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.35 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
