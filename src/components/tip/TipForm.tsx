"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock, ArrowRight } from "lucide-react";

export function TipForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!message.trim()) {
      setError("A message is required. Everything else is up to you.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, message }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data?.error ?? "Something went wrong on our end. Try again in a minute.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Network refused. If you're using Tor, try the .onion mirror once it's live.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-md border border-signal-500/30 bg-signal-50 p-10"
      >
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-signal-500 text-white">
          <Check size={20} />
        </div>
        <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink-900">
          Received.
        </h3>
        <p className="mt-4 max-w-prose text-ink-600">
          We&rsquo;ve got your tip. We don&rsquo;t auto-reply — if a reporter
          follows up, it will come from a deepstatemedia.co address. If you
          submitted without contact info, watch the relevant beat: we publish
          when we can verify.
        </p>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-signal-600">
          Thank you for trusting us.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6"
      aria-label="Send a confidential tip to Deep State Media"
    >
      <Field
        label="Name"
        sublabel="Optional"
        id="name"
        value={name}
        onChange={setName}
        placeholder="Or leave blank — we'll never ask twice."
      />

      <Field
        label="How to reach you (if you want us to)"
        sublabel="Optional"
        id="contact"
        value={contact}
        onChange={setContact}
        placeholder="Email, Signal, ProtonMail, anything."
      />

      <div>
        <label htmlFor="message" className="block">
          <span className="kicker">
            What you have
            <span className="ml-2 text-signal-600">· Required</span>
          </span>
        </label>
        <textarea
          id="message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={9}
          maxLength={20_000}
          placeholder="Documents, names, dates, dollar amounts. The more specific, the better. Paste links if you have them. Drag-and-drop attachment support is on the roadmap — for now, link to a Proton or Tresorit share."
          className="mt-3 w-full rounded-md border border-ink-900/15 bg-white p-4 font-mono text-sm leading-relaxed text-ink-900 placeholder:text-ink-400 focus:border-navy-500 focus:outline-none"
        />
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400">
          {message.length.toLocaleString()} / 20,000 characters
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="rounded-md border border-signal-500/30 bg-signal-50 px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-signal-700"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-500">
          <Lock size={12} className="text-signal-600" />
          We don&rsquo;t log IP, user-agent, or referrer.
        </p>
        <button
          type="submit"
          disabled={sending}
          className="group inline-flex items-center gap-3 rounded-full bg-signal-500 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-signal-600 disabled:opacity-60"
        >
          {sending ? "Sending securely" : "Send tip"}
          <ArrowRight size={14} />
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  sublabel,
  id,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  sublabel: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block">
        <span className="kicker">
          {label}
          <span className="ml-2 text-ink-400">· {sublabel}</span>
        </span>
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-3 w-full rounded-md border border-ink-900/15 bg-white px-4 py-3 font-mono text-sm text-ink-900 placeholder:text-ink-400 focus:border-navy-500 focus:outline-none"
      />
    </div>
  );
}
