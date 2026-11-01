import type { Rng } from './logic';
import type { Puzzle } from './types';
import { KEYS, readJson, writeJson } from './storage';

/**
 * Picks the next puzzle. Unplayed puzzles are preferred; once every puzzle has
 * been seen, it picks randomly from the least recently played half, so the
 * same puzzle never comes back soon after it was played.
 *
 * @param history puzzle ids, least recently played first.
 */
export function pickNextPuzzle(
  puzzles: readonly Puzzle[],
  history: readonly string[],
  rng: Rng = Math.random,
  excludeId?: string,
): Puzzle {
  if (puzzles.length === 0) throw new Error('No puzzles available');
  const known = new Set(puzzles.map((p) => p.id));
  const recent = history.filter((id) => known.has(id));
  const played = new Set(recent);

  let pool = puzzles.filter((p) => !played.has(p.id) && p.id !== excludeId);
  if (pool.length === 0) {
    const oldest = new Set(recent.slice(0, Math.max(1, Math.ceil(recent.length / 2))));
    pool = puzzles.filter((p) => oldest.has(p.id) && p.id !== excludeId);
  }
  if (pool.length === 0) pool = puzzles.slice();
  return pool[Math.floor(rng() * pool.length)];
}

/** Moves `id` to the most-recent end of the history, keeping each id once. */
export function pushHistory(history: readonly string[], id: string, limit: number): string[] {
  return [...history.filter((h) => h !== id), id].slice(-limit);
}

export function loadHistory(): string[] {
  const saved = readJson<unknown>(KEYS.history);
  return Array.isArray(saved) ? saved.filter((x): x is string => typeof x === 'string') : [];
}

export function saveHistory(history: string[]): void {
  writeJson(KEYS.history, history);
}
