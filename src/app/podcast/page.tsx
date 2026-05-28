import type { Metadata } from "next";
import { Rss, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AudioPlayer } from "@/components/podcast/AudioPlayer";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { EPISODES, formatDuration } from "@/lib/episodes";

export const metadata: Metadata = {
  title: "The Briefing Room — Podcast",
  description:
    "Weekly long-form journalism on tape. Lobbyists, lawyers, defectors, donors — we record the call, publish the source list, and let you hear what they actually said.",
};

const PODCAST_SHOWS = [
  { name: "Apple Podcasts", href: "#" },
  { name: "Spotify", href: "#" },
  { name: "Overcast", href: "#" },
  { name: "Pocket Casts", href: "#" },
];

export default function PodcastPage() {
  const [latest, ...rest] = EPISODES;
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/5 pb-20 pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 top-10 select-none font-display text-[clamp(14rem,22vw,28rem)] font-bold leading-none tracking-tightest text-white/[0.025]"
        >
          {String(latest.number).padStart(2, "0")}
        </div>
        <Container className="relative">
          <p className="kicker mb-6">The Briefing Room — Podcast</p>
          <h1 className="display-stencil text-hero text-ink-50">
            Tape from
            <br />
            <span className="text-signal-500">the room.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-deck text-ink-200">
            Weekly long-form. Lobbyists, lawyers, defectors, donors. We record
            the call. We publish the source list. You hear what they actually
            said.
          </p>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="kicker mb-3">Now playing — Latest</p>
              <h2 className="font-display text-headline font-bold leading-tight tracking-tight text-ink-50">
                {latest.title}
              </h2>
              <p className="mt-4 max-w-prose text-ink-200">
                {latest.description}
              </p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
                Episode {String(latest.number).padStart(2, "0")} ·{" "}
                {formatDate(latest.publishedAt)} ·{" "}
                {formatDuration(latest.durationSec)}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {latest.guests.map((g) => (
                  <li
                    key={g}
                    className="rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-100"
                  >
                    {g}
                  </li>
                ))}
              </ul>
            </div>
            <AudioPlayer src={latest.audioUrl} title={latest.title} />
          </div>

          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="kicker mb-4">Subscribe</p>
            <div className="flex flex-wrap items-center gap-3">
              {PODCAST_SHOWS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-100 hover:border-signal-500/60 hover:text-signal-300"
                >
                  {s.name}
                  <ExternalLink size={12} />
                </a>
              ))}
              <a
                href="/podcast/rss.xml"
                className="inline-flex items-center gap-2 rounded-full border border-signal-500/40 bg-signal-500/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-signal-100 hover:bg-signal-500 hover:text-black"
              >
                <Rss size={14} />
                RSS feed
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/5 py-24">
        <Container>
          <div className="mb-12 flex items-end justify-between">
            <h2 className="display-stencil text-title text-ink-50">All episodes.</h2>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
              {EPISODES.length} on file
            </p>
          </div>

          <ul className="divide-y divide-white/5">
            {[latest, ...rest].map((ep, i) => (
              <RevealOnScroll key={ep.slug} as="li" delay={i * 0.04}>
                <article className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 py-8 transition-colors hover:bg-ink-900/30">
                  <div className="font-mono text-2xl font-medium tabular-nums text-ink-300 group-hover:text-signal-400">
                    {String(ep.number).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold leading-tight tracking-tight text-ink-50 transition-colors group-hover:text-signal-300">
                      {ep.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-ink-300">{ep.description}</p>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
                      {formatDate(ep.publishedAt)} · {formatDuration(ep.durationSec)} · {ep.guests[0]}
                    </p>
                  </div>
                  <div
                    className="hidden h-20 w-20 shrink-0 rounded-md border border-white/10 bg-cover bg-center md:block"
                    style={{ backgroundImage: `url(${ep.cover})` }}
                    aria-hidden
                  />
                </article>
              </RevealOnScroll>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
