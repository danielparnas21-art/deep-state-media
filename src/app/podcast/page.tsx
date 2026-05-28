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
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-navy-900 pb-20 pt-40 text-paper">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 top-10 select-none font-display text-[clamp(14rem,22vw,28rem)] font-semibold leading-none tracking-tight text-white/[0.03]"
        >
          {String(latest.number).padStart(2, "0")}
        </div>
        <Container className="relative">
          <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-200">
            The Briefing Room — Podcast
          </p>
          <h1 className="display-stencil text-hero text-paper">
            Tape from
            <br />
            <span className="italic text-signal-400">the room.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-deck text-navy-100/80">
            Weekly long-form. Lobbyists, lawyers, defectors, donors. We record
            the call. We publish the source list. You hear what they actually
            said.
          </p>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-200">
                Now playing — Latest
              </p>
              <h2 className="font-display text-headline font-semibold leading-tight tracking-tight text-paper">
                {latest.title}
              </h2>
              <p className="mt-4 max-w-prose text-navy-100/80">
                {latest.description}
              </p>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-200/70">
                Episode {String(latest.number).padStart(2, "0")} ·{" "}
                {formatDate(latest.publishedAt)} ·{" "}
                {formatDuration(latest.durationSec)}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {latest.guests.map((g) => (
                  <li
                    key={g}
                    className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-paper"
                  >
                    {g}
                  </li>
                ))}
              </ul>
            </div>
            <AudioPlayer src={latest.audioUrl} title={latest.title} />
          </div>

          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-200">
              Subscribe
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {PODCAST_SHOWS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:border-white/50"
                >
                  {s.name}
                  <ExternalLink size={12} />
                </a>
              ))}
              <a
                href="/podcast/rss.xml"
                className="inline-flex items-center gap-2 rounded-full bg-signal-500 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-signal-600"
              >
                <Rss size={14} />
                RSS feed
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-navy-950 py-24 text-paper">
        <Container>
          <div className="mb-12 flex items-end justify-between">
            <h2 className="display-stencil text-title text-paper">All episodes.</h2>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-200/70">
              {EPISODES.length} on file
            </p>
          </div>

          <ul className="divide-y divide-white/10">
            {[latest, ...rest].map((ep, i) => (
              <RevealOnScroll key={ep.slug} as="li" delay={i * 0.04}>
                <article className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 py-8 transition-colors hover:bg-white/5">
                  <div className="font-display text-2xl font-semibold tabular-nums text-navy-300 group-hover:text-signal-400">
                    {String(ep.number).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-paper transition-colors group-hover:text-signal-400">
                      {ep.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-navy-100/70">{ep.description}</p>
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-200/70">
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
