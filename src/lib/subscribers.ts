import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Waitlist storage. Deliberately provider-agnostic and dependency-free so we can
 * start collecting emails today and swap in a real ESP (Resend, Kit, Mailchimp)
 * later without touching the form or route code.
 *
 * Resolution order:
 *   1. Vercel KV / Upstash Redis — if REST creds are set, persist durably there.
 *   2. Local file (dev only) — append to .data/subscribers.jsonl so signups are
 *      captured while testing on a machine with a writable filesystem.
 *   3. Nothing configured in production — log a warning and let the UX succeed
 *      anyway (we never trap a visitor behind a missing backend).
 *
 * Privacy posture: we store only the email, a coarse source tag, and a first-seen
 * timestamp. No IP, user-agent, or referrer. Keep it that way.
 */

const SET_KEY = "dsm:subscribers";

export type SubscribeResult = {
  ok: true;
  /** Whether the email was durably stored. */
  persisted: boolean;
  /** True if this email was already on the list. */
  alreadyKnown: boolean;
};

/** Vercel KV and Upstash expose the same REST API under different env names. */
function kvCreds(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "";
  return url && token ? { url, token } : null;
}

async function kvCommand(
  creds: { url: string; token: string },
  command: string[],
): Promise<unknown> {
  // Bound every KV call so a stalled storage request can't hang the whole
  // route (which would leave the visitor stuck on "Unlocking…").
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  let res: Response;
  try {
    res = await fetch(creds.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
  if (!res.ok) throw new Error(`KV ${command[0]} failed: ${res.status}`);
  const data = (await res.json()) as { result?: unknown };
  return data.result;
}

async function saveToKv(
  creds: { url: string; token: string },
  email: string,
  source: string,
): Promise<boolean> {
  // SADD dedupes for free: returns 1 if newly added, 0 if already present.
  const added = (await kvCommand(creds, ["SADD", SET_KEY, email])) === 1;
  const key = `dsm:subscriber:${email}`;
  // HSETNX so a repeat signup never overwrites the original source/timestamp.
  await kvCommand(creds, ["HSETNX", key, "at", new Date().toISOString()]);
  if (source) await kvCommand(creds, ["HSETNX", key, "source", source]);
  return added;
}

async function saveToFile(email: string, source: string): Promise<boolean> {
  const dir = path.join(process.cwd(), ".data");
  const file = path.join(dir, "subscribers.jsonl");
  await fs.mkdir(dir, { recursive: true });

  let known = false;
  try {
    const existing = await fs.readFile(file, "utf8");
    known = existing.split("\n").some((line) => {
      try {
        return (JSON.parse(line) as { email?: string }).email === email;
      } catch {
        return false;
      }
    });
  } catch {
    /* file doesn't exist yet */
  }

  if (!known) {
    const entry = JSON.stringify({ email, source, at: new Date().toISOString() });
    await fs.appendFile(file, `${entry}\n`, "utf8");
  }
  return !known;
}

export async function saveSubscriber(
  rawEmail: string,
  source: string,
): Promise<SubscribeResult> {
  const email = rawEmail.trim().toLowerCase();

  const creds = kvCreds();
  if (creds) {
    const added = await saveToKv(creds, email, source);
    return { ok: true, persisted: true, alreadyKnown: !added };
  }

  if (process.env.NODE_ENV !== "production") {
    const added = await saveToFile(email, source);
    return { ok: true, persisted: true, alreadyKnown: !added };
  }

  // eslint-disable-next-line no-console
  console.warn(
    "[subscribe] No storage configured (set KV_REST_API_URL + KV_REST_API_TOKEN). Email not persisted.",
  );
  return { ok: true, persisted: false, alreadyKnown: false };
}
