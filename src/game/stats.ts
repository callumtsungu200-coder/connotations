import { MAX_MISTAKES } from './logic';
import { KEYS, readJson, remove, writeJson } from './storage';

export interface Stats {
  played: number;
  won: number;
  lost: number;
  currentStreak: number;
  maxStreak: number;
  /** Sum of mistakes across every counted game, won or lost. */
  totalMistakes: number;
  /** Wins bucketed by mistakes made: index 0 = flawless, 3 = won on the last life. */
  winsByMistakes: number[];
}

export const EMPTY_STATS: Stats = {
  played: 0,
  won: 0,
  lost: 0,
  currentStreak: 0,
  maxStreak: 0,
  totalMistakes: 0,
  winsByMistakes: [0, 0, 0, 0],
};

export function recordGame(stats: Stats, result: { won: boolean; mistakes: number }): Stats {
  const currentStreak = result.won ? stats.currentStreak + 1 : 0;
  const winsByMistakes = stats.winsByMistakes.slice();
  if (result.won) {
    const bucket = Math.min(Math.max(result.mistakes, 0), MAX_MISTAKES - 1);
    winsByMistakes[bucket] += 1;
  }
  return {
    played: stats.played + 1,
    won: stats.won + (result.won ? 1 : 0),
    lost: stats.lost + (result.won ? 0 : 1),
    currentStreak,
    maxStreak: Math.max(stats.maxStreak, currentStreak),
    totalMistakes: stats.totalMistakes + result.mistakes,
    winsByMistakes,
  };
}

export function winRate(stats: Stats): number {
  return stats.played ? Math.round((stats.won / stats.played) * 100) : 0;
}

export function averageMistakes(stats: Stats): number {
  return stats.played ? stats.totalMistakes / stats.played : 0;
}

/** Fewest mistakes in any win, or null if the player hasn't won yet. */
export function bestPerformance(stats: Stats): number | null {
  const idx = stats.winsByMistakes.findIndex((n) => n > 0);
  return idx === -1 ? null : idx;
}

function isStats(value: unknown): value is Stats {
  if (!value || typeof value !== 'object') return false;
  const s = value as Record<string, unknown>;
  const numeric = ['played', 'won', 'lost', 'currentStreak', 'maxStreak', 'totalMistakes'];
  return (
    numeric.every((k) => typeof s[k] === 'number' && Number.isFinite(s[k]) && (s[k] as number) >= 0) &&
    Array.isArray(s.winsByMistakes) &&
    s.winsByMistakes.length === MAX_MISTAKES &&
    s.winsByMistakes.every((n) => typeof n === 'number')
  );
}

export function loadStats(): Stats {
  const saved = readJson<unknown>(KEYS.stats);
  return isStats(saved) ? saved : { ...EMPTY_STATS, winsByMistakes: [...EMPTY_STATS.winsByMistakes] };
}

export function saveStats(stats: Stats): void {
  writeJson(KEYS.stats, stats);
}

export function clearStats(): Stats {
  remove(KEYS.stats);
  return loadStats();
}
