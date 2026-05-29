"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Full-viewport "decryption portal" backdrop for the V1 homepage — columns of
 * code glyphs and redaction blocks in the brand's navy, each stream led by a
 * luminous near-white head with rare white/red bloom glyphs (deliberately NOT
 * the cliché green matrix). Depth comes from a wide speed/alpha range so columns
 * read as near and far.
 *
 * Mounted as a layout sibling of <PageTransition> (never a descendant) so the
 * route-transition transform can't turn its `position: fixed` into a scroll-
 * away absolute box. Homepage-only via pathname. This signature ambient layer
 * deliberately animates for everyone — including OS "reduce motion" — since it's
 * a slow background texture, not a vestibular trigger; the expensive bits (bloom,
 * DPR) are still trimmed on touch devices. Throttled to ~32fps, DPR capped at 2,
 * paused while the tab is hidden.
 *
 * Hardened to never glitch on mobile or desktop: width-only rebuilds (ignoring
 * the mobile URL-bar resize storm), a single rAF loop that can never stack,
 * recovery from a lost GPU context and from bfcache (back/forward) restores,
 * a guard against bogus 0-size frames, and an adaptive latch that retires the
 * bloom if a device can't hold framerate — so the field stays smooth no matter
 * what.
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
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    const FONT = 16;
    const HEAD = mix(NAVY, WHITE, 0.55); // luminous leading glyph for navy streams
    // Touch / small screens: drop the per-glyph bloom (shadowBlur is the most
    // expensive canvas op) and cap DPR, so the field stays smooth on phones.
    // Re-evaluated on every (re)build so rotating or resizing across the
    // breakpoint adapts instead of staying stuck at the mount-time value.
    const isLite = () =>
      window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
    let lite = isLite();
    // Adaptive quality: if a non-lite device still can't hold the framerate
    // (weak/integrated GPU), retire the bloom for good. Latched so it never
    // oscillates between quality levels (which would itself read as a glitch).
    let degraded = false;
    let slow = 0;
    let w = 0;
    let h = 0;
    let lastW = window.innerWidth;
    let cols: Column[] = [];

    const setFont = () => {
      ctx.font = `${FONT}px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`;
      ctx.textBaseline = "top";
    };

    const build = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Bail on bogus dimensions (some mobile transition states momentarily
      // report 0) and keep the last good frame rather than blanking the canvas.
      if (vw <= 0 || vh <= 0) return;
      lite = isLite();
      const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2);
      w = vw;
      lastW = vw;
      // Pad the height so the canvas still covers the screen when a mobile URL
      // bar collapses and grows the viewport — without forcing a rebuild.
      h = vh + 140;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setFont();
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);

      const count = Math.ceil(w / FONT);
      const rows = h / FONT;
      cols = Array.from({ length: count }, (_, i) => {
        const depth = Math.random();
        return {
          x: i * FONT,
          // Seed across the screen (not all above it) so the field is alive
          // immediately instead of cascading in from the top after a (re)build.
          drop: Math.random() * rows * 1.4 - rows * 0.4,
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

        const glow = bloom && !lite && !degraded;
        if (glow) {
          ctx.shadowColor = rgb(color, 0.85);
          ctx.shadowBlur = c.kind === 2 ? 9 : 6;
        }
        ctx.fillStyle = rgb(color, alpha);
        ctx.fillText(c.glyph, c.x, y);
        if (glow) ctx.shadowBlur = 0;
      }
    };

    let raf = 0;
    let last = 0;
    const interval = 1000 / 32;

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const delta = t - last;
      if (delta < interval) return;
      last = t;
      step();
      // Watch real frame spacing (which reflects GPU compositing of the bloom,
      // not just JS time). A sustained streak below ~13fps on a non-lite device
      // trips the latch; huge deltas (tab stalls / bfcache) are ignored.
      if (!degraded && !lite) {
        if (delta > interval * 2.5 && delta < 1000) {
          if (++slow >= 12) degraded = true;
        } else {
          slow = 0;
        }
      }
    };

    // Single source of truth for (re)starting the loop. Always cancels first so
    // visibility / pageshow / context-restore can never stack two rAF chains
    // (which would double the speed and read as a glitch).
    const start = () => {
      cancelAnimationFrame(raf);
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => cancelAnimationFrame(raf);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      // Only a real width change warrants a rebuild. Mobile browsers fire
      // resize on every URL-bar show/hide (height-only); rebuilding there would
      // wipe and restart the whole field, which is what reads as "glitchy."
      if (window.innerWidth === lastW) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 150);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    // Back/forward (bfcache) can restore the page with the canvas frozen and no
    // rAF running; rebuild + restart so it never comes back as a dead frame.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        build();
        start();
      }
    };

    // Mobile GPUs can drop the 2D context under memory pressure; without this
    // the canvas would stay permanently blank. Ask for it back, then re-init.
    const onContextLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    const onContextRestored = () => {
      build();
      start();
    };

    build();
    start();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("contextlost", onContextLost as EventListener);
    canvas.addEventListener(
      "contextrestored",
      onContextRestored as EventListener,
    );

    return () => {
      stop();
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("contextlost", onContextLost as EventListener);
      canvas.removeEventListener(
        "contextrestored",
        onContextRestored as EventListener,
      );
    };
  }, [pathname]);

  if (pathname !== "/") return null;

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 block"
    />
  );
}
