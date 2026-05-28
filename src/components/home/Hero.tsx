"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { EASE_OUT_EXPO, wordRise, stagger } from "@/lib/motion";

/**
 * Cinematic full-bleed hero. A title-card masthead with layered parallax,
 * ambient grain, scanlines, and a slow horizon glow. Reduced-motion: still,
 * but the typographic composition stays identical.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Layered parallax — each row drifts at a different rate.
  const yDeep = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-50%"]);
  const yState = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-90%"]);
  const yMedia = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-130%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.2]);
  const horizonY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "60%"]);

  return (
    <section
      ref={containerRef}
      aria-label="Deep State Media — masthead"
      className="grain scanlines relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink-950"
    >
      {/* Horizon glow — subtle signal-red wash from the bottom */}
      <motion.div
        aria-hidden
        style={{ y: horizonY }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60vh] bg-[radial-gradient(120%_60%_at_50%_100%,rgba(255,45,45,0.18),transparent_70%)]"
      />

      {/* Faint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 90% 60% at 50% 40%, black 60%, transparent 100%)",
        }}
      />

      {/* Top meta strip */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1480px] items-center justify-between px-6 pt-28 sm:px-8 lg:px-12">
        <p className="kicker flex items-center gap-3">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-pulse-dot rounded-full bg-signal-500" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-400" />
          </span>
          Live newsroom · Established 2026
        </p>
        <p className="kicker hidden md:block">Issue Nº 001 — Cycle: 2026</p>
      </div>

      {/* The film-title-card masthead */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-[1480px] flex-1 flex-col justify-center px-6 sm:px-8 lg:px-12"
      >
        <motion.div
          variants={stagger(0.12, 0.1)}
          initial="hidden"
          animate="visible"
          className="pointer-events-none select-none"
        >
          <motion.div className="overflow-hidden">
            <motion.h1
              style={{ y: yDeep }}
              variants={wordRise}
              className="display-stencil text-hero text-ink-50"
              aria-label="Deep State Media"
            >
              Deep
            </motion.h1>
          </motion.div>

          <motion.div className="overflow-hidden">
            <motion.span
              style={{ y: yState }}
              variants={wordRise}
              className="display-stencil block text-hero text-signal-500"
            >
              State.
            </motion.span>
          </motion.div>

          <motion.div className="overflow-hidden">
            <motion.span
              style={{ y: yMedia }}
              variants={wordRise}
              className="display-stencil block text-hero text-ink-50"
            >
              Media.
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Deck / mission line */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9, ease: EASE_OUT_EXPO }}
          className="mt-10 grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end"
        >
          <p className="max-w-2xl text-balance text-deck text-ink-100">
            Investigative journalism on the people who actually run things —
            <span className="text-signal-400"> left, right,</span> and the rooms
            where the press isn&rsquo;t supposed to be. <strong className="text-ink-50">Bold framing.</strong>{" "}
            <strong className="text-ink-50">Sourced facts.</strong> No team jersey.
          </p>
          <div className="md:justify-self-end">
            <a
              href="#latest"
              className="group inline-flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.28em] text-ink-200 hover:text-ink-50"
            >
              <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-signal-500">
                <ArrowDown size={14} />
              </span>
              Enter the dossier
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom hairline + corner credits */}
      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-6 pb-8 sm:px-8 lg:px-12">
        <div className="hairline-top pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
            <span>Vol. I — Sourced &amp; Strange</span>
            <span className="hidden md:inline">
              Filed from: <span className="text-ink-200">DC · Miami · New York</span>
            </span>
            <span>
              <span className="text-ink-200">Reader-funded</span> · No corp owners
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
