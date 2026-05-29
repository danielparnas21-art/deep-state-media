"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import { EASE_IN_OUT_EXPO, EASE_OUT_EXPO } from "@/lib/motion";
import {
  armGateAudio,
  gateBreach,
  gateEnter,
  gateTick,
  setGateMuted,
  stopGateAudio,
} from "@/lib/gateAudio";
import { cn } from "@/lib/cn";

/**
 * The Unlock — a full-screen entry gate that plays on every page load. A short
 * decrypt sequence scrambles and resolves on screen, a progress readout climbs
 * to 100%, then the brand asks the visitor to step inside; clicking Enter splits
 * the screen open (doors) to reveal the site behind it.
 *
 * The real page is always rendered in the DOM beneath this overlay (good for
 * SEO/crawlers). The gate is skippable and, under prefers-reduced-motion, the
 * decrypt is bypassed and the prompt shows immediately with no animation.
 */
const BOOT_LINES = [
  "establishing secure channel",
  "tracing inbound signal …",
  "indexing 12,418 documents",
  "cross-referencing both parties",
  "lifting the redactions",
  "exposing the deep state",
];

// "It sees you" — rewrite the trace line with the visitor's own context so the
// system reads as if it's scanning *them*. Uses only signals that are actually
// accurate client-side: exact local time and a coarse device label. (We avoid
// timezone-to-city, which is wrong for everyone outside the zone's namesake
// city — e.g. all of US Eastern reads as "New York".) Computed in the browser
// and shown back to them only — never sent or logged.
function personalizedBootLines(): string[] {
  const out = [...BOOT_LINES];
  try {
    const time = new Date()
      .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      .toLowerCase();
    const ua = navigator.userAgent;
    const device = /iphone/i.test(ua)
      ? "iphone"
      : /ipad/i.test(ua)
        ? "ipad"
        : /android/i.test(ua)
          ? "android"
          : /macintosh|mac os x/i.test(ua)
            ? "mac"
            : /windows/i.test(ua)
              ? "windows"
              : /linux/i.test(ua)
                ? "linux"
                : "";
    out[1] = `tracing signal ▸ ${time}${device ? ` · ${device}` : ""}`;
  } catch {
    /* unavailable — keep the generic trace line */
  }
  return out;
}

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&/<>*+=?·";

// Headline, split into lines/segments so the decode effect can resolve it
// character-by-character while preserving the accent styling. Written as the
// next beat after the boot's "exposing the deep state" payoff — the reveal.
const HEADLINE: { text: string; accent?: boolean }[][] = [
  [{ text: "The truth is" }],
  [{ text: "declassified.", accent: true }],
];

declare global {
  interface Window {
    __dsmEntered?: boolean;
  }
}

type Phase = "typing" | "ready" | "exiting" | "done";

export function IntroGate() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("typing");
  // The boot lines, personalized on the client after mount (see effect below).
  // Starts as the static set so SSR and first client render match.
  const [bootLines, setBootLines] = useState<string[]>(BOOT_LINES);
  const [lines, setLines] = useState<string[]>([]);
  const [activeLine, setActiveLine] = useState(0);
  const [progress, setProgress] = useState(0);
  // Brief held beat once decrypt reaches 100% — the lock arming before the breach.
  const [charged, setCharged] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Returning visitors who already gave an email skip the capture step (the
  // cinematic boot still plays — they just go straight to Enter).
  const [known, setKnown] = useState(false);
  // Gate sound design (procedural). On by default; persisted per device.
  const [soundOn, setSoundOn] = useState(true);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  // Guards against re-entry; also lets us run enter()'s side effects outside the
  // setState updater (dispatching there warns about cross-component updates).
  const enteringRef = useRef(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem("dsm:subscribed") === "1") setKnown(true);
    } catch {
      /* storage blocked — treat as a new visitor */
    }
  }, []);

  // "It sees you": swap in the visitor's real local context once on the client.
  // Done in an effect (not at render) so it never causes a hydration mismatch.
  useEffect(() => {
    setBootLines(personalizedBootLines());
  }, []);

  // Sound: respect any saved preference, then arm the audio engine on the very
  // first user gesture (browsers won't let it start before that). The ambient
  // drone fades in then; ticks / breach / whoosh fire on their cues.
  useEffect(() => {
    let on = true;
    try {
      on = localStorage.getItem("dsm:sound") !== "0";
    } catch {
      /* storage blocked — default to on */
    }
    setSoundOn(on);
    setGateMuted(!on);
    const arm = () => {
      if (on) armGateAudio();
    };
    window.addEventListener("pointerdown", arm, { once: true });
    window.addEventListener("keydown", arm, { once: true });
    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
      stopGateAudio();
    };
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    try {
      localStorage.setItem("dsm:sound", next ? "1" : "0");
    } catch {
      /* ignore */
    }
    setGateMuted(!next);
    if (next) armGateAudio(); // this handler is itself a user gesture
  };

  // Decrypt boot sequence — each line scrambles random glyphs, then resolves
  // left-to-right to the real text before the next line begins. Skipped under
  // reduced motion (prompt shows immediately).
  useEffect(() => {
    if (reduce) {
      setPhase("ready");
      setProgress(100);
      return;
    }

    const totalChars = bootLines.reduce((n, l) => n + l.length, 0);
    const out: string[] = [];
    let line = 0;
    let doneChars = 0;

    const scramble = (full: string, resolved: number) =>
      full
        .split("")
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < resolved) return ch;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");

    const runLine = () => {
      if (line >= bootLines.length) {
        setProgress(100);
        // Arm — hold on 100% for a beat of tension, then breach into the reveal.
        const arm = setTimeout(() => setCharged(true), 220);
        const breach = setTimeout(() => {
          gateBreach(); // boom + crack as the lock blows open
          setPhase("ready");
        }, 760);
        timers.current.push(arm, breach);
        return;
      }
      const full = bootLines[line];
      setActiveLine(line);
      let frame = 0;
      interval.current = setInterval(() => {
        frame += 1;
        const resolved = Math.min(Math.floor(frame / 1.5), full.length);
        out[line] = scramble(full, resolved);
        setLines([...out]);
        setProgress(
          Math.round(((doneChars + resolved) / totalChars) * 100),
        );
        if (resolved >= full.length) {
          if (interval.current) clearInterval(interval.current);
          out[line] = full;
          setLines([...out]);
          gateTick(); // soft click as the line locks in
          doneChars += full.length;
          line += 1;
          const t = setTimeout(runLine, 190);
          timers.current.push(t);
        }
      }, 30);
    };

    const start = setTimeout(runLine, 340);
    timers.current.push(start);

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      if (interval.current) clearInterval(interval.current);
    };
  }, [reduce, bootLines]);

  // Lock body scroll while the gate is up.
  useEffect(() => {
    if (phase === "done") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  const enter = () => {
    if (enteringRef.current) return;
    enteringRef.current = true;
    gateEnter(); // door whoosh
    stopGateAudio(); // fade the ambient drone out as we cross in
    // Signal the page (e.g. the coming-soon hero) to animate in as doors open.
    window.__dsmEntered = true;
    window.dispatchEvent(new Event("dsm:enter"));
    setPhase("exiting");
    const t = setTimeout(() => setPhase("done"), reduce ? 220 : 920);
    timers.current.push(t);
  };

  // Returning visitors who already gave their email skip the capture prompt
  // entirely. The cinematic boot still plays for everyone, but the instant it
  // resolves we breach straight into the site instead of asking them again.
  useEffect(() => {
    if (known && phase === "ready") enter();
    // enter() is guarded against re-entry; deps intentionally minimal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [known, phase]);

  // Fast-forward the decrypt to the prompt without bypassing the email gate.
  const skipBoot = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (interval.current) clearInterval(interval.current);
    setLines([...BOOT_LINES]);
    setActiveLine(BOOT_LINES.length);
    setProgress(100);
    setPhase("ready");
  };

  // Required email capture for new visitors — persists so returning visitors
  // skip straight to Enter. (Stubbed submit; wire a real endpoint before launch.)
  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError("Enter a valid email to continue.");
      return;
    }
    setEmailError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source: "intro-gate" }),
      });
      if (res.status === 400) {
        const data = await res.json().catch(() => ({}));
        setEmailError(data.error ?? "Enter a valid email to continue.");
        setSubmitting(false);
        return;
      }
      if (res.ok) {
        try {
          localStorage.setItem("dsm:subscribed", "1");
        } catch {
          /* storage blocked — proceed anyway */
        }
      }
    } catch {
      // Network/infra hiccup — don't trap the visitor at the gate. We let them
      // in without marking them subscribed, so they're asked again next visit.
    }
    enter();
  };

  if (phase === "done") return null;

  const exiting = phase === "exiting";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Enter Deep State Media"
      className="fixed inset-0 z-[100] overflow-hidden"
    >
      {/* Thin progress rail pinned to the very top edge */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 z-20 h-px origin-left bg-signal-500"
        initial={false}
        animate={{ scaleX: progress / 100, opacity: exiting ? 0 : 1 }}
        transition={{ ease: EASE_OUT_EXPO, duration: 0.25 }}
      />

      {/* Doors — two solid panels that slide apart on enter */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[51%] bg-[#05070d]"
        initial={false}
        animate={reduce ? { opacity: exiting ? 0 : 1 } : { y: exiting ? "-100%" : "0%" }}
        transition={{ duration: reduce ? 0.2 : 0.92, ease: EASE_IN_OUT_EXPO }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[51%] bg-[#05070d]"
        initial={false}
        animate={reduce ? { opacity: exiting ? 0 : 1 } : { y: exiting ? "100%" : "0%" }}
        transition={{ duration: reduce ? 0.2 : 0.92, ease: EASE_IN_OUT_EXPO }}
      />

      {/* Content layer — fades out as the doors open */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        initial={false}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: exiting ? 0.3 : 0.4, ease: EASE_OUT_EXPO }}
      >
        {/* Decor: faint grid + navy glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(120,150,199,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(120,150,199,0.6) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage:
                "radial-gradient(ellipse 70% 60% at 50% 50%, black 35%, transparent 100%)",
            }}
          />
          <div className="absolute left-1/2 top-1/2 h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(28,60,107,0.45),transparent_68%)] blur-2xl" />
          {/* Live "decryption console" decor — only while the boot is running */}
          {!reduce && phase === "typing" && (
            <>
              {/* Matrix-style cipher rain, masked away from the center text */}
              <CodeRain />
              {/* Static CRT scanlines */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 1px, transparent 3px)",
                }}
              />
              {/* Scanline sweep */}
              <motion.div
                className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-signal-500/70 to-transparent"
                initial={{ top: "12%", opacity: 0 }}
                animate={{ top: ["12%", "88%"], opacity: [0, 1, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Streaming decrypt log + live telemetry, lower-left */}
              <DataStream />
              {/* Investigation-subject ticker hugging the right edge, for balance */}
              <SubjectTicker />
            </>
          )}
        </div>

        {/* The breach — flash-bang + shockwave the instant the lock blows open */}
        {!reduce && (phase === "ready" || phase === "exiting") && <BreachFX />}

        <div className="absolute left-1/2 top-8 -translate-x-1/2">
          <Wordmark variant="inline" className="text-paper/90" />
        </div>

        {/* Status readout — top corners */}
        <div className="absolute inset-x-6 top-7 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-paper/40 sm:inset-x-10">
          <span className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-500" />
            </span>
            <span className="hidden sm:inline">Secure channel</span>
            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundOn ? "Mute sound" : "Unmute sound"}
              aria-pressed={soundOn}
              className="ml-1 inline-flex items-center text-paper/40 transition-colors hover:text-paper/80"
            >
              {soundOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
            </button>
          </span>
          <span className="tabular-nums text-paper/55">
            <span className="hidden sm:inline">
              {phase === "typing"
                ? charged
                  ? "BREACHING"
                  : "DECRYPTING"
                : "UNLOCKED"}{" "}
              ·{" "}
            </span>
            {progress}%
          </span>
        </div>

        <AnimatePresence mode="wait">
          {phase === "typing" ? (
            <motion.div
              key="boot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: charged ? 1.05 : 1 }}
              exit={{ opacity: 0, scale: 1.35, filter: "blur(8px)" }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
              style={
                charged
                  ? { textShadow: "0 0 16px rgba(200,57,42,0.55)" }
                  : undefined
              }
              className="relative font-mono text-left text-[13px] leading-relaxed text-paper/70 sm:text-sm"
            >
              {bootLines.map((full, i) => {
                const text = lines[i];
                const shown = text !== undefined;
                const resolved = shown && text === full && i < activeLine;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 whitespace-nowrap"
                    style={{ opacity: shown ? 1 : 0.18 }}
                  >
                    <span
                      className={
                        resolved
                          ? "text-signal-400"
                          : i === activeLine
                            ? "text-signal-500"
                            : "text-paper/25"
                      }
                    >
                      {resolved ? "✓" : "»"}
                    </span>
                    <span className={resolved ? "text-paper/55" : "text-paper"}>
                      {shown ? text : full.replace(/./g, "·")}
                    </span>
                    {i === activeLine && (
                      <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-px animate-pulse bg-signal-400 align-middle" />
                    )}
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="prompt"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative flex flex-col items-center"
            >
              <motion.p
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduce ? 0 : 0.45, duration: 0.5 }}
                className="mb-6 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-signal-400"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-500" />
                {known ? "Welcome back" : "Clearance required"}
              </motion.p>

              <motion.h2
                initial={reduce ? false : { opacity: 0, scale: 1.08 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                transition={
                  reduce ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT_EXPO }
                }
                style={
                  reduce
                    ? undefined
                    : { textShadow: "0 0 44px rgba(200,57,42,0.35)" }
                }
                className="display-stencil text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.98] text-paper"
              >
                <DecodeHeadline reduce={!!reduce} />
              </motion.h2>

              <motion.p
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 0.6, duration: 0.6, ease: EASE_OUT_EXPO }}
                className="mt-7 max-w-md text-paper/55"
              >
                {known ? (
                  <>
                    You&rsquo;re about to enter Deep State Media — the podcast,
                    the campaign trail, and the investigations both parties
                    would rather keep buried.
                  </>
                ) : (
                  <>
                    Drop your email to get in first — the podcast, the campaign
                    trail, and the investigations both parties would rather keep
                    buried.
                  </>
                )}
              </motion.p>

              {known ? (
                <motion.button
                  type="button"
                  onClick={enter}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.78, duration: 0.6, ease: EASE_OUT_EXPO }}
                  whileHover={reduce ? undefined : { scale: 1.03 }}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                  className="group mt-10 inline-flex items-center gap-3 rounded-full bg-signal-500 px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_20px_60px_-20px_rgba(200,57,42,0.7)] transition-colors hover:bg-signal-600"
                >
                  Uncover the Deep State
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </motion.button>
              ) : (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.78, duration: 0.6, ease: EASE_OUT_EXPO }}
                  className="mt-9 flex w-full max-w-md flex-col items-center"
                >
                  <form
                    onSubmit={submitEmail}
                    noValidate
                    className="flex w-full flex-col gap-3 sm:flex-row"
                  >
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(null);
                      }}
                      placeholder="you@email.com"
                      aria-label="Email address"
                      aria-invalid={!!emailError}
                      disabled={submitting}
                      className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/[0.04] px-6 py-4 text-[14px] text-paper placeholder:text-paper/35 transition-colors focus:border-signal-500/70 focus:outline-none focus:ring-1 focus:ring-signal-500/40 disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-signal-500 px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_20px_60px_-20px_rgba(200,57,42,0.7)] transition-colors hover:bg-signal-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {submitting ? "Unlocking…" : "Uncover the Deep State"}
                      {!submitting && (
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      )}
                    </button>
                  </form>

                  <p
                    className="mt-3 h-4 text-[12px] text-signal-400"
                    role="alert"
                  >
                    {emailError ?? ""}
                  </p>

                  {/* Very soft skip — easy to miss, but there for the wary. */}
                  <button
                    type="button"
                    onClick={enter}
                    className="mt-1 text-[10px] lowercase tracking-[0.15em] text-paper/25 transition-colors hover:text-paper/45"
                  >
                    skip for now
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {phase === "typing" && (
          <button
            type="button"
            onClick={skipBoot}
            className="absolute bottom-7 right-7 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/40 transition-colors hover:text-paper/80"
          >
            Skip intro
          </button>
        )}
      </motion.div>
    </div>
  );
}

/**
 * The breach effect — a single-shot flash-bang plus an expanding signal-red
 * shockwave that fires the instant the lock blows open. Mounts once when the
 * gate enters its "ready" state; not rendered under reduced motion.
 */
function BreachFX() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-30">
      {/* White flash-bang — clears fast so the decode reads behind it */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.72, 0] }}
        transition={{ duration: 0.42, times: [0, 0.08, 1], ease: "easeOut" }}
      />
      {/* Signal-red afterglow bloom */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,57,42,0.6),transparent_62%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ duration: 1, times: [0, 0.14, 1], ease: "easeOut" }}
      />
      {/* Shockwave rings rippling out from center */}
      <div className="absolute inset-0 grid place-items-center">
        <motion.span
          className="block aspect-square w-[34vmin] rounded-full border-2 border-signal-500"
          initial={{ scale: 0, opacity: 0.85 }}
          animate={{ scale: 12, opacity: 0 }}
          transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
        />
        <motion.span
          className="absolute block aspect-square w-[34vmin] rounded-full border border-paper/40"
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 9.5, opacity: 0 }}
          transition={{ duration: 0.95, delay: 0.07, ease: EASE_OUT_EXPO }}
        />
      </div>
    </div>
  );
}

type DecodeCell = {
  ch: string;
  final: string;
  state: "scramble" | "lock" | "flash" | "space";
};

/**
 * The headline "decode" — the words are cracked open character-by-character.
 * Each letter cycles through random cipher glyphs, then locks into place in a
 * left-to-right wave (flashing white the instant it resolves), while offset
 * red/cyan ghost copies tear and fade for a hijacked-signal feel. Each glyph
 * sits in a fixed-width slot (an invisible final character) so the scramble
 * never reflows the layout. Under reduced motion the headline renders plainly.
 */
function DecodeHeadline({ reduce }: { reduce: boolean }) {
  // Per-character lock times, computed once: a left-to-right wave with jitter.
  const plan = useRef<{ lockAt: number[][][]; end: number } | null>(null);
  if (!plan.current) {
    const START = 120;
    const SPREAD = 700;
    const JITTER = 130;
    let total = 0;
    HEADLINE.forEach((line) =>
      line.forEach((seg) => {
        for (const c of seg.text) if (c !== " ") total += 1;
      }),
    );
    let order = 0;
    const lockAt = HEADLINE.map((line) =>
      line.map((seg) =>
        Array.from(seg.text).map((ch) => {
          if (ch === " ") return 0;
          const at =
            START +
            (order / Math.max(total - 1, 1)) * SPREAD +
            Math.random() * JITTER;
          order += 1;
          return at;
        }),
      ),
    );
    plan.current = { lockAt, end: START + SPREAD + JITTER + 140 };
  }

  const build = (now: number): DecodeCell[][][] =>
    HEADLINE.map((line, li) =>
      line.map((seg, si) =>
        Array.from(seg.text).map((ch, ci) => {
          if (ch === " ") return { ch: " ", final: " ", state: "space" };
          const at = plan.current!.lockAt[li][si][ci];
          if (now >= at) {
            return { ch, final: ch, state: now - at < 110 ? "flash" : "lock" };
          }
          return {
            ch: GLYPHS[(Math.random() * GLYPHS.length) | 0],
            final: ch,
            state: "scramble",
          };
        }),
      ),
    );

  const [cells, setCells] = useState<DecodeCell[][][]>(() => build(0));

  useEffect(() => {
    if (reduce) return;
    const t0 = performance.now();
    const iv = setInterval(() => {
      const now = performance.now() - t0;
      setCells(build(now));
      if (now >= plan.current!.end) clearInterval(iv);
    }, 28);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  if (reduce) {
    return (
      <>
        {HEADLINE.map((line, li) => (
          <span key={li} className={li === 0 ? "block" : "mt-1 block"}>
            {line.map((seg, si) => (
              <span
                key={si}
                className={seg.accent ? "accent-signal" : undefined}
              >
                {seg.text}
              </span>
            ))}
          </span>
        ))}
      </>
    );
  }

  const renderCells = (data: DecodeCell[][][], ghost: boolean) =>
    data.map((line, li) => (
      <span key={li} className={li === 0 ? "block" : "mt-1 block"}>
        {line.map((seg, si) => (
          <span
            key={si}
            className={HEADLINE[li][si].accent ? "accent-signal" : undefined}
          >
            {seg.map((cell, ci) => {
              const cls =
                ghost || cell.state === "lock" || cell.state === "space"
                  ? undefined
                  : cell.state === "flash"
                    ? "text-white"
                    : "text-paper/60";
              const style =
                !ghost && cell.state === "flash"
                  ? { textShadow: "0 0 14px rgba(255,255,255,0.9)" }
                  : undefined;
              return (
                <span key={ci} className="relative inline-block align-top">
                  <span className="invisible">
                    {cell.final === " " ? " " : cell.final}
                  </span>
                  <span
                    className={cn("absolute inset-0 text-center", cls)}
                    style={style}
                  >
                    {cell.ch === " " ? " " : cell.ch}
                  </span>
                </span>
              );
            })}
          </span>
        ))}
      </span>
    ));

  const ghostCls =
    "pointer-events-none absolute inset-0 select-none mix-blend-screen [&_*]:!text-[color:inherit]";
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{renderCells(cells, false)}</span>
      <motion.span
        aria-hidden
        className={cn(ghostCls, "text-signal-500")}
        initial={{ x: -16, opacity: 0.85 }}
        animate={{ x: [-16, 9, -3, 0], opacity: [0.85, 0.55, 0.25, 0] }}
        transition={{ duration: 0.8, times: [0, 0.4, 0.75, 1], ease: "easeOut" }}
      >
        {renderCells(cells, true)}
      </motion.span>
      <motion.span
        aria-hidden
        className={cn(ghostCls, "text-[#3fe0ef]")}
        initial={{ x: 16, opacity: 0.85 }}
        animate={{ x: [16, -9, 3, 0], opacity: [0.85, 0.55, 0.25, 0] }}
        transition={{ duration: 0.8, times: [0, 0.4, 0.75, 1], ease: "easeOut" }}
      >
        {renderCells(cells, true)}
      </motion.span>
    </span>
  );
}

/**
 * Matrix-style cipher rain on a canvas — faint columns of glyphs streaming
 * downward, radially masked so they thin out behind the center text. Throttled
 * to ~18fps and torn down on unmount; only mounted while the boot is running.
 */
function CodeRain() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const FONT = 14;
    let w = 0;
    let h = 0;
    let cols = 0;
    let drops: number[] = [];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(1, Math.floor(w / FONT));
      drops = Array.from({ length: cols }, () => Math.random() * -40);
    };
    resize();
    window.addEventListener("resize", resize);
    let raf = 0;
    let last = 0;
    const STEP = 55;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < STEP) return;
      last = t;
      ctx.fillStyle = "rgba(5,7,13,0.16)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${FONT}px ui-monospace, SFMono-Regular, monospace`;
      for (let i = 0; i < cols; i += 1) {
        const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        const x = i * FONT;
        const y = drops[i] * FONT;
        ctx.fillStyle =
          Math.random() > 0.95
            ? "rgba(200,57,42,0.6)"
            : "rgba(120,150,199,0.34)";
        ctx.fillText(ch, x, y);
        if (y > h && Math.random() > 0.975) drops[i] = Math.random() * -16;
        drops[i] += 1;
      }
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      aria-hidden
      className="absolute inset-0 h-full w-full"
      style={{
        opacity: 0.55,
        maskImage:
          "radial-gradient(ellipse 70% 64% at 50% 50%, transparent 12%, black 92%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 64% at 50% 50%, transparent 12%, black 92%)",
      }}
    />
  );
}

const hexStr = (n: number) =>
  Array.from(
    { length: n },
    () => "0123456789ABCDEF"[(Math.random() * 16) | 0],
  ).join("");

// Thematic "declassification feed" lines — framed as documents being indexed
// and cross-referenced, drawn from both sides of the aisle. Decorative flavor,
// not factual claims about any named individual.
const FEED: ((r: (n: number) => number) => string)[] = [
  (r) => `decrypting FOIA #${4000 + r(5999)} …`,
  (r) => `redaction lifted ▸ pg ${1 + r(240)}`,
  () => "cross-referencing both parties",
  () => "xref: dark money ⟶ super PAC",
  (r) => `wire $${1 + r(9)}.${r(9)}M traced`,
  () => "follow the money …",
  (r) => `${2 + r(8)} names surfaced`,
  () => "donor ledger ▸ R + D flagged",
  () => "offshore shell co. mapped",
  () => "lobbying disclosure flagged",
  () => "revolving door ▸ K Street",
  () => "campaign finance ▸ both aisles",
  (r) => `Epstein flight logs ▸ ${10 + r(40)} names`,
  () => "Panama Papers ▸ match found",
  () => "subpoena trail ▸ traced",
  () => "whistleblower dossier opened",
  () => "classified memo ▸ declassified",
  () => "no party spared …",
  () => "exposing the deep state …",
];

/**
 * Streaming "declassification log" with live telemetry — a rolling feed of
 * investigation-themed lines plus files/sources counters that climb.
 * Lower-left, dim, hidden on small screens. Decorative only.
 */
function DataStream() {
  const [rows, setRows] = useState<string[]>([]);
  const [files, setFiles] = useState(12418);
  const [sources, setSources] = useState(7);
  useEffect(() => {
    const rint = (n: number) => (Math.random() * n) | 0;
    const make = () => FEED[rint(FEED.length)](rint);
    setRows(Array.from({ length: 6 }, make));
    const iv = setInterval(() => {
      setRows((prev) => [...prev.slice(-6), make()]);
      setFiles((f) => f + rint(40) + 5);
      setSources((s) => (s < 16 ? s + (Math.random() > 0.7 ? 1 : 0) : s));
    }, 140);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="absolute bottom-7 left-6 hidden max-w-[46vw] font-mono text-[10px] leading-relaxed text-paper/30 sm:left-10 sm:block">
      <div className="mb-1.5 flex items-center gap-3 uppercase tracking-[0.18em] text-paper/45">
        <span className="text-signal-400">{"// declassifying"}</span>
        <span className="tabular-nums">files {files.toLocaleString()}</span>
        <span className="tabular-nums">sources {sources}/16</span>
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className="whitespace-nowrap"
          style={{ opacity: 0.25 + (i / rows.length) * 0.75 }}
        >
          <span className="text-paper/25">›</span> {row}
        </div>
      ))}
    </div>
  );
}

// Investigation subjects that scroll up the right edge — bipartisan by design,
// flavor only (no fabricated claims about named living individuals).
const SUBJECTS = [
  "EPSTEIN FILES",
  "DARK MONEY",
  "OFFSHORE",
  "PANAMA PAPERS",
  "LOBBYING",
  "SUPER PAC",
  "FOIA",
  "REDACTED",
  "DONOR RECORDS",
  "K STREET",
  "SHELL CO.",
  "FLIGHT LOGS",
  "SUBPOENA",
  "DECLASSIFIED",
  "BOTH SIDES",
  "FOLLOW $",
  "WIRE XFER",
  "BLIND TRUST",
  "DEEP STATE",
  "NO PARTY SPARED",
  "REVOLVING DOOR",
  "CAMPAIGN FINANCE",
];

/**
 * Thin vertical column hugging the right edge — scrolls investigation subject
 * tokens (with occasional hex noise) up the screen to balance the lower-left
 * log with ambient "data everywhere" texture, themed to the Deep State beat.
 */
function SubjectTicker() {
  // Start empty so server and client render identically; the random rows are
  // filled in on mount (client-only) to avoid a hydration mismatch.
  const [rows, setRows] = useState<string[]>([]);
  useEffect(() => {
    const rint = (n: number) => (Math.random() * n) | 0;
    const next = () =>
      Math.random() > 0.78
        ? `${hexStr(2)} ${hexStr(2)}`
        : SUBJECTS[rint(SUBJECTS.length)];
    setRows(Array.from({ length: 14 }, next));
    const iv = setInterval(() => {
      setRows((prev) => [next(), ...prev.slice(0, 13)]);
    }, 240);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="absolute right-4 top-1/2 hidden max-w-[26vw] -translate-y-1/2 flex-col items-end gap-1.5 text-right font-mono text-[9px] uppercase leading-none tracking-[0.22em] text-paper/15 md:flex">
      {rows.map((r, i) => (
        <span
          key={i}
          className={cn(
            "whitespace-nowrap",
            i === 2 && "text-signal-500/45",
          )}
        >
          {r}
        </span>
      ))}
    </div>
  );
}
