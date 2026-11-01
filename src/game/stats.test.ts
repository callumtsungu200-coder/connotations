import { describe, expect, it } from 'vitest';
import {
  EMPTY_STATS,
  averageMistakes,
  bestPerformance,
  clearStats,
  loadStats,
  recordGame,
  saveStats,
  winRate,
} from './stats';
import { pickNextPuzzle, pushHistory } from './picker';
import { migrateLegacyKeys } from './storage';
import type { Puzzle } from './types';

describe('stats', () => {
  it('tracks wins, losses, streaks and mistakes', () => {
    let s = EMPTY_STATS;
    s = recordGame(s, { won: true, mistakes: 0 });
    s = recordGame(s, { won: true, mistakes: 2 });
    s = recordGame(s, { won: false, mistakes: 4 });
    s = recordGame(s, { won: true, mistakes: 1 });

    expect(s.played).toBe(4);
    expect(s.won).toBe(3);
    expect(s.lost).toBe(1);
    expect(s.currentStreak).toBe(1);
    expect(s.maxStreak).toBe(2);
    expect(s.totalMistakes).toBe(7);
    expect(s.winsByMistakes).toEqual([1, 1, 1, 0]);
    expect(winRate(s)).toBe(75);
    expect(averageMistakes(s)).toBeCloseTo(1.75);
    expect(bestPerformance(s)).toBe(0);
  });

  it('handles an empty record', () => {
    expect(winRate(EMPTY_STATS)).toBe(0);
    expect(averageMistakes(EMPTY_STATS)).toBe(0);
    expect(bestPerformance(EMPTY_STATS)).toBeNull();
  });

  it('does not mutate the previous stats object', () => {
    const before = structuredClone(EMPTY_STATS);
    recordGame(EMPTY_STATS, { won: true, mistakes: 3 });
    expect(EMPTY_STATS).toEqual(before);
  });

  it('persists to localStorage and can be reset', () => {
    const s = recordGame(EMPTY_STATS, { won: true, mistakes: 1 });
    saveStats(s);
    expect(loadStats()).toEqual(s);
    expect(clearStats()).toEqual(EMPTY_STATS);
    expect(loadStats()).toEqual(EMPTY_STATS);
  });

  it('carries over stats saved under the old Quartets name', () => {
    const s = recordGame(EMPTY_STATS, { won: true, mistakes: 2 });
    localStorage.setItem('quartets:stats', JSON.stringify(s));
    migrateLegacyKeys();
    expect(loadStats()).toEqual(s);
    expect(localStorage.getItem('quartets:stats')).toBeNull();
  });

  it('falls back to empty stats when storage is corrupted', () => {
    localStorage.setItem('connotations:stats', '{"played":"lots"}');
    expect(loadStats()).toEqual(EMPTY_STATS);
    localStorage.setItem('connotations:stats', 'not json');
    expect(loadStats()).toEqual(EMPTY_STATS);
  });
});

describe('puzzle picker', () => {
  const puzzles = Array.from({ length: 6 }, (_, i) => ({ id: `p${i}`, groups: [] }) as Puzzle);

  it('prefers puzzles that have not been played', () => {
    const history = ['p0', 'p1', 'p2', 'p3', 'p4'];
    for (let i = 0; i < 20; i++) {
      expect(pickNextPuzzle(puzzles, history, Math.random).id).toBe('p5');
    }
  });

  it('picks from the least recently played half once all are played', () => {
    const history = ['p3', 'p1', 'p5', 'p0', 'p2', 'p4'];
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) seen.add(pickNextPuzzle(puzzles, history, Math.random, 'p4').id);
    expect([...seen].sort()).toEqual(['p1', 'p3', 'p5']);
  });

  it('never hands back the puzzle just played', () => {
    const history = ['p0'];
    const solo = [puzzles[0], puzzles[1]];
    for (let i = 0; i < 20; i++) expect(pickNextPuzzle(solo, history, Math.random, 'p0').id).toBe('p1');
  });

  it('keeps history unique, ordered and bounded', () => {
    let h: string[] = [];
    for (const id of ['a', 'b', 'c', 'a', 'd']) h = pushHistory(h, id, 3);
    expect(h).toEqual(['c', 'a', 'd']);
  });
});
