"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getCurrentPlayer,
  getSelectedDate,
  getTerminVotes,
  getHighscores,
  getGameCompleted,
  getGameUnlocks,
  isGameUnlocked,
  setGameUnlock,
} from "@/lib/storage";
import { CONFIG } from "@/lib/config";
import ParticleBackground from "@/components/ParticleBackground";
import CountdownTimer from "@/components/CountdownTimer";

export default function CountdownPage() {
  const router = useRouter();
  const [player, setPlayer] = useState<string | null>(null);
  const [selectedDate, setDate] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, number[]>>({});
  const [showAdmin, setShowAdmin] = useState(false);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [highscores, setHighscoresState] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [unlocks, setUnlocks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const p = getCurrentPlayer();
    if (!p) {
      router.replace("/");
      return;
    }
    setPlayer(p);
    setDate(getSelectedDate());
    setVotes(getTerminVotes());
    setHighscoresState(getHighscores());
    setCompleted(getGameCompleted());
    setUnlocks(getGameUnlocks());
  }, [router]);

  // Refresh state when returning to page (e.g. after playing a game)
  useEffect(() => {
    function handleFocus() {
      setHighscoresState(getHighscores());
      setCompleted(getGameCompleted());
      setUnlocks(getGameUnlocks());
    }
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Triple-tap on greeting to reveal admin panel (using ref for reliable counting)
  function handleGreetingTap() {
    if (player !== "Malte") return;
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    if (tapCountRef.current >= 3) {
      setShowAdmin((prev) => !prev);
      tapCountRef.current = 0;
      return;
    }
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 1200);
  }

  function resetAllData() {
    const keys = ["tdw_highscores", "tdw_terminVotes", "tdw_selectedDate", "tdw_gameCompleted", "tdw_gameUnlocks"];
    keys.forEach((k) => localStorage.removeItem(k));
    setDate(null);
    setVotes({});
    setHighscoresState({});
    setCompleted({});
    setUnlocks({});
    setShowAdmin(false);
  }

  function resetHighscores() {
    localStorage.removeItem("tdw_highscores");
    localStorage.removeItem("tdw_gameCompleted");
    setHighscoresState({});
    setCompleted({});
    setShowAdmin(false);
  }

  function resetTerminVotes() {
    localStorage.removeItem("tdw_terminVotes");
    localStorage.removeItem("tdw_selectedDate");
    setDate(null);
    setVotes({});
    setShowAdmin(false);
  }

  function toggleGameUnlock(gameId: string) {
    const current = isGameUnlocked(gameId);
    setGameUnlock(gameId, !current);
    setUnlocks(getGameUnlocks());
  }

  const selectedTermin = CONFIG.termine.find((t) => t.date === selectedDate);
  const myVotes = player ? votes[player] : [];
  const hasVoted = myVotes && myVotes.length > 0;

  // Sort highscores for display
  const sortedScores = Object.entries(highscores).sort(([, a], [, b]) => b - a);

  if (!player) return null;

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10 relative">
      <ParticleBackground />

      <div className="z-10 w-full max-w-md">
        <h1 className="font-bangers text-3xl md:text-4xl text-[#FFD700] text-center tracking-[4px] text-shadow-orange mb-2 animate-title-bounce">
          🚴 Tour de Will 🚴
        </h1>
        <p
          className="text-[#8ab4d6] text-center font-semibold tracking-wider mb-8 text-sm cursor-default select-none"
          onClick={handleGreetingTap}
        >
          Hallo {player}!
        </p>

        {/* Admin Panel (nur für Malte) */}
        {showAdmin && player === "Malte" && (
          <div className="glass-card rounded-2xl p-5 mb-6 border-[#e8590c]/50">
            <h3 className="font-bangers text-lg text-[#e8590c] tracking-wider mb-3">
              Admin-Panel
            </h3>

            {/* Score Overview */}
            {sortedScores.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Highscores</p>
                {sortedScores.map(([name, hs], i) => (
                  <div key={name} className="flex justify-between text-sm py-1 border-b border-white/5 last:border-0">
                    <span className="text-white/70">{i === 0 ? "👑 " : `${i + 1}. `}{name}</span>
                    <span className="text-[#FFD700]">{hs}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Game Unlock Toggles */}
            <div className="mb-4">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Spiele freischalten</p>
              {CONFIG.games.map((game) => {
                const unlocked = game.id === "bike-runner" || isGameUnlocked(game.id);
                return (
                  <div key={game.id} className="flex justify-between items-center text-sm py-1.5">
                    <span className="text-white/70">Woche {game.week}: {game.title}</span>
                    {game.id === "bike-runner" ? (
                      <span className="text-green-400 text-xs">Immer offen</span>
                    ) : (
                      <button
                        onClick={() => toggleGameUnlock(game.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          unlocked
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-white/5 text-white/40 border border-white/10"
                        }`}
                      >
                        {unlocked ? "Offen" : "Gesperrt"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-2 border-t border-white/10 pt-3">
              <button
                onClick={resetHighscores}
                className="text-left text-sm text-white/70 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                🗑️ Highscores + Abzeichen zurücksetzen
              </button>
              <button
                onClick={resetTerminVotes}
                className="text-left text-sm text-white/70 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                🗓️ Terminwahl zurücksetzen
              </button>
              <button
                onClick={resetAllData}
                className="text-left text-sm text-red-400 hover:text-red-300 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                💣 ALLES zurücksetzen
              </button>
              <button
                onClick={() => setShowAdmin(false)}
                className="text-xs text-white/30 mt-2"
              >
                Schließen
              </button>
            </div>
          </div>
        )}

        {/* Countdown */}
        <div className="mb-10">
          {selectedDate ? (
            <>
              <p className="text-center text-white/70 text-sm mb-4 font-semibold tracking-wider uppercase">
                Countdown zum Abenteuer
              </p>
              <CountdownTimer targetDate={selectedDate} />
              {selectedTermin && (
                <p className="text-center text-[#8ab4d6] text-sm mt-3">
                  {selectedTermin.label}
                </p>
              )}
            </>
          ) : (
            <Link href="/termin" className="block">
              <div className="glass-card rounded-2xl p-6 text-center hover:translate-y-[-2px] transition-all cursor-pointer hover:border-[rgba(255,215,0,0.4)]">
                <p className="text-3xl mb-2">🗓️</p>
                <p className="text-white/70 font-semibold mb-1">
                  Termin noch offen
                </p>
                <p className="text-[#8ab4d6] text-sm">
                  {hasVoted ? "Du hast abgestimmt – Tippe hier um zu ändern" : "Tippe hier um abzustimmen, wann du kannst"}
                </p>
              </div>
            </Link>
          )}
        </div>

        {/* Route with Games */}
        <h2 className="font-bangers text-xl text-white tracking-wider mb-6">
          Deine Route
        </h2>

        <div className="relative pl-8">
          {/* Vertical route line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#FFD700] via-[#FFD700]/40 to-[#FFD700]/10" />

          {CONFIG.games.map((game, i) => {
            const isCompleted = completed[game.id];
            const unlocked = game.id === "bike-runner" || isGameUnlocked(game.id);
            const isLast = i === CONFIG.games.length - 1;

            return (
              <div key={game.id} className="relative mb-6 last:mb-8">
                {/* Route dot / checkmark */}
                <div
                  className={`absolute -left-8 top-4 w-[33px] h-[33px] rounded-full flex items-center justify-center border-[3px] z-10 ${
                    isCompleted
                      ? "bg-green-500 border-green-400 shadow-[0_0_12px_rgba(74,222,128,0.5)]"
                      : unlocked
                      ? "bg-[#FFD700] border-[#FFD700] shadow-[0_0_12px_rgba(255,215,0,0.4)] animate-pulse-slow"
                      : "bg-[#1a2a3a] border-white/20"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : unlocked ? (
                    <span className="text-[#1a2a3a] font-bold text-sm">{i + 1}</span>
                  ) : (
                    <span className="text-white/30 text-xs">🔒</span>
                  )}
                </div>

                {/* Game card */}
                {unlocked && game.href ? (
                  <Link href={game.href}>
                    <div className={`glass-card rounded-2xl p-4 hover:translate-y-[-2px] transition-all cursor-pointer ${
                      isCompleted
                        ? "border-green-500/30 hover:border-green-500/60"
                        : "border-[#FFD700]/30 hover:border-[#FFD700]/60"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{isCompleted ? "✅" : "🚴"}</div>
                        <div className="flex-1">
                          <div className="font-bangers text-lg text-white tracking-wider">
                            {game.title}
                          </div>
                          <div className="text-sm text-[#8ab4d6]">{game.description}</div>
                          {isCompleted && game.id === "bike-runner" && (
                            <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                              <span>🎯</span> Hinweis freigeschaltet!
                            </div>
                          )}
                        </div>
                        <div className="text-[#FFD700] text-xl">▶</div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="glass-card rounded-2xl p-4 opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🔒</div>
                      <div>
                        <div className="font-bangers text-lg text-white/50 tracking-wider">
                          Woche {game.week}
                        </div>
                        <div className="text-sm text-[#8ab4d6]/50">Bald verfügbar</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hint revealed after completion */}
                {isCompleted && game.id === "bike-runner" && (
                  <div className="mt-2 ml-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                    <p className="text-sm text-green-300 flex items-center gap-2">
                      <span className="text-lg">💡</span>
                      {CONFIG.bikeRunnerHintText}
                    </p>
                  </div>
                )}

                {/* Connector dots between stops */}
                {!isLast && (
                  <div className="absolute -left-[17.5px] bottom-[-12px]">
                    <div className="flex flex-col gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700]/30" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Destination: Tour Start */}
          <div className="relative mb-4">
            {/* Destination marker */}
            <div className="absolute -left-8 top-3 w-[33px] h-[33px] rounded-full flex items-center justify-center border-[3px] border-[#e8590c] bg-[#e8590c]/20 z-10">
              <span className="text-sm">📍</span>
            </div>

            <div className="glass-card rounded-2xl p-5 border-[#e8590c]/30 bg-gradient-to-r from-[#e8590c]/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🏁</div>
                <div className="flex-1">
                  <div className="font-bangers text-lg text-[#FFD700] tracking-wider">
                    Tour Start
                  </div>
                  <div className="text-sm text-white/60">
                    Was wird passieren?
                  </div>
                  <div className="text-xs text-[#8ab4d6] mt-1">
                    Löse alle Challenges um es herauszufinden...
                  </div>
                </div>
                <div className="text-2xl">❓</div>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("tdw_currentPlayer");
            router.replace("/");
          }}
          className="mt-8 text-white/30 text-xs text-center w-full hover:text-white/60 transition-colors"
        >
          Spieler wechseln
        </button>
      </div>
    </main>
  );
}
