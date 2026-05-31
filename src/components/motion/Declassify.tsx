"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Declassify-on-scroll: wraps content so it sits under a black redaction bar
 * that wipes away left-to-right — trailed by a signal-red edge — the first time
 * it scrolls into view. The intro gate's signature reveal, reused as the site's
 * motif. Under reduced motion it renders the content plainly (no bar), and the
 * real text is always in the DOM beneath the bar for crawlers.
 */
export function Declassify({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{children}</span>;

  const transition = { duration: 0.7, ease: EASE_OUT_EXPO, delay };
  const viewport = { once: true, amount: 0.5 } as const;

  return (
    <span className={cn("relative inline-block", className)}>
      {children}
      {/* Redaction bar wiping away left-to-right */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-y-1 inset-x-0 bg-black"
        initial={{ clipPath: "inset(0 0 0 0)" }}
        whileInView={{ clipPath: "inset(0 0 0 100%)" }}
        viewport={viewport}
        transition={transition}
      />
      {/* Signal-red wipe edge tracking the reveal */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-y-1 w-[2px] bg-signal-500"
        style={{ boxShadow: "0 0 14px rgba(200,57,42,0.85)" }}
        initial={{ left: "0%", opacity: 0 }}
        whileInView={{ left: "100%", opacity: [0, 1, 1, 0] }}
        viewport={viewport}
        transition={transition}
      />
    </span>
  );
}
