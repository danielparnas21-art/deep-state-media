"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Rss } from "lucide-react";

const LATEST = {
  episode: 14,
  title: "The Lobbyist Pipeline — How Florida's 27th Got Bought",
  duration: "52:18",
  publishedAt: "2026-05-24",
  description:
    "We trace the money from three shell PACs into a single congressional race — and ask the donors, on tape, what they thought they were buying.",
  guests: ["Lev Parnas", "Anita Tran (FEC analyst)"],
};

/**
 * The one cinematic dark band on the homepage — a deep navy feature strip for
 * the podcast, a deliberate change of register between the light editorial
 * sections above and below.
 */
export function PodcastStrip() {
  const reduce = useReducedMotion();
  return (
    <section
      aria-labelledby="podcast-heading"
      className="relative isolate overflow-hidden border-t border-white/5 bg-navy-900 py-32 text-paper"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-10 select-none font-display text-[clamp(14rem,22vw,28rem)] font-semibold leading-none tracking-tight text-white/[0.03]"
      >
        {String(LATEST.episode).padStart(2, "0")}
      </div>

      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-200">
              Deep State Uncovered — the podcast
            </p>
            <h2 id="podcast-heading" className="display-stencil text-title text-paper">
              Tape from
              <br />
              <span className="italic text-signal-400">the room.</span>
            </h2>
            <p className="mt-6 max-w-md text-navy-100/80">
              Weekly long-form. Lobbyists, lawyers, defectors, donors. We
              record the call. We publish the source list. You hear what they
              actually said.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link
                href="/podcast"
                className="group inline-flex items-center gap-3 rounded-full bg-signal-500 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-signal-600"
              >
                <Play size={14} fill="currentColor" />
                Play latest episode
              </Link>
              <a
                href="/podcast/rss.xml"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-paper transition-colors hover:border-white/50"
              >
                <Rss size={14} />
                RSS
              </a>
            </div>
          </div>

          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-md border border-white/10 bg-navy-950/60 p-8 backdrop-blur"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-200">
              Episode {String(LATEST.episode).padStart(2, "0")} ·{" "}
              {formatDate(LATEST.publishedAt)} · {LATEST.duration}
            </p>
            <h3 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-paper">
              {LATEST.title}
            </h3>
            <p className="mt-4 text-navy-100/80">{LATEST.description}</p>
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-200">
                Featured
              </p>
              <ul className="flex flex-wrap gap-2">
                {LATEST.guests.map((g) => (
                  <li
                    key={g}
                    className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-paper"
                  >
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            {/* Faux waveform — heights are pre-rounded so SSR and CSR agree */}
            <div aria-hidden className="mt-8 flex items-end gap-1">
              {Array.from({ length: 56 }).map((_, i) => {
                const h = Math.round(
                  6 + Math.abs(Math.sin((i + 1) * 0.45)) * 36 + ((i * 7) % 12),
                );
                return (
                  <span
                    key={i}
                    className="w-1 rounded-sm bg-signal-500/70"
                    style={{ height: `${h}px` }}
                  />
                );
              })}
            </div>
          </motion.article>
        </div>
      </Container>
    </section>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
