import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { InvestigationCard } from "@/components/investigation/InvestigationCard";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import type { InvestigationMeta } from "@/lib/investigations";

export function LatestInvestigations({ items }: { items: InvestigationMeta[] }) {
  const [lead, ...rest] = items;
  if (!lead) return null;
  return (
    <section
      id="latest"
      aria-labelledby="latest-heading"
      className="relative border-t border-white/5 bg-ink-950 py-32"
    >
      <Container>
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="kicker mb-4">Latest dispatches</p>
            <h2 id="latest-heading" className="display-stencil text-title text-ink-50">
              The Dossier.
            </h2>
          </div>
          <Link
            href="/investigations"
            className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-200 hover:text-signal-300"
          >
            All investigations
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-signal-500">
              <ArrowRight size={14} />
            </span>
          </Link>
        </div>

        <div className="grid gap-14 lg:grid-cols-[1.6fr_1fr]">
          <RevealOnScroll>
            <InvestigationCard item={lead} size="lg" />
          </RevealOnScroll>
          <div className="grid content-start gap-12">
            {rest.slice(0, 2).map((item, i) => (
              <RevealOnScroll key={item.slug} delay={0.1 + i * 0.08}>
                <InvestigationCard item={item} size="sm" />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
