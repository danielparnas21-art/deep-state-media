"use client";

/**
 * Procedural audio for the intro gate, synthesized live with the Web Audio API
 * so there are no asset files to ship or license. A low tension drone hums
 * under the boot, soft ticks mark each resolved line, and a breach boom + door
 * whoosh punctuate entry.
 *
 * Browsers block audio until a user gesture, so the AudioContext is created and
 * resumed lazily on the first tap (`armGateAudio`). Everything no-ops until
 * then and while muted. Volumes are deliberately low. Nothing here records or
 * transmits anything — it only makes sound.
 */

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let stopDrone: (() => void) | null = null;
let muted = false;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  // Creating/resuming an AudioContext can throw on some devices (locked audio,
  // low-power/silent mode, unsupported browser). Audio is non-critical, so we
  // swallow any failure and return null — callers no-op.
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** Call from a user gesture: unlocks the context and starts the ambient drone.
 *  Fully guarded — audio must never be able to throw into the gate flow. */
export function armGateAudio(): void {
  try {
    const c = getContext();
    if (!c || muted) return;
    if (!stopDrone) startDrone(c);
  } catch {
    /* audio unavailable — never block the gate */
  }
}

/** Mute/unmute. Muting stops the drone; unmuting waits for a gesture to re-arm. */
export function setGateMuted(m: boolean): void {
  muted = m;
  if (m) stopGateAudio();
}

function startDrone(c: AudioContext): void {
  if (!master) return;
  const now = c.currentTime;
  const g = c.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.06, now + 1.6);

  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 240;
  g.connect(lp).connect(master);

  // Two slightly detuned low oscillators = a warm, beating pad.
  const o1 = c.createOscillator();
  o1.type = "sine";
  o1.frequency.value = 55;
  const o2 = c.createOscillator();
  o2.type = "triangle";
  o2.frequency.value = 55.5;
  o1.connect(g);
  o2.connect(g);

  // Slow breathing LFO on the drone's gain.
  const lfo = c.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.12;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 0.018;
  lfo.connect(lfoGain).connect(g.gain);

  o1.start();
  o2.start();
  lfo.start();

  stopDrone = () => {
    const t = c.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(g.gain.value, t);
    g.gain.linearRampToValueAtTime(0, t + 0.4);
    o1.stop(t + 0.5);
    o2.stop(t + 0.5);
    lfo.stop(t + 0.5);
  };
}

function noiseBurst(
  c: AudioContext,
  dur: number,
  vol: number,
  freq: number,
  sweepUp: boolean,
  startAt?: number,
): void {
  if (!master) return;
  const now = startAt ?? c.currentTime;
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buffer;

  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(sweepUp ? freq * 0.4 : freq, now);
  if (sweepUp) bp.frequency.exponentialRampToValueAtTime(freq * 2.6, now + dur);
  bp.Q.value = 0.8;

  const g = c.createGain();
  g.gain.setValueAtTime(vol, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  src.connect(bp).connect(g).connect(master);
  src.start(now);
  src.stop(now + dur);
}

/** Soft click as a boot line resolves. */
export function gateTick(): void {
  const c = ctx;
  if (!c || !master || muted) return;
  const now = c.currentTime;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.linearRampToValueAtTime(0.05, now + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
  const o = c.createOscillator();
  o.type = "square";
  o.frequency.value = 760 + Math.random() * 360;
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 500;
  o.connect(hp).connect(g).connect(master);
  o.start(now);
  o.stop(now + 0.08);
}

/** Digital glitch zap the instant "deep state" tears into the open, before the
 *  breach: a rapid stutter of bright noise micro-bursts plus a square blip
 *  cracking downward. */
export function gateStab(): void {
  const c = ctx;
  if (!c || !master || muted) return;
  const now = c.currentTime;
  // Stutter: rapid bright noise micro-bursts at jumping frequencies.
  [0, 0.028, 0.052, 0.078, 0.1].forEach((t) =>
    noiseBurst(c, 0.022, 0.2, 1800 + Math.random() * 2400, false, now + t),
  );
  // Zap: a high square blip cracking down.
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.22, now + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  const o = c.createOscillator();
  o.type = "square";
  o.frequency.setValueAtTime(1200, now);
  o.frequency.exponentialRampToValueAtTime(220, now + 0.14);
  o.connect(g).connect(master);
  o.start(now);
  o.stop(now + 0.2);
}

/** The breach — a low boom + filtered crack as the lock blows open. */
export function gateBreach(): void {
  const c = ctx;
  if (!c || !master || muted) return;
  const now = c.currentTime;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.5, now + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(150, now);
  o.frequency.exponentialRampToValueAtTime(44, now + 0.7);
  o.connect(g).connect(master);
  o.start(now);
  o.stop(now + 0.95);
  noiseBurst(c, 0.35, 0.22, 1300, false);
}

/** A warm rising arpeggio — the "access granted" chime as the locks open. */
export function gateUnlock(): void {
  try {
    const c = ctx;
    const m = master; // const so the narrowing holds inside the closure
    if (!c || !m || muted) return;
    const now = c.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 · E5 · G5 · C6
    notes.forEach((freq, i) => {
      const t = now + i * 0.1;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.15, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      const o = c.createOscillator();
      o.type = "triangle";
      o.frequency.setValueAtTime(freq, t);
      o.connect(g).connect(m);
      o.start(t);
      o.stop(t + 0.65);
    });
  } catch {
    /* audio unavailable — never block the gate */
  }
}

/** Door whoosh as the gate splits open into the site. */
export function gateEnter(): void {
  const c = ctx;
  if (!c || !master || muted) return;
  const now = c.currentTime;
  noiseBurst(c, 0.6, 0.2, 650, true);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.4, now + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(95, now);
  o.frequency.exponentialRampToValueAtTime(38, now + 0.6);
  o.connect(g).connect(master);
  o.start(now);
  o.stop(now + 0.75);
}

/** Fade out and tear down the ambient drone (one-shots are left to finish). */
export function stopGateAudio(): void {
  if (stopDrone) {
    stopDrone();
    stopDrone = null;
  }
}
