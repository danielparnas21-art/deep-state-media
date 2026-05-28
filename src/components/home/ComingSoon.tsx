"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Lock, ShieldCheck } from "lucide-react";
import { EASE_OUT_EXPO, stagger, wordRise } from "@/lib/motion";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { cn } from "@/lib/cn";

/** A small pulsing signal dot — the brand's "live / on the record" tell. */
function Pulse({ size = "sm" }: { size?: "sm" | "md" }) {
  const d = size === "md" ? "h-2 w-2" : "h-1.5 w-1.5";
  return (
    <span className={cn("relative flex", d)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-500 opacity-60 motion-reduce:hidden" />
      <span className={cn("relative inline-flex rounded-full bg-signal-500", d)} />
    </span>
  );
}

/** Refined eyebrow chip used above every section heading. */
function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-paper/85 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] backdrop-blur-sm",
        className,
      )}
    >
      <Pulse />
      {children}
    </span>
  );
}

const HEADLINE = ["The truth has", "a side now."];

// Subtle film-grain texture (inline SVG fractal noise) for the cinematic hero.
const FILM_GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")";

/**
 * The V1 teaser landing. While the site is unlaunched this replaces the full
 * movement homepage: the intro gate opens onto this "Coming soon" screen, whose
 * one real destination is Meet the Team. It collects a waitlist, tells the
 * story, and previews the two fronts (the podcast, the campaign desk) —
 * without pretending any of them have shipped yet.
 *
 * The hero stays hidden until the gate's doors open (listening for "dsm:enter"),
 * so the reveal and the door-split read as one motion. Reduced motion shows
 * everything immediately.
 */
const FRONTS = [
  {
    index: "01",
    kicker: "The Podcast",
    title: "Deep State Uncovered",
    body: "The investigative podcast — long-form conversations with the insiders, operators, and whistleblowers who move money and power. On the record, sources published.",
    status: "In production",
    href: undefined as string | undefined,
  },
  {
    index: "02",
    kicker: "The Campaign Desk",
    title: "On the trail with Lev",
    body: "We'll be inside Lev's congressional run from day one — on the trail through the entire campaign, with full transparency.",
    status: "Filing soon",
    href: undefined as string | undefined,
  },
];

export function ComingSoon() {
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
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "28%"]);
  const ghostY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-16%"]);

  const state = revealed ? "visible" : "hidden";

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        ref={ref}
        aria-label="Deep State Media — coming soon"
        className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-[#06070d]/65 pb-24 pt-36 text-paper"
      >
        <motion.div
          aria-hidden
          style={{ y: glowY }}
          className="pointer-events-none absolute inset-0"
        >
          <motion.div
            animate={reduce ? undefined : { opacity: [0.45, 0.85, 0.45], scale: [1, 1.06, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1/3 left-1/2 h-[88vh] w-[88vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(28,60,107,0.6),transparent_65%)] blur-3xl"
          />
          <motion.div
            animate={reduce ? undefined : { opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-0 right-0 h-[58vh] w-[58vh] translate-x-1/4 translate-y-1/4 rounded-full bg-[radial-gradient(circle,rgba(200,57,42,0.22),transparent_70%)] blur-3xl"
          />
          <motion.div
            animate={reduce ? undefined : { opacity: [0.28, 0.5, 0.28] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute bottom-8 left-0 h-[42vh] w-[42vh] -translate-x-1/3 rounded-full bg-[radial-gradient(circle,rgba(28,60,107,0.38),transparent_70%)] blur-3xl"
          />
        </motion.div>

        {/* Cinematic film grain — barely-there texture that keeps the dark from
            reading as flat. Animated opacity only (transform-cheap). */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0.08 }}
          animate={reduce ? { opacity: 0.08 } : { opacity: [0.06, 0.11, 0.06] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 z-[1] mix-blend-overlay"
          style={{ backgroundImage: FILM_GRAIN, backgroundSize: "220px 220px" }}
        />

        {/* Vignette to focus the eye on the headline and deepen the edges. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse 78% 62% at 50% 42%, transparent 52%, rgba(2,3,8,0.72) 100%)",
          }}
        />

        <motion.span
          aria-hidden
          style={{ y: ghostY }}
          className="pointer-events-none absolute -right-6 bottom-2 select-none font-display text-[clamp(7rem,20vw,20rem)] font-semibold leading-none tracking-tighter text-white/[0.025]"
        >
          DSM
        </motion.span>

        <div className="relative z-10 mx-auto flex w-full max-w-[1480px] flex-col items-center px-6 text-center sm:px-8 lg:px-12">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={revealed ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="mb-9 flex justify-center"
          >
            <span className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.05] px-5 py-2.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6),0_1px_0_0_rgba(255,255,255,0.06)_inset] backdrop-blur-md">
              <Pulse size="md" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-paper">
                Coming soon
              </span>
              <span aria-hidden className="hidden h-3.5 w-px bg-white/15 sm:block" />
              <span className="hidden text-[10px] font-medium uppercase tracking-[0.22em] text-paper/45 sm:inline">
                Est. 2026
              </span>
              <span aria-hidden className="hidden h-3.5 w-px bg-white/15 sm:block" />
              <span className="hidden text-[10px] font-medium uppercase tracking-[0.22em] text-paper/45 sm:inline">
                Independent · Both sides
              </span>
            </span>
          </motion.div>

          <motion.h1
            variants={stagger(0.12, 0.05)}
            initial="hidden"
            animate={state}
            className="display-stencil mx-auto max-w-[16ch] text-balance text-center text-[clamp(3.2rem,9vw,8rem)] leading-[0.92] tracking-[-0.012em]"
          >
            {HEADLINE.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  variants={wordRise}
                  className={
                    i === HEADLINE.length - 1
                      ? "inline-block accent-signal"
                      : "inline-block"
                  }
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.div
            aria-hidden
            initial={reduce ? false : { scaleX: 0, opacity: 0 }}
            animate={revealed ? { scaleX: 1, opacity: 1 } : undefined}
            transition={{ delay: 0.55, duration: 0.7, ease: EASE_OUT_EXPO }}
            className="mx-auto mt-7 h-[3px] w-32 origin-center bg-signal-500"
          />

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={revealed ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.5, duration: 0.8, ease: EASE_OUT_EXPO }}
            className="mx-auto mt-8 max-w-2xl text-center text-deck text-paper/70"
          >
            And it was never theirs. Both parties lie, the press covers for its
            own, and the real money still moves in rooms with no cameras.{" "}
            <span className="text-paper">
              We name names. We bring the receipt. We&rsquo;re building it now.
            </span>
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={revealed ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.65, duration: 0.8, ease: EASE_OUT_EXPO }}
            className="mt-11 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/team"
              className="group inline-flex items-center gap-2.5 rounded-full bg-signal-500 px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-signal-600"
            >
              Meet the team
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <a
              href="#waitlist"
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-paper transition-colors hover:border-white/50"
            >
              Get notified at launch
            </a>
          </motion.div>
        </div>

        <motion.div
          aria-hidden
          initial={reduce ? false : { opacity: 0 }}
          animate={revealed ? { opacity: 1 } : undefined}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute inset-x-0 bottom-8 z-10 mx-auto flex w-full max-w-[1480px] flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/35 sm:px-8 lg:px-12"
        >
          <span>Independent — no party line</span>
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

      {/* ── Our story / manifesto ────────────────────────────── */}
      <section
        aria-labelledby="story-heading"
        className="relative isolate overflow-hidden bg-[#06070d]/65 py-28 text-paper sm:py-32"
      >
        <div className="relative z-10 mx-auto w-full max-w-[1480px] px-6 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <Eyebrow className="mb-6">Our story</Eyebrow>
            <h2
              id="story-heading"
              className="display-stencil text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.02]"
            >
              Why we&rsquo;re{" "}
              <span className="accent-signal">building this.</span>
            </h2>
            <div className="mt-10 max-w-2xl space-y-6 text-deck text-paper/70">
              <p>
                The people who actually run things count on one thing: that
                you&rsquo;ll never see how it works. The press picks a side and
                covers for it. The money moves in rooms with no cameras.
              </p>
              <p>
                Deep State Media is the answer to that — built by people who
                have been <span className="text-paper">inside those rooms</span>{" "}
                and decided to talk. We expose corruption on both sides of the
                aisle, name names, and attach the receipt to every claim.
              </p>
              <p className="text-paper">
                Bold in style. Rigorous in facts. No party line, no sacred cows.
                That&rsquo;s the standard we hold every story to. Now we go to
                work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What's coming ────────────────────────────────────── */}
      <section
        aria-labelledby="coming-heading"
        className="relative isolate overflow-hidden bg-[#06070d]/65 py-28 text-paper sm:py-32"
      >
        <div className="relative z-10 mx-auto w-full max-w-[1480px] px-6 sm:px-8 lg:px-12">
          <div className="mx-auto mb-14 flex max-w-3xl flex-col items-center text-center">
            <Eyebrow className="mb-5">What&rsquo;s coming</Eyebrow>
            <h2
              id="coming-heading"
              className="display-stencil text-[clamp(2.2rem,5vw,4rem)] leading-[1.02]"
            >
              Two fronts.{" "}
              <span className="accent-signal">One movement.</span>
            </h2>
          </div>

          <ul className="divide-y divide-white/5">
            {FRONTS.map((f, i) => (
              <FrontRow key={f.index} front={f} index={i} reduce={!!reduce} />
            ))}
          </ul>
        </div>
      </section>

      {/* ── Waitlist ─────────────────────────────────────────── */}
      <section
        id="waitlist"
        aria-labelledby="waitlist-heading"
        className="relative isolate scroll-mt-24 overflow-hidden bg-[#06070d]/65 py-28 text-paper sm:py-32"
      >
        <motion.div
          aria-hidden
          animate={
            reduce ? undefined : { backgroundPosition: ["0% 0%", "100% 100%"] }
          }
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(680px 420px at 88% 95%, rgba(200,57,42,0.14), transparent 62%)",
            backgroundSize: "200% 200%",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-[1480px] px-6 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <Eyebrow className="mb-6">Be first in</Eyebrow>
            <h2
              id="waitlist-heading"
              className="display-stencil text-[clamp(2.3rem,5.5vw,4.5rem)] leading-[0.98]"
            >
              Get the truth{" "}
              <span className="accent-signal">before they bury it.</span>
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-deck text-paper/65">
              Get on the list and we&rsquo;ll bring it straight to your inbox —
              the podcast, the campaign desk, and every investigation as it
              breaks. The leads we&rsquo;re chasing and the names we&rsquo;re
              about to name. No spam, no party line.
            </p>

            <div className="mt-12 flex w-full flex-col items-center">
              <NewsletterForm />
              <Link
                href="/team"
                className="group mt-6 inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-paper/60 transition-colors hover:text-paper"
              >
                <ShieldCheck size={15} className="text-signal-400" />
                Meet the people behind it
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FrontRow({
  front,
  index,
  reduce,
}: {
  front: (typeof FRONTS)[number];
  index: number;
  reduce: boolean;
}) {
  const live = Boolean(front.href);
  const inner = (
    <>
      <span className="font-mono text-sm text-paper/30 transition-colors group-hover:text-signal-400">
        {front.index}
      </span>
      <Eyebrow className="mt-4">{front.kicker}</Eyebrow>
      <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-paper sm:text-3xl">
        {front.title}
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-paper/55">{front.body}</p>

      <span
        className={
          live
            ? "mt-6 inline-flex items-center gap-2 rounded-full border border-signal-500/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-signal-400"
            : "mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/45"
        }
      >
        {live ? (
          <ArrowUpRight size={12} />
        ) : (
          <Lock size={11} className="text-paper/40" />
        )}
        {front.status}
      </span>
    </>
  );

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE_OUT_EXPO }}
    >
      {live ? (
        <a
          href={front.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center py-10 text-center"
        >
          {inner}
        </a>
      ) : (
        <div className="group flex flex-col items-center py-10 text-center">
          {inner}
        </div>
      )}
    </motion.li>
  );
}
