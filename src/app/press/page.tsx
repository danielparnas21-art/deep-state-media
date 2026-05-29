import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { getPress, type PressItem } from "@/lib/press";

export const metadata: Metadata = {
  title: "Press",
  description:
    "Deep State Media in the news — coverage of our work, our team, and the stories both parties would rather bury.",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PressPage() {
  const items = getPress();
  const featured = items.find((p) => p.featured) ?? items[0];
  const rest = items.filter((p) => p !== featured);

  return (
    <div className="bg-[#06070d] text-paper">
      {/* ── Masthead ─────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-white/10 pb-20 pt-40 sm:pt-44">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-1/3 left-1/2 h-[64vh] w-[64vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(28,60,107,0.5),transparent_66%)] blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(120,150,199,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(120,150,199,0.7) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              maskImage:
                "radial-gradient(ellipse 90% 70% at 50% 30%, black 40%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1480px] px-6 sm:px-8 lg:px-12">
          <p className="mb-6 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-navy-200">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-500" />
            In the news
          </p>
          <h1 className="display-stencil text-[clamp(2.8rem,8vw,7rem)] leading-[0.98]">
            The <span className="accent-signal">coverage.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-deck text-paper/65">
            Every story written about Deep State Media, our team, and the work —
            collected in one place, on the record. More lands as it publishes.
          </p>
        </div>
      </section>

      {/* ── Featured ─────────────────────────────────────────── */}
      {featured && (
        <section className="border-b border-white/10 py-16 sm:py-20">
          <div className="mx-auto w-full max-w-[1480px] px-6 sm:px-8 lg:px-12">
            <FeaturedCard item={featured} />
          </div>
        </section>
      )}

      {/* ── The rest ─────────────────────────────────────────── */}
      {rest.length > 0 && (
        <section className="py-16 sm:py-20">
          <ul className="mx-auto w-full max-w-[1480px] divide-y divide-white/10 px-6 sm:px-8 lg:px-12">
            {rest.map((item, i) => (
              <RevealOnScroll key={item.url} as="li" amount={0.2}>
                <PressRow item={item} index={i} />
              </RevealOnScroll>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function FeaturedCard({ item }: { item: PressItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-colors hover:border-signal-500/40 hover:bg-white/[0.05] sm:p-12"
    >
      <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em]">
        <span className="rounded-full bg-signal-500/15 px-3 py-1 text-signal-400">
          Featured
        </span>
        <span className="text-paper/55">{item.outlet}</span>
        <span className="text-paper/30">{fmtDate(item.date)}</span>
      </div>
      <h2 className="mt-6 max-w-4xl font-serif text-[clamp(1.6rem,3.6vw,2.8rem)] leading-[1.1] text-paper transition-colors group-hover:text-white">
        {item.title}
      </h2>
      {item.excerpt && (
        <p className="mt-5 max-w-2xl text-deck text-paper/60">{item.excerpt}</p>
      )}
      <span className="mt-8 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-signal-400">
        Read the story
        <ArrowUpRight
          size={15}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
    </a>
  );
}

function PressRow({ item }: { item: PressItem; index: number }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 py-7 transition-colors sm:flex-row sm:items-center sm:gap-8"
    >
      <div className="flex shrink-0 items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] sm:w-48">
        <span className="text-signal-400">{item.outlet}</span>
        <span className="text-paper/30">{fmtDate(item.date)}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-[clamp(1.15rem,2vw,1.5rem)] leading-snug text-paper/90 transition-colors group-hover:text-white">
          {item.title}
        </h3>
        {item.excerpt && (
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-paper/55">
            {item.excerpt}
          </p>
        )}
      </div>
      <ArrowUpRight
        size={18}
        className="hidden shrink-0 text-paper/30 transition-all group-hover:text-signal-400 sm:block group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}
