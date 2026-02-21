"use client";

import { PlayerName } from "./config";

const KEYS = {
  currentPlayer: "tdw_currentPlayer",
  selectedDate: "tdw_selectedDate",
  highscores: "tdw_highscores",
  terminVotes: "tdw_terminVotes",
  gameCompleted: "tdw_gameCompleted",
  gameUnlocks: "tdw_gameUnlocks",
} as const;

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

export function getHighscores(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEYS.highscores) || "{}");
  } catch {
    return {};
  }
}

export function setHighscore(player: string, score: number) {
  const scores = getHighscores();
  if (!scores[player] || score > scores[player]) {
    scores[player] = score;
    localStorage.setItem(KEYS.highscores, JSON.stringify(scores));
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
