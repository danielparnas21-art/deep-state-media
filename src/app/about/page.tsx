import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

export const metadata: Metadata = {
  title: "About",
  description:
    "Deep State Media is an independent investigative newsroom. We report on power — left, right, and the rooms where the press isn't supposed to be.",
};

const STANDARDS = [
  {
    n: "01",
    h: "Sourcing is non-negotiable.",
    p: "Every published investigation ships with a public Sources panel: documents, dockets, interviews, data. If a claim isn’t sourced, it isn’t published.",
  },
  {
    n: "02",
    h: "Adversarial, not partisan.",
    p: "We name corruption regardless of jersey. If the story implicates a friend of the editor, the story runs anyway.",
  },
  {
    n: "03",
    h: "On the record by default.",
    p: "Anonymous sourcing is reserved for situations where on-the-record would cause genuine harm — and we say why we granted it, every time.",
  },
  {
    n: "04",
    h: "Corrections, prominently.",
    p: "Errors get corrected at the top of the affected story with a timestamp. We publish a running corrections page.",
  },
  {
    n: "05",
    h: "Independent by structure.",
    p: "Reader-funded. No corporate ownership. No party affiliation. No advertiser veto. Editorial decisions are made by editors only.",
  },
  {
    n: "06",
    h: "Tip line is a fortress.",
    p: "We accept anonymous tips. We minimize metadata. We don’t collect what we don’t need.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative border-b border-white/5 pb-20 pt-40">
        <Container>
          <p className="kicker mb-6">The Charter</p>
          <h1 className="display-stencil text-hero text-ink-50">
            We report on
            <br />
            <span className="text-signal-500">power.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-deck text-ink-200">
            Deep State Media is an independent investigative newsroom. We
            cover the people who actually run things — the operators, the
            donors, the consultants, the staffers — across the aisle and the
            rooms the press isn&rsquo;t supposed to be in. Bold framing.
            Sourced facts.
          </p>
        </Container>
      </section>

      {/* Mission deep-dive */}
      <section className="border-b border-white/5 py-32">
        <Container size="lg" className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="kicker mb-4">The why</p>
            <h2 className="display-stencil text-title text-ink-50">
              The press
              <br />
              flinches.
              <br />
              <span className="text-signal-500">We don&rsquo;t.</span>
            </h2>
          </div>
          <div className="prose-editorial">
            <p>
              We started Deep State Media because the established press
              flinches when the story walks into its own party. We don&rsquo;t.
              We follow the documents, name the operators, and let the
              citations do the arguing.
            </p>
            <p>
              We are not neutral about corruption. We are not neutral about
              capture. We are not neutral about the use of public office for
              private revenge. We are, however, scrupulously fair about who we
              name — and why.
            </p>
            <p>
              Our standard is simple: if it&rsquo;s in the story, it&rsquo;s in
              the sources panel. If it&rsquo;s in the sources panel, you can
              check it yourself.
            </p>
          </div>
        </Container>
      </section>

      {/* Editorial Standards */}
      <section className="border-b border-white/5 py-32">
        <Container>
          <div className="mb-12">
            <p className="kicker mb-4">Editorial standards</p>
            <h2 className="display-stencil text-title text-ink-50">
              How we work.
            </h2>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STANDARDS.map((s, i) => (
              <RevealOnScroll
                key={s.n}
                as="li"
                delay={i * 0.05}
                className="group relative overflow-hidden rounded-md border border-white/10 bg-ink-900/40 p-6 hover:border-signal-500/40"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-400">
                  {s.n}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink-50">
                  {s.h}
                </h3>
                <p className="mt-3 text-ink-300">{s.p}</p>
              </RevealOnScroll>
            ))}
          </ul>
        </Container>
      </section>

      {/* Funding model */}
      <section className="border-b border-white/5 py-32">
        <Container size="lg" className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="kicker mb-4">How we&rsquo;re paid</p>
            <h2 className="display-stencil text-title text-ink-50">
              Reader-funded.
              <br />
              <span className="text-signal-500">Period.</span>
            </h2>
            <p className="mt-6 max-w-prose text-ink-200">
              Our revenue comes from individual subscribers and explicitly-disclosed
              philanthropic grants. We do not accept advertising. We do not
              accept funding from political parties, campaigns, super PACs,
              foreign governments, or corporate entities seeking favorable
              coverage.
            </p>
            <p className="mt-4 max-w-prose text-ink-300">
              Our annual funding disclosure is published every January 1 with
              the names of donors above a $5,000 contribution threshold.
            </p>
          </div>
          <div className="rounded-md border border-white/10 bg-ink-900/40 p-8">
            <p className="kicker mb-4">Quick stats</p>
            <dl className="space-y-5">
              {[
                { k: "Revenue from advertisers", v: "0%" },
                { k: "Revenue from political parties", v: "0%" },
                { k: "Revenue from readers", v: "100%" },
                { k: "Funding disclosure cadence", v: "Annual" },
              ].map((r) => (
                <div key={r.k} className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-3 last:border-b-0">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-300">{r.k}</dt>
                  <dd className="font-display text-2xl font-bold text-signal-500">{r.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* Big CTAs */}
      <section className="py-32">
        <Container className="grid gap-6 md:grid-cols-2">
          <Link
            href="/team"
            className="group relative overflow-hidden rounded-md border border-white/10 bg-ink-900/40 p-10 transition-colors hover:border-signal-500/40"
          >
            <p className="kicker mb-3">Who we are</p>
            <h3 className="font-display text-3xl font-bold tracking-tight text-ink-50">
              Meet the masthead
            </h3>
            <p className="mt-3 text-ink-300">
              Founders, contributors, and the central figures behind Deep State Media.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-signal-300">
              The team <ArrowRight size={14} />
            </span>
          </Link>
          <Link
            href="/tip"
            className="group relative overflow-hidden rounded-md border border-signal-500/40 bg-signal-500/10 p-10 transition-colors hover:bg-signal-500/15"
          >
            <p className="kicker mb-3 text-signal-300">Have something for us?</p>
            <h3 className="font-display text-3xl font-bold tracking-tight text-ink-50">
              Send a tip.
            </h3>
            <p className="mt-3 text-ink-200">
              Documents, screenshots, voicemails — anonymously if you need it.
              We&rsquo;ll read every line.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-signal-200">
              Secure tip line <ArrowRight size={14} />
            </span>
          </Link>
        </Container>
      </section>
    </>
  );
}
