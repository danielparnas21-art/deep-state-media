import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { getTeam, initialsOf, type TeamMember } from "@/lib/team";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "The Team",
  description:
    "Founders, contributors, and the central figures behind Deep State Media — on the record.",
};

export default function TeamPage() {
  const team = getTeam();
  return (
    <div className="bg-[#06070d] text-paper">
      {/* ── Masthead ─────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-white/10 pb-24 pt-40 sm:pt-44">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-1/3 left-1/2 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(28,60,107,0.5),transparent_66%)] blur-3xl" />
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
            Who we are
          </p>
          <h1 className="display-stencil text-[clamp(2.8rem,8vw,7rem)] leading-[0.98]">
            Meet the{" "}
            <span className="accent-signal">team.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-deck text-paper/65">
            The founders and central figures building Deep State Media — on the
            record, in their own words.
          </p>
        </div>
      </section>

      {/* ── Members ──────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <ul className="mx-auto w-full max-w-[1480px] space-y-28 px-6 sm:px-8 lg:space-y-36 lg:px-12">
          {team.map((m, i) => (
            <RevealOnScroll key={m.slug} as="li" amount={0.15} className="group">
              <MemberRow member={m} index={i} />
            </RevealOnScroll>
          ))}
        </ul>
      </section>

      {/* ── Closing nudge ────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-navy-950 py-20">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col items-start justify-between gap-8 px-6 sm:flex-row sm:items-center sm:px-8 lg:px-12">
          <h2 className="display-stencil text-[clamp(1.6rem,3.5vw,2.6rem)] leading-tight">
            Want in early?{" "}
            <span className="accent-signal">Join the waitlist.</span>
          </h2>
          <Link
            href="/#waitlist"
            className="group inline-flex items-center gap-3 rounded-full bg-signal-500 px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-signal-600"
          >
            Get notified at launch
            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}

function MemberRow({ member: m, index }: { member: TeamMember; index: number }) {
  const flip = index % 2 === 1;
  return (
    <article
      id={m.slug}
      className={cn(
        "grid grid-cols-1 items-start gap-10 lg:gap-16",
        flip
          ? "lg:grid-cols-[1fr_minmax(0,420px)]"
          : "lg:grid-cols-[minmax(0,420px)_1fr]",
      )}
    >
      {/* Portrait */}
      <div
        className={cn(
          "group/photo mx-auto w-full max-w-[420px] lg:mx-0 lg:sticky lg:top-28",
          flip && "lg:order-2 lg:ml-auto",
        )}
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.9)] ring-1 ring-white/5">
          {m.portrait ? (
            <div
              aria-hidden
              className="aspect-[4/5] bg-navy-900 bg-cover bg-center transition-transform duration-700 ease-out group-hover/photo:scale-[1.04]"
              style={{ backgroundImage: `url(${m.portrait})` }}
            />
          ) : (
            <PortraitPending initials={initialsOf(m.name)} />
          )}
        </div>
      </div>

      {/* Bio */}
      <div className={cn("max-w-prose", flip && "lg:order-1 lg:ml-auto")}>
        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-signal-400">
          {m.role}
        </p>
        {m.roleSub && (
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-paper/40">
            {m.roleSub}
          </p>
        )}
        <h2 className="mt-4 display-stencil text-[clamp(2rem,4.5vw,3.6rem)] leading-[0.95] text-paper">
          {m.name}
        </h2>

        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-paper/65">
          {m.bio.split(/\n\n+/).map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {m.quote && (
          <figure className="mt-8 border-l-2 border-signal-500/70 pl-6">
            <blockquote className="font-serif text-[clamp(1.15rem,1.6vw,1.4rem)] italic leading-snug text-paper/90">
              &ldquo;{m.quote.text}&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/45">
              {m.quote.source ? (
                <a
                  href={m.quote.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-signal-400"
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
      </div>
    </article>
  );
}

/** Dark editorial placeholder for members without a portrait file yet. */
function PortraitPending({ initials }: { initials: string }) {
  return (
    <div
      aria-hidden
      className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-navy-950"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(120,150,199,0.5) 0 1px, transparent 1px 12px)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(120%_60%_at_50%_100%,rgba(28,60,107,0.35),transparent_70%)]"
      />
      <span className="display-stencil relative z-10 text-[clamp(4rem,8vw,6.5rem)] leading-none text-navy-200">
        {initials}
      </span>
      <span
        aria-hidden
        className="absolute right-3 top-3 inline-block h-1.5 w-1.5 rotate-45 bg-signal-500"
      />
      <span className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/35">
        Portrait pending
      </span>
    </div>
  );
}
