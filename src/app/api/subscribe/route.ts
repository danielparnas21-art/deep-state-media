import { NextResponse } from "next/server";
import { promises as dns } from "node:dns";
import { saveSubscriber } from "@/lib/subscribers";
import { EMAIL_RE, domainOf, isDisposableEmail } from "@/lib/emailCheck";

/**
 * Waitlist intake for the coming-soon teaser (the intro gate + the ComingSoon
 * form both POST here). Validates the email — format, disposable domains, and a
 * live MX-record check so the domain can actually receive mail — then hands off
 * to saveSubscriber (Vercel KV / Upstash in prod, local file in dev).
 *
 * Privacy posture: we do NOT log IP, user-agent, or referrer — only the email
 * the visitor chose to give. Do not add request-metadata logging here.
 */

// Needs the Node runtime for dns (MX lookups); the file fallback needs it too.
export const runtime = "nodejs";

/**
 * Does this domain accept mail? Rejects only when the domain demonstrably can't
 * (no MX and no A record) — every transient/unknown DNS failure FAILS OPEN so a
 * real visitor is never wrongly blocked.
 */
async function domainAcceptsMail(domain: string): Promise<boolean> {
  const withTimeout = <T,>(p: Promise<T>): Promise<T> =>
    Promise.race([
      p,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error("dns-timeout")), 3000),
      ),
    ]);
  try {
    const mx = await withTimeout(dns.resolveMx(domain));
    return Array.isArray(mx) && mx.length > 0;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    // Domain doesn't exist / has no MX → reject. (We require MX rather than
    // falling back to an A record, because ISP/resolver DNS-hijacking returns a
    // bogus A record for *any* nonexistent domain, which would defeat the
    // check; MX records aren't hijacked that way.)
    if (code === "ENOTFOUND" || code === "ENODATA") return false;
    return true; // transient DNS failure / timeout — fail open
  }
}

export async function POST(req: Request) {
  let payload: { email?: string; source?: string } = {};
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
  }

  const email = (payload.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid email." },
      { status: 400 },
    );
  }
  if (isDisposableEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Please use a permanent email address." },
      { status: 400 },
    );
  }
  if (!(await domainAcceptsMail(domainOf(email)))) {
    return NextResponse.json(
      { ok: false, error: "That email domain can’t receive mail — double-check it." },
      { status: 400 },
    );
  }

  const source = (payload.source ?? "").slice(0, 40);

  try {
    const result = await saveSubscriber(email, source);
    return NextResponse.json({ ok: true, persisted: result.persisted });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[subscribe] save failed", err);
    return NextResponse.json(
      { ok: false, error: "Could not save right now — try again." },
      { status: 500 },
    );
  }
}
