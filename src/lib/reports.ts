import { fetchSubstack, type Writing } from "@/lib/writings";

/**
 * The Deep State Media Substack (@deepstatemedia) — the brand's own publication.
 * Everything posted there is pulled in live and surfaced on the site as Reports.
 *
 * If the publication moves to a custom domain, change REPORTS_FEED to that
 * domain's RSS (e.g. https://read.deepstate.media/feed) — nothing else changes.
 */
export const REPORTS_FEED = "https://deepstatemedia.substack.com/feed";
export const REPORTS_HOME = "https://substack.com/@deepstatemedia";
export const REPORTS_AUTHOR = "Deep State Media";

export type Report = Writing;

export async function listReports(): Promise<Report[]> {
  return fetchSubstack(REPORTS_FEED, REPORTS_AUTHOR);
}
