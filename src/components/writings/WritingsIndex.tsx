"use client";

import { useMemo, useState, useDeferredValue } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, X } from "lucide-react";
import { WritingCard } from "@/components/writings/WritingCard";
import type { Writing } from "@/lib/writings";

export function WritingsIndex({ items }: { items: Writing[] }) {
  const reduce = useReducedMotion();
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);

  const filtered = useMemo(() => {
    const needle = dq.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(
      (it) =>
        it.title.toLowerCase().includes(needle) ||
        it.description.toLowerCase().includes(needle),
    );
  }, [items, dq]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
          {filtered.length} {filtered.length === 1 ? "writing" : "writings"} ·
          <span className="ml-2 text-signal-300">Lev Remembers</span>
        </p>
        <div className="group relative flex items-center rounded-full border border-white/15 bg-black/30 px-4 py-2 transition-colors focus-within:border-signal-500/60 lg:w-[360px]">
          <Search size={14} className="text-ink-300" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the column…"
            aria-label="Search writings"
            className="ml-3 w-full bg-transparent font-mono text-[12px] text-ink-50 placeholder:text-ink-400 focus:outline-none"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label="Clear search"
              className="ml-2 text-ink-400 hover:text-ink-50"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div
          key={dq}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((item) => (
            <WritingCard key={item.guid} item={item} size="md" />
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="rounded-md border border-dashed border-white/15 p-12 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-300">
            No writings match — try a different term, or read the whole column on
            Substack.
          </p>
        </div>
      )}
    </div>
  );
}
