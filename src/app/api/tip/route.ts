import { NextResponse } from "next/server";

/**
 * Stub backend for the whistleblower tip line.
 *
 * In production this would forward to encrypted intake — SecureDrop, Hush
 * Line, OnionShare, or a self-hosted GPG queue. For now we accept the payload,
 * validate the required fields, and log to the server console so the form
 * end-to-end is testable in development.
 *
 * Privacy posture: we do NOT log IP, user-agent, or referrer. We retain only
 * what the tipster chose to send. Do not change this without editorial review.
 */
export async function POST(req: Request) {
  let payload: { name?: string; contact?: string; message?: string } = {};
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
  }

  const message = (payload.message ?? "").trim();
  if (!message) {
    return NextResponse.json({ ok: false, error: "Message is required." }, { status: 400 });
  }
  if (message.length > 20_000) {
    return NextResponse.json(
      { ok: false, error: "Message too long — try splitting into multiple tips." },
      { status: 413 },
    );
  }

  // Server-side log only — no PII enrichment. Replace with real intake.
  // eslint-disable-next-line no-console
  console.log("[tip] received", {
    nameProvided: Boolean((payload.name ?? "").trim()),
    contactProvided: Boolean((payload.contact ?? "").trim()),
    messageLength: message.length,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
