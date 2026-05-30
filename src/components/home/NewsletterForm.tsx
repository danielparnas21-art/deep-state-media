"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { EMAIL_RE, suggestEmailFix } from "@/lib/emailCheck";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!EMAIL_RE.test(email.trim())) {
      setError("That email doesn't look right.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: compact ? "newsletter-compact" : "newsletter",
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong — try again.");
      }
    } catch {
      setError("Network hiccup — try again.");
    } finally {
      setSubmitting(false);
    }
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
            className="flex items-center gap-3 rounded-full border border-navy-600/30 bg-navy-50 px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy-700"
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
            className="group relative flex items-center overflow-hidden rounded-full border border-ink-900/15 bg-white transition-colors focus-within:border-navy-500"
          >
            <input
              type="email"
              required
              placeholder="you@somewhere.com"
              value={email}
              onChange={(e) => {
                const v = e.target.value;
                setEmail(v);
                setSuggestion(
                  EMAIL_RE.test(v.trim()) ? suggestEmailFix(v.trim()) : null,
                );
              }}
              disabled={submitting}
              className="w-full bg-transparent py-3.5 pl-5 pr-2 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none disabled:opacity-50"
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={submitting}
              className="m-1 inline-flex items-center gap-2 rounded-full bg-signal-500 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-signal-600 disabled:opacity-50"
            >
              {submitting ? "Sending" : compact ? "Join" : "Subscribe"}
              <ArrowRight size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {error && (
        <p role="alert" className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-600">
          {error}
        </p>
      )}
      {suggestion && !error && !submitted && (
        <button
          type="button"
          onClick={() => {
            setEmail(suggestion);
            setSuggestion(null);
          }}
          className="mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-400 transition-colors hover:text-ink-700"
        >
          Did you mean <span className="text-signal-600">{suggestion}</span>?
        </button>
      )}
      {!submitted && (
        <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-400">
          No spam. Unsubscribe in one click.
        </p>
      )}
    </form>
  );
}
