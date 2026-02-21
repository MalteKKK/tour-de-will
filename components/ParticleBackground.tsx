"use client";

export default function ParticleBackground() {
  const particles = [
    { left: "10%", top: "20%", delay: "0s" },
    { left: "25%", top: "60%", delay: "1s" },
    { left: "50%", top: "30%", delay: "2s" },
    { left: "70%", top: "70%", delay: "3s" },
    { left: "85%", top: "15%", delay: "4s" },
    { left: "40%", top: "85%", delay: "1.5s" },
    { left: "15%", top: "45%", delay: "2.5s" },
    { left: "60%", top: "10%", delay: "3.5s" },
    { left: "90%", top: "50%", delay: "0.5s" },
    { left: "35%", top: "75%", delay: "4.5s" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: p.left,
            top: p.top,
            background: "rgba(255,215,0,0.3)",
            animation: `float 6s ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
