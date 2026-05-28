"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import type { Writing } from "@/lib/writings";

/**
 * Dark-register dispatches rail — the homepage's window into the column without
 * turning into an article grid. Consumes the live Substack feed (passed from
 * the server page) and links out to the originals. Falls back to a quiet prompt
 * if the feed is unreachable so the section never renders empty.
 */
export function LatestDispatches({ items }: { items: Writing[] }) {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="dispatches-heading"
      className="relative isolate overflow-hidden border-t border-white/5 bg-[#06070d] py-28 text-paper sm:py-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 right-1/4 h-[40vh] w-[40vh] translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,57,42,0.1),transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-6 sm:px-8 lg:px-12">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="mb-5 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-navy-200">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-500" />
              Latest dispatches — published live
            </p>
            <h2
              id="dispatches-heading"
              className="display-stencil text-[clamp(2.2rem,5vw,4rem)] leading-[1.02]"
            >
              Straight from <span className="italic text-signal-500">the column.</span>
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/writings"
              className="group inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-paper/70 transition-colors hover:text-paper"
            >
              All writings
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-white/60">
                <ArrowRight size={14} />
              </span>
            </Link>
            <a
              href="https://levremembers.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-signal-500 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-signal-600"
            >
              Subscribe <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-md border border-white/10 bg-navy-950/40 p-10">
            <p className="max-w-prose text-paper/60">
              The column is syncing. Read{" "}
              <a
                href="https://levremembers.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal-400 underline underline-offset-4 hover:text-signal-300"
              >
                Lev Remembers
              </a>{" "}
              directly while the feed reconnects.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <DispatchCard
                key={item.guid}
                item={item}
                index={i}
                reduce={!!reduce}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function DispatchCard({
  item,
  index,
  reduce,
}: {
  item: Writing;
  index: number;
  reduce: boolean;
}) {
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE_OUT_EXPO }}
      whileHover={reduce ? undefined : { y: -4 }}
      className="group h-full"
    >
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full flex-col overflow-hidden rounded-md border border-white/10 bg-navy-950/40 transition-colors hover:border-white/25"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {item.cover ? (
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${item.cover})` }}
              whileHover={reduce ? undefined : { scale: 1.05 }}
              transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
            />
          ) : (
            <DispatchPlate title={item.title} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper backdrop-blur">
            Lev Remembers
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-200">
            <span>{formatDate(item.publishedAt)}</span>
            <span className="text-white/20">·</span>
            <span className="text-paper/40">{item.readingTimeMin} min read</span>
          </div>
          <h3 className="mt-3 font-display text-xl font-semibold leading-tight tracking-tight text-paper">
            <span className="bg-[linear-gradient(theme(colors.signal.500),theme(colors.signal.500))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_2px]">
              {item.title}
            </span>
          </h3>
          <p className="mt-3 line-clamp-3 text-sm text-paper/55">
            {item.description}
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 border-t border-white/10 pt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-200 transition-colors group-hover:text-signal-400">
            Read on Substack <ArrowUpRight size={14} />
          </span>
        </div>
      </a>
    </motion.article>
  );
}

function DispatchPlate({ title }: { title: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden bg-navy-900">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(120,150,199,0.12) 0 1px, transparent 1px 14px)",
        }}
      />
      <span
        aria-hidden
        className="absolute right-3 top-3 inline-block h-2 w-2 rotate-45 bg-signal-500"
      />
      <p className="display-stencil relative z-10 max-w-[16ch] text-balance px-6 text-center text-[clamp(1.1rem,2vw,1.6rem)] font-semibold leading-[1.1] text-paper/90">
        {title}
      </p>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
