"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { EASE_OUT_EXPO, stagger, wordRise } from "@/lib/motion";
import type { Writing } from "@/lib/writings";

const FALLBACK_IMAGE = "/team/lev-parnas.jpg";

/**
 * Light editorial masthead. A newspaper-style folio sits above the lead column
 * piece, presented as a cinematic feature: staggered serif reveal, a slow image
 * scale-settle on load, and a gentle parallax on the lead image as you scroll.
 * Reduced-motion keeps the identical composition, just still.
 */
export function Hero({ lead }: { lead?: Writing }) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-6%"]);

  const cover = lead?.cover ?? FALLBACK_IMAGE;
  const headline = lead?.title ?? "The people who actually run things — on the record.";
  const dek =
    lead?.description ??
    "Independent investigative journalism on power, money, and the rooms the press isn't supposed to be in.";

  return (
    <section
      ref={containerRef}
      aria-label="Deep State Media — masthead"
      className="paper-grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-paper pt-28"
    >
      {/* Faint navy editorial grid, softly masked — texture, not a dashboard. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(28,60,107,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(28,60,107,0.8) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 35%, black 50%, transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1480px] flex-1 flex-col px-6 sm:px-8 lg:px-12">
        {/* Nameplate folio */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          className="hairline-bottom flex flex-wrap items-center justify-between gap-3 pb-5"
        >
          <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-signal-600">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-500" />
            Live newsroom
          </p>
          <p className="hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400 sm:block">
            Independent · Both sides · Vol. I
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400">
            Est. 2026
          </p>
        </motion.div>

        {/* Lead feature */}
        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-16">
          <motion.div style={{ y: contentY }}>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease: EASE_OUT_EXPO }}
              className="kicker mb-6"
            >
              {lead ? "Latest from Lev Remembers" : "Independent investigative media"}
            </motion.p>

            <motion.h1
              variants={stagger(0.1, 0.18)}
              initial="hidden"
              animate="visible"
              className="display-stencil text-balance text-[clamp(2.4rem,5.2vw,4.75rem)] leading-[1.02] text-ink-900"
            >
              {headline.split(" ").reduce<string[][]>((lines, word) => {
                // Greedy ~3-word grouping just for the staggered line reveal.
                const last = lines[lines.length - 1];
                if (last && last.join(" ").length + word.length < 22) last.push(word);
                else lines.push([word]);
                return lines;
              }, []).map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span variants={wordRise} className="inline-block">
                    {line.join(" ")}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: EASE_OUT_EXPO }}
              className="mt-7 max-w-xl text-deck text-ink-600"
            >
              {dek}
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.8, ease: EASE_OUT_EXPO }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              {lead ? (
                <a
                  href={lead.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-navy-600 px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-navy-700"
                >
                  Read the column
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ) : (
                <Link
                  href="/writings"
                  className="group inline-flex items-center gap-2 rounded-full bg-navy-600 px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-navy-700"
                >
                  Read the writings
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-ink-900/20 px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-700 transition-colors hover:border-ink-900/40 hover:text-ink-900"
              >
                Why we exist
              </Link>
            </motion.div>
          </motion.div>

          {/* Lead image */}
          <motion.figure
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-ink-900/10 bg-paper-200 shadow-[0_30px_80px_-40px_rgba(20,18,14,0.5)]">
              <motion.div
                aria-hidden
                initial={reduce ? false : { scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.6, ease: EASE_OUT_EXPO }}
                style={{ y: imageY, backgroundImage: `url(${cover})` }}
                className="absolute inset-0 bg-cover bg-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-paper">
                  {lead ? "Lev Remembers" : "Lev Parnas · Founder"}
                </span>
                {lead && (
                  <span className="rounded-full bg-paper/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-800">
                    {lead.readingTimeMin} min read
                  </span>
                )}
              </figcaption>
            </div>
            <span
              aria-hidden
              className="absolute -left-3 -top-3 h-16 w-16 border-l border-t border-navy-600/40"
            />
            <span
              aria-hidden
              className="absolute -bottom-3 -right-3 h-16 w-16 border-b border-r border-navy-600/40"
            />
          </motion.figure>
        </div>

        {/* Bottom folio */}
        <div className="hairline-top flex flex-wrap items-center justify-between gap-4 py-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
          <span>Bold in style · Rigorous in facts</span>
          <span className="hidden md:inline">
            Filed from <span className="text-ink-700">DC · Miami · New York</span>
          </span>
          <span>
            <span className="text-ink-700">No corporate parent</span> · No party
          </span>
        </div>
      </div>
    </section>
  );
}
