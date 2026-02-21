"use client";

export default function WillAvatar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 230 250" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* BLACK FIXIE */}
      <g transform="translate(35, 130)">
        <g style={{ transformOrigin: "25px 60px", animation: "wheelSpin 1.8s linear infinite" }}>
          <circle cx="25" cy="60" r="22" fill="none" stroke="#888" strokeWidth="2" />
          <circle cx="25" cy="60" r="3" fill="#666" />
          <line x1="25" y1="38" x2="25" y2="82" stroke="#777" strokeWidth="0.7" />
          <line x1="3" y1="60" x2="47" y2="60" stroke="#777" strokeWidth="0.7" />
          <line x1="9" y1="44" x2="41" y2="76" stroke="#777" strokeWidth="0.7" />
          <line x1="41" y1="44" x2="9" y2="76" stroke="#777" strokeWidth="0.7" />
          <line x1="12" y1="73" x2="38" y2="47" stroke="#777" strokeWidth="0.7" />
          <line x1="38" y1="73" x2="12" y2="47" stroke="#777" strokeWidth="0.7" />
        </g>
        <g style={{ transformOrigin: "120px 60px", animation: "wheelSpin 1.8s linear infinite" }}>
          <circle cx="120" cy="60" r="22" fill="none" stroke="#888" strokeWidth="2" />
          <circle cx="120" cy="60" r="3" fill="#666" />
          <line x1="120" y1="38" x2="120" y2="82" stroke="#777" strokeWidth="0.7" />
          <line x1="98" y1="60" x2="142" y2="60" stroke="#777" strokeWidth="0.7" />
          <line x1="104" y1="44" x2="136" y2="76" stroke="#777" strokeWidth="0.7" />
          <line x1="136" y1="44" x2="104" y2="76" stroke="#777" strokeWidth="0.7" />
          <line x1="107" y1="73" x2="133" y2="47" stroke="#777" strokeWidth="0.7" />
          <line x1="133" y1="73" x2="107" y2="47" stroke="#777" strokeWidth="0.7" />
        </g>
        <polygon points="72,12 40,55 72,55 108,28" fill="none" stroke="#111" strokeWidth="3.5" strokeLinejoin="round" />
        <line x1="72" y1="55" x2="25" y2="60" stroke="#111" strokeWidth="3" />
        <line x1="40" y1="55" x2="25" y2="60" stroke="#111" strokeWidth="3" />
        <line x1="108" y1="28" x2="120" y2="60" stroke="#111" strokeWidth="3" />
        <line x1="68" y1="2" x2="72" y2="12" stroke="#111" strokeWidth="3" />
        <ellipse cx="66" cy="1" rx="10" ry="3.5" fill="#222" />
        <line x1="108" y1="28" x2="118" y2="12" stroke="#111" strokeWidth="3" />
        <line x1="112" y1="12" x2="128" y2="10" stroke="#333" strokeWidth="3" strokeLinecap="round" />
        <circle cx="72" cy="55" r="6" fill="none" stroke="#555" strokeWidth="2" />
        <circle cx="72" cy="55" r="2" fill="#444" />
        <line x1="66" y1="52" x2="78" y2="58" stroke="#555" strokeWidth="2" />
      </g>

      {/* WILL BODY */}
      <g>
        <line x1="95" y1="175" x2="100" y2="185" stroke="#6b8cad" strokeWidth="8" strokeLinecap="round" />
        <line x1="112" y1="175" x2="118" y2="186" stroke="#6b8cad" strokeWidth="8" strokeLinecap="round" />
        <line x1="100" y1="185" x2="103" y2="193" stroke="#e8b88a" strokeWidth="6" strokeLinecap="round" />
        <line x1="118" y1="186" x2="120" y2="194" stroke="#e8b88a" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="103" cy="195" rx="6" ry="3" fill="#444" />
        <ellipse cx="120" cy="196" rx="6" ry="3" fill="#444" />

        <rect x="84" y="125" width="38" height="52" rx="10" fill="#1a1a30" />
        <rect x="86" y="140" width="34" height="14" rx="2" fill="#dc2626" />
        <rect x="86" y="140" width="34" height="5" rx="1" fill="#FFD700" />
        <rect x="86" y="150" width="34" height="3" fill="#FFD700" />

        <rect x="150" y="135" width="8" height="12" rx="3" fill="#222" stroke="#444" strokeWidth="1" />
        <rect x="152" y="137" width="4" height="8" rx="1.5" fill="#1a6eff" />

        <line x1="86" y1="140" x2="148" y2="138" stroke="#1a1a30" strokeWidth="6" strokeLinecap="round" />
        <line x1="120" y1="140" x2="153" y2="139" stroke="#1a1a30" strokeWidth="6" strokeLinecap="round" />
        <circle cx="150" cy="138" r="5" fill="#e8b88a" />
        <circle cx="155" cy="139" r="5" fill="#e8b88a" />

        {/* WILL HEAD */}
        <g transform="translate(103, 97)">
          <rect x="-5" y="16" width="10" height="10" rx="4" fill="#e8b88a" />
          <ellipse cx="0" cy="2" rx="21" ry="23" fill="#e8b88a" />
          <path d="M-20,-10 Q-17,-26 0,-24 Q17,-26 20,-10" fill="#6b4a28" />
          <ellipse cx="0" cy="-18" rx="17" ry="8" fill="#6b4a28" />
          <path d="M-8,-24 Q-4,-28 0,-24 Q4,-28 8,-24" fill="#6b4a28" />
          <path d="M-13,-22 Q-9,-26 -5,-23" fill="#6b4a28" />
          <path d="M5,-23 Q9,-26 13,-22" fill="#6b4a28" />
          <path d="M-21,-8 L-21,0" stroke="#5a3a1e" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M21,-8 L21,0" stroke="#5a3a1e" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="-21" cy="2" rx="4" ry="5" fill="#d8a87a" />
          <ellipse cx="21" cy="2" rx="4" ry="5" fill="#d8a87a" />
          <path d="M-11,-3 Q-7,-6 -2,-4" fill="none" stroke="#5a3a1e" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M2,-4 Q7,-6 11,-3" fill="none" stroke="#5a3a1e" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="-7" cy="1" rx="3.5" ry="3.2" fill="white" />
          <ellipse cx="7" cy="1" rx="3.5" ry="3.2" fill="white" />
          <circle cx="-6.2" cy="1" r="2.3" fill="#5a3a1e" />
          <circle cx="7.8" cy="1" r="2.3" fill="#5a3a1e" />
          <circle cx="-5.7" cy="0.3" r="0.8" fill="white" />
          <circle cx="8.3" cy="0.3" r="0.8" fill="white" />
          <path d="M-1,5 Q0,9 1,5" fill="none" stroke="#c4905a" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M-9,10 Q0,19 9,10" fill="white" stroke="#b5745a" strokeWidth="1.5" />
          <path d="M-7,11 Q0,17 7,11" fill="#b5745a" />
          <circle cx="-12" cy="7" r="4" fill="rgba(255,140,140,0.2)" />
          <circle cx="12" cy="7" r="4" fill="rgba(255,140,140,0.2)" />

          {/* PARTY HAT */}
          <polygon points="0,-32 -12,-14 12,-14" fill="#FFD700" stroke="#e8590c" strokeWidth="1" />
          <circle cx="0" cy="-34" r="5" fill="#ff6b6b" />
          <line x1="-4" y1="-36" x2="-10" y2="-42" stroke="#4a9eff" strokeWidth="2" strokeLinecap="round" />
          <line x1="4" y1="-36" x2="10" y2="-42" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
          <line x1="0" y1="-39" x2="0" y2="-46" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
          <line x1="-2" y1="-37" x2="-7" y2="-40" stroke="#ff6b6b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="-38" x2="6" y2="-44" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
