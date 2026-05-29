"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { NewsletterForm } from "@/components/home/NewsletterForm";

/**
 * The closing call — dark "join the movement" band. Pairs the newsletter signup
 * (the white pill reads as a deliberate light accent on the dark field) with a
 * quiet secure-tip nudge, so the homepage ends on a recruitment beat rather
 * than a footer of links.
 */
export function JoinMovement() {
  const reduce = useReducedMotion();
  return (
    <section
      aria-labelledby="join-heading"
      className="relative isolate overflow-hidden border-t border-white/5 bg-navy-950 py-28 text-paper sm:py-32"
    >
      <motion.div
        aria-hidden
        animate={
          reduce ? undefined : { backgroundPosition: ["0% 0%", "100% 100%"] }
        }
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(700px 420px at 15% 10%, rgba(28,60,107,0.45), transparent 60%), radial-gradient(680px 420px at 88% 95%, rgba(200,57,42,0.16), transparent 62%)",
          backgroundSize: "200% 200%",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-6 sm:px-8 lg:px-12">
        <div className="grid items-end gap-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
              className="mb-6 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-navy-200"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-500" />
              Join the movement
            </motion.p>
            <motion.h2
              id="join-heading"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
              className="display-stencil text-[clamp(2.3rem,5.5vw,4.5rem)] leading-[1.0]"
            >
              Get the truth{" "}
              <span className="italic text-signal-500">before they bury it.</span>
            </motion.h2>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT_EXPO }}
              className="mt-7 max-w-xl text-deck text-paper/65"
            >
              One email a week. The leads we&rsquo;re chasing, the documents we
              just pulled, the names we&rsquo;re about to name. No spam, no
              spin.
            </motion.p>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE_OUT_EXPO }}
            className="lg:justify-self-end"
          >
            <NewsletterForm />
            <Link
              href="/tip"
              className="group mt-6 inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-paper/60 transition-colors hover:text-paper"
            >
              <ShieldCheck size={15} className="text-signal-400" />
              Sitting on something? Send a secure tip
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
