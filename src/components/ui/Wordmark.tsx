import { cn } from "@/lib/cn";

/**
 * Editorial wordmark set in the display serif. Inline = compact horizontal
 * lockup for the nav; stack = large masthead lockup. A single navy mark
 * between words carries the brand identity (red is reserved for CTAs).
 */
export function Wordmark({
  variant = "stack",
  className,
}: {
  variant?: "stack" | "inline";
  className?: string;
}) {
  if (variant === "inline") {
    return (
      <span
        className={cn(
          "inline-flex items-baseline gap-1.5 font-display font-semibold leading-none",
          className,
        )}
      >
        <span className="text-[1.15rem] tracking-tight">Deep</span>
        <span className="mb-0.5 inline-block h-1 w-1 self-center rounded-full bg-navy-600" />
        <span className="text-[1.15rem] tracking-tight">State</span>
        <span className="mb-0.5 inline-block h-1 w-1 self-center rounded-full bg-navy-600" />
        <span className="text-[1.15rem] tracking-tight">Media</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex flex-col font-display font-semibold leading-[0.92] tracking-tight",
        className,
      )}
    >
      <span>Deep</span>
      <span>State</span>
      <span className="inline-flex items-center gap-3">
        Media
        <span aria-hidden className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-signal-500" />
      </span>
    </span>
  );
}
