"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * A subtle custom cursor. Two rings — a fast dot and a lagging trailer.
 * Hidden on touch devices and when prefers-reduced-motion is set.
 */
export function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<"idle" | "hover" | "press">("idle");
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const trailX = useSpring(x, { damping: 28, stiffness: 220, mass: 0.6 });
  const trailY = useSpring(y, { damping: 28, stiffness: 220, mass: 0.6 });
  const lastMoveRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    setEnabled(true);
    document.documentElement.dataset.cursor = "custom";

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      lastMoveRef.current = performance.now();
    };
    const onDown = () => setVariant("press");
    const onUp = () => setVariant("hover");

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        "a, button, [role='button'], [data-magnetic], input, textarea, select, [data-cursor-label]",
      ) as HTMLElement | null;
      if (interactive) {
        setVariant("hover");
        const cl = interactive.getAttribute("data-cursor-label");
        setLabel(cl);
      } else {
        setVariant("idle");
        setLabel(null);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerover", onOver);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerover", onOver);
      delete document.documentElement.dataset.cursor;
    };
  }, [prefersReducedMotion, x, y]);

  if (!enabled) return null;

  const isHover = variant === "hover";
  const isPress = variant === "press";

  return (
    <>
      {/* Trailing ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
        style={{ x: trailX, y: trailY }}
      >
        <motion.div
          animate={{
            width: isHover ? 56 : 28,
            height: isHover ? 56 : 28,
            opacity: isPress ? 0.4 : 0.9,
          }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
        />
      </motion.div>
      {/* Center dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
        style={{ x, y }}
      >
        <motion.div
          animate={{
            width: isHover ? 6 : 6,
            height: isHover ? 6 : 6,
            backgroundColor: isHover ? "#FF2D2D" : "#FFFFFF",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full"
        />
      </motion.div>
      {/* Cursor label, if data-cursor-label provided */}
      {label && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 14 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed left-0 top-0 z-[100] font-mono text-[10px] uppercase tracking-[0.22em] text-white"
          style={{ x: trailX, y: trailY }}
        >
          <span className="translate-x-3 translate-y-3 rounded-sm bg-signal-500 px-2 py-1 text-black">
            {label}
          </span>
        </motion.div>
      )}
    </>
  );
}
