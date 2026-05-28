"use client";

import { useMemo, useState, useDeferredValue } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, X } from "lucide-react";
import { InvestigationCard } from "@/components/investigation/InvestigationCard";
import type { InvestigationCategory, InvestigationMeta } from "@/lib/investigations";
import { cn } from "@/lib/cn";

type Filter = "all" | InvestigationCategory;

const CATEGORIES: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "intelligence", label: "Intelligence" },
  { id: "money", label: "Money" },
  { id: "campaign-desk", label: "Campaign Desk" },
  { id: "judiciary", label: "Judiciary" },
  { id: "foreign-influence", label: "Foreign Influence" },
  { id: "tech-power", label: "Tech Power" },
];

export function IndexClient({ items }: { items: InvestigationMeta[] }) {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);

  const filtered = useMemo(() => {
    const needle = dq.trim().toLowerCase();
    return items.filter((it) => {
      const matchCat = filter === "all" || it.category === filter;
      if (!matchCat) return false;
      if (!needle) return true;
      return (
        it.title.toLowerCase().includes(needle) ||
        it.deck.toLowerCase().includes(needle) ||
        it.authors.some((a) => a.toLowerCase().includes(needle))
      );
    });
  }, [items, filter, dq]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((c) => {
            const active = filter === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                className={cn(
                  "group relative rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors",
                  active
                    ? "border-signal-500 bg-signal-500 text-black"
                    : "border-white/15 text-ink-200 hover:border-white/30 hover:text-ink-50",
                )}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="group relative flex items-center rounded-full border border-white/15 bg-black/30 px-4 py-2 transition-colors focus-within:border-signal-500/60 lg:w-[360px]">
          <Search size={14} className="text-ink-300" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search investigations, people, money trails…"
            aria-label="Search investigations"
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

      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
        {filtered.length} {filtered.length === 1 ? "investigation" : "investigations"} shown
        {filter !== "all" && (
          <>
            <span className="mx-3 text-ink-600">·</span>
            <span className="text-signal-300">{CATEGORIES.find((c) => c.id === filter)?.label}</span>
          </>
        )}
      </p>

      <AnimatePresence mode="popLayout">
        <motion.div
          key={`${filter}-${dq}`}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((item) => (
            <InvestigationCard key={item.slug} item={item} size="md" />
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="rounded-md border border-dashed border-white/15 p-12 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-300">
            No matches. The story may not be filed yet — or it may be
            classified.
          </p>
        </div>
      )}
    </div>
  );
}
