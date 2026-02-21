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
  getCustomTermine,
  setCustomTermine,
  Termin,
  getAchievements,
  hasAchievement,
  getLastSeenUnlocks,
  setLastSeenUnlocks,
} from "@/lib/storage";
import { CONFIG, ACHIEVEMENTS } from "@/lib/config";
import ParticleBackground from "@/components/ParticleBackground";
import CountdownTimer from "@/components/CountdownTimer";
import WeatherWidget from "@/components/WeatherWidget";

// Route dot offsets to create winding path feel
const ROUTE_OFFSETS = [0, 18, -12, 18, -12, 0]; // px shift for each stop

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
  const [termine, setTermine] = useState<Termin[]>(CONFIG.termine as unknown as Termin[]);
  const [newTerminLabel, setNewTerminLabel] = useState("");
  const [newTerminDate, setNewTerminDate] = useState("");
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);
  const [playerAchievements, setPlayerAchievements] = useState<Record<string, { unlockedAt: string }>>({});
  const [sharedScores, setSharedScores] = useState<Record<string, Record<string, number>>>({});

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
    setPlayerAchievements(getAchievements());
    const custom = getCustomTermine();
    if (custom) setTermine(custom);

    // Fetch shared scores from backend
    fetch("/api/scores")
      .then((res) => res.json())
      .then((data) => setSharedScores(data))
      .catch(() => {});

    // Check for newly unlocked games (notification system)
    const currentUnlocks = getGameUnlocks();
    const lastSeen = getLastSeenUnlocks(p);
    const newGames = CONFIG.games.filter(
      (g) => currentUnlocks[g.id] === true && !lastSeen.includes(g.id) && g.id !== "bike-runner"
    );
    if (newGames.length > 0) {
      setNewlyUnlocked(newGames.map((g) => g.id));
      setTimeout(() => {
        setNewlyUnlocked([]);
        const allUnlocked = Object.entries(currentUnlocks)
          .filter(([, v]) => v)
          .map(([k]) => k);
        setLastSeenUnlocks(p, [...allUnlocked, "bike-runner"]);
      }, 5000);
    }
  }, [router]);

  // Refresh state when returning to page
  useEffect(() => {
    function handleFocus() {
      setHighscoresState(getHighscores());
      setCompleted(getGameCompleted());
      setUnlocks(getGameUnlocks());
      setPlayerAchievements(getAchievements());
    }
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

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
    const keys = ["tdw_highscores", "tdw_terminVotes", "tdw_selectedDate", "tdw_gameCompleted", "tdw_gameUnlocks", "tdw_achievements"];
    keys.forEach((k) => localStorage.removeItem(k));
    setDate(null);
    setVotes({});
    setHighscoresState({});
    setCompleted({});
    setUnlocks({});
    setPlayerAchievements({});
    setShowAdmin(false);
  }

  function resetHighscores() {
    localStorage.removeItem("tdw_highscores");
    localStorage.removeItem("tdw_gameCompleted");
    localStorage.removeItem("tdw_achievements");
    setHighscoresState({});
    setCompleted({});
    setPlayerAchievements({});
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

  function addTermin() {
    if (!newTerminLabel.trim() || !newTerminDate) return;
    const nextId = termine.length > 0 ? Math.max(...termine.map((t) => t.id)) + 1 : 1;
    const updated = [...termine, { id: nextId, label: newTerminLabel.trim(), date: newTerminDate }];
    setTermine(updated);
    setCustomTermine(updated);
    setNewTerminLabel("");
    setNewTerminDate("");
  }

  function removeTermin(id: number) {
    const updated = termine.filter((t) => t.id !== id);
    setTermine(updated);
    setCustomTermine(updated);
  }

  const selectedTermin = termine.find((t) => t.date === selectedDate);
  const myVotes = player ? votes[player] : [];
  const hasVoted = myVotes && myVotes.length > 0;
  const sortedScores = Object.entries(highscores).sort(([, a], [, b]) => b - a);
  const achievementCount = Object.keys(playerAchievements).length;

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

        {/* Notification: New game unlocked */}
        {newlyUnlocked.length > 0 && (
          <div className="mb-6 animate-slide-in-top">
            <div className="glass-card rounded-2xl p-4 border-[#FFD700]/50 bg-gradient-to-r from-[#FFD700]/10 to-transparent">
              <div className="flex items-center gap-3">
                <span className="text-3xl animate-pulse-slow">🎉</span>
                <div>
                  <p className="font-bangers text-lg text-[#FFD700] tracking-wider">
                    Neue Challenge!
                  </p>
                  {newlyUnlocked.map((id) => {
                    const g = CONFIG.games.find((g) => g.id === id);
                    return g ? (
                      <p key={id} className="text-sm text-white/80">
                        {g.title} ist jetzt verfügbar!
                      </p>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Panel (nur für Malte) */}
        {showAdmin && player === "Malte" && (
          <div className="glass-card rounded-2xl p-5 mb-6 border-[#e8590c]/50">
            <h3 className="font-bangers text-lg text-[#e8590c] tracking-wider mb-3">
              Admin-Panel
            </h3>

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

            <div className="mb-4">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Spiele freischalten</p>
              {CONFIG.games.map((game) => {
                const unlocked = game.id === "bike-runner" || isGameUnlocked(game.id);
                return (
                  <div key={game.id} className="flex justify-between items-center text-sm py-1.5">
                    <span className="text-white/70">{game.title}</span>
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

            <div className="mb-4">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Termine verwalten</p>
              {termine.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm py-1.5 border-b border-white/5 last:border-0">
                  <div className="flex-1 min-w-0">
                    <span className="text-white/70 truncate block">{t.label}</span>
                    <span className="text-white/30 text-xs">{t.date}</span>
                  </div>
                  <button
                    onClick={() => removeTermin(t.id)}
                    className="ml-2 px-2 py-1 rounded text-xs text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                <input
                  type="text"
                  value={newTerminLabel}
                  onChange={(e) => setNewTerminLabel(e.target.value)}
                  placeholder="z.B. Samstag, 16. Mai"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FFD700]/50"
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={newTerminDate}
                    onChange={(e) => setNewTerminDate(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FFD700]/50 [color-scheme:dark]"
                  />
                  <button
                    onClick={addTermin}
                    disabled={!newTerminLabel.trim() || !newTerminDate}
                    className="px-4 py-2 rounded-lg text-sm font-bold transition-colors bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 hover:bg-[#FFD700]/30 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-white/10 pt-3">
              <button onClick={resetHighscores} className="text-left text-sm text-white/70 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-colors">
                🗑️ Highscores + Achievements zurücksetzen
              </button>
              <button onClick={resetTerminVotes} className="text-left text-sm text-white/70 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-colors">
                🗓️ Terminwahl zurücksetzen
              </button>
              <button onClick={resetAllData} className="text-left text-sm text-red-400 hover:text-red-300 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors">
                💣 ALLES zurücksetzen
              </button>
              <button onClick={() => setShowAdmin(false)} className="text-xs text-white/30 mt-2">
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
              <WeatherWidget targetDate={selectedDate} />
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

        {/* Route intro text */}
        <div className="glass-card rounded-2xl p-5 mb-6 border-[#FFD700]/20 bg-gradient-to-r from-[#FFD700]/5 to-transparent">
          <p className="font-bangers text-lg text-[#FFD700] tracking-wider mb-1">
            Was wird passieren?
          </p>
          <p className="text-sm text-white/70 mb-2">
            Löse alle Challenges, um das Geheimnis der Tour zu lüften!
          </p>
          <p className="text-xs text-[#8ab4d6]">
            Du erhältst eine Nachricht, sobald eine neue Challenge freigeschaltet wird.
          </p>
        </div>

        {/* Route with Games */}
        <h2 className="font-bangers text-xl text-white tracking-wider mb-4">
          Deine Route zum Abenteuer
        </h2>

        {/* Adventure Route */}
        <div className="relative pl-12">
          {/* SVG winding path */}
          <svg
            className="absolute left-0 top-0 w-14 pointer-events-none"
            style={{ height: "100%" }}
            viewBox="0 0 56 500"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id="routeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="60%" stopColor="#FFD700" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FFD700" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d="M 28 0 C 48 40, 8 80, 28 100 C 48 120, 8 160, 28 200 C 48 240, 8 280, 28 300 C 48 320, 8 360, 28 400 C 48 440, 28 470, 28 500"
              stroke="url(#routeGrad)"
              strokeWidth="3"
              strokeDasharray="8 5"
              className="animate-draw-path"
            />
            {/* Small decorative dots along path */}
            <circle cx="38" cy="60" r="2" fill="#FFD700" opacity="0.2" />
            <circle cx="18" cy="150" r="2" fill="#FFD700" opacity="0.2" />
            <circle cx="38" cy="250" r="2" fill="#FFD700" opacity="0.2" />
            <circle cx="18" cy="350" r="2" fill="#FFD700" opacity="0.2" />
          </svg>

          {/* Compass at top */}
          <div className="absolute -left-1 -top-6 text-lg opacity-40">🧭</div>

          {CONFIG.games.map((game, i) => {
            const isCompleted = completed[game.id];
            const unlocked = game.id === "bike-runner" || isGameUnlocked(game.id);
            const isNewlyUnlocked = newlyUnlocked.includes(game.id);
            const offset = ROUTE_OFFSETS[i] || 0;

            return (
              <div key={game.id} className="relative mb-8">
                {/* Route dot / checkmark */}
                <div
                  className={`absolute top-4 w-[33px] h-[33px] rounded-full flex items-center justify-center border-[3px] z-10 transition-all ${
                    isCompleted
                      ? "bg-green-500 border-green-400 shadow-[0_0_12px_rgba(74,222,128,0.5)]"
                      : unlocked
                      ? `bg-[#FFD700] border-[#FFD700] shadow-[0_0_12px_rgba(255,215,0,0.4)] ${isNewlyUnlocked ? "animate-glow-pulse" : "animate-pulse-slow"}`
                      : "bg-[#1a2a3a] border-white/20"
                  }`}
                  style={{ left: `${-44 + offset}px` }}
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

                {/* Decorative elements along path */}
                {i === 0 && <div className="absolute -left-2 top-16 text-xs opacity-20">🌲</div>}
                {i === 1 && <div className="absolute -left-6 top-12 text-xs opacity-20">⛰️</div>}
                {i === 2 && <div className="absolute -left-2 top-16 text-xs opacity-20">🏕️</div>}

                {/* Game card */}
                {unlocked && game.href ? (
                  <Link href={game.href}>
                    <div className={`glass-card rounded-2xl p-4 hover:translate-y-[-2px] transition-all cursor-pointer ${
                      isCompleted
                        ? "border-green-500/30 hover:border-green-500/60"
                        : isNewlyUnlocked
                        ? "border-[#FFD700]/60 animate-glow-pulse"
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
                          Geheime Challenge
                        </div>
                        <div className="text-sm text-[#8ab4d6]/50">Wird bald freigeschaltet...</div>
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
              </div>
            );
          })}

          {/* Destination: Das große Abenteuer */}
          <div className="relative mb-4">
            <div
              className="absolute top-3 w-[33px] h-[33px] rounded-full flex items-center justify-center border-[3px] border-[#e8590c] bg-[#e8590c]/20 z-10"
              style={{ left: `${-44 + (ROUTE_OFFSETS[CONFIG.games.length] || 0)}px` }}
            >
              <span className="text-sm">📍</span>
            </div>

            <div className="glass-card rounded-2xl p-5 border-[#e8590c]/30 bg-gradient-to-r from-[#e8590c]/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🏁</div>
                <div className="flex-1">
                  <div className="font-bangers text-lg text-[#FFD700] tracking-wider">
                    Das große Abenteuer
                  </div>
                  <div className="text-sm text-white/60">
                    Ziel der Tour
                  </div>
                </div>
                <div className="text-2xl">🗺️</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-10">
          <h2 className="font-bangers text-xl text-white tracking-wider mb-1">
            Deine Erfolge
          </h2>
          <p className="text-[#8ab4d6] text-xs mb-4">
            {achievementCount}/{ACHIEVEMENTS.length} freigeschaltet
          </p>
          <div className="grid grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((a) => {
              const unlocked = hasAchievement(a.id);
              return (
                <div
                  key={a.id}
                  className={`glass-card rounded-xl p-3 text-center transition-all ${
                    unlocked ? "border-[#FFD700]/40" : "opacity-40 grayscale"
                  }`}
                >
                  <div className="text-2xl mb-1">{unlocked ? a.emoji : "🔒"}</div>
                  <div className="text-xs font-bold text-white/80 leading-tight">
                    {unlocked ? a.title : "???"}
                  </div>
                  {unlocked && (
                    <div className="text-[10px] text-[#8ab4d6] mt-1 leading-tight">
                      {a.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Shared Leaderboard */}
        {Object.keys(sharedScores).length > 0 && (
          <div className="mt-10">
            <h2 className="font-bangers text-xl text-white tracking-wider mb-4">
              Bestenliste
            </h2>
            {CONFIG.games.filter(g => g.href).map((game) => {
              const scores = sharedScores[game.id];
              if (!scores || Object.keys(scores).length === 0) return null;
              const sorted = Object.entries(scores).sort(([, a], [, b]) => Number(b) - Number(a));
              return (
                <div key={game.id} className="glass-card rounded-2xl p-4 mb-3">
                  <p className="font-bangers text-sm text-[#FFD700] tracking-wider mb-2">{game.title}</p>
                  {sorted.map(([name, hs], i) => (
                    <div key={name} className={`flex justify-between text-sm py-1 border-b border-white/5 last:border-0 ${name === player ? "text-[#FFD700]" : ""}`}>
                      <span className="text-white/70">{i === 0 ? "👑 " : `${i + 1}. `}{name}</span>
                      <span className={name === player ? "text-[#FFD700] font-bold" : "text-white/50"}>{hs}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

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
