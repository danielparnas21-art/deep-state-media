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
    body: "Independently owned. No corporate parent. No party affiliation. Editors decide what runs.",
  },
];

export function Mission() {
  const reduce = useReducedMotion();
  return (
    <section
      aria-labelledby="mission-heading"
      className="relative border-t border-ink-900/10 bg-paper-100 py-28"
    >
      <div className="mx-auto grid max-w-[1480px] gap-16 px-6 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:px-12">
        <div className="relative">
          <p className="kicker mb-6">The Charter</p>
          <RevealOnScroll>
            <motion.h2
              id="mission-heading"
              className="display-stencil text-title text-ink-900"
            >
              <span className="block overflow-hidden">
                <motion.span variants={wordRise} className="inline-block">
                  Adversarial
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span variants={wordRise} className="inline-block italic text-navy-600">
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
              className="mt-12 h-0.5 w-32 bg-navy-600"
            />
          </RevealOnScroll>

          <RevealOnScroll delay={0.3}>
            <p className="mt-8 max-w-md text-ink-500">
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
              className="group relative overflow-hidden rounded-lg border border-ink-900/10 bg-paper p-6 transition-all duration-500 hover:border-navy-600/40 hover:shadow-[0_18px_50px_-30px_rgba(20,18,14,0.4)]"
            >
              <p className="font-display text-lg font-semibold text-signal-500">
                {p.n}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900">
                {p.head}
              </h3>
              <p className="mt-3 text-ink-500">{p.body}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
