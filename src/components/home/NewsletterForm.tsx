"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That email doesn't look right.");
      return;
    }
    setSubmitting(true);
    // Stub backend — replace with real subscribe endpoint
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative w-full max-w-md"
      aria-label="Subscribe to The Briefing"
    >
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 rounded-full border border-signal-500/40 bg-signal-500/10 px-5 py-4 font-mono text-[12px] uppercase tracking-[0.22em] text-signal-100"
          >
            <Check size={16} />
            You&rsquo;re in. Watch your inbox.
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="group relative flex items-center overflow-hidden rounded-full border border-white/15 bg-black/40 transition-colors focus-within:border-signal-500/60"
          >
            <input
              type="email"
              required
              placeholder="you@somewhere.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className="w-full bg-transparent py-3.5 pl-5 pr-2 font-mono text-sm text-ink-50 placeholder:text-ink-400 focus:outline-none disabled:opacity-50"
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={submitting}
              className="m-1 inline-flex items-center gap-2 rounded-full bg-signal-500 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-black transition-transform hover:translate-x-0.5 disabled:opacity-50"
            >
              {submitting ? "Sending" : compact ? "Join" : "Subscribe"}
              <ArrowRight size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {error && (
        <p role="alert" className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-signal-300">
          {error}
        </p>
      )}
      {!submitted && (
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
          No spam. No tracking pixels. Unsubscribe in one click.
        </p>
      )}
    </form>
  );
}
