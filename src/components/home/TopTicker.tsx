import { Marquee } from "@/components/motion/Marquee";
import { listWritings } from "@/lib/writings";

/**
 * Slim newsroom ticker that runs between the nav and the page. Pulls the most
 * recent Substack headlines from Lev's column; falls back to editorial taglines
 * if the feed is unreachable. Server-rendered so the marquee stays SEO-visible.
 */
export async function TopTicker() {
  const items = await listWritings();
  const heads = items.slice(0, 4).map((w) => w.title);
  const tags = [
    "Both sides. No team.",
    "Bold in style. Rigorous in facts.",
    "Evidence over allegiance.",
    "Independent. Period.",
  ];
  const strip = heads.length ? heads : tags;

  return (
    <div className="fixed inset-x-0 top-16 z-40 hidden border-b border-ink-900/10 bg-paper-100/85 backdrop-blur-xl md:block">
      <Marquee speed={64} className="py-2">
        <div className="flex shrink-0 items-center gap-10">
          <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-signal-600">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-500" />
            Now filing
          </span>
          {strip.map((s, i) => (
            <span key={`${s}-${i}`} className="flex items-center gap-10">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-600">
                {s}
              </span>
              <span
                aria-hidden
                className="inline-block h-1 w-1 rotate-45 bg-navy-600/60"
              />
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
