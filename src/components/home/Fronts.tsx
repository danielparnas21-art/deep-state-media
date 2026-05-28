"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE_OUT_EXPO } from "@/lib/motion";

type Front = {
  index: string;
  kicker: string;
  title: string;
  body: string;
  href: string;
  cta: string;
};

/**
 * The three fronts the movement fights on — presented as an oversized editorial
 * index rather than a card grid, so the homepage reads as one statement, not a
 * newspaper. Each row is a full link that lights up on hover (signal accent,
 * title shifts, arrow fills) and rises in on scroll.
 */
const FRONTS: Front[] = [
  {
    index: "01",
    kicker: "The Podcast",
    title: "Deep State Uncovered",
    body: "Long-form tape from inside the rooms where it actually happens. We record the call, publish the source list, and let you hear what they really said.",
    href: "/podcast",
    cta: "Listen",
  },
  {
    index: "02",
    kicker: "The Campaign Desk",
    title: "On the trail with Lev",
    body: "Lev Parnas is running for Congress in Florida's 27th — and documenting it from the inside. The money, the machine, the parts campaigns never show you.",
    href: "/campaign-desk",
    cta: "Follow",
  },
  {
    index: "03",
    kicker: "The Reporting",
    title: "Writings & dispatches",
    body: "Lev Remembers plus original reporting from Daniel and David. Corruption on both sides — named, sourced, and on the record.",
    href: "/writings",
    cta: "Read",
  },
];

export function Fronts() {
  const reduce = useReducedMotion();
  return (
    <section
      aria-labelledby="fronts-heading"
      className="relative isolate overflow-hidden border-t border-white/5 bg-[#070811] py-28 text-paper sm:py-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-0 h-[45vh] w-[45vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(28,60,107,0.28),transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-6 sm:px-8 lg:px-12">
        <div className="mb-14 max-w-3xl sm:mb-20">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="mb-6 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-navy-200"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-500" />
            One mission, many fronts
          </motion.p>
          <motion.h2
            id="fronts-heading"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            className="display-stencil text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[1.02]"
          >
            This isn&rsquo;t a newspaper.{" "}
            <span className="italic text-signal-500">It&rsquo;s a movement.</span>
          </motion.h2>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT_EXPO }}
            className="mt-7 max-w-2xl text-deck text-paper/65"
          >
            One newsroom won&rsquo;t expose power on both sides. So we built a
            podcast, a congressional campaign documented from the inside, and
            reporting with the receipts attached — three fronts, one fight.
          </motion.p>
        </div>

        <div className="border-t border-white/10">
          {FRONTS.map((f, i) => (
            <FrontRow key={f.index} front={f} index={i} reduce={!!reduce} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FrontRow({
  front,
  index,
  reduce,
}: {
  front: Front;
  index: number;
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE_OUT_EXPO }}
    >
      <Link
        href={front.href}
        className="group relative flex items-start gap-5 border-b border-white/10 py-9 sm:items-center sm:gap-10 sm:py-12"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-px bg-signal-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <span className="mt-1.5 font-mono text-[12px] tracking-tight text-navy-200/60 transition-colors duration-300 group-hover:text-signal-400 sm:mt-0">
          {front.index}
        </span>
        <div className="flex-1">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-200">
            {front.kicker}
          </p>
          <h3 className="display-stencil text-[clamp(1.75rem,4vw,3.1rem)] leading-[1.03] text-paper transition-transform duration-300 group-hover:translate-x-1.5">
            {front.title}
          </h3>
          <p className="mt-3 max-w-xl text-paper/55 transition-colors duration-300 group-hover:text-paper/80">
            {front.body}
          </p>
        </div>
        <span className="hidden shrink-0 items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-200 lg:flex">
          {front.cta}
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-paper transition-all duration-300 group-hover:border-signal-500 group-hover:bg-signal-500 group-hover:text-white">
            <ArrowUpRight size={18} />
          </span>
        </span>
      </Link>
    </motion.div>
  );
}
