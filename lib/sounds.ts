"use client";

// ============================================================
// 8-Bit Retro Sound System (Web Audio API)
// ============================================================

const MUTE_KEY = "tdw_soundMuted";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

export function isMuted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MUTE_KEY) === "true";
}

export function setMuted(muted: boolean) {
  localStorage.setItem(MUTE_KEY, muted ? "true" : "false");
}

export function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

// --- Sound generators ---

function playTone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.3) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playCrash() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.25);
  // Noise burst
  const noise = ctx.createOscillator();
  const noiseGain = ctx.createGain();
  noise.type = "sawtooth";
  noise.frequency.setValueAtTime(200, ctx.currentTime);
  noise.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.15);
  noiseGain.gain.setValueAtTime(0.2, ctx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  noise.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(ctx.currentTime);
  noise.stop(ctx.currentTime + 0.15);
}

function playStarCollect() {
  playTone(800, 0.08, "sine", 0.25);
  setTimeout(() => playTone(1200, 0.1, "sine", 0.25), 80);
}

function playComboWhoosh() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
}

function playMilestone() {
  const notes = [523, 659, 784]; // C5, E5, G5
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, "sine", 0.25), i * 120);
  });
}

function playHintFanfare() {
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, i === 3 ? 0.4 : 0.15, "sine", 0.3), i * 150);
  });
}

function playTargetSpawn() {
  playTone(600, 0.1, "sine", 0.2);
}

function playTapHit() {
  playTone(300, 0.05, "square", 0.15);
  setTimeout(() => playTone(500, 0.05, "sine", 0.15), 30);
}

function playGameOver() {
  const notes = [392, 330, 262]; // G4, E4, C4
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, "sine", 0.25), i * 150);
  });
}

function playAchievement() {
  const notes = [523, 659, 784, 1047, 784, 1047]; // C5-E5-G5-C6-G5-C6
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.12, "sine", 0.2), i * 100);
  });
}

// --- Public API ---

export type SoundName =
  | "crash"
  | "starCollect"
  | "comboWhoosh"
  | "milestone"
  | "hintFanfare"
  | "targetSpawn"
  | "tapHit"
  | "gameOver"
  | "achievement";

const soundMap: Record<SoundName, () => void> = {
  crash: playCrash,
  starCollect: playStarCollect,
  comboWhoosh: playComboWhoosh,
  milestone: playMilestone,
  hintFanfare: playHintFanfare,
  targetSpawn: playTargetSpawn,
  tapHit: playTapHit,
  gameOver: playGameOver,
  achievement: playAchievement,
};

export function playSound(name: SoundName) {
  if (typeof window === "undefined") return;
  if (isMuted()) return;
  try {
    soundMap[name]();
  } catch {
    // Silently fail if audio context is unavailable
  }
}
