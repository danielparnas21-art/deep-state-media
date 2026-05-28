"use client";

import { useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "button" | "a" | "div";
  href?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "ref">;

/**
 * Magnetic pull effect — element is gently dragged toward the cursor
 * within its bounding box. Disabled for reduced motion.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.35,
  as = "button",
  href,
  ...rest
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 18, stiffness: 240, mass: 0.4 });
  const sy = useSpring(y, { damping: 18, stiffness: 240, mass: 0.4 });

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const MotionTag =
    as === "a"
      ? (motion.a as typeof motion.a)
      : as === "div"
        ? (motion.div as typeof motion.div)
        : (motion.button as typeof motion.button);

  return (
    <MotionTag
      // @ts-expect-error — framer ref typing across polymorphic tags
      ref={ref}
      data-magnetic
      href={as === "a" ? href : undefined}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={cn("relative inline-flex items-center", className)}
      {...(rest as object)}
    >
      {children}
    </MotionTag>
  );
}
