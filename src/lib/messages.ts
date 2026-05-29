import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Contact-form message storage. Mirrors the subscriber store: provider-agnostic
 * and dependency-free. Persists to Vercel KV / Upstash when configured, else
 * appends to a local file in development.
 *
 * Privacy posture: stores only what the visitor typed (name, email, message,
 * source) plus a first-seen timestamp. No IP, user-agent, or referrer.
 */

const LIST_KEY = "dsm:messages";

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
  source: string;
};

export type SaveMessageResult = { ok: true; persisted: boolean };

function kvCreds(): { url: string; token: string } | null {
  const url =
    process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "";
  return url && token ? { url, token } : null;
}

async function kvCommand(
  creds: { url: string; token: string },
  command: string[],
): Promise<void> {
  // Bound the request so a slow/hung store can never stall the API route.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(creds.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`KV ${command[0]} failed: ${res.status}`);
  } finally {
    clearTimeout(timeout);
  }
}

export async function saveMessage(
  msg: ContactMessage,
): Promise<SaveMessageResult> {
  const entry = JSON.stringify({ ...msg, at: new Date().toISOString() });

  const creds = kvCreds();
  if (creds) {
    // Newest first — LPUSH onto a single list you can read back with LRANGE.
    await kvCommand(creds, ["LPUSH", LIST_KEY, entry]);
    return { ok: true, persisted: true };
  }

  if (process.env.NODE_ENV !== "production") {
    const dir = path.join(process.cwd(), ".data");
    await fs.mkdir(dir, { recursive: true });
    await fs.appendFile(path.join(dir, "messages.jsonl"), `${entry}\n`, "utf8");
    return { ok: true, persisted: true };
  }

  // eslint-disable-next-line no-console
  console.warn(
    "[contact] No storage configured (set KV_REST_API_URL + KV_REST_API_TOKEN). Message not persisted.",
  );
  return { ok: true, persisted: false };
}
