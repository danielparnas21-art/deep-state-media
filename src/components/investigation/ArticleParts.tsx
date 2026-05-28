"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
import type { Source } from "@/lib/investigations";
import { cn } from "@/lib/cn";

/** Pull quote — set in display face at dramatic scale, signal-red rule. */
export function PullQuote({
  children,
  cite,
}: {
  children: ReactNode;
  cite?: string;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative my-16 -mx-4 sm:mx-0"
    >
      <span
        aria-hidden
        className="absolute -left-2 -top-6 select-none font-display text-[8rem] leading-none text-signal-500/30 sm:-left-8"
      >
        “
      </span>
      <blockquote className="relative border-l-[3px] border-signal-500 pl-6 sm:pl-10">
        <div className="display-stencil text-[clamp(1.8rem,3.2vw,2.8rem)] leading-[1.05] text-ink-50 [&_p]:m-0">
          {children}
        </div>
        {cite && (
          <figcaption className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-300">
            — {cite}
          </figcaption>
        )}
      </blockquote>
    </motion.figure>
  );
}

/** Inline citation — a clickable footnote marker, scrolls to source panel. */
export function Cite({ id }: { id: string }) {
  return (
    <a
      href={`#source-${id}`}
      data-cursor-label="Source"
      className="group ml-0.5 inline-flex -translate-y-1.5 items-center"
      aria-label={`Source ${id}`}
    >
      <sup className="rounded-sm border border-signal-500/40 bg-signal-500/10 px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-signal-300 transition-colors group-hover:bg-signal-500 group-hover:text-black">
        {id}
      </sup>
    </a>
  );
}

/** Chapter header — kicker + display heading. */
export function Chapter({
  n,
  title,
  id,
}: {
  n: string;
  title: string;
  id?: string;
}) {
  return (
    <header id={id} className="mt-24 mb-10 scroll-mt-32">
      <p className="kicker mb-4 text-signal-400">Chapter {n}</p>
      <h2 className="display-stencil text-[clamp(2rem,4vw,3.25rem)] leading-[1] text-ink-50">
        {title}
      </h2>
      <div aria-hidden className="mt-6 h-px w-24 bg-signal-500" />
    </header>
  );
}

/**
 * Scrollytelling data moment. A sticky-pinned display of a single, dramatic
 * number, with a caption that the reader sees as they scroll past. Used for
 * "the money", "the count", "the gap".
 */
export function DataMoment({
  value,
  unit,
  label,
  caption,
}: {
  value: string;
  unit?: string;
  label: string;
  caption: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <section className="relative my-24 -mx-4 grid gap-10 rounded-md border border-white/10 bg-ink-900/40 p-6 sm:mx-0 sm:p-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-baseline gap-3"
      >
        <span className="display-stencil text-[clamp(4rem,12vw,9rem)] leading-[0.85] text-signal-500">
          {value}
        </span>
        {unit && (
          <span className="font-mono text-2xl uppercase tracking-[0.18em] text-ink-200">
            {unit}
          </span>
        )}
      </motion.div>
      <div className="self-end">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-300">
          {label}
        </p>
        <div className="mt-3 text-lg leading-relaxed text-ink-100">{caption}</div>
      </div>
    </section>
  );
}

/** Inline aside — boxed editorial sidebar. */
export function Aside({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="my-12 rounded-md border border-hazard/40 bg-hazard/[0.04] p-6">
      <p className="kicker mb-3 text-hazard-dim">{title}</p>
      <div className="text-ink-100">{children}</div>
    </aside>
  );
}

/** The sources panel — the editorial guardrail rendered. */
export function SourcesPanel({ sources }: { sources: Source[] }) {
  return (
    <section
      aria-labelledby="sources-heading"
      className="mt-32 border-t border-white/10 pt-16"
    >
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="kicker mb-3">Editorial guardrail</p>
          <h2
            id="sources-heading"
            className="display-stencil text-[clamp(2rem,4vw,3rem)] text-ink-50"
          >
            Sources & Citations
          </h2>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-300">
          {sources.length} entries
        </p>
      </div>
      <p className="mb-10 max-w-prose text-ink-200">
        Every numbered marker in this story links here. We name the document,
        the date, and where you can verify it yourself. If we got something
        wrong, write to{" "}
        <a className="text-signal-300 underline underline-offset-4" href="/corrections">
          /corrections
        </a>
        .
      </p>
      <ol className="space-y-6">
        {sources.map((s) => (
          <li
            key={s.id}
            id={`source-${s.id}`}
            className="scroll-mt-32 border-l-2 border-signal-500/40 pl-6"
          >
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-sm font-medium text-signal-400">
                [{s.id}]
              </span>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-300">
                {s.label}
                {s.date && (
                  <>
                    <span className="mx-2 text-ink-600">·</span>
                    {s.date}
                  </>
                )}
              </p>
            </div>
            <p className="mt-2 text-ink-100">{s.citation}</p>
            {s.url && (
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block font-mono text-[11px] uppercase tracking-[0.22em] text-signal-300 underline underline-offset-4 hover:text-signal-200"
              >
                Open source ↗
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Body paragraph wrapper - used inside MDX as <p>. */
export function P({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("mb-7", className)}>{children}</p>;
}
