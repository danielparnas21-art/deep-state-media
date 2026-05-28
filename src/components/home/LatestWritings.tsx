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
        className="relative border-t border-ink-900/10 bg-paper py-28"
      >
        <Container>
          <p className="kicker mb-4">Latest from the column</p>
          <h2 className="display-stencil text-title text-ink-900">
            The Column is loading.
          </h2>
          <p className="mt-6 max-w-prose text-ink-500">
            Lev&rsquo;s Substack feed is temporarily unreachable. Read{" "}
            <a
              href="https://levremembers.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy-600 underline underline-offset-4"
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
      className="relative border-t border-ink-900/10 bg-paper py-28"
    >
      <Container>
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="kicker mb-4 flex items-center gap-2.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-500" />
              Latest from Lev — published live
            </p>
            <h2 id="latest-heading" className="display-stencil text-title text-ink-900">
              The Column.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/writings"
              className="group inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-600 hover:text-navy-600"
            >
              All writings
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/20 transition-colors group-hover:border-navy-600">
                <ArrowRight size={14} />
              </span>
            </Link>
            <a
              href="https://levremembers.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-signal-500 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-signal-600"
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
