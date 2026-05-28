"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";

/**
 * Full-viewport "decryption portal" backdrop for the V1 homepage — columns of
 * code glyphs and redaction blocks in the brand's navy, each stream led by a
 * luminous near-white head with rare white/red bloom glyphs (deliberately NOT
 * the cliché green matrix). Depth comes from a wide speed/alpha range so columns
 * read as near and far.
 *
 * Mounted as a layout sibling of <PageTransition> (never a descendant) so the
 * route-transition transform can't turn its `position: fixed` into a scroll-
 * away absolute box. Homepage-only via pathname. Reduced motion paints one
 * static, dim frame and attaches no listeners. Throttled to ~32fps, DPR capped
 * at 2, paused while the tab is hidden.
 */

const BG = "#06070d";
const GLYPHS =
  "01010101<>{}[]()=+-*/;:.#%&$@!?|~^01abcdef01ghijkl01mnopqr01stuvwx01yz0123456789█▓▒░";

const NAVY: [number, number, number] = [150, 178, 222];
const WHITE: [number, number, number] = [226, 232, 245];
const RED: [number, number, number] = [208, 70, 56];

type Column = {
  x: number;
  drop: number;
  row: number;
  speed: number;
  alpha: number;
  kind: 0 | 1 | 2; // 0 navy · 1 white · 2 red
  glyph: string;
};

function pickGlyph() {
  return GLYPHS.charAt((Math.random() * GLYPHS.length) | 0);
}

function rgb([r, g, b]: [number, number, number], a: number) {
  return `rgba(${r},${g},${b},${a})`;
}

function mix(a: [number, number, number], b: [number, number, number], t: number) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ] as [number, number, number];
}

export function CodeRain() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    const FONT = 16;
    const HEAD = mix(NAVY, WHITE, 0.55); // luminous leading glyph for navy streams
    let w = 0;
    let h = 0;
    let cols: Column[] = [];

    const setFont = () => {
      ctx.font = `${FONT}px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`;
      ctx.textBaseline = "top";
    };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setFont();
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);

      const count = Math.ceil(w / FONT);
      cols = Array.from({ length: count }, (_, i) => {
        const depth = Math.random();
        return {
          x: i * FONT,
          drop: -Math.random() * (h / FONT) - 4,
          row: -9999,
          speed: 0.4 + depth * 0.95,
          alpha: 0.3 + depth * 0.6, // wide range => real depth
          kind: 0 as const,
          glyph: pickGlyph(),
        };
      });
    };

    const step = () => {
      // Trail fade.
      ctx.fillStyle = "rgba(6,7,13,0.062)";
      ctx.fillRect(0, 0, w, h);

      for (const c of cols) {
        c.drop += c.speed;
        const row = Math.floor(c.drop);
        if (row !== c.row) {
          c.row = row;
          c.glyph = pickGlyph();
          const r = Math.random();
          c.kind = r < 0.022 ? 2 : r < 0.085 ? 1 : 0;
          if (row * FONT > h && Math.random() > 0.972) {
            c.drop = -Math.random() * 24;
            c.row = -9999;
            const depth = Math.random();
            c.speed = 0.4 + depth * 0.95;
            c.alpha = 0.3 + depth * 0.6;
          }
        }
        const y = c.row * FONT;
        if (y < -FONT || y > h) continue;

        // Luminous head: navy streams brighten toward white at the leading edge.
        const color = c.kind === 2 ? RED : c.kind === 1 ? WHITE : HEAD;
        const alpha = c.kind === 0 ? Math.min(1, c.alpha + 0.22) : c.alpha;
        const bloom = c.kind !== 0;

        if (bloom) {
          ctx.shadowColor = rgb(color, 0.85);
          ctx.shadowBlur = c.kind === 2 ? 9 : 6;
        }
        ctx.fillStyle = rgb(color, alpha);
        ctx.fillText(c.glyph, c.x, y);
        if (bloom) ctx.shadowBlur = 0;
      }
    };

    // ── Reduced motion: one quiet, static frame, no listeners. ──
    const paintStatic = () => {
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);
      const rows = Math.ceil(h / FONT);
      for (const c of cols) {
        for (let r = 0; r < rows; r++) {
          if (Math.random() > 0.86) {
            ctx.fillStyle = rgb(NAVY, 0.1 + Math.random() * 0.16);
            ctx.fillText(pickGlyph(), c.x, r * FONT);
          }
        }
      }
    };

    if (reduce) {
      build();
      paintStatic();
      const onResizeStatic = () => {
        build();
        paintStatic();
      };
      window.addEventListener("resize", onResizeStatic);
      return () => window.removeEventListener("resize", onResizeStatic);
    }

    let raf = 0;
    let last = 0;
    const interval = 1000 / 32;

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < interval) return;
      last = t;
      step();
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 150);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    };

    build();
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pathname, reduce]);

  if (pathname !== "/") return null;

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 block"
    />
  );
}
