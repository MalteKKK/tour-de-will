"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 500); // Wait for fade-out
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f1923 0%, #1a2a3a 50%, #0f1923 100%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease-out",
        pointerEvents: visible ? "all" : "none",
      }}
    >
      {/* Disco light rays */}
      <div className="absolute inset-0 overflow-hidden">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <div
            key={deg}
            className="absolute top-1/4 left-1/2 w-2 origin-top"
            style={{
              height: "120vh",
              transform: `translateX(-50%) rotate(${deg}deg)`,
              background: `linear-gradient(180deg, rgba(255,215,0,0.15) 0%, transparent 60%)`,
              animation: `discoRay 3s ease-in-out infinite`,
              animationDelay: `${deg * 0.01}s`,
            }}
          />
        ))}
      </div>

      {/* Disco ball */}
      <div className="relative mb-8" style={{ animation: "discoBall 4s linear infinite" }}>
        {/* String */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-16 w-0.5 h-16 bg-white/30" />
        {/* Ball */}
        <div className="w-20 h-20 rounded-full relative" style={{
          background: "radial-gradient(circle at 35% 35%, #fff, #ccc 30%, #888 60%, #555)",
          boxShadow: "0 0 40px rgba(255,215,0,0.4), 0 0 80px rgba(255,215,0,0.2)",
        }}>
          {/* Mirror tiles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-sm"
              style={{
                width: "6px",
                height: "6px",
                background: "rgba(255,255,255,0.8)",
                top: `${20 + Math.sin(i * 0.5) * 25}%`,
                left: `${20 + Math.cos(i * 0.8) * 25}%`,
                animation: `discoTile 2s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      <h1
        className="font-bangers text-4xl text-[#FFD700] tracking-[4px] text-shadow-orange mb-8"
        style={{ animation: "titleBounce 0.8s ease-out" }}
      >
        Tour de Will
      </h1>

      {/* Dancing avatars */}
      <div className="flex gap-6 items-end">
        {/* Will */}
        <div className="text-center" style={{ animation: "dance1 0.6s ease-in-out infinite alternate" }}>
          <div className="text-4xl">🕺</div>
          <div className="text-xs text-white/60 mt-1 font-semibold">Will</div>
        </div>
        {/* Malte */}
        <div className="text-center" style={{ animation: "dance2 0.5s ease-in-out infinite alternate", animationDelay: "0.1s" }}>
          <div className="text-4xl">🕺</div>
          <div className="text-xs text-white/60 mt-1 font-semibold">Malte</div>
        </div>
        {/* Linda */}
        <div className="text-center" style={{ animation: "dance1 0.55s ease-in-out infinite alternate", animationDelay: "0.2s" }}>
          <div className="text-4xl">💃</div>
          <div className="text-xs text-white/60 mt-1 font-semibold">Linda</div>
        </div>
        {/* Nicola */}
        <div className="text-center" style={{ animation: "dance2 0.65s ease-in-out infinite alternate", animationDelay: "0.3s" }}>
          <div className="text-4xl">💃</div>
          <div className="text-xs text-white/60 mt-1 font-semibold">Nicola</div>
        </div>
      </div>

      {/* Floor reflection */}
      <div className="w-64 h-1 mt-4 rounded-full opacity-30"
        style={{ background: "linear-gradient(90deg, transparent, #FFD700, transparent)" }}
      />

      <style jsx>{`
        @keyframes discoBall {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes discoTile {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes discoRay {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.2; }
        }
        @keyframes dance1 {
          0% { transform: translateY(0) rotate(-5deg); }
          100% { transform: translateY(-12px) rotate(5deg); }
        }
        @keyframes dance2 {
          0% { transform: translateY(-8px) rotate(5deg); }
          100% { transform: translateY(0) rotate(-5deg); }
        }
      `}</style>
    </div>
  );
}
