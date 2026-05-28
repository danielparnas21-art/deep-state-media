export type Episode = {
  number: number;
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  durationSec: number;
  audioUrl: string;
  cover: string;
  guests: string[];
  transcriptUrl?: string;
};

/**
 * Placeholder episode catalog. The Podcast page will consume this until a
 * real CMS / audio host is wired up. Audio URLs point at a public test stream
 * so the player works end-to-end during development; swap out with the real
 * production CDN before launch.
 */
export const EPISODES: Episode[] = [
  {
    number: 14,
    slug: "ep-14-the-lobbyist-pipeline",
    title: "The Lobbyist Pipeline — How Florida's 27th Got Bought",
    description:
      "We trace the money from three shell PACs into a single congressional race — and ask the donors, on tape, what they thought they were buying.",
    publishedAt: "2026-05-24",
    durationSec: 3138,
    audioUrl: "https://archive.org/download/testmp3testfile/mpthreetest.mp3",
    cover:
      "https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?auto=format&fit=crop&w=1600&q=80",
    guests: ["Lev Parnas", "Anita Tran (FEC analyst)"],
    transcriptUrl: "#transcript",
  },
  {
    number: 13,
    slug: "ep-13-the-third-letter",
    title: "The Third Letter — An Intelligence Memo Without a Signature",
    description:
      "Inside an unsigned intelligence memo that circulated through three agencies, two committees, and one network green room before anyone agreed who wrote it.",
    publishedAt: "2026-05-10",
    durationSec: 2742,
    audioUrl: "https://archive.org/download/testmp3testfile/mpthreetest.mp3",
    cover:
      "https://images.unsplash.com/photo-1521120098171-3ac6c4f3d2dc?auto=format&fit=crop&w=1600&q=80",
    guests: ["Former senior ODNI analyst (on-record)"],
  },
  {
    number: 12,
    slug: "ep-12-the-vendor-pattern",
    title: "The Vendor Pattern — Six Campaigns, One Delaware LLC",
    description:
      "Cross-cycle FEC analysis pulls every Schedule B entry naming the same Delaware-registered media-services LLC across six federal campaign committees, 2024–2026.",
    publishedAt: "2026-04-29",
    durationSec: 2210,
    audioUrl: "https://archive.org/download/testmp3testfile/mpthreetest.mp3",
    cover:
      "https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&w=1600&q=80",
    guests: ["Jonathan Hay", "Anonymous campaign treasurer"],
  },
  {
    number: 11,
    slug: "ep-11-foreign-money-domestic-doors",
    title: "Foreign Money, Domestic Doors",
    description:
      "A Gulf-state sovereign wealth fund quietly capitalized a US think tank that, six months later, wrote a policy memo two senators read on the floor verbatim.",
    publishedAt: "2026-04-12",
    durationSec: 3402,
    audioUrl: "https://archive.org/download/testmp3testfile/mpthreetest.mp3",
    cover:
      "https://images.unsplash.com/photo-1554260570-9140fd3b7614?auto=format&fit=crop&w=1600&q=80",
    guests: ["Daniel Parnas", "FARA compliance attorney"],
  },
];

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
