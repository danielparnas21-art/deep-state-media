"use client";

import { useEffect, useState } from "react";

/**
 * True on touch / small-screen devices, where the expensive desktop effects
 * (scroll-linked parallax on blurred layers, infinitely animated blur-3xl
 * blobs, mix-blend grain) make scrolling stutter. Components use this to hold
 * those layers static so mobile scroll stays smooth — distinct from
 * `useReducedMotion`, which the user may not have enabled.
 *
 * SSR-safe: starts false, resolves on mount, and tracks viewport/pointer
 * changes (e.g. orientation, desktop window resize).
 */
export function useLite() {
  const [lite, setLite] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px), (pointer: coarse)");
    const update = () => setLite(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return lite;
}
