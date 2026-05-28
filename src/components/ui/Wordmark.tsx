import { cn } from "@/lib/cn";

/**
 * Stacked wordmark: "DEEP / STATE / MEDIA" — set in our display face, with
 * a punctuating signal-red bullet between the words. Small variant is a
 * compact horizontal lockup for the nav.
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
          "inline-flex items-center gap-2 font-display font-bold tracking-tightest leading-none",
          className,
        )}
      >
        <span className="text-[1.05rem] uppercase">DEEP</span>
        <span className="mx-0.5 inline-block h-1.5 w-1.5 rounded-full bg-signal-500" />
        <span className="text-[1.05rem] uppercase">STATE</span>
        <span className="mx-0.5 inline-block h-1.5 w-1.5 rounded-full bg-signal-500" />
        <span className="text-[1.05rem] uppercase">MEDIA</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex flex-col font-display font-bold uppercase tracking-tightest leading-[0.85]",
        className,
      )}
    >
      <span>Deep</span>
      <span className="text-signal-500">State</span>
      <span>Media</span>
    </span>
  );
}
