"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatDuration } from "@/lib/episodes";

/**
 * Cinematic, on-brand audio player. Custom scrubber, 15-sec skip, speed
 * cycler, mute toggle. No native chrome — feels editorial, not bolted on.
 */
export function AudioPlayer({
  src,
  title,
  className,
}: {
  src: string;
  title: string;
  className?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onLoaded = () => setDuration(a.duration || 0);
    const onTime = () => {
      if (!scrubbing) setCurrent(a.currentTime);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onWaiting = () => setLoading(true);
    const onPlaying = () => setLoading(false);
    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("waiting", onWaiting);
    a.addEventListener("playing", onPlaying);
    return () => {
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("waiting", onWaiting);
      a.removeEventListener("playing", onPlaying);
    };
  }, [scrubbing]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
      } catch {
        // autoplay or src error — swallow; UI will reflect paused state
      }
    } else {
      a.pause();
    }
  };

  const skip = (delta: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min((a.duration || 0), a.currentTime + delta));
  };

  const seekFromEvent = (clientX: number) => {
    const el = scrubberRef.current;
    const a = audioRef.current;
    if (!el || !a || !duration) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const t = pct * duration;
    setCurrent(t);
    a.currentTime = t;
  };

  const cycleSpeed = () => {
    const next = speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : speed === 1.5 ? 2 : 1;
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  };

  const pct = duration ? (current / duration) * 100 : 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border border-white/10 bg-navy-950/60 p-5 backdrop-blur",
        className,
      )}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Scrubber */}
      <div
        ref={scrubberRef}
        role="slider"
        aria-label={`Scrub ${title}`}
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={current}
        tabIndex={0}
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          setScrubbing(true);
          seekFromEvent(e.clientX);
        }}
        onPointerMove={(e) => {
          if (scrubbing) seekFromEvent(e.clientX);
        }}
        onPointerUp={() => setScrubbing(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") skip(-5);
          if (e.key === "ArrowRight") skip(5);
        }}
        className="group relative h-3 cursor-pointer touch-none"
      >
        <div className="absolute inset-y-1/2 h-px w-full -translate-y-1/2 bg-white/15" />
        <motion.div
          className="absolute inset-y-1/2 h-[2px] -translate-y-1/2 bg-signal-500"
          style={{ width: `${pct}%` }}
        />
        <motion.div
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal-500 shadow-[0_0_12px_rgba(200,57,42,0.6)]"
          style={{ left: `${pct}%` }}
          aria-hidden
        />
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-navy-200">
        <span className="tabular-nums">{formatDuration(Math.floor(current))}</span>
        <span className="tabular-nums">{formatDuration(Math.floor(duration))}</span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => skip(-15)}
            aria-label="Back 15 seconds"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-paper hover:border-white/30"
          >
            <SkipBack size={14} />
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="group relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-signal-500 text-white transition-transform hover:scale-105"
          >
            {loading ? (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : playing ? (
              <Pause size={16} fill="currentColor" />
            ) : (
              <Play size={16} fill="currentColor" className="ml-0.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => skip(15)}
            aria-label="Forward 15 seconds"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-paper hover:border-white/30"
          >
            <SkipForward size={14} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cycleSpeed}
            aria-label="Playback speed"
            className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-paper hover:border-signal-500/60 hover:text-signal-400"
          >
            {speed}×
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-paper hover:border-white/30"
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
