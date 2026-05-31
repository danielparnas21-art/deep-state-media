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
  /**
   * Substack uses enclosure for both cover images AND audio (live recordings,
   * podcast episodes). We must check `@_type` before assuming it's an image.
   */
  enclosure?: { "@_url"?: string; "@_type"?: string };
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

/**
 * URLs/fragments we treat as promotional / recurring elements in Lev's
 * posts (book cover, profile avatar, subscribe badges) and should not
 * pick as a per-post cover image.
 */
const SKIP_IMAGE_FRAGMENTS = [
  // Lev's Substack profile avatar — already used as his portrait elsewhere.
  "fa4728ad-99a5-4d28-9206-4d8efbced422",
  // Substack subscribe / share button asset paths.
  "/subscribe-button",
  "/share-button",
];

function isPromoImage(url: string): boolean {
  return SKIP_IMAGE_FRAGMENTS.some((frag) => url.includes(frag));
}

function imageWidthFromUrl(url: string): number {
  // Substack's image CDN encodes display width as `w_NNNN` inside the URL.
  const m = url.match(/[?&,/]w_(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

/**
 * Pull every <img src="..."> URL out of post-body HTML, in document order,
 * skipping the known-promo URLs (avatar, subscribe buttons).
 */
function allImagesFromHtml(html: string): string[] {
  if (!html) return [];
  const matches = Array.from(html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi));
  return matches.map((m) => m[1]).filter((src) => !isPromoImage(src));
}

/**
 * Substack proxies images through `substackcdn.com/image/fetch/<params>/<src>`.
 * Two posts referencing the same source image will have different proxy params
 * (width, quality, etc.), so we strip the proxy wrapper for cross-post
 * comparison.
 */
function canonicalImageKey(url: string): string {
  const m = url.match(/^https:\/\/[^/]+\/image\/fetch\/[^/]+\/(https?%3A%2F%2F[^"']+)$/i);
  if (m) {
    try {
      return decodeURIComponent(m[1]);
    } catch {
      return url;
    }
  }
  return url;
}

type ParsedItem = Writing & { _bodyImages: string[] };

function normalize(item: RawItem, fallbackAuthor: string): ParsedItem | null {
  const title = textify(item.title);
  const link = textify(item.link);
  if (!title || !link) return null;
  const guid =
    typeof item.guid === "string" ? item.guid : textify(item.guid) || link;
  const author = textify(item["dc:creator"]) || fallbackAuthor;
  const pubDate = textify(item.pubDate);
  const publishedAt = pubDate
    ? new Date(pubDate).toISOString()
    : new Date().toISOString();
  const descriptionRaw = textify(item.description);
  const contentRaw = textify(item["content:encoded"]);
  const dek = clipDek(stripHtml(descriptionRaw || contentRaw));
  // Substack enclosure points at an audio file on podcast/video posts —
  // only use it as a cover when the MIME type is an image.
  const encUrl = item.enclosure?.["@_url"];
  const encType = item.enclosure?.["@_type"] ?? "";
  const enclosureCover = encType.startsWith("image/") ? encUrl : undefined;
  const bodyImages = allImagesFromHtml(contentRaw);
  const rt = readingTime(stripHtml(contentRaw || descriptionRaw));

  return {
    guid,
    slug: slugifyFromLink(link),
    title,
    link,
    author,
    publishedAt,
    description: dek,
    // Cover from enclosure now; body-image fallback resolved post-dedup below.
    cover: enclosureCover,
    readingTimeMin: rt,
    _bodyImages: bodyImages,
  };
}

/**
 * After normalizing every item, promote a body image to cover for any item
 * still missing one — but only if that image is unique across the feed.
 * Recurring images (book promos, banner ads, signature graphics) appear in
 * many posts and would otherwise dominate the page.
 */
function resolveCoversAcrossFeed(parsed: ParsedItem[]): Writing[] {
  const counts = new Map<string, number>();
  for (const item of parsed) {
    for (const u of item._bodyImages) {
      const k = canonicalImageKey(u);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }

  return parsed.map((item) => {
    let cover = item.cover;
    if (!cover) {
      // Prefer a unique image with display width ≥ 600 if any; otherwise
      // any unique image at all.
      const unique = item._bodyImages.filter(
        (u) => counts.get(canonicalImageKey(u)) === 1,
      );
      cover =
        unique.find((u) => imageWidthFromUrl(u) >= 600) ?? unique[0];
    }
    // Strip the working field before exposing to consumers.
    const { _bodyImages: _omit, ...rest } = item;
    return { ...rest, cover };
  });
}

/**
 * Fetch any Substack RSS feed, parse it, and return a date-sorted list of posts.
 * Uses Next.js fetch revalidate so the feed is cached for 10 minutes — light on
 * requests, fresh enough to read as "live." Always resolves (returns [] on any
 * network/parse failure) so a feed hiccup never breaks the page.
 */
export async function fetchSubstack(
  feedUrl: string,
  fallbackAuthor: string,
): Promise<Writing[]> {
  let xml = "";
  try {
    const res = await fetch(feedUrl, {
      next: { revalidate: 120 },
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
  const parsedItems = (Array.isArray(rawItems) ? rawItems : [rawItems])
    .map((it) => normalize(it, fallbackAuthor))
    .filter((w): w is ParsedItem => w !== null);

  const items = resolveCoversAcrossFeed(parsedItems);

  return items.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/** Lev Parnas's "Lev Remembers" column. */
export async function listWritings(): Promise<Writing[]> {
  return fetchSubstack(SUBSTACK_FEED, SUBSTACK_AUTHOR);
}
