"use client";

import Link from "next/link";

interface GameCardProps {
  title: string;
  description: string;
  href: string;
  locked?: boolean;
  week: number;
}

export default function GameCard({ title, description, href, locked = false, week }: GameCardProps) {
  if (locked) {
    return (
      <div className="glass-card rounded-2xl p-5 opacity-50 cursor-not-allowed">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🔒</div>
          <div>
            <div className="font-bangers text-lg text-white/50 tracking-wider">Woche {week}</div>
            <div className="text-sm text-[#8ab4d6]/50">Bald verfügbar</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={href}>
      <div className="glass-card rounded-2xl p-5 hover:translate-y-[-4px] hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-pointer border-[#FFD700]/30 hover:border-[#FFD700]/60">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🚴</div>
          <div>
            <div className="font-bangers text-lg text-white tracking-wider">{title}</div>
            <div className="text-sm text-[#8ab4d6]">{description}</div>
          </div>
          <div className="ml-auto text-[#FFD700] text-xl">▶</div>
        </div>
      </div>
    </Link>
  );
}
