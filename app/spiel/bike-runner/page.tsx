"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCurrentPlayer, getHighscores, setHighscore, setGameCompleted } from "@/lib/storage";
import { CONFIG } from "@/lib/config";
import ParticleBackground from "@/components/ParticleBackground";
import WillAvatar from "@/components/avatars/WillAvatar";
import MalteAvatar from "@/components/avatars/MalteAvatar";
import LindaAvatar from "@/components/avatars/LindaAvatar";
import NicolaAvatar from "@/components/avatars/NicolaAvatar";

// Obstacle types – Berlin + Aussie mix
const OBSTACLE_TYPES = [
  { emoji: "🕳️", label: "Schlagloch" },
  { emoji: "🚧", label: "Baustelle" },
  { emoji: "🚕", label: "Taxi" },
  { emoji: "🧑‍🤝‍🧑", label: "Touristen" },
  { emoji: "🥙", label: "Döner-Bude" },
  { emoji: "🛴", label: "E-Scooter" },
  { emoji: "🦘", label: "Boxendes Känguru" },
  { emoji: "🐊", label: "Alligator" },
];

const LANE_COUNT = 3;
const GAME_SPEED_INITIAL = 3;
const GAME_SPEED_INCREMENT = 0.0015;
const MIN_OBSTACLE_GAP = 120;
const MAX_OBSTACLE_GAP = 80;
const DOUBLE_OBSTACLE_CHANCE = 0.15;
const COLLISION_THRESHOLD = 28;

// Milestone thresholds
const MILESTONES = [100, 250, 500, 750, 1000, 1500, 2000];

// Avatar components by player name
const AVATARS: Record<string, React.ComponentType<{ className?: string }>> = {
  Will: WillAvatar,
  Malte: MalteAvatar,
  Linda: LindaAvatar,
  Nicola: NicolaAvatar,
};

function getOtherAvatars(current: string) {
  return Object.entries(AVATARS).filter(([name]) => name !== current);
}

interface Obstacle {
  id: number;
  lane: number;
  y: number;
  type: number;
  dodged?: boolean;
}

interface Collectible {
  id: number;
  lane: number;
  y: number;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  createdAt: number;
}

export default function BikeRunnerPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const collectiblesRef = useRef<Collectible[]>([]);
  const scoreRef = useRef(0);
  const speedRef = useRef(GAME_SPEED_INITIAL);
  const laneRef = useRef(1);
  const nextObstacleRef = useRef(0);
  const nextCollectibleRef = useRef(0);
  const hintShownRef = useRef(false);
  const gameActiveRef = useRef(false);
  const dodgeStreakRef = useRef(0);
  const lastMilestoneRef = useRef(0);
  const prevHighscoreRef = useRef(0);

  const [player, setPlayer] = useState<string | null>(null);
  const [gameState, setGameState] = useState<"ready" | "playing" | "hint" | "gameover">("ready");
  const [score, setScore] = useState(0);
  const [lane, setLane] = useState(1);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [showFriends, setShowFriends] = useState(false);
  const [highscores, setHighscores] = useState<Record<string, number>>({});
  const [roadOffset, setRoadOffset] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [dodgeStreak, setDodgeStreak] = useState(0);
  const [isNewHighscore, setIsNewHighscore] = useState(false);
  const [milestone, setMilestone] = useState<string | null>(null);
  const [screenShake, setScreenShake] = useState(false);

  useEffect(() => {
    const p = getCurrentPlayer();
    if (!p) {
      router.replace("/");
      return;
    }
    setPlayer(p);
    const hs = getHighscores();
    setHighscores(hs);
    prevHighscoreRef.current = hs[p] || 0;
  }, [router]);

  function addFloatingText(text: string, x: number, y: number, color: string) {
    const ft: FloatingText = { id: Date.now() + Math.random(), text, x, y, color, createdAt: Date.now() };
    setFloatingTexts(prev => [...prev.slice(-5), ft]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== ft.id));
    }, 1200);
  }

  function showMilestone(text: string) {
    setMilestone(text);
    setTimeout(() => setMilestone(null), 1500);
  }

  const gameLoop = useCallback((timestamp: number) => {
    if (!gameActiveRef.current) return;

    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = (timestamp - lastTimeRef.current) / 16;
    lastTimeRef.current = timestamp;

    speedRef.current += GAME_SPEED_INCREMENT * delta;
    scoreRef.current += delta * 0.5;
    setScore(Math.floor(scoreRef.current));

    // Milestone check
    for (const ms of MILESTONES) {
      if (scoreRef.current >= ms && lastMilestoneRef.current < ms) {
        lastMilestoneRef.current = ms;
        showMilestone(`${ms}m! 🔥`);
        // Bonus points at milestones
        scoreRef.current += 10;
        break;
      }
    }

    // Hint trigger
    if (!hintShownRef.current && scoreRef.current >= CONFIG.bikeRunnerHintScore) {
      hintShownRef.current = true;
      gameActiveRef.current = false;
      setGameState("hint");
      setShowFriends(true);
      setGameCompleted("bike-runner");
      setTimeout(() => {
        setGameState("playing");
        gameActiveRef.current = true;
        lastTimeRef.current = 0;
        animFrameRef.current = requestAnimationFrame(gameLoop);
      }, 5000);
      return;
    }

    const speed = speedRef.current * delta;

    // Move obstacles
    obstaclesRef.current = obstaclesRef.current
      .map((o) => ({ ...o, y: o.y + speed }))
      .filter((o) => o.y < 700);

    // Move collectibles
    collectiblesRef.current = collectiblesRef.current
      .map((c) => ({ ...c, y: c.y + speed }))
      .filter((c) => c.y < 700);

    // Spawn obstacles
    nextObstacleRef.current -= speed;
    if (nextObstacleRef.current <= 0) {
      const lane1 = Math.floor(Math.random() * LANE_COUNT);
      const type = Math.floor(Math.random() * OBSTACLE_TYPES.length);
      obstaclesRef.current.push({ id: Date.now(), lane: lane1, y: -50, type });

      if (Math.random() < DOUBLE_OBSTACLE_CHANCE) {
        let lane2 = Math.floor(Math.random() * LANE_COUNT);
        while (lane2 === lane1) lane2 = Math.floor(Math.random() * LANE_COUNT);
        const type2 = Math.floor(Math.random() * OBSTACLE_TYPES.length);
        obstaclesRef.current.push({ id: Date.now() + 1, lane: lane2, y: -50, type: type2 });
      }

      nextObstacleRef.current = MIN_OBSTACLE_GAP + Math.random() * MAX_OBSTACLE_GAP;
    }

    // Spawn collectibles (stars)
    nextCollectibleRef.current -= speed;
    if (nextCollectibleRef.current <= 0) {
      const cLane = Math.floor(Math.random() * LANE_COUNT);
      // Don't spawn on obstacle lanes
      const hasObstacleNearby = obstaclesRef.current.some(o => o.lane === cLane && o.y < 100);
      if (!hasObstacleNearby) {
        collectiblesRef.current.push({ id: Date.now() + 2, lane: cLane, y: -50 });
      }
      nextCollectibleRef.current = 200 + Math.random() * 250;
    }

    const playerLane = laneRef.current;
    const laneWidth = 100 / LANE_COUNT;

    // Collect stars
    collectiblesRef.current = collectiblesRef.current.filter((c) => {
      if (c.lane === playerLane && Math.abs(c.y - 520) < 40) {
        scoreRef.current += 15;
        const x = c.lane * laneWidth + laneWidth / 2;
        addFloatingText("+15 ⭐", x, 480, "#FFD700");
        return false;
      }
      return true;
    });

    // Near-miss detection + dodge streak
    for (const obs of obstaclesRef.current) {
      // Near miss: obstacle passed player zone in adjacent lane
      if (!obs.dodged && obs.y > 540 && obs.y < 580) {
        const laneDiff = Math.abs(obs.lane - playerLane);
        if (laneDiff === 1) {
          // Close dodge!
          obs.dodged = true;
          dodgeStreakRef.current += 1;
          setDodgeStreak(dodgeStreakRef.current);
          const bonus = Math.min(5 + dodgeStreakRef.current * 2, 25);
          scoreRef.current += bonus;
          const x = playerLane * laneWidth + laneWidth / 2;
          if (dodgeStreakRef.current >= 3) {
            addFloatingText(`Combo x${dodgeStreakRef.current}! +${bonus}`, x, 470, "#ff6b6b");
          } else {
            addFloatingText(`Knapp! +${bonus}`, x, 470, "#22c55e");
          }
        } else if (laneDiff === 0) {
          // Hit detection handled below
        } else if (!obs.dodged && obs.y > 560) {
          obs.dodged = true;
        }
      }
      // Mark as dodged once fully past
      if (!obs.dodged && obs.y > 580) {
        obs.dodged = true;
      }
    }

    // Collision
    for (const obs of obstaclesRef.current) {
      if (obs.lane === playerLane && Math.abs(obs.y - 520) < COLLISION_THRESHOLD) {
        gameActiveRef.current = false;
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 300);

        const finalScore = Math.floor(scoreRef.current);
        const isNew = player ? finalScore > prevHighscoreRef.current : false;
        setIsNewHighscore(isNew);

        if (player) {
          setHighscore(player, finalScore);
          setHighscores(getHighscores());
        }
        setGameState("gameover");
        return;
      }
    }

    // Reset dodge streak on safe distance
    const anyNearby = obstaclesRef.current.some(o => o.y > 400 && o.y < 600);
    if (!anyNearby && dodgeStreakRef.current > 0) {
      dodgeStreakRef.current = 0;
      setDodgeStreak(0);
    }

    setRoadOffset((prev) => (prev + speed) % 40);
    setObstacles([...obstaclesRef.current]);
    setCollectibles([...collectiblesRef.current]);
    animFrameRef.current = requestAnimationFrame(gameLoop);
  }, [player]);

  function startGame() {
    scoreRef.current = 0;
    speedRef.current = GAME_SPEED_INITIAL;
    laneRef.current = 1;
    obstaclesRef.current = [];
    collectiblesRef.current = [];
    nextObstacleRef.current = 80;
    nextCollectibleRef.current = 50;
    hintShownRef.current = false;
    lastTimeRef.current = 0;
    lastMilestoneRef.current = 0;
    dodgeStreakRef.current = 0;
    gameActiveRef.current = true;
    setScore(0);
    setLane(1);
    setObstacles([]);
    setCollectibles([]);
    setShowFriends(false);
    setFloatingTexts([]);
    setDodgeStreak(0);
    setIsNewHighscore(false);
    setMilestone(null);
    setGameState("playing");
    if (player) {
      prevHighscoreRef.current = getHighscores()[player] || 0;
    }
    animFrameRef.current = requestAnimationFrame(gameLoop);
  }

  function moveLane(direction: "left" | "right") {
    if (!gameActiveRef.current) return;
    const newLane = direction === "left"
      ? Math.max(0, laneRef.current - 1)
      : Math.min(2, laneRef.current + 1);
    laneRef.current = newLane;
    setLane(newLane);
  }

  function handleInteraction(clientX: number) {
    if (!canvasRef.current || !gameActiveRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const relX = clientX - rect.left;
    moveLane(relX < rect.width / 2 ? "left" : "right");
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" || e.key === "a") moveLane("left");
      if (e.key === "ArrowRight" || e.key === "d") moveLane("right");
      if (e.key === " " && (gameState === "ready" || gameState === "gameover")) startGame();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState]);

  useEffect(() => {
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, []);

  const touchStartRef = useRef<number>(0);
  function handleTouchStart(e: React.TouchEvent) { touchStartRef.current = e.touches[0].clientX; }
  function handleTouchEnd(e: React.TouchEvent) {
    const diff = e.changedTouches[0].clientX - touchStartRef.current;
    if (Math.abs(diff) > 30) moveLane(diff > 0 ? "right" : "left");
  }

  const laneWidth = 100 / LANE_COUNT;
  const playerX = laneRef.current * laneWidth + laneWidth / 2;

  const PlayerAvatar = player ? AVATARS[player] || WillAvatar : WillAvatar;
  const otherAvatars = player ? getOtherAvatars(player) : [];

  if (!player) return null;

  return (
    <main className="min-h-screen flex flex-col items-center px-2 py-4 relative">
      <ParticleBackground />

      <div className="z-10 w-full max-w-sm">
        <div className="flex justify-between items-center mb-3">
          <button onClick={() => router.push("/countdown")} className="text-white/50 hover:text-white text-sm">
            ← Zurück
          </button>
          <div className="flex items-center gap-3">
            {dodgeStreak >= 3 && gameState === "playing" && (
              <div className="text-xs text-[#ff6b6b] font-bold animate-pulse-slow">
                🔥 x{dodgeStreak}
              </div>
            )}
            <div className="font-bangers text-xl text-[#FFD700] tracking-wider">
              {Math.floor(score)} Punkte
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div
          ref={canvasRef}
          className={`relative w-full rounded-2xl overflow-hidden touch-none select-none ${screenShake ? "animate-shake" : ""}`}
          style={{ height: "600px", background: "#2d2d2d" }}
          onClick={(e) => handleInteraction(e.clientX)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Road lines */}
          <div className="absolute inset-0" style={{
            background: `repeating-linear-gradient(180deg, transparent 0px, transparent 18px, rgba(255,255,255,0.1) 18px, rgba(255,255,255,0.1) 20px)`,
            backgroundPositionY: `${roadOffset}px`,
          }} />

          {/* Lane dividers */}
          {[1, 2].map((i) => (
            <div key={i} className="absolute top-0 bottom-0 w-px" style={{
              left: `${(i / LANE_COUNT) * 100}%`,
              background: "repeating-linear-gradient(180deg, rgba(255,215,0,0.3) 0px, rgba(255,215,0,0.3) 20px, transparent 20px, transparent 40px)",
              backgroundPositionY: `${roadOffset}px`,
            }} />
          ))}

          {/* Milestone popup */}
          {milestone && (
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
              <div className="font-bangers text-4xl text-[#FFD700] tracking-wider text-shadow-orange animate-milestone">
                {milestone}
              </div>
            </div>
          )}

          {/* Ready screen */}
          {gameState === "ready" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20">
              <div className="w-32 h-32 mb-4">
                <PlayerAvatar className="w-full h-full" />
              </div>
              <h2 className="font-bangers text-3xl text-[#FFD700] tracking-wider mb-4 text-shadow-orange">
                Bike Runner
              </h2>
              <p className="text-white/80 text-center mb-1 text-sm px-6">
                Weiche Hindernissen aus!
              </p>
              <p className="text-[#8ab4d6] text-center mb-1 text-xs px-6">
                ⭐ Sammle Sterne für Bonuspunkte
              </p>
              <p className="text-[#8ab4d6] text-center mb-4 text-xs px-6">
                🔥 Knappe Ausweichmanöver = Combo-Bonus!
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="mt-2 px-8 py-3 rounded-full font-bangers text-xl tracking-wider text-[#1a1a2e] animate-pulse-slow"
                style={{ background: "linear-gradient(135deg, #FFD700, #e8590c)" }}
              >
                Los geht&apos;s!
              </button>
            </div>
          )}

          {/* Hint overlay */}
          {gameState === "hint" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-20 px-4">
              <div className="flex gap-3 mb-4 animate-slide-in-left">
                {Object.entries(AVATARS).map(([name, Avatar]) => (
                  <div key={name} className="w-14 h-14">
                    <Avatar className="w-full h-full" />
                  </div>
                ))}
              </div>
              <p className="font-bangers text-xl text-[#FFD700] tracking-wider text-center animate-fade-in-up mb-3">
                Du fährst nicht allein...
              </p>
              <div className="animate-fade-in-up bg-green-500/15 border border-green-500/30 rounded-xl px-5 py-3 mt-1" style={{ animationDelay: "1.5s", animationFillMode: "backwards" }}>
                <p className="text-sm text-green-300 text-center flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  {CONFIG.bikeRunnerHintText}
                </p>
              </div>
            </div>
          )}

          {/* Collectible stars */}
          {gameState === "playing" && collectibles.map((c) => (
            <div
              key={c.id}
              className="absolute text-2xl animate-pulse-slow"
              style={{
                left: `${c.lane * laneWidth + laneWidth / 2}%`,
                top: `${c.y}px`,
                transform: "translate(-50%, -50%)",
                filter: "drop-shadow(0 0 6px rgba(255,215,0,0.6))",
              }}
            >
              ⭐
            </div>
          ))}

          {/* Obstacles */}
          {gameState === "playing" && obstacles.map((obs) => (
            <div
              key={obs.id}
              className="absolute text-3xl"
              style={{
                left: `${obs.lane * laneWidth + laneWidth / 2}%`,
                top: `${obs.y}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {OBSTACLE_TYPES[obs.type].emoji}
            </div>
          ))}

          {/* Floating texts (bonuses, combos) */}
          {floatingTexts.map((ft) => (
            <div
              key={ft.id}
              className="absolute pointer-events-none font-bold text-sm animate-float-up z-20"
              style={{
                left: `${ft.x}%`,
                top: `${ft.y}px`,
                color: ft.color,
                textShadow: "0 0 8px rgba(0,0,0,0.8)",
              }}
            >
              {ft.text}
            </div>
          ))}

          {/* Player Avatar */}
          {(gameState === "playing" || gameState === "hint") && (
            <div
              className="absolute transition-all duration-150 ease-out"
              style={{
                left: `${playerX}%`,
                bottom: "40px",
                transform: "translateX(-50%)",
                width: "65px",
                height: "65px",
              }}
            >
              <PlayerAvatar className="w-full h-full" />
            </div>
          )}

          {/* Friends riding alongside after hint */}
          {showFriends && gameState === "playing" && (
            <>
              {otherAvatars.map(([name, Avatar], i) => (
                <div
                  key={name}
                  className="absolute opacity-50"
                  style={{
                    width: "45px",
                    height: "45px",
                    left: i === 0 ? "5%" : i === 1 ? "82%" : "12%",
                    bottom: i === 0 ? "80px" : i === 1 ? "65px" : "35px",
                  }}
                >
                  <Avatar className="w-full h-full" />
                </div>
              ))}
            </>
          )}

          {/* Game Over */}
          {gameState === "gameover" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-20">
              {isNewHighscore && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 font-bangers text-2xl text-[#ff6b6b] tracking-wider animate-title-bounce">
                  🎉 Neuer Rekord! 🎉
                </div>
              )}

              <h2 className="font-bangers text-3xl text-[#FFD700] tracking-wider mb-2 text-shadow-orange">
                Game Over!
              </h2>
              <p className="text-white text-2xl font-bold mb-1">
                {Math.floor(score)} Punkte
              </p>
              {isNewHighscore && (
                <p className="text-[#ff6b6b] text-sm mb-4 animate-pulse-slow">
                  Persönliche Bestleistung!
                </p>
              )}
              {!isNewHighscore && (
                <p className="text-white/40 text-xs mb-4">
                  Rekord: {prevHighscoreRef.current}
                </p>
              )}

              <div className="glass-card rounded-2xl p-4 w-64 mb-6">
                <h3 className="font-bangers text-lg text-[#FFD700] tracking-wider mb-3 text-center">
                  Bestenliste
                </h3>
                {Object.entries(highscores)
                  .sort(([, a], [, b]) => b - a)
                  .map(([name, hs], i) => (
                    <div key={name} className={`flex justify-between items-center py-1.5 border-b border-white/10 last:border-0 ${name === player && isNewHighscore ? "bg-[#FFD700]/10 -mx-2 px-2 rounded" : ""}`}>
                      <span className="text-white/80 text-sm">
                        {i === 0 ? "👑 " : `${i + 1}. `}{name}
                      </span>
                      <span className="font-bold text-[#FFD700] text-sm">{hs}</span>
                    </div>
                  ))}
                {Object.keys(highscores).length === 0 && (
                  <p className="text-white/50 text-sm text-center">Noch keine Scores</p>
                )}
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

        {gameState === "playing" && (
          <p className="text-center text-white/30 text-xs mt-2">
            ← Tippe links / rechts →
          </p>
        )}
      </div>
    </main>
  );
}
