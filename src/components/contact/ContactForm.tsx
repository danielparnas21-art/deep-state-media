"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { EASE_OUT_EXPO } from "@/lib/motion";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD =
  "w-full rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3.5 text-[15px] text-paper placeholder:text-paper/35 transition-colors focus:border-signal-500/70 focus:outline-none focus:ring-1 focus:ring-signal-500/40 disabled:opacity-60";

/**
 * Dark contact form — name, email, message. No company contact details are
 * exposed anywhere; this is the only way in. Posts to /api/contact, which saves
 * to the same store as the waitlist. Bounded by a timeout so a slow/blocked
 * request can never trap the visitor on "Sending…".
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!name.trim()) {
      setError("Enter your name.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email.");
      return;
    }
    if (message.trim().length < 2) {
      setError("Enter a message.");
      return;
    }
    setError(null);
    setSubmitting(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          source: "contact-page",
        }),
        signal: controller.signal,
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Couldn't send — please try again.");
        setSubmitting(false);
      }
    } catch {
      setError("Network hiccup — please try again.");
      setSubmitting(false);
    } finally {
      clearTimeout(timeout);
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        className="flex flex-col items-start gap-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.06] p-8"
      >
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <Check size={20} />
        </span>
        <div>
          <h2 className="display-stencil text-[clamp(1.6rem,3vw,2.2rem)] leading-tight text-paper">
            Message received.
          </h2>
          <p className="mt-3 max-w-md text-paper/60">
            We read everything that comes in. If it needs a reply, we&rsquo;ll be
            in touch at the address you gave us.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/45"
          >
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Your name"
            disabled={submitting}
            className={FIELD}
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/45"
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder="you@email.com"
            disabled={submitting}
            className={FIELD}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/45"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          rows={6}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (error) setError(null);
          }}
          placeholder="What's on your mind?"
          disabled={submitting}
          className={`${FIELD} resize-y`}
        />
      </div>

      <p className="h-4 text-[13px] text-signal-400" role="alert">
        {error ?? ""}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-signal-500 px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_20px_60px_-20px_rgba(200,57,42,0.7)] transition-colors hover:bg-signal-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Sending…" : "Send message"}
          {!submitting && (
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          )}
        </button>
        <p className="text-[11px] uppercase tracking-[0.16em] text-paper/30">
          We never sell your data.
        </p>
      </div>
    </form>
  );
}
