/**
 * The single switch between V1 (gated coming-soon teaser) and V2 (the full site).
 *
 * While `LAUNCHED` is false the site ships as a brand teaser: the intro gate opens
 * onto a "Coming soon" landing, and the ONLY real page anyone can reach is
 * /team. Every other route (podcast, writings, campaign-desk, about, contact,
 * tip) is fully built but redirected back to / by the middleware.
 *
 * Flip this to `true` when the podcast, episodes, and the rest are ready — the
 * full V2 homepage and all inner pages come back with near-zero rework.
 */
export const LAUNCHED = false;

/** Routes reachable while !LAUNCHED. Everything else redirects to "/". */
export const V1_ALLOWED_PATHS = ["/", "/team"] as const;

/** True if `pathname` may be served while the site is still in V1 teaser mode. */
export function isAllowedInV1(pathname: string): boolean {
  return (V1_ALLOWED_PATHS as readonly string[]).includes(pathname);
}
