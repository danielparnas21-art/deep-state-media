import { XMLParser } from "fast-xml-parser";

/**
 * Lev Parnas's Substack — "Lev Remembers" — is the editorial column that
 * currently feeds the Deep State Media Writings section. Every post is hosted
 * on Substack; we surface them on our site and link out to the original.
 */
export const SUBSTACK_FEED = "https://levremembers.substack.com/feed";
export const SUBSTACK_HOME = "https://levremembers.substack.com";
export const SUBSTACK_AUTHOR = "Lev Parnas";
export const SUBSTACK_TITLE = "Lev Remembers";

export type Writing = {
  guid: string;
  slug: string;          // derived from link path
  title: string;
  link: string;          // external Substack URL
  author: string;
  publishedAt: string;   // ISO 8601
  description: string;   // plain-text lede
  cover?: string;
  readingTimeMin: number;
};

type RawItem = {
  title?: string;
  link?: string;
  guid?: string | { "#text"?: string };
  description?: string;
  pubDate?: string;
  "dc:creator"?: string;
  enclosure?: { "@_url"?: string };
  "content:encoded"?: string;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  cdataPropName: "#cdata",
  textNodeName: "#text",
  trimValues: true,
});

function textify(node: unknown): string {
  if (typeof node === "string") return node;
  if (node && typeof node === "object") {
    const n = node as { "#cdata"?: string; "#text"?: string };
    if (typeof n["#cdata"] === "string") return n["#cdata"];
    if (typeof n["#text"] === "string") return n["#text"];
  }
  return "";
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8212;/g, "—")
    .replace(/&#8211;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function readingTime(plainText: string): number {
  const words = plainText.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function slugifyFromLink(link: string): string {
  try {
    const u = new URL(link);
    const parts = u.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? u.pathname;
  } catch {
    return link;
  }
}

function clipDek(plain: string, max = 220): string {
  if (plain.length <= max) return plain;
  const sliced = plain.slice(0, max);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${sliced.slice(0, lastSpace > 80 ? lastSpace : max)}…`;
}

function normalize(item: RawItem): Writing | null {
  const title = textify(item.title);
  const link = textify(item.link);
  if (!title || !link) return null;
  const guid =
    typeof item.guid === "string" ? item.guid : textify(item.guid) || link;
  const author = textify(item["dc:creator"]) || SUBSTACK_AUTHOR;
  const pubDate = textify(item.pubDate);
  const publishedAt = pubDate
    ? new Date(pubDate).toISOString()
    : new Date().toISOString();
  const descriptionRaw = textify(item.description);
  const contentRaw = textify(item["content:encoded"]);
  const dek = clipDek(stripHtml(descriptionRaw || contentRaw));
  const cover = item.enclosure?.["@_url"];
  const rt = readingTime(stripHtml(contentRaw || descriptionRaw));

  return {
    guid,
    slug: slugifyFromLink(link),
    title,
    link,
    author,
    publishedAt,
    description: dek,
    cover,
    readingTimeMin: rt,
  };
}

/**
 * Fetches Lev's Substack RSS, parses, and returns a sorted list of Writings.
 * Uses Next.js's fetch revalidate so the feed is cached on the edge for 10
 * minutes — keeps requests light, keeps the surface fresh enough for an
 * editorial column.
 */
export async function listWritings(): Promise<Writing[]> {
  let xml = "";
  try {
    const res = await fetch(SUBSTACK_FEED, {
      next: { revalidate: 600 },
      headers: { "User-Agent": "DeepStateMedia/1.0 (+https://deepstate.media)" },
    });
    if (!res.ok) return [];
    xml = await res.text();
  } catch {
    return [];
  }

  let parsed: { rss?: { channel?: { item?: RawItem[] | RawItem } } } = {};
  try {
    parsed = parser.parse(xml);
  } catch {
    return [];
  }

  const rawItems = parsed.rss?.channel?.item;
  if (!rawItems) return [];
  const items = (Array.isArray(rawItems) ? rawItems : [rawItems])
    .map(normalize)
    .filter((w): w is Writing => w !== null);

  return items.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}
