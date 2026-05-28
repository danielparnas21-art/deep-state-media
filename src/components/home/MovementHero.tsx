"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, Headphones } from "lucide-react";
import { EASE_OUT_EXPO, stagger, wordRise } from "@/lib/motion";

const HEADLINE = ["We expose", "the people who", "actually", "run things."];

/**
 * Full-bleed cinematic brand hero — the movement statement, not a newspaper
 * masthead. It stays hidden until the intro gate's doors open (listening for
 * the "dsm:enter" event the gate dispatches), then the lines rise in, so the
 * reveal and the door-split read as one motion. Falls back to revealing on its
 * own if the gate never fires. Reduced motion shows everything immediately.
 */
export function MovementHero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (reduce || window.__dsmEntered) {
      setRevealed(true);
      return;
    }
    const on = () => setRevealed(true);
    window.addEventListener("dsm:enter", on);
    // Safety net: never leave the hero hidden if the gate never signals.
    const fallback = setTimeout(() => setRevealed(true), 6000);
    return () => {
      window.removeEventListener("dsm:enter", on);
      clearTimeout(fallback);
    };
  }, [reduce]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-8%"]);
  const ghostY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-18%"]);

  const state = revealed ? "visible" : "hidden";

  return (
    <section
      ref={ref}
      aria-label="Deep State Media"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-[#06070d] pb-24 pt-36 text-paper"
    >
      {/* Ambient background — always in subtle motion so the reveal feels alive */}
      <motion.div
        aria-hidden
        style={{ y: glowY }}
        className="pointer-events-none absolute inset-0"
      >
        <motion.div
          animate={reduce ? undefined : { opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(28,60,107,0.55),transparent_65%)] blur-3xl"
        />
        <div className="absolute bottom-0 right-0 h-[55vh] w-[55vh] translate-x-1/4 translate-y-1/4 rounded-full bg-[radial-gradient(circle,rgba(200,57,42,0.16),transparent_70%)] blur-3xl" />
      </motion.div>

      {/* Faint grid, masked to center */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(120,150,199,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(120,150,199,0.7) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 40%, black 40%, transparent 100%)",
        }}
      />

      {/* Oversized ghost wordmark */}
      <motion.span
        aria-hidden
        style={{ y: ghostY }}
        className="pointer-events-none absolute -right-6 bottom-2 select-none font-display text-[clamp(7rem,20vw,20rem)] font-semibold leading-none tracking-tighter text-white/[0.025]"
      >
        DSM
      </motion.span>

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto w-full max-w-[1480px] px-6 sm:px-8 lg:px-12"
      >
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={revealed ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-navy-200"
        >
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-500" />
            Independent media
          </span>
          <span className="text-white/20">/</span>
          <span>Both sides</span>
          <span className="text-white/20">/</span>
          <span>No team</span>
        </motion.p>

        <motion.h1
          variants={stagger(0.12, 0.05)}
          initial="hidden"
          animate={state}
          className="display-stencil max-w-[16ch] text-balance text-[clamp(2.8rem,8vw,7rem)] leading-[0.98]"
        >
          {HEADLINE.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                variants={wordRise}
                className={
                  i === HEADLINE.length - 1
                    ? "inline-block italic text-signal-500"
                    : "inline-block"
                }
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={revealed ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.5, duration: 0.8, ease: EASE_OUT_EXPO }}
          className="mt-9 max-w-2xl text-deck text-paper/70"
        >
          The podcast, the campaign trail, and the reporting the establishment
          press flinches from — corruption on both sides, named and sourced.{" "}
          <span className="text-paper">Bold framing. Receipts attached.</span>
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={revealed ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.65, duration: 0.8, ease: EASE_OUT_EXPO }}
          className="mt-11 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/podcast"
            className="group inline-flex items-center gap-2.5 rounded-full bg-signal-500 px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-signal-600"
          >
            <Headphones size={16} />
            Start with the podcast
          </Link>
          <Link
            href="/campaign-desk"
            className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-paper transition-colors hover:border-white/50"
          >
            Follow the campaign
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        initial={reduce ? false : { opacity: 0 }}
        animate={revealed ? { opacity: 1 } : undefined}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute inset-x-0 bottom-8 z-10 mx-auto flex w-full max-w-[1480px] items-center justify-between px-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/35 sm:px-8 lg:px-12"
      >
        <span>Est. 2026 — Independent</span>
        <span className="flex items-center gap-2">
          Scroll
          <motion.span
            animate={reduce ? undefined : { y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block h-3 w-px bg-paper/40"
          />
        </span>
      </motion.div>
    </section>
  );
}
