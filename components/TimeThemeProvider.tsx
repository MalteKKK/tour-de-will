"use client";

import { useEffect, useState } from "react";

type TimeOfDay = "morning" | "day" | "evening" | "night";

const THEMES: Record<TimeOfDay, { bg1: string; bg2: string; accent: string; label: string; emoji: string }> = {
  morning: {
    bg1: "#1a2530",
    bg2: "#2a3a4a",
    accent: "rgba(255, 183, 77, 0.08)",
    label: "Guten Morgen",
    emoji: "🌅",
  },
  day: {
    bg1: "#0f1923",
    bg2: "#1a2a3a",
    accent: "rgba(255, 215, 0, 0.05)",
    label: "Schönen Tag",
    emoji: "☀️",
  },
  evening: {
    bg1: "#12101e",
    bg2: "#1e1838",
    accent: "rgba(168, 85, 247, 0.06)",
    label: "Guten Abend",
    emoji: "🌆",
  },
  night: {
    bg1: "#080a12",
    bg2: "#0e1220",
    accent: "rgba(74, 158, 255, 0.04)",
    label: "Gute Nacht",
    emoji: "🌙",
  },
};

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "day";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
}

export function useTimeGreeting(): { label: string; emoji: string } {
  const [tod, setTod] = useState<TimeOfDay>("day");

  useEffect(() => {
    setTod(getTimeOfDay());
  }, []);

  return THEMES[tod];
}

export default function TimeThemeProvider() {
  useEffect(() => {
    function applyTheme() {
      const tod = getTimeOfDay();
      const theme = THEMES[tod];
      document.documentElement.style.setProperty("--theme-bg1", theme.bg1);
      document.documentElement.style.setProperty("--theme-bg2", theme.bg2);
      document.documentElement.style.setProperty("--theme-accent", theme.accent);
    }

    applyTheme();
    // Re-check every 10 minutes
    const interval = setInterval(applyTheme, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
