"use client";

import { useEffect, useState } from "react";

interface AchievementPopupProps {
  title: string;
  emoji: string;
  description: string;
  onDone: () => void;
}

export default function AchievementPopup({ title, emoji, description, onDone }: AchievementPopupProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 500);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="fixed top-4 left-1/2 z-50 animate-achievement-pop pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s" }}
    >
      <div className="glass-card rounded-2xl px-5 py-3 border-[#FFD700]/50 flex items-center gap-3 shadow-[0_0_30px_rgba(255,215,0,0.3)] whitespace-nowrap">
        <span className="text-3xl">{emoji}</span>
        <div>
          <p className="font-bangers text-sm text-[#FFD700] tracking-wider">Erfolg freigeschaltet!</p>
          <p className="text-white text-sm font-bold">{title}</p>
          <p className="text-[#8ab4d6] text-xs">{description}</p>
        </div>
      </div>
    </div>
  );
}
