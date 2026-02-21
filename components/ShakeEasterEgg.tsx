"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import WillAvatar from "@/components/avatars/WillAvatar";

const FUNNY_MESSAGES = [
  "Will ist vom Rad gefallen! 🚴💥",
  "Nicht so stark schütteln! 😵‍💫",
  "Will braucht eine Pause... 🍺",
  "Erdbeben auf der Tour! 🌋",
  "Wills Helm ist verrutscht! ⛑️",
  "Die Kette ist abgesprungen! ⛓️",
  "Platten! Wer hat den Flicken? 🔧",
  "Will sucht sein Gleichgewicht... 🤸",
];

export default function ShakeEasterEgg() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const lastShakeRef = useRef(0);
  const shakeCountRef = useRef(0);
  const lastAccelRef = useRef({ x: 0, y: 0, z: 0 });

  const handleShake = useCallback(() => {
    const now = Date.now();
    if (now - lastShakeRef.current < 5000) return; // cooldown
    lastShakeRef.current = now;
    const msg = FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)];
    setMessage(msg);
    setShow(true);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
    setTimeout(() => setShow(false), 3000);
  }, []);

  useEffect(() => {
    function onMotion(e: DeviceMotionEvent) {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x == null || acc.y == null || acc.z == null) return;

      const dx = Math.abs(acc.x - lastAccelRef.current.x);
      const dy = Math.abs(acc.y - lastAccelRef.current.y);
      const dz = Math.abs(acc.z - lastAccelRef.current.z);
      const delta = dx + dy + dz;

      lastAccelRef.current = { x: acc.x, y: acc.y, z: acc.z };

      if (delta > 25) {
        shakeCountRef.current += 1;
        if (shakeCountRef.current >= 3) {
          shakeCountRef.current = 0;
          handleShake();
        }
      }
    }

    // Request permission on iOS 13+
    const dme = DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> };
    if (dme.requestPermission) {
      // We'll request on first user tap
      function requestOnTap() {
        dme.requestPermission!().then((state: string) => {
          if (state === "granted") {
            window.addEventListener("devicemotion", onMotion);
          }
        });
        document.removeEventListener("click", requestOnTap);
      }
      document.addEventListener("click", requestOnTap, { once: true });
    } else {
      window.addEventListener("devicemotion", onMotion);
    }

    // Reset shake count periodically
    const interval = setInterval(() => {
      shakeCountRef.current = Math.max(0, shakeCountRef.current - 1);
    }, 1000);

    return () => {
      window.removeEventListener("devicemotion", onMotion);
      clearInterval(interval);
    };
  }, [handleShake]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
      <div className="bg-black/80 backdrop-blur-sm rounded-3xl p-8 mx-6 animate-shake text-center">
        <div className="w-24 h-24 mx-auto mb-4 animate-wobble">
          <WillAvatar className="w-full h-full" />
        </div>
        <p className="font-bangers text-2xl text-[#FFD700] tracking-wider mb-2">
          Oops!
        </p>
        <p className="text-white text-sm">{message}</p>
      </div>
    </div>
  );
}
