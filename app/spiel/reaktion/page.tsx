"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCurrentPlayer, getHighscores, setHighscore, setGameCompleted, unlockAchievement } from "@/lib/storage";
import { ACHIEVEMENTS } from "@/lib/config";
import { playSound, vibrate, isMuted, setMuted } from "@/lib/sounds";
import AchievementPopup from "@/components/AchievementPopup";
import ParticleBackground from "@/components/ParticleBackground";

const TARGETS = ["🦘", "🚴", "🎂", "🌟", "🎯", "⚡", "🔥", "🎪", "🐊", "🍻"];
const ROUNDS = 10;
const HIGHSCORE_KEY_PREFIX = "reaktion_";

interface Target {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  spawned: number;
}

export default function ReaktionPage() {
  const router = useRouter();
  const [player, setPlayer] = useState<string | null>(null);
  const [gameState, setGameState] = useState<"ready" | "countdown" | "playing" | "gameover">("ready");
  const [countdownNum, setCountdownNum] = useState(3);
  const [targets, setTargets] = useState<Target[]>([]);
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [highscores, setHighscores] = useState<Record<string, number>>({});
  const spawnTimeRef = useRef(0);
  const areaRef = useRef<HTMLDivElement>(null);
  const [muted, setMutedState] = useState(false);
  const [achievementPopup, setAchievementPopup] = useState<{ title: string; emoji: string; description: string } | null>(null);

  useEffect(() => {
    const p = getCurrentPlayer();
    if (!p) {
      router.replace("/");
      return;
    }
    setPlayer(p);
    setHighscores(getHighscores("reaktion"));
    setMutedState(isMuted());
  }, [router]);

  function tryUnlockAchievement(id: string) {
    const isNew = unlockAchievement(id);
    if (isNew) {
      const def = ACHIEVEMENTS.find(a => a.id === id);
      if (def) {
        playSound("achievement");
        setAchievementPopup({ title: def.title, emoji: def.emoji, description: def.description });
      }
      if (player) {
        fetch("/api/achievements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ player, achievementId: id }),
        }).catch(() => {});
      }
    }
  }

  const spawnTarget = useCallback(() => {
    const emoji = TARGETS[Math.floor(Math.random() * TARGETS.length)];
    const size = 50 + Math.random() * 30;
    const x = 10 + Math.random() * 70; // % from left
    const y = 10 + Math.random() * 60; // % from top
    setTargets([{ id: Date.now(), emoji, x, y, size, spawned: Date.now() }]);
    spawnTimeRef.current = Date.now();
    playSound("targetSpawn");
  }, []);

  function startGame() {
    setGameState("countdown");
    setRound(0);
    setTimes([]);
    setCountdownNum(3);

    let count = 3;
    const interval = setInterval(() => {
      count--;
      setCountdownNum(count);
      if (count === 0) {
        clearInterval(interval);
        setGameState("playing");
        spawnTarget();
      }
    }, 800);
  }

  function handleTap() {
    if (gameState !== "playing" || targets.length === 0) return;

    playSound("tapHit");
    vibrate(20);

    const reactionTime = Date.now() - spawnTimeRef.current;
    const newTimes = [...times, reactionTime];
    setTimes(newTimes);
    setTargets([]);

    const nextRound = round + 1;
    setRound(nextRound);

    if (nextRound >= ROUNDS) {
      const avg = Math.round(newTimes.reduce((a, b) => a + b, 0) / newTimes.length);
      const score = Math.max(0, 1000 - avg);
      if (player) {
        setHighscore(player, score, "reaktion");
        setHighscores(getHighscores("reaktion"));
        fetch("/api/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ player, game: "reaktion", score }),
        }).catch(() => {});
      }
      setGameCompleted("reaktion");
      playSound("gameOver");

      // Check achievements
      if (avg < 200) tryUnlockAchievement("geschwindigkeitsrausch");
      if (score >= 800) tryUnlockAchievement("perfektionist");
      if (newTimes.some(t => t < 150)) tryUnlockAchievement("blitzstart");

      setGameState("gameover");
    } else {
      // Next target after random delay
      const delay = 400 + Math.random() * 1200;
      setTimeout(() => {
        if (gameState === "playing") spawnTarget();
      }, delay);
    }
  }

  const avgTime = times.length > 0
    ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    : 0;
  const bestTime = times.length > 0 ? Math.min(...times) : 0;

  if (!player) return null;

  return (
    <main className="min-h-screen flex flex-col items-center px-2 py-4 relative">
      <ParticleBackground />

      <div className="z-10 w-full max-w-sm">
        {achievementPopup && (
          <AchievementPopup
            {...achievementPopup}
            onDone={() => setAchievementPopup(null)}
          />
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/countdown")}
              className="text-white/50 hover:text-white text-sm"
            >
              ← Zurück
            </button>
            <button
              onClick={() => { const next = !muted; setMutedState(next); setMuted(next); }}
              className="text-white/40 hover:text-white text-sm"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>
          <div className="font-bangers text-lg text-[#FFD700] tracking-wider">
            {round}/{ROUNDS}
          </div>
        </div>

        {/* Game Area */}
        <div
          ref={areaRef}
          className="relative w-full rounded-2xl overflow-hidden touch-none select-none"
          style={{ height: "500px", background: "linear-gradient(180deg, #1a2a3a, #0f1923)" }}
          onClick={handleTap}
        >
          {/* Ready screen */}
          {gameState === "ready" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <h2 className="font-bangers text-3xl text-[#FFD700] tracking-wider mb-2 text-shadow-orange">
                Reaktionstest
              </h2>
              <p className="text-white/80 text-center text-sm px-6 mb-2">
                Tippe so schnell wie möglich auf die Emojis!
              </p>
              <p className="text-[#8ab4d6] text-center text-xs px-6 mb-6">
                {ROUNDS} Runden – wer hat die schnellsten Reflexe?
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="px-8 py-3 rounded-full font-bangers text-xl tracking-wider text-[#1a1a2e] animate-pulse-slow"
                style={{ background: "linear-gradient(135deg, #FFD700, #e8590c)" }}
              >
                Start!
              </button>
            </div>
          )}

          {/* Countdown */}
          {gameState === "countdown" && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <span className="font-bangers text-8xl text-[#FFD700] text-shadow-orange animate-pulse-slow">
                {countdownNum}
              </span>
            </div>
          )}

          {/* Targets */}
          {gameState === "playing" && targets.map((t) => (
            <div
              key={t.id}
              className="absolute cursor-pointer animate-fade-in-up"
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                fontSize: `${t.size}px`,
                transform: "translate(-50%, -50%)",
                filter: "drop-shadow(0 0 10px rgba(255,215,0,0.5))",
              }}
            >
              {t.emoji}
            </div>
          ))}

          {/* Waiting for next target */}
          {gameState === "playing" && targets.length === 0 && round < ROUNDS && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white/30 text-sm">Warte...</p>
            </div>
          )}

          {/* Last reaction time flash */}
          {gameState === "playing" && times.length > 0 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <span className={`font-bold text-lg ${times[times.length - 1] < 300 ? "text-green-400" : times[times.length - 1] < 500 ? "text-[#FFD700]" : "text-[#e8590c]"}`}>
                {times[times.length - 1]}ms
              </span>
            </div>
          )}

          {/* Game Over */}
          {gameState === "gameover" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20">
              <h2 className="font-bangers text-3xl text-[#FFD700] tracking-wider mb-4 text-shadow-orange">
                Ergebnis!
              </h2>

              <div className="glass-card rounded-2xl p-5 w-64 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70 text-sm">Durchschnitt</span>
                  <span className="font-bold text-[#FFD700] text-lg">{avgTime}ms</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70 text-sm">Beste Reaktion</span>
                  <span className="font-bold text-green-400 text-lg">{bestTime}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Bewertung</span>
                  <span className="font-bold text-lg">
                    {avgTime < 250 ? "🔥 Blitzschnell!" : avgTime < 350 ? "⚡ Sehr gut!" : avgTime < 500 ? "👍 Solide!" : "🐢 Übung macht den Meister!"}
                  </span>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="glass-card rounded-2xl p-4 w-64 mb-6">
                <h3 className="font-bangers text-lg text-[#FFD700] tracking-wider mb-3 text-center">
                  Bestenliste
                </h3>
                {Object.entries(highscores)
                  .sort(([, a], [, b]) => b - a)
                  .map(([name, hs], i) => (
                    <div
                      key={name}
                      className="flex justify-between items-center py-1.5 border-b border-white/10 last:border-0"
                    >
                      <span className="text-white/80 text-sm">
                        {i === 0 ? "👑 " : `${i + 1}. `}{name}
                      </span>
                      <span className="font-bold text-[#FFD700] text-sm">{hs}</span>
                    </div>
                  ))}
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="px-8 py-3 rounded-full font-bangers text-xl tracking-wider text-[#1a1a2e]"
                style={{ background: "linear-gradient(135deg, #FFD700, #e8590c)" }}
              >
                Nochmal!
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
