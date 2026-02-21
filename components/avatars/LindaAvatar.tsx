"use client";

export default function LindaAvatar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 230 250" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* BLUE DAMENRAD */}
      <g transform="translate(35, 135)">
        <g style={{ transformOrigin: "25px 60px", animation: "wheelSpin 2s linear infinite" }}>
          <circle cx="25" cy="60" r="22" fill="none" stroke="#ccc" strokeWidth="2.5" />
          <circle cx="25" cy="60" r="3" fill="#999" />
          <line x1="25" y1="38" x2="25" y2="82" stroke="#bbb" strokeWidth="0.8" />
          <line x1="3" y1="60" x2="47" y2="60" stroke="#bbb" strokeWidth="0.8" />
          <line x1="9" y1="44" x2="41" y2="76" stroke="#bbb" strokeWidth="0.8" />
          <line x1="41" y1="44" x2="9" y2="76" stroke="#bbb" strokeWidth="0.8" />
        </g>
        <g style={{ transformOrigin: "120px 60px", animation: "wheelSpin 2s linear infinite" }}>
          <circle cx="120" cy="60" r="22" fill="none" stroke="#ccc" strokeWidth="2.5" />
          <circle cx="120" cy="60" r="3" fill="#999" />
          <line x1="120" y1="38" x2="120" y2="82" stroke="#bbb" strokeWidth="0.8" />
          <line x1="98" y1="60" x2="142" y2="60" stroke="#bbb" strokeWidth="0.8" />
          <line x1="104" y1="44" x2="136" y2="76" stroke="#bbb" strokeWidth="0.8" />
          <line x1="136" y1="44" x2="104" y2="76" stroke="#bbb" strokeWidth="0.8" />
        </g>
        <line x1="72" y1="40" x2="72" y2="58" stroke="#3b82f6" strokeWidth="3.5" />
        <line x1="72" y1="58" x2="25" y2="60" stroke="#3b82f6" strokeWidth="3.5" />
        <line x1="72" y1="46" x2="40" y2="52" stroke="#3b82f6" strokeWidth="3" />
        <line x1="40" y1="52" x2="25" y2="60" stroke="#3b82f6" strokeWidth="3" />
        <line x1="72" y1="40" x2="105" y2="30" stroke="#3b82f6" strokeWidth="3.5" />
        <line x1="105" y1="30" x2="120" y2="60" stroke="#3b82f6" strokeWidth="3" />
        <line x1="65" y1="15" x2="72" y2="40" stroke="#3b82f6" strokeWidth="3" />
        <ellipse cx="65" cy="13" rx="10" ry="4" fill="#444" />
        <line x1="105" y1="30" x2="112" y2="10" stroke="#3b82f6" strokeWidth="3" />
        <line x1="104" y1="10" x2="120" y2="10" stroke="#555" strokeWidth="3" strokeLinecap="round" />
        <path d="M5,50 A22,22 0 0,1 25,38" fill="none" stroke="#3b82f6" strokeWidth="2" />
        <path d="M140,50 A22,22 0 0,0 120,38" fill="none" stroke="#3b82f6" strokeWidth="2" />
        <line x1="66" y1="56" x2="78" y2="62" stroke="#888" strokeWidth="2" />
      </g>

      {/* LINDA BODY */}
      <g>
        <line x1="95" y1="180" x2="103" y2="195" stroke="#1a1a2e" strokeWidth="7" strokeLinecap="round" />
        <line x1="110" y1="180" x2="118" y2="196" stroke="#1a1a2e" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="103" cy="197" rx="6" ry="3" fill="#444" />
        <ellipse cx="118" cy="198" rx="6" ry="3" fill="#444" />

        <rect x="85" y="135" width="34" height="48" rx="10" fill="#60a5fa" />
        <rect x="85" y="160" width="34" height="23" rx="8" fill="#e8e0d0" />
        <rect x="92" y="136" width="20" height="15" rx="4" fill="white" />
        <ellipse cx="102" cy="172" rx="14" ry="6" fill="#b8860b" />
        <circle cx="102" cy="171" r="2.5" fill="#8B6914" />
        <line x1="88" y1="165" x2="90" y2="155" stroke="#c4a050" strokeWidth="2" />

        <line x1="86" y1="150" x2="140" y2="145" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" />
        <line x1="118" y1="150" x2="145" y2="145" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" />
        <circle cx="142" cy="144" r="5" fill="#f0bc8a" />
        <circle cx="147" cy="144" r="5" fill="#f0bc8a" />

        {/* LINDA HEAD */}
        <g transform="translate(102, 108)">
          <rect x="-5" y="14" width="10" height="8" rx="4" fill="#f0bc8a" />
          <ellipse cx="0" cy="2" rx="21" ry="22" fill="#f0bc8a" />
          <ellipse cx="-17" cy="4" rx="7" ry="16" fill="#c9a34d" />
          <ellipse cx="17" cy="4" rx="7" ry="16" fill="#c9a34d" />
          <ellipse cx="-14" cy="16" rx="6" ry="8" fill="#c9a34d" />
          <ellipse cx="14" cy="16" rx="6" ry="8" fill="#c9a34d" />
          <path d="M-20,-8 Q-18,-22 0,-20 Q18,-22 20,-8" fill="#c9a34d" />
          <ellipse cx="0" cy="-16" rx="18" ry="8" fill="#c9a34d" />
          <line x1="0" y1="-22" x2="0" y2="-12" stroke="#a88535" strokeWidth="1.2" />
          {/* Sunglasses on top */}
          <g transform="translate(0, -16)">
            <rect x="-13" y="-3" width="11" height="7" rx="3" fill="rgba(50,50,50,0.85)" stroke="#333" strokeWidth="0.5" />
            <rect x="2" y="-3" width="11" height="7" rx="3" fill="rgba(50,50,50,0.85)" stroke="#333" strokeWidth="0.5" />
            <line x1="-2" y1="0" x2="2" y2="0" stroke="#555" strokeWidth="1.5" />
            <line x1="-13" y1="0" x2="-17" y2="-1" stroke="#555" strokeWidth="1" />
            <line x1="13" y1="0" x2="17" y2="-1" stroke="#555" strokeWidth="1" />
          </g>
          <path d="M-10,-3 Q-7,-6 -3,-4" fill="none" stroke="#8a6e3e" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M3,-4 Q7,-6 10,-3" fill="none" stroke="#8a6e3e" strokeWidth="1.3" strokeLinecap="round" />
          <ellipse cx="-7" cy="1" rx="3.8" ry="3.5" fill="white" />
          <ellipse cx="7" cy="1" rx="3.8" ry="3.5" fill="white" />
          <circle cx="-6.2" cy="1" r="2.4" fill="#5a7e4e" />
          <circle cx="7.8" cy="1" r="2.4" fill="#5a7e4e" />
          <circle cx="-5.7" cy="0.3" r="0.9" fill="white" />
          <circle cx="8.3" cy="0.3" r="0.9" fill="white" />
          <path d="M-1,5 Q0,8 1,5" fill="none" stroke="#d4a070" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M-7,9 Q0,16 7,9" fill="white" stroke="#c47a5a" strokeWidth="1.5" />
          <path d="M-5,10 Q0,14 5,10" fill="#c47a5a" />
          <circle cx="-11" cy="7" r="4" fill="rgba(255,140,140,0.25)" />
          <circle cx="11" cy="7" r="4" fill="rgba(255,140,140,0.25)" />
        </g>
      </g>
    </svg>
  );
}
