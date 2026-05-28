import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { WritingCard } from "@/components/writings/WritingCard";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import type { Writing } from "@/lib/writings";

export function LatestWritings({ items }: { items: Writing[] }) {
  const [lead, ...rest] = items;
  if (!lead) {
    return (
      <section
        id="latest"
        className="relative border-t border-white/5 bg-ink-950 py-32"
      >
        <Container>
          <p className="kicker mb-4">Latest from the column</p>
          <h2 className="display-stencil text-title text-ink-50">
            The Column is loading.
          </h2>
          <p className="mt-6 max-w-prose text-ink-300">
            Lev&rsquo;s Substack feed is temporarily unreachable. Read{" "}
            <a
              href="https://levremembers.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal-300 underline underline-offset-4"
            >
              Lev Remembers
            </a>{" "}
            directly while we re-sync.
          </p>
        </Container>
      </section>
    );
  }
  return (
    <section
      id="latest"
      aria-labelledby="latest-heading"
      className="relative border-t border-white/5 bg-ink-950 py-32"
    >
      <Container>
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="kicker mb-4 flex items-center gap-3">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-pulse-dot rounded-full bg-signal-500" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-400" />
              </span>
              Latest from Lev — published live
            </p>
            <h2 id="latest-heading" className="display-stencil text-title text-ink-50">
              The Column.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/writings"
              className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-200 hover:text-signal-300"
            >
              All writings
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-signal-500">
                <ArrowRight size={14} />
              </span>
            </Link>
            <a
              href="https://levremembers.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-signal-500/40 bg-signal-500/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-signal-100 transition-colors hover:bg-signal-500 hover:text-black"
            >
              Subscribe <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <div className="grid gap-14 lg:grid-cols-[1.6fr_1fr]">
          <RevealOnScroll>
            <WritingCard item={lead} size="lg" />
          </RevealOnScroll>
          <div className="grid content-start gap-12">
            {rest.slice(0, 2).map((item, i) => (
              <RevealOnScroll key={item.guid} delay={0.1 + i * 0.08}>
                <WritingCard item={item} size="sm" />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
