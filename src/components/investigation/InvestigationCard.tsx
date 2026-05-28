"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { InvestigationMeta } from "@/lib/investigations";

export function InvestigationCard({
  item,
  size = "md",
}: {
  item: InvestigationMeta;
  size?: "sm" | "md" | "lg";
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.4 }}
      className="group relative"
    >
      <Link
        href={`/investigations/${item.slug}`}
        data-cursor-label="Read"
        className="block"
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-md border border-white/10 bg-ink-800",
            size === "lg" && "aspect-[16/10]",
            size === "md" && "aspect-[4/3]",
            size === "sm" && "aspect-[5/4]",
          )}
        >
          {/* Cover with gentle zoom on hover */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${item.cover})` }}
            whileHover={reduce ? undefined : { scale: 1.04 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-100 backdrop-blur">
              {item.categoryLabel}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-200">
              {item.readingTimeMin} min
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-signal-300">
              <span className="h-px w-4 bg-signal-500" />
              {formatDate(item.publishedAt)}
            </span>
          </div>
        </div>

        <div className="mt-5">
          {item.kicker && <p className="kicker">{item.kicker}</p>}
          <h3
            className={cn(
              "mt-2 font-display font-bold tracking-tight text-ink-50",
              size === "lg" ? "text-headline" : "text-2xl leading-tight",
            )}
          >
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_1px]">
              {item.title}
            </span>
          </h3>
          <p className="mt-3 max-w-prose text-ink-300">{item.deck}</p>
          <div className="mt-4 flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
              By {item.authors.join(", ")}
            </p>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-200 transition-colors group-hover:text-signal-400">
              Read <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
