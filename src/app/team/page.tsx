import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Monogram } from "@/components/team/Monogram";
import { TEAM, initialsOf } from "@/lib/team";

export const metadata: Metadata = {
  title: "The Team",
  description:
    "Founders, contributors, and the central figures behind Deep State Media — on the record.",
};

export default function TeamPage() {
  return (
    <>
      <section className="relative border-b border-white/5 pb-20 pt-40">
        <Container>
          <p className="kicker mb-6">The Masthead</p>
          <h1 className="display-stencil text-hero text-ink-50">
            By name.
            <br />
            <span className="text-signal-500">On record.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-deck text-ink-200">
            Reader-funded means reader-accountable. Every byline below is a
            human you can email. Every claim has a date attached and a source
            you can check.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <ul className="space-y-24">
            {TEAM.map((m, i) => (
              <RevealOnScroll
                key={m.slug}
                as="li"
                delay={i * 0.05}
                className="group relative"
              >
                <article
                  id={m.slug}
                  className="grid grid-cols-1 gap-10 lg:grid-cols-[320px_1fr] lg:gap-16"
                >
                  {/* Portrait column */}
                  <div className="lg:sticky lg:top-32 lg:self-start">
                    <div className="relative">
                      <span className="absolute -left-3 -top-3 z-10 rounded-full bg-signal-500 px-2.5 py-1 font-mono text-[10px] font-medium tabular-nums uppercase tracking-[0.18em] text-black">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {m.portrait ? (
                        <div
                          aria-hidden
                          className="aspect-[4/5] overflow-hidden rounded-md border border-white/10 bg-cover bg-center grayscale transition-all duration-700 group-hover:grayscale-0"
                          style={{ backgroundImage: `url(${m.portrait})` }}
                        />
                      ) : (
                        <Monogram
                          initials={initialsOf(m.name)}
                          className="aspect-[4/5]"
                        />
                      )}
                    </div>

                    {m.beats && m.beats.length > 0 && (
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {m.beats.map((b) => (
                          <li
                            key={b}
                            className="rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-100"
                          >
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Bio column */}
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-400">
                      {m.role}
                    </p>
                    {m.roleSub && (
                      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-300">
                        {m.roleSub}
                      </p>
                    )}
                    <h2 className="mt-4 display-stencil text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-ink-50">
                      {m.name}
                    </h2>

                    <p className="mt-8 max-w-prose text-ink-200">{m.bio}</p>

                    {m.quote && (
                      <figure className="relative mt-10 rounded-md border-l-2 border-signal-500 bg-ink-900/40 p-6 pl-8">
                        <Quote
                          size={14}
                          className="absolute left-3 top-6 text-signal-500"
                          aria-hidden
                        />
                        <blockquote className="display-stencil text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.15] text-ink-50">
                          {m.quote.text}
                        </blockquote>
                        <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-300">
                          {m.quote.source ? (
                            <a
                              href={m.quote.source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 hover:text-signal-300"
                            >
                              — {m.quote.cite}
                              <ExternalLink size={11} />
                            </a>
                          ) : (
                            <span>— {m.quote.cite}</span>
                          )}
                        </figcaption>
                      </figure>
                    )}

                    {m.links && m.links.length > 0 && (
                      <ul className="mt-8 flex flex-wrap items-center gap-3">
                        {m.links.map((l) => {
                          const external = /^https?:/.test(l.href);
                          if (external) {
                            return (
                              <li key={l.label}>
                                <a
                                  href={l.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-100 transition-colors hover:border-signal-500/60 hover:text-signal-300"
                                >
                                  {l.label}
                                  <ExternalLink size={11} />
                                </a>
                              </li>
                            );
                          }
                          return (
                            <li key={l.label}>
                              <Link
                                href={l.href}
                                className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-100 transition-colors hover:border-signal-500/60 hover:text-signal-300"
                              >
                                {l.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
