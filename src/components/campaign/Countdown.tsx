"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/** Election Day 2026 — US general election: Tuesday, November 3, 2026. */
const ELECTION_DAY = "2026-11-03T12:00:00-05:00";

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

export function Countdown() {
  // Initialize with stable SSR values (zero ticks), then hydrate on client.
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const target = new Date(ELECTION_DAY);
    setMounted(true);
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, []);

  const items: { label: string; value: number; pad: number }[] = [
    { label: "Days", value: t.days, pad: 3 },
    { label: "Hours", value: t.hours, pad: 2 },
    { label: "Min", value: t.minutes, pad: 2 },
    { label: "Sec", value: t.seconds, pad: 2 },
  ];

  return (
    <div
      aria-label="Countdown to Election Day, November 3, 2026"
      className="grid grid-cols-4 gap-3 sm:gap-6"
      suppressHydrationWarning
    >
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-md border border-white/10 bg-ink-900/50 p-4 backdrop-blur"
        >
          <motion.div
            key={mounted ? it.value : "ssr"}
            initial={{ opacity: 0.6, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="display-stencil text-[clamp(2rem,4vw,3.5rem)] leading-none text-signal-500 tabular-nums"
          >
            {String(it.value).padStart(it.pad, "0")}
          </motion.div>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-300">
            {it.label}
          </p>
        </div>
      ))}
    </div>
  );
}
