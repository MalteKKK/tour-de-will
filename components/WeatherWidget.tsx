"use client";

import { useEffect, useState } from "react";

interface WeatherData {
  maxTemp: number;
  minTemp: number;
  precipProb: number;
}

export default function WeatherWidget({ targetDate }: { targetDate: string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const target = new Date(targetDate);
    const now = new Date();
    const daysAway = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysAway < 0 || daysAway > 16) return;

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe/Berlin`
    )
      .then((res) => res.json())
      .then((data) => {
        const idx = data.daily?.time?.indexOf(targetDate);
        if (idx >= 0) {
          setWeather({
            maxTemp: Math.round(data.daily.temperature_2m_max[idx]),
            minTemp: Math.round(data.daily.temperature_2m_min[idx]),
            precipProb: data.daily.precipitation_probability_max[idx],
          });
        }
      })
      .catch(() => {});
  }, [targetDate]);

  if (!weather) return null;

  const getMessage = () => {
    if (weather.precipProb > 60) return { emoji: "🌧️", msg: "Regenjacke nicht vergessen!" };
    if (weather.precipProb > 30) return { emoji: "⛅", msg: "Könnte nass werden – Regenzeug einpacken!" };
    if (weather.maxTemp > 28) return { emoji: "☀️", msg: "Sonnencreme und viel Wasser mitnehmen!" };
    if (weather.maxTemp < 10) return { emoji: "🥶", msg: "Warm anziehen auf dem Rad!" };
    return { emoji: "🌤️", msg: "Perfektes Radwetter!" };
  };

  const { emoji, msg } = getMessage();

  return (
    <div className="glass-card rounded-2xl p-4 mt-4 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{emoji}</span>
        <div className="flex-1">
          <div className="text-sm font-bold text-white/80">
            {weather.minTemp}° – {weather.maxTemp}°C
          </div>
          <div className="text-xs text-[#8ab4d6]">{msg}</div>
          <div className="text-xs text-white/40 mt-0.5">
            Regenwahrscheinlichkeit: {weather.precipProb}%
          </div>
        </div>
        <span className="text-xl">🚴</span>
      </div>
    </div>
  );
}
