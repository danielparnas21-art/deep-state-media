"use client";

/**
 * Route-level safety net. If anything in the page tree throws at runtime, the
 * visitor sees this themed fallback with a one-tap recovery instead of a blank
 * or frozen screen. (The intro gate has its own boundary in IntroGate.tsx.)
 */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#06070d] px-6 text-center text-paper">
      <p className="mb-4 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-signal-400">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-500" />
        Signal interference
      </p>
      <h1 className="display-stencil text-[clamp(2rem,5vw,3.4rem)] leading-[0.98]">
        Lost the connection.
      </h1>
      <p className="mt-4 max-w-md text-paper/60">
        A momentary glitch on the wire. Re-establish the channel and try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-signal-500 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-signal-600"
      >
        Reconnect
      </button>
    </div>
  );
}
