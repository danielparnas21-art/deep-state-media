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
    p: "No corporate ownership. No party affiliation. Editorial decisions are made by editors only.",
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
      <section className="relative border-b border-ink-900/10 bg-paper-100 pb-20 pt-40">
        <Container>
          <p className="kicker mb-6">The Charter</p>
          <h1 className="display-stencil text-hero text-ink-900">
            We report on
            <br />
            <span className="italic text-navy-600">power.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-deck text-ink-600">
            Deep State Media is an independent investigative newsroom. We
            cover the people who actually run things — the operators, the
            donors, the consultants, the staffers — across the aisle and the
            rooms the press isn&rsquo;t supposed to be in. Bold framing.
            Sourced facts.
          </p>
        </Container>
      </section>

      {/* Mission deep-dive */}
      <section className="border-b border-ink-900/10 bg-paper py-32">
        <Container size="lg" className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="kicker mb-4">The why</p>
            <h2 className="display-stencil text-title text-ink-900">
              The press
              <br />
              flinches.
              <br />
              <span className="italic text-navy-600">We don&rsquo;t.</span>
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
      <section className="border-b border-ink-900/10 bg-paper-100 py-32">
        <Container>
          <div className="mb-12">
            <p className="kicker mb-4">Editorial standards</p>
            <h2 className="display-stencil text-title text-ink-900">
              How we work.
            </h2>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STANDARDS.map((s, i) => (
              <RevealOnScroll
                key={s.n}
                as="li"
                delay={i * 0.05}
                className="group relative overflow-hidden rounded-md border border-ink-900/10 bg-paper p-6 transition-colors hover:border-navy-600/40 hover:shadow-sm"
              >
                <p className="font-display text-2xl font-semibold text-signal-500">
                  {s.n}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900">
                  {s.h}
                </h3>
                <p className="mt-3 text-ink-500">{s.p}</p>
              </RevealOnScroll>
            ))}
          </ul>
        </Container>
      </section>

      {/* Independence / firewall */}
      <section className="border-b border-ink-900/10 bg-paper py-32">
        <Container size="lg" className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="kicker mb-4">How we operate</p>
            <h2 className="display-stencil text-title text-ink-900">
              Independent.
              <br />
              <span className="italic text-navy-600">Period.</span>
            </h2>
            <p className="mt-6 max-w-prose text-ink-600">
              Deep State Media is a for-profit, independently-owned company. A
              hard wall separates the business from the newsroom: advertisers and
              partners never see a story before it runs, and they never decide
              what we cover. We take no money from political parties, campaigns,
              super PACs, or foreign governments.
            </p>
            <p className="mt-4 max-w-prose text-ink-500">
              When a sponsor or partner has a stake in a story, we disclose it
              inside the story. Editorial decisions are made by editors only.
            </p>
          </div>
          <div className="rounded-md border border-ink-900/10 bg-paper-100 p-8">
            <p className="kicker mb-4">The firewall</p>
            <dl className="space-y-5">
              {[
                { k: "Revenue from political parties", v: "0%" },
                { k: "Advertiser say over coverage", v: "None" },
                { k: "Conflicts disclosed in-story", v: "Always" },
                { k: "Owned by", v: "Its founders" },
              ].map((r) => (
                <div key={r.k} className="flex items-baseline justify-between gap-4 border-b border-ink-900/10 pb-3 last:border-b-0">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">{r.k}</dt>
                  <dd className="font-display text-2xl font-semibold text-navy-600">{r.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* Big CTAs */}
      <section className="bg-paper-100 py-32">
        <Container className="grid gap-6 md:grid-cols-2">
          <Link
            href="/team"
            className="group relative overflow-hidden rounded-md border border-ink-900/10 bg-paper p-10 transition-colors hover:border-navy-600/40 hover:shadow-sm"
          >
            <p className="kicker mb-3">Who we are</p>
            <h3 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
              Meet the masthead
            </h3>
            <p className="mt-3 text-ink-500">
              Founders, contributors, and the central figures behind Deep State Media.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-navy-600 group-hover:text-navy-700">
              The team <ArrowRight size={14} />
            </span>
          </Link>
          <Link
            href="/tip"
            className="group relative overflow-hidden rounded-md border border-signal-500/30 bg-signal-50 p-10 transition-colors hover:border-signal-500/60"
          >
            <p className="kicker mb-3 text-signal-600">Have something for us?</p>
            <h3 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
              Send a tip.
            </h3>
            <p className="mt-3 text-ink-600">
              Documents, screenshots, voicemails — anonymously if you need it.
              We&rsquo;ll read every line.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-signal-600 group-hover:text-signal-700">
              Secure tip line <ArrowRight size={14} />
            </span>
          </Link>
        </Container>
      </section>
    </>
  );
}
