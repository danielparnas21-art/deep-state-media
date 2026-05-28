import { Marquee } from "@/components/motion/Marquee";
import { listWritings } from "@/lib/writings";

/**
 * Slim newsroom-style ticker that runs between the nav and hero. Pulls the
 * three most recent Substack headlines from Lev's column; falls back to
 * editorial tags if the feed is unreachable. Server-rendered so the marquee
 * stays SEO-visible.
 */
export async function TopTicker() {
  const items = await listWritings();
  const heads = items.slice(0, 4).map((w) => w.title);
  const tags = [
    "Both sides. No team.",
    "Bold in style. Rigorous in facts.",
    "Evidence over allegiance.",
    "Reader-funded. Period.",
  ];
  const strip = heads.length ? heads : tags;

  return (
    <div className="fixed inset-x-0 top-16 z-40 hidden border-b border-white/5 bg-ink-950/80 backdrop-blur-xl md:block">
      <Marquee speed={60} className="py-2">
        <div className="flex shrink-0 items-center gap-10">
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-signal-300">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-pulse-dot rounded-full bg-signal-500" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-400" />
            </span>
            Now filing
          </span>
          {strip.map((s, i) => (
            <span key={`${s}-${i}`} className="flex items-center gap-10">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-100">
                {s}
              </span>
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rotate-45 bg-signal-500"
              />
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
