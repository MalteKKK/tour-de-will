"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCurrentPlayer } from "@/lib/storage";
import { PlayerName } from "@/lib/config";
import ParticleBackground from "@/components/ParticleBackground";
import LoadingScreen from "@/components/LoadingScreen";
import WillAvatar from "@/components/avatars/WillAvatar";
import MalteAvatar from "@/components/avatars/MalteAvatar";
import LindaAvatar from "@/components/avatars/LindaAvatar";
import NicolaAvatar from "@/components/avatars/NicolaAvatar";

const players: { name: PlayerName; role: string; badge: string; Avatar: React.ComponentType<{ className?: string }>; isWill?: boolean }[] = [
  { name: "Will", role: "Das Geburtstagskind", badge: "🎂 BIRTHDAY BOY 🎂", Avatar: WillAvatar, isWill: true },
  { name: "Malte", role: "Organisator", badge: "Mastermind", Avatar: MalteAvatar },
  { name: "Linda", role: "Co-Pilotin", badge: "Co-Pilotin", Avatar: LindaAvatar },
  { name: "Nicola", role: "Navigatorin", badge: "Navigatorin", Avatar: NicolaAvatar },
];

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  function handleSelect(name: PlayerName) {
    setCurrentPlayer(name);
    if (name === "Will") {
      router.push("/einladung");
    } else {
      router.push("/countdown");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 relative">
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <ParticleBackground />

      <h1 className="font-bangers text-4xl md:text-5xl text-[#FFD700] text-center tracking-[4px] text-shadow-orange animate-title-bounce z-10">
        🚴 Tour de Will 🚴
      </h1>
      <p className="text-[#8ab4d6] text-center mt-2 mb-10 font-semibold tracking-widest text-sm z-10">
        Wer bist du?
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-lg w-full z-10">
        {players.map((player, i) => (
          <button
            key={player.name}
            onClick={() => handleSelect(player.name)}
            className="glass-card rounded-3xl p-4 pt-6 text-center relative transition-all duration-300 hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-[rgba(255,215,0,0.4)] animate-card-appear active:scale-95"
            style={{
              animationDelay: `${i * 0.15}s`,
              ...(player.isWill ? { borderColor: "rgba(255,215,0,0.4)", boxShadow: "0 0 30px rgba(255,215,0,0.15)" } : {}),
            }}
          >
            <span
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bangers tracking-wider whitespace-nowrap"
              style={{
                background: player.isWill
                  ? "linear-gradient(135deg, #FFD700, #ff6b6b)"
                  : "linear-gradient(135deg, #FFD700, #e8590c)",
                color: "#1a1a2e",
              }}
            >
              {player.badge}
            </span>

            <div className="w-full aspect-square max-w-[140px] mx-auto">
              <player.Avatar className="w-full h-full" />
            </div>

            <h2 className="font-bangers text-xl text-white tracking-wider mt-1">{player.name}</h2>
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: player.isWill ? "#FFD700" : "#8ab4d6" }}
            >
              {player.role}
            </p>
          </button>
        ))}
      </div>

      <div className="w-full max-w-lg h-1.5 mt-10 rounded-full opacity-40 z-10"
        style={{ background: "repeating-linear-gradient(90deg, #FFD700 0px, #FFD700 30px, transparent 30px, transparent 60px)" }}
      />
    </main>
  );
}
