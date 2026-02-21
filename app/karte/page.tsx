"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentPlayer } from "@/lib/storage";
import { CONFIG } from "@/lib/config";
import ParticleBackground from "@/components/ParticleBackground";
import MalteAvatar from "@/components/avatars/MalteAvatar";
import LindaAvatar from "@/components/avatars/LindaAvatar";

export default function KartePage() {
  const router = useRouter();

  useEffect(() => {
    const player = getCurrentPlayer();
    if (player !== "Will") {
      router.replace("/countdown");
    }
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 relative">
      <ParticleBackground />

      <div className="z-10 w-full max-w-md">
        {/* Karte */}
        <div className="glass-card rounded-3xl p-8 animate-card-appear relative overflow-hidden">
          {/* Deko-Ecke */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-10"
            style={{ background: "linear-gradient(135deg, #FFD700, transparent)" }}
          />

          <h2 className="font-bangers text-3xl text-[#FFD700] tracking-wider text-center mb-2 text-shadow-orange">
            Happy Birthday, Willi!
          </h2>

          <div className="w-16 h-1 mx-auto rounded-full mb-6"
            style={{ background: "linear-gradient(90deg, #FFD700, #e8590c)" }}
          />

          {/* Nachricht */}
          <div className="text-white/90 text-base leading-relaxed whitespace-pre-line mb-8">
            {CONFIG.birthdayMessage}
          </div>

          {/* Absender */}
          <div className="border-t border-white/10 pt-6">
            <p className="text-[#8ab4d6] text-sm font-semibold text-center mb-3 tracking-wider uppercase">
              Von {CONFIG.cardSenders}
            </p>
            <div className="flex justify-center gap-4">
              <div className="w-20 h-20">
                <LindaAvatar className="w-full h-full" />
              </div>
              <div className="w-20 h-20">
                <MalteAvatar className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Weiter Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/countdown")}
            className="px-10 py-4 rounded-full font-bangers text-xl tracking-wider text-[#1a1a2e] animate-pulse-slow"
            style={{ background: "linear-gradient(135deg, #FFD700, #e8590c)" }}
          >
            Weiter →
          </button>
        </div>
      </div>
    </main>
  );
}
