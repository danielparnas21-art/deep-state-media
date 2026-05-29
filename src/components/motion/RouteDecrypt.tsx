"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Re-decrypt route transition. On every client navigation a brief scanline +
 * static wash sweeps the screen, so moving between pages feels like one
 * continuous secure terminal re-scanning the next file.
 *
 * - Skips the very first load (the intro gate owns that entrance).
 * - Disabled under prefers-reduced-motion.
 * - Light by design — opacity + transform + a CSS gradient only (no blur, no
 *   canvas) — so it stays smooth on mobile. Auto-unmounts after the sweep.
 */
export function RouteDecrypt() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const first = useRef(true);
  const [token, setToken] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setToken((t) => t + 1);
    setActive(true);
    const timer = setTimeout(() => setActive(false), 680);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (reduce) return null;

  return (
    <AnimatePresence>{active && <Sweep key={token} />}</AnimatePresence>
  );
}

function Sweep() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      {/* Dark wash that briefly veils the page swap */}
      <motion.div
        className="absolute inset-0 bg-[#06070d]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.92, 0.92, 0] }}
        transition={{ duration: 0.55, times: [0, 0.22, 0.55, 1], ease: "easeInOut" }}
      />
      {/* CRT static scanlines, briefly */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 1px, transparent 1px, transparent 3px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.55, 0] }}
        transition={{ duration: 0.55, times: [0, 0.32, 1] }}
      />
      {/* Signal-red scanline sweeping top to bottom */}
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-signal-500 to-transparent"
        style={{ boxShadow: "0 0 18px rgba(200,57,42,0.7)" }}
        initial={{ top: "-2%", opacity: 0 }}
        animate={{ top: ["-2%", "102%"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.55, times: [0, 0.1, 0.9, 1], ease: "easeInOut" }}
      />
      {/* DECRYPTING flash */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.5, times: [0, 0.45, 1], ease: "easeOut" }}
      >
        <span
          className="font-mono text-[10px] uppercase tracking-[0.42em] text-signal-400 sm:text-[11px]"
          style={{ textShadow: "0 0 18px rgba(200,57,42,0.6)" }}
        >
          Decrypting
        </span>
      </motion.div>
    </motion.div>
  );
}
