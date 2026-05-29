import { NextResponse } from "next/server";
import { saveMessage } from "@/lib/messages";

/**
 * Contact-form intake. Validates name + email + message, then hands off to
 * saveMessage (Vercel KV / Upstash when configured, local file in dev).
 *
 * Privacy posture: we do NOT log IP, user-agent, or referrer — only what the
 * visitor typed. Do not add request-metadata logging here.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let payload: {
    name?: string;
    email?: string;
    message?: string;
    source?: string;
  } = {};
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid payload." },
      { status: 400 },
    );
  }

  const name = (payload.name ?? "").trim();
  const email = (payload.email ?? "").trim();
  const message = (payload.message ?? "").trim();

  if (!name || name.length > 120) {
    return NextResponse.json(
      { ok: false, error: "Enter your name." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid email." },
      { status: 400 },
    );
  }
  if (message.length < 2 || message.length > 5000) {
    return NextResponse.json(
      { ok: false, error: "Enter a message." },
      { status: 400 },
    );
  }

  const source = (payload.source ?? "contact").slice(0, 40);

  try {
    const result = await saveMessage({
      name: name.slice(0, 120),
      email,
      message: message.slice(0, 5000),
      source,
    });
    return NextResponse.json({ ok: true, persisted: result.persisted });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[contact] save failed", err);
    return NextResponse.json(
      { ok: false, error: "Could not send right now — try again." },
      { status: 500 },
    );
  }
}
