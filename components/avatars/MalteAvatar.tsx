"use client";

export default function MalteAvatar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 230 250" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* BLACK GRAVEL BIKE */}
      <g transform="translate(35, 130)">
        <g style={{ transformOrigin: "25px 60px", animation: "wheelSpin 2s linear infinite" }}>
          <circle cx="25" cy="60" r="22" fill="none" stroke="#aaa" strokeWidth="3.5" />
          <circle cx="25" cy="60" r="3" fill="#777" />
          <line x1="25" y1="38" x2="25" y2="82" stroke="#999" strokeWidth="0.8" />
          <line x1="3" y1="60" x2="47" y2="60" stroke="#999" strokeWidth="0.8" />
          <line x1="9" y1="44" x2="41" y2="76" stroke="#999" strokeWidth="0.8" />
          <line x1="41" y1="44" x2="9" y2="76" stroke="#999" strokeWidth="0.8" />
        </g>
        <g style={{ transformOrigin: "120px 60px", animation: "wheelSpin 2s linear infinite" }}>
          <circle cx="120" cy="60" r="22" fill="none" stroke="#aaa" strokeWidth="3.5" />
          <circle cx="120" cy="60" r="3" fill="#777" />
          <line x1="120" y1="38" x2="120" y2="82" stroke="#999" strokeWidth="0.8" />
          <line x1="98" y1="60" x2="142" y2="60" stroke="#999" strokeWidth="0.8" />
          <line x1="104" y1="44" x2="136" y2="76" stroke="#999" strokeWidth="0.8" />
          <line x1="136" y1="44" x2="104" y2="76" stroke="#999" strokeWidth="0.8" />
        </g>
        <polygon points="72,15 40,55 72,55 105,30" fill="none" stroke="#222" strokeWidth="3.5" strokeLinejoin="round" />
        <line x1="72" y1="55" x2="25" y2="60" stroke="#222" strokeWidth="3" />
        <line x1="40" y1="55" x2="25" y2="60" stroke="#222" strokeWidth="3" />
        <line x1="105" y1="30" x2="120" y2="60" stroke="#222" strokeWidth="3" />
        <line x1="68" y1="5" x2="72" y2="15" stroke="#222" strokeWidth="3" />
        <ellipse cx="66" cy="4" rx="10" ry="3.5" fill="#333" />
        <line x1="105" y1="30" x2="115" y2="12" stroke="#222" strokeWidth="3" />
        <path d="M110,12 L120,12 Q126,12 126,18 L126,24" fill="none" stroke="#444" strokeWidth="3" strokeLinecap="round" />
        <line x1="66" y1="52" x2="78" y2="58" stroke="#666" strokeWidth="2" />
      </g>

      {/* MALTE BODY */}
      <g>
        <line x1="95" y1="178" x2="100" y2="192" stroke="#2d3748" strokeWidth="7" strokeLinecap="round" />
        <line x1="112" y1="178" x2="118" y2="193" stroke="#2d3748" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="100" cy="194" rx="6" ry="3" fill="#444" />
        <ellipse cx="118" cy="195" rx="6" ry="3" fill="#444" />

        <rect x="84" y="128" width="38" height="52" rx="10" fill="#1e3a5f" />
        <rect x="84" y="140" width="38" height="15" rx="0" fill="#dc2626" />
        <rect x="84" y="148" width="38" height="4" fill="white" />
        <line x1="103" y1="128" x2="103" y2="178" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

        <line x1="86" y1="142" x2="148" y2="140" stroke="#1e3a5f" strokeWidth="6" strokeLinecap="round" />
        <line x1="120" y1="142" x2="152" y2="140" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
        <circle cx="150" cy="139" r="5" fill="#f0bc8a" />
        <circle cx="155" cy="140" r="5" fill="#f0bc8a" />

        {/* MALTE HEAD */}
        <g transform="translate(103, 100)">
          <rect x="-5" y="16" width="10" height="10" rx="4" fill="#f0bc8a" />
          <ellipse cx="0" cy="2" rx="20" ry="23" fill="#f0bc8a" />
          <path d="M-20,-10 Q-18,-24 0,-22 Q18,-24 20,-10" fill="#a07840" />
          <ellipse cx="0" cy="-18" rx="17" ry="7" fill="#a07840" />
          <path d="M-20,-10 L-21,-2" stroke="#a07840" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M20,-10 L21,-2" stroke="#a07840" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="-20" cy="2" rx="4" ry="5" fill="#e8b08a" />
          <ellipse cx="20" cy="2" rx="4" ry="5" fill="#e8b08a" />
          <path d="M-10,-3 Q-7,-6 -3,-4" fill="none" stroke="#8a6e3e" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3,-4 Q7,-6 10,-3" fill="none" stroke="#8a6e3e" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="-7" cy="1" rx="3.5" ry="3.2" fill="white" />
          <ellipse cx="7" cy="1" rx="3.5" ry="3.2" fill="white" />
          <circle cx="-6.2" cy="1" r="2.2" fill="#4a6e3a" />
          <circle cx="7.8" cy="1" r="2.2" fill="#4a6e3a" />
          <circle cx="-5.7" cy="0.3" r="0.8" fill="white" />
          <circle cx="8.3" cy="0.3" r="0.8" fill="white" />
          <path d="M-1,5 Q0,8 1,5" fill="none" stroke="#d4a070" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M-8,10 Q0,18 8,10" fill="white" stroke="#c47a5a" strokeWidth="1.5" />
          <path d="M-6,11 Q0,16 6,11" fill="#c47a5a" />
          <circle cx="-12" cy="7" r="4" fill="rgba(255,140,140,0.2)" />
          <circle cx="12" cy="7" r="4" fill="rgba(255,140,140,0.2)" />
        </g>
      </g>
    </svg>
  );
}
