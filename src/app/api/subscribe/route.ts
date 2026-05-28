import { NextResponse } from "next/server";
import { saveSubscriber } from "@/lib/subscribers";

/**
 * Waitlist intake for the coming-soon teaser (the intro gate + the ComingSoon
 * form both POST here). Validates the email, then hands off to saveSubscriber,
 * which persists to Vercel KV / Upstash when configured and falls back to a
 * local file in development.
 *
 * Privacy posture: we do NOT log IP, user-agent, or referrer — only the email
 * the visitor chose to give. Do not add request-metadata logging here.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let payload: { email?: string; source?: string } = {};
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
  }

  const email = (payload.email ?? "").trim();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid email." },
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
