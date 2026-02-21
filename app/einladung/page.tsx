"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentPlayer } from "@/lib/storage";
import ParticleBackground from "@/components/ParticleBackground";
import Confetti from "@/components/Confetti";
import WillAvatar from "@/components/avatars/WillAvatar";

export default function EinladungPage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const player = getCurrentPlayer();
    if (player !== "Will") {
      router.replace("/countdown");
      return;
    }

    // Animation sequence
    const timers = [
      setTimeout(() => setPhase(1), 500),   // "Du wirst 30..."
      setTimeout(() => setPhase(2), 2500),   // Avatar fährt rein
      setTimeout(() => setPhase(3), 3800),   // Konfetti + Titel
      setTimeout(() => setShowConfetti(true), 3800),
    ];

    return () => timers.forEach(clearTimeout);
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      <ParticleBackground />
      <Confetti active={showConfetti} />

      <div className="z-10 flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md">
        {/* Phase 1: "Du wirst 30..." */}
        {phase >= 1 && (
          <p
            className="font-bangers text-3xl md:text-4xl text-white text-center tracking-wider mb-8 animate-fade-in-up"
            style={{ opacity: phase >= 3 ? 0.4 : 1, transition: "opacity 0.5s", fontSize: phase >= 3 ? "1.2rem" : undefined }}
          >
            Du wirst 30...
          </p>
        )}

        {/* Phase 2: Will fährt rein */}
        {phase >= 2 && (
          <div className="w-48 h-48 mb-6 animate-slide-in-left">
            <WillAvatar className="w-full h-full" />
          </div>
        )}

        {/* Phase 3: Titel */}
        {phase >= 3 && (
          <div className="animate-fade-in-up text-center">
            <h1 className="font-bangers text-5xl md:text-6xl text-[#FFD700] tracking-[4px] text-shadow-orange animate-title-bounce">
              🚴 TOUR DE WILL 🚴
            </h1>
            <p className="text-[#8ab4d6] mt-4 font-semibold tracking-widest text-lg">
              Dein 30. Geburtstags-Radabenteuer
            </p>

            <button
              onClick={() => router.push("/karte")}
              className="mt-10 px-10 py-4 rounded-full font-bangers text-xl tracking-wider text-[#1a1a2e] animate-pulse-slow"
              style={{ background: "linear-gradient(135deg, #FFD700, #e8590c)" }}
            >
              Weiter →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
