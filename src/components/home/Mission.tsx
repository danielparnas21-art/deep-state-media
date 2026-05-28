"use client";

import { motion, useReducedMotion } from "framer-motion";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { maskReveal, stagger, wordRise, EASE_OUT_EXPO } from "@/lib/motion";

const PRINCIPLES = [
  {
    n: "01",
    head: "Both sides. No team.",
    body: "We expose corruption regardless of party. If the story implicates a friend of the editor, it runs anyway.",
  },
  {
    n: "02",
    head: "Bold in style. Rigorous in facts.",
    body: "We use cinematic language because the stakes deserve it — and we cite every claim that matters.",
  },
  {
    n: "03",
    head: "Sources, not vibes.",
    body: "Every investigation ships with a public sources panel: documents, dockets, interviews, data. Footnotes inline.",
  },
  {
    n: "04",
    head: "Independent by structure.",
    body: "Reader-funded. No corporate ownership. No party affiliation. No advertiser veto.",
  },
];

export function Mission() {
  const reduce = useReducedMotion();
  return (
    <section
      aria-labelledby="mission-heading"
      className="relative border-t border-white/5 bg-ink-950 py-32"
    >
      <div className="mx-auto grid max-w-[1480px] gap-16 px-6 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:px-12">
        <div className="relative">
          <p className="kicker mb-6">The Charter</p>
          <RevealOnScroll>
            <motion.h2
              id="mission-heading"
              className="display-stencil text-title text-ink-50"
            >
              <span className="block overflow-hidden">
                <motion.span variants={wordRise} className="inline-block">
                  Adversarial
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span variants={wordRise} className="inline-block text-signal-500">
                  to power.
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span variants={wordRise} className="inline-block">
                  Loyal to the
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span variants={wordRise} className="inline-block">
                  paper trail.
                </motion.span>
              </span>
            </motion.h2>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <motion.div
              variants={maskReveal}
              className="mt-12 h-px w-32 bg-signal-500"
            />
          </RevealOnScroll>

          <RevealOnScroll delay={0.3}>
            <p className="mt-8 max-w-md text-ink-300">
              We started Deep State Media because the established press
              flinches when the story walks into its own party. We don&rsquo;t.
              We follow the documents, name the operators, and let the citations
              do the arguing.
            </p>
          </RevealOnScroll>
        </div>

        <motion.ul
          variants={stagger(0.08, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 sm:grid-cols-2"
        >
          {PRINCIPLES.map((p) => (
            <motion.li
              key={p.n}
              variants={{
                hidden: { opacity: 0, y: 32 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: reduce ? 0 : 0.8, ease: EASE_OUT_EXPO },
                },
              }}
              className="group relative overflow-hidden rounded-lg border border-white/10 bg-ink-900/40 p-6 transition-colors hover:border-signal-500/40"
            >
              <div
                aria-hidden
                className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-signal-500/0 blur-2xl transition-colors duration-700 group-hover:bg-signal-500/20"
              />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-400">
                {p.n}
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight text-ink-50">
                {p.head}
              </h3>
              <p className="mt-3 text-ink-300">{p.body}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
