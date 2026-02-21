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
  { name: "Malte", role: "Co-Pilot", badge: "Co-Pilot", Avatar: MalteAvatar },
  { name: "Linda", role: "Co-Pilotin", badge: "Co-Pilotin", Avatar: LindaAvatar },
  { name: "Nicola", role: "Co-Pilotin", badge: "Co-Pilotin", Avatar: NicolaAvatar },
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
      {/* Will – zentral oben */}
      {(() => {
        const will = players.find(p => p.isWill)!;
        return (
          <button
            onClick={() => handleSelect(will.name)}
            className="glass-card rounded-3xl p-5 pt-7 text-center relative transition-all duration-300 hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] animate-card-appear active:scale-95 z-10 w-full max-w-[220px] mb-2"
            style={{ borderColor: "rgba(255,215,0,0.4)", boxShadow: "0 0 30px rgba(255,215,0,0.15)" }}
          >
            <span
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bangers tracking-wider whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #FFD700, #ff6b6b)", color: "#1a1a2e" }}
            >
              {will.badge}
            </span>
            <div className="w-full aspect-square max-w-[150px] mx-auto">
              <will.Avatar className="w-full h-full" />
            </div>
            <h2 className="font-bangers text-2xl text-white tracking-wider mt-1">{will.name}</h2>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#FFD700" }}>
              {will.role}
            </p>
          </button>
        );
      })()}

      <p className="text-[#8ab4d6] text-center mt-4 mb-4 font-semibold tracking-widest text-sm z-10">
        Wer bist du?
      </p>

      {/* Co-Piloten */}
      <div className="grid grid-cols-3 gap-3 max-w-lg w-full z-10">
        {players.filter(p => !p.isWill).map((player, i) => (
          <button
            key={player.name}
            onClick={() => handleSelect(player.name)}
            className="glass-card rounded-3xl p-3 pt-5 text-center relative transition-all duration-300 hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-[rgba(255,215,0,0.4)] animate-card-appear active:scale-95"
            style={{ animationDelay: `${(i + 1) * 0.15}s` }}
          >
            <span
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bangers tracking-wider whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #FFD700, #e8590c)", color: "#1a1a2e" }}
            >
              {player.badge}
            </span>

            <div className="w-full aspect-square max-w-[100px] mx-auto">
              <player.Avatar className="w-full h-full" />
            </div>

            <h2 className="font-bangers text-lg text-white tracking-wider mt-1">{player.name}</h2>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#8ab4d6" }}>
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
