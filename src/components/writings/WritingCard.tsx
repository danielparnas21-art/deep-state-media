"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Writing } from "@/lib/writings";

export function WritingCard({
  item,
  size = "md",
}: {
  item: Writing;
  size?: "sm" | "md" | "lg";
}) {
  const reduce = useReducedMotion();
  const cover = item.cover;
  return (
    <motion.article
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.4 }}
      className="group relative"
    >
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-md border border-ink-900/10 bg-paper-200",
            size === "lg" && "aspect-[16/10]",
            size === "md" && "aspect-[4/3]",
            size === "sm" && "aspect-[5/4]",
          )}
        >
          {cover ? (
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${cover})` }}
              whileHover={reduce ? undefined : { scale: 1.04 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          ) : (
            <TypographicCover title={item.title} />
          )}
          <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-800 backdrop-blur">
            Lev Remembers
          </span>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-600">
            <span className="inline-flex items-center gap-2">
              <span className="h-px w-4 bg-navy-600" />
              {formatDate(item.publishedAt)}
            </span>
            <span className="text-ink-300">·</span>
            <span className="text-ink-400">{item.readingTimeMin} min read</span>
          </div>
          <h3
            className={cn(
              "mt-3 font-display font-semibold tracking-tight text-ink-900",
              size === "lg" ? "text-headline" : "text-2xl leading-tight",
            )}
          >
            <span className="bg-[linear-gradient(theme(colors.navy.600),theme(colors.navy.600))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_2px]">
              {item.title}
            </span>
          </h3>
          <p className="mt-3 max-w-prose text-ink-500">{item.description}</p>
          <div className="mt-4 flex items-center justify-between border-t border-ink-900/10 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
              By {item.author}
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-600 transition-colors group-hover:text-signal-600">
              Read on Substack <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </a>
    </motion.article>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Editorial placeholder for posts without a usable cover image — a warm paper
 * canvas with a fine navy hatch and the post title set in the display serif.
 * Reads as an intentional editorial plate, not a broken image.
 */
function TypographicCover({ title }: { title: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden bg-paper-200">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(28,60,107,0.06) 0 1px, transparent 1px 14px)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(120%_70%_at_50%_120%,rgba(28,60,107,0.12),transparent_70%)]"
      />
      <span
        aria-hidden
        className="absolute right-3 top-3 inline-block h-2 w-2 rotate-45 bg-signal-500"
      />
      <p className="display-stencil relative z-10 max-w-[18ch] text-balance px-6 text-center text-[clamp(1.25rem,2.2vw,2rem)] font-semibold leading-[1.08] text-ink-900">
        {title}
      </p>
    </div>
  );
}
