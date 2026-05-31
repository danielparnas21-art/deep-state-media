import { EPISODES } from "@/lib/episodes";

const SITE = "https://deepstatemedia.co";
const SHOW = {
  title: "The Briefing Room — Deep State Media",
  description:
    "Weekly long-form investigative journalism on tape. Lobbyists, lawyers, defectors, donors — we record the call, publish the source list.",
  author: "Deep State Media",
  email: "podcast@deepstatemedia.co",
  language: "en-us",
  category: "News",
  image: `${SITE}/podcast-cover.jpg`,
};

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(iso: string) {
  return new Date(iso).toUTCString();
}

function iTunesDuration(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export const dynamic = "force-static";

export function GET() {
  const items = EPISODES.map((ep) => `
    <item>
      <title>${escapeXml(ep.title)}</title>
      <description><![CDATA[${ep.description}]]></description>
      <link>${SITE}/podcast#${ep.slug}</link>
      <guid isPermaLink="false">${SITE}/podcast/${ep.slug}</guid>
      <pubDate>${rfc822(ep.publishedAt)}</pubDate>
      <enclosure url="${ep.audioUrl}" length="0" type="audio/mpeg"/>
      <itunes:author>${escapeXml(SHOW.author)}</itunes:author>
      <itunes:duration>${iTunesDuration(ep.durationSec)}</itunes:duration>
      <itunes:episode>${ep.number}</itunes:episode>
      <itunes:explicit>false</itunes:explicit>
      <itunes:image href="${ep.cover}"/>
    </item>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SHOW.title)}</title>
    <description><![CDATA[${SHOW.description}]]></description>
    <link>${SITE}/podcast</link>
    <language>${SHOW.language}</language>
    <copyright>© ${new Date().getFullYear()} Deep State Media</copyright>
    <itunes:author>${escapeXml(SHOW.author)}</itunes:author>
    <itunes:summary><![CDATA[${SHOW.description}]]></itunes:summary>
    <itunes:owner>
      <itunes:name>${escapeXml(SHOW.author)}</itunes:name>
      <itunes:email>${SHOW.email}</itunes:email>
    </itunes:owner>
    <itunes:image href="${SHOW.image}"/>
    <itunes:category text="${SHOW.category}"/>
    <itunes:explicit>false</itunes:explicit>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
