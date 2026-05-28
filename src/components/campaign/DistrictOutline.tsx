"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Schematic outline of Florida's 27th congressional district. Not a precise
 * shapefile — a stylized editorial map, signal-red strokes against the deep
 * navy canvas. Path is drawn-on with strokeDashoffset animation.
 */
export function DistrictOutline({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox="0 0 600 480"
      role="img"
      aria-label="Florida's 27th congressional district — schematic outline"
      className={className}
    >
      <defs>
        <linearGradient id="dist-grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#C8392A" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#E0594B" stopOpacity="0.65" />
        </linearGradient>
        <filter id="dist-glow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Cardinal axes */}
      <g stroke="rgba(255,255,255,0.08)" strokeWidth="1">
        <line x1="0" y1="240" x2="600" y2="240" />
        <line x1="300" y1="0" x2="300" y2="480" />
      </g>

      {/* District schematic — coast-on-the-east footprint */}
      <motion.path
        d="M 130 90 L 240 70 L 340 80 L 410 110 L 480 150 L 520 220 L 510 290 L 470 350 L 420 400 L 350 420 L 270 410 L 200 380 L 140 320 L 110 250 L 100 180 Z"
        fill="none"
        stroke="url(#dist-grad)"
        strokeWidth="2.5"
        strokeDasharray="2200"
        initial={reduce ? { strokeDashoffset: 0 } : { strokeDashoffset: 2200 }}
        whileInView={{ strokeDashoffset: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d="M 130 90 L 240 70 L 340 80 L 410 110 L 480 150 L 520 220 L 510 290 L 470 350 L 420 400 L 350 420 L 270 410 L 200 380 L 140 320 L 110 250 L 100 180 Z"
        fill="rgba(200, 57, 42, 0.07)"
        stroke="none"
      />

      {/* Pin — Miami */}
      <motion.g
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <circle cx="340" cy="240" r="14" fill="rgba(200,57,42,0.20)" filter="url(#dist-glow)" />
        <circle cx="340" cy="240" r="6" fill="#C8392A" />
        <line x1="340" y1="240" x2="500" y2="240" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="2 4" />
        <text x="508" y="244" fontSize="11" fill="#F4F1EA" fontFamily="var(--font-mono)" letterSpacing="0.18em">
          FL-27 · MIAMI
        </text>
      </motion.g>

      {/* Coordinates */}
      <g
        fill="rgba(255,255,255,0.35)"
        fontSize="9"
        fontFamily="var(--font-mono)"
        letterSpacing="0.16em"
      >
        <text x="8" y="16">25.7617° N</text>
        <text x="8" y="468">80.1918° W</text>
      </g>
    </svg>
  );
}
