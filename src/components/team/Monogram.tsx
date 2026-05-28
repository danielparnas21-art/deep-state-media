import { cn } from "@/lib/cn";

/**
 * Brutalist monogram card used as a portrait placeholder when no real photo
 * URL is set on a TeamMember yet. Reads as intentional editorial, not broken.
 */
export function Monogram({
  initials,
  className,
}: {
  initials: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-md border border-white/10 bg-ink-900",
        className,
      )}
    >
      {/* Faint diagonal hatch */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 12px)",
        }}
      />
      {/* Horizon glow */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(120%_60%_at_50%_100%,rgba(255,45,45,0.20),transparent_70%)]"
      />
      {/* Initials */}
      <span className="display-stencil relative z-10 text-[clamp(4rem,8vw,6.5rem)] leading-none text-ink-50">
        {initials}
      </span>
      {/* Corner marker */}
      <span
        aria-hidden
        className="absolute right-3 top-3 inline-block h-1.5 w-1.5 rotate-45 bg-signal-500"
      />
      <span
        aria-hidden
        className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-400"
      >
        Portrait pending
      </span>
    </div>
  );
}
