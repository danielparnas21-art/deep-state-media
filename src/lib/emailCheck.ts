/**
 * Dependency-free email checks shared by the client (typo hints) and the server
 * (disposable blocking). The MX-record check lives server-side in the subscribe
 * route since it needs Node's dns. Goal: keep junk and typo'd emails off the
 * waitlist without adding friction for real people.
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function domainOf(email: string): string {
  return email.split("@")[1]?.trim().toLowerCase() ?? "";
}

/** Common throwaway / temp-mail domains. Not exhaustive, but covers the bulk. */
const DISPOSABLE = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.info",
  "grr.la",
  "sharklasers.com",
  "10minutemail.com",
  "10minutemail.net",
  "tempmail.com",
  "temp-mail.org",
  "tempmail.net",
  "tempmailo.com",
  "throwawaymail.com",
  "yopmail.com",
  "getnada.com",
  "nada.email",
  "trashmail.com",
  "mailnesia.com",
  "maildrop.cc",
  "dispostable.com",
  "fakeinbox.com",
  "mintemail.com",
  "spamgourmet.com",
  "mohmal.com",
  "emailondeck.com",
  "moakt.com",
  "mailcatch.com",
  "tmpmail.org",
  "tmpmail.net",
  "burnermail.io",
  "33mail.com",
  "spam4.me",
  "mailpoof.com",
  "discard.email",
  "dropmail.me",
  "harakirimail.com",
]);

export function isDisposableEmail(email: string): boolean {
  return DISPOSABLE.has(domainOf(email));
}

/** Popular providers — used to spot 1–2 char typos of the domain. */
const COMMON_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "live.com",
  "msn.com",
  "comcast.net",
  "me.com",
  "proton.me",
  "protonmail.com",
];

function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array<number>(n + 1).fill(0),
  );
  for (let i = 0; i <= m; i += 1) dp[i][0] = i;
  for (let j = 0; j <= n; j += 1) dp[0][j] = j;
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/**
 * If the domain looks like a 1–2 character typo of a popular provider
 * (gmial.com → gmail.com), return the corrected email; otherwise null.
 */
export function suggestEmailFix(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 0) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase();
  if (!domain || COMMON_DOMAINS.includes(domain)) return null;
  let best: { domain: string; dist: number } | null = null;
  for (const candidate of COMMON_DOMAINS) {
    const dist = editDistance(domain, candidate);
    if (dist > 0 && dist <= 2 && (!best || dist < best.dist)) {
      best = { domain: candidate, dist };
    }
  }
  return best ? `${local}@${best.domain}` : null;
}
