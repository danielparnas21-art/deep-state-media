import { fetchSubstack, type Writing } from "@/lib/writings";

/**
 * The Deep State Media Substack(s). The brand currently publishes across two
 * publications — both named "Deep State Media" — so we pull both feeds, merge,
 * dedupe, and sort by date. Everything posted to either lands on the site live.
 *
 * Add/remove a feed here if publications consolidate or a custom domain is set;
 * a dead/unreachable feed just resolves to nothing (it never breaks the page).
 */
export const REPORTS_FEEDS = [
  "https://deepstatemediainc.substack.com/feed",
  "https://deepstatemedia.substack.com/feed",
];
export const REPORTS_HOME = "https://substack.com/@deepstatemedia";
export const REPORTS_AUTHOR = "Deep State Media";

export type Report = Writing;

export async function listReports(): Promise<Report[]> {
  const feeds = await Promise.all(
    REPORTS_FEEDS.map((url) => fetchSubstack(url, REPORTS_AUTHOR)),
  );
  const seen = new Set<string>();
  const merged = feeds.flat().filter((r) => {
    const key = r.guid || r.link;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return merged.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}
