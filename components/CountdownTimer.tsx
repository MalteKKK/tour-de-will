"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calculate() {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    }

    setTimeLeft(calculate());
    const timer = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const blocks = [
    { value: timeLeft.days, label: "Tage" },
    { value: timeLeft.hours, label: "Stunden" },
    { value: timeLeft.minutes, label: "Minuten" },
    { value: timeLeft.seconds, label: "Sekunden" },
  ];

  return (
    <div className="flex gap-3 justify-center">
      {blocks.map((block) => (
        <div key={block.label} className="glass-card rounded-2xl p-3 min-w-[70px] text-center">
          <div className="font-bangers text-3xl md:text-4xl text-[#FFD700] tracking-wider">
            {String(block.value).padStart(2, "0")}
          </div>
          <div className="text-[#8ab4d6] text-xs font-semibold uppercase tracking-widest mt-1">
            {block.label}
          </div>
        </div>
      ))}
    </div>
  );
}
