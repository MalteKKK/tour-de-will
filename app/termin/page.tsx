"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentPlayer, getTerminVotes, setTerminVotes } from "@/lib/storage";
import { CONFIG } from "@/lib/config";
import ParticleBackground from "@/components/ParticleBackground";
import Confetti from "@/components/Confetti";

export default function TerminPage() {
  const router = useRouter();
  const [player, setPlayer] = useState<string | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [saved, setSaved] = useState(false);
  const [allVotes, setAllVotes] = useState<Record<string, number[]>>({});

  useEffect(() => {
    const p = getCurrentPlayer();
    if (!p) {
      router.replace("/");
      return;
    }
    setPlayer(p);
    const votes = getTerminVotes();
    setAllVotes(votes);
    if (votes[p]) {
      setSelected(votes[p]);
    }
  }, [router]);

  function toggleDate(id: number) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
    setSaved(false);
  }

  function handleSave() {
    if (!player) return;
    setTerminVotes(player, selected);
    setAllVotes({ ...allVotes, [player]: selected });
    setSaved(true);
  }

  // Count votes per termin
  function voteCount(terminId: number): string[] {
    return Object.entries(allVotes)
      .filter(([, ids]) => ids.includes(terminId))
      .map(([name]) => name);
  }

  if (!player) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 relative">
      <ParticleBackground />
      <Confetti active={saved} />

      <div className="z-10 w-full max-w-md text-center">
        <h1 className="font-bangers text-3xl md:text-4xl text-[#FFD700] tracking-wider text-shadow-orange mb-2 animate-title-bounce">
          🗓️ Terminwahl
        </h1>
        <p className="text-[#8ab4d6] font-semibold tracking-wider mb-2">
          Wann hast du Zeit, {player}?
        </p>
        <p className="text-white/50 text-sm mb-8">
          Hake alle Termine an, an denen du kannst
        </p>

        <div className="flex flex-col gap-4 mb-8">
          {CONFIG.termine.map((termin) => {
            const isChecked = selected.includes(termin.id);
            const voters = voteCount(termin.id);

            return (
              <button
                key={termin.id}
                onClick={() => toggleDate(termin.id)}
                className="glass-card rounded-2xl p-5 text-left transition-all duration-300 hover:translate-y-[-2px]"
                style={{
                  borderColor: isChecked ? "rgba(255,215,0,0.6)" : undefined,
                  boxShadow: isChecked ? "0 0 20px rgba(255,215,0,0.2)" : undefined,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all shrink-0"
                    style={{
                      borderColor: isChecked ? "#FFD700" : "rgba(255,255,255,0.3)",
                      background: isChecked ? "#FFD700" : "transparent",
                    }}
                  >
                    {isChecked && (
                      <svg className="w-4 h-4" fill="#1a1a2e" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bangers text-xl text-white tracking-wider">{termin.label}</div>
                    {voters.length > 0 && (
                      <div className="text-xs text-[#8ab4d6] mt-1">
                        {voters.join(", ")} {voters.length === 1 ? "kann" : "können"}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleSave}
            className="px-10 py-4 rounded-full font-bangers text-xl tracking-wider text-[#1a1a2e] transition-all"
            style={{
              background: selected.length > 0
                ? "linear-gradient(135deg, #FFD700, #e8590c)"
                : "rgba(255,255,255,0.1)",
              color: selected.length > 0 ? "#1a1a2e" : "rgba(255,255,255,0.3)",
            }}
          >
            {saved ? "Gespeichert ✓" : "Speichern"}
          </button>

          <button
            onClick={() => router.push("/countdown")}
            className="text-white/50 hover:text-white text-sm transition-colors"
          >
            ← Zurück zum Countdown
          </button>
        </div>
      </div>
    </main>
  );
}
