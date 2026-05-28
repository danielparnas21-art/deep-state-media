"use client";

import { useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Infinite horizontal marquee. Duplicates children so the loop is seamless.
 * Pauses on hover. Static when reduced motion is preferred.
 */
export function Marquee({
  children,
  className,
  speed = 40,
  pauseOnHover = true,
}: {
  children: ReactNode;
  className?: string;
  /** seconds per loop */
  speed?: number;
  pauseOnHover?: boolean;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={cn("overflow-hidden", className)}>
        <div className="flex gap-12">{children}</div>
      </div>
    );
  }

  return (
    <div className={cn("group overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max gap-12 will-change-transform",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        <div className="flex shrink-0 items-center gap-12">{children}</div>
        <div aria-hidden className="flex shrink-0 items-center gap-12">
          {children}
        </div>
      </div>
    </div>
  );
}
