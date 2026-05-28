import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({
  children,
  className,
  size = "xl",
}: {
  children: ReactNode;
  className?: string;
  size?: "md" | "lg" | "xl" | "full";
}) {
  return (
    <div
      className={cn(
        "mx-auto px-6 sm:px-8 lg:px-12",
        size === "md" && "max-w-3xl",
        size === "lg" && "max-w-5xl",
        size === "xl" && "max-w-[1480px]",
        size === "full" && "max-w-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
