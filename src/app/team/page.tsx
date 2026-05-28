import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { TEAM } from "@/lib/team";

export const metadata: Metadata = {
  title: "The Team",
  description:
    "Founders, contributors, and the central figures behind Deep State Media.",
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
            human you can email. Every story we file has a name attached.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <ul className="divide-y divide-white/5">
            {TEAM.map((m, i) => (
              <RevealOnScroll
                key={m.slug}
                as="li"
                delay={i * 0.06}
                className="group grid grid-cols-1 gap-8 py-14 md:grid-cols-[280px_1fr_auto] md:items-start md:gap-12"
              >
                <div
                  aria-hidden
                  className="aspect-square overflow-hidden rounded-md border border-white/10 bg-cover bg-center grayscale transition-all duration-700 group-hover:grayscale-0"
                  style={{ backgroundImage: `url(${m.portrait})` }}
                />
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-400">
                    {m.role}
                  </p>
                  <h2 className="mt-2 display-stencil text-[clamp(2rem,5vw,4rem)] leading-[0.95] text-ink-50">
                    {m.name}
                  </h2>
                  <p className="mt-5 max-w-2xl text-ink-200">{m.bio}</p>

                  {m.beats && m.beats.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {m.beats.map((b) => (
                        <li
                          key={b}
                          className="rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-100"
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {m.links && (
                  <ul className="space-y-2 self-end">
                    {m.links.map((l) => {
                      const external = /^https?:/.test(l.href);
                      return (
                        <li key={l.label}>
                          {external ? (
                            <a
                              href={l.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-200 hover:text-signal-300"
                            >
                              <span className="h-px w-3 bg-white/30 transition-all duration-500 group-hover:w-6 group-hover:bg-signal-500" />
                              {l.label} ↗
                            </a>
                          ) : (
                            <Link
                              href={l.href}
                              className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-200 hover:text-signal-300"
                            >
                              <span className="h-px w-3 bg-white/30 transition-all duration-500 group-hover:w-6 group-hover:bg-signal-500" />
                              {l.label}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </RevealOnScroll>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
