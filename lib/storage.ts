"use client";

import { PlayerName } from "./config";

const KEYS = {
  currentPlayer: "tdw_currentPlayer",
  selectedDate: "tdw_selectedDate",
  highscores: "tdw_highscores",
  terminVotes: "tdw_terminVotes",
  gameCompleted: "tdw_gameCompleted",
  gameUnlocks: "tdw_gameUnlocks",
  customTermine: "tdw_customTermine",
  achievements: "tdw_achievements",
} as const;

export type Termin = { id: number; label: string; date: string };

export function setCurrentPlayer(name: PlayerName) {
  localStorage.setItem(KEYS.currentPlayer, name);
}

export function getCurrentPlayer(): PlayerName | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.currentPlayer) as PlayerName | null;
}

export function clearCurrentPlayer() {
  localStorage.removeItem(KEYS.currentPlayer);
}

export function setSelectedDate(date: string) {
  localStorage.setItem(KEYS.selectedDate, date);
}

export function getSelectedDate(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.selectedDate);
}

export function getHighscores(game?: string): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    if (game) {
      return JSON.parse(localStorage.getItem(`${KEYS.highscores}_${game}`) || "{}");
    }
    // Fallback: legacy global highscores
    return JSON.parse(localStorage.getItem(KEYS.highscores) || "{}");
  } catch {
    return {};
  }
}

export function setHighscore(player: string, score: number, game?: string) {
  const key = game ? `${KEYS.highscores}_${game}` : KEYS.highscores;
  const scores = getHighscores(game);
  if (!scores[player] || score > scores[player]) {
    scores[player] = score;
    localStorage.setItem(key, JSON.stringify(scores));
  }
}

// Termin-Votes: { "Malte": [1, 3], "Will": [2] } – each player picks date IDs
export function getTerminVotes(): Record<string, number[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEYS.terminVotes) || "{}");
  } catch {
    return {};
  }
}

export function setTerminVotes(player: string, dateIds: number[]) {
  const votes = getTerminVotes();
  votes[player] = dateIds;
  localStorage.setItem(KEYS.terminVotes, JSON.stringify(votes));
}

// Game Completion: { "bike-runner": true, "reaktion": true }
export function getGameCompleted(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEYS.gameCompleted) || "{}");
  } catch {
    return {};
  }
}

export function setGameCompleted(gameId: string) {
  const completed = getGameCompleted();
  completed[gameId] = true;
  localStorage.setItem(KEYS.gameCompleted, JSON.stringify(completed));
}

// Game Unlocks (admin-controlled): { "reaktion": true }
// bike-runner is always unlocked
export function getGameUnlocks(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEYS.gameUnlocks) || "{}");
  } catch {
    return {};
  }
}

export function setGameUnlock(gameId: string, unlocked: boolean) {
  const unlocks = getGameUnlocks();
  unlocks[gameId] = unlocked;
  localStorage.setItem(KEYS.gameUnlocks, JSON.stringify(unlocks));
}

export function isGameUnlocked(gameId: string): boolean {
  if (gameId === "bike-runner") return true;
  return getGameUnlocks()[gameId] === true;
}

// Custom Termine (admin-managed, overrides CONFIG.termine)
export function getCustomTermine(): Termin[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEYS.customTermine);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCustomTermine(termine: Termin[]) {
  localStorage.setItem(KEYS.customTermine, JSON.stringify(termine));
}

export function clearCustomTermine() {
  localStorage.removeItem(KEYS.customTermine);
}

// Achievements: { "sternsammler": { unlockedAt: "2026-..." }, ... }
export function getAchievements(): Record<string, { unlockedAt: string }> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEYS.achievements) || "{}");
  } catch {
    return {};
  }
}

export function unlockAchievement(id: string): boolean {
  const current = getAchievements();
  if (current[id]) return false;
  current[id] = { unlockedAt: new Date().toISOString() };
  localStorage.setItem(KEYS.achievements, JSON.stringify(current));
  return true;
}

export function hasAchievement(id: string): boolean {
  return !!getAchievements()[id];
}

// Notification tracking (per player)
export function getLastSeenUnlocks(player: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(`tdw_lastSeenUnlocks_${player}`) || "[]");
  } catch {
    return [];
  }
}

export function setLastSeenUnlocks(player: string, gameIds: string[]) {
  localStorage.setItem(`tdw_lastSeenUnlocks_${player}`, JSON.stringify(gameIds));
}
