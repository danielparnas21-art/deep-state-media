"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Container } from "@/components/ui/Container";
import type { InvestigationMeta } from "@/lib/investigations";

export function ArticleHero({ meta }: { meta: InvestigationMeta }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const coverY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "30%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);

  return (
    <header
      ref={ref}
      className="relative isolate min-h-[100svh] overflow-hidden bg-ink-950"
    >
      <motion.div
        aria-hidden
        style={{ y: coverY, backgroundImage: `url(${meta.cover})` }}
        className="absolute inset-0 -z-10 scale-110 bg-cover bg-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/50 via-ink-950/70 to-ink-950"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          opacity: 0.12,
        }}
      />

      <Container className="flex min-h-[100svh] flex-col justify-end pb-20 pt-40">
        <motion.div style={{ y: titleY }}>
          <p className="kicker mb-6 text-signal-300">
            {meta.categoryLabel} ·{" "}
            <time dateTime={meta.publishedAt}>
              {formatDate(meta.publishedAt)}
            </time>{" "}
            · {meta.readingTimeMin} min read
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="display-stencil max-w-[18ch] text-balance text-hero text-ink-50"
          >
            {meta.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-2xl text-pretty text-deck text-ink-100"
          >
            {meta.deck}
          </motion.p>

          <div className="mt-10 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            <Meta label="Byline" value={meta.authors.join(", ")} />
            <Meta label="Beat" value={meta.categoryLabel} />
            <Meta label="Filed" value={formatDate(meta.publishedAt)} />
            <Meta
              label="Sources"
              value={`${meta.sources.length} cited`}
              accent
            />
          </div>
          {meta.coverCredit && (
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-400">
              Cover: {meta.coverCredit}
            </p>
          )}
        </motion.div>
      </Container>
    </header>
  );
}

function Meta({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-400">
        {label}
      </p>
      <p
        className={`mt-1 text-sm ${accent ? "text-signal-300" : "text-ink-100"}`}
      >
        {value}
      </p>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
