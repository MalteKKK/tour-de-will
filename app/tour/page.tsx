"use client";

import ParticleBackground from "@/components/ParticleBackground";
import Link from "next/link";

export default function TourPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 relative">
      <ParticleBackground />
      <div className="z-10 text-center max-w-sm">
        <div className="text-6xl mb-6">🔎</div>
        <h1 className="font-bangers text-3xl text-[#FFD700] tracking-wider text-shadow-orange mb-4">
          Das Abenteuer
        </h1>
        <p className="text-white/70 font-semibold mb-3 leading-relaxed">
          Schritt für Schritt bekommst du Hinweise, was dich erwartet.
        </p>
        <p className="text-[#8ab4d6] text-sm mb-8">
          Schaffst du die Herausforderungen und löst das Rätsel, bevor es losgeht?
        </p>
        <Link
          href="/countdown"
          className="px-8 py-3 rounded-full font-bangers text-lg tracking-wider text-[#1a1a2e] inline-block"
          style={{ background: "linear-gradient(135deg, #FFD700, #e8590c)" }}
        >
          Zurück
        </Link>
      </div>
    </main>
  );
}
