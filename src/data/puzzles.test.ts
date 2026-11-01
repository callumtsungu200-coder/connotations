import { describe, expect, it } from 'vitest';
import { PUZZLES } from './puzzles';

describe('puzzle collection', () => {
  it('has a good number of puzzles with unique ids', () => {
    expect(PUZZLES.length).toBeGreaterThanOrEqual(50);
    expect(new Set(PUZZLES.map((p) => p.id)).size).toBe(PUZZLES.length);
  });

  it.each(PUZZLES.map((p) => [p.id, p] as const))('%s is a well-formed 4×4 puzzle', (_id, puzzle) => {
    expect(puzzle.groups).toHaveLength(4);
    expect(puzzle.groups.map((g) => g.level)).toEqual([0, 1, 2, 3]);

    const categories = puzzle.groups.map((g) => g.category.trim().toLowerCase());
    expect(new Set(categories).size).toBe(4);
    categories.forEach((c) => expect(c.length).toBeGreaterThan(0));

    const words = puzzle.groups.flatMap((g) => g.words);
    puzzle.groups.forEach((g) => expect(g.words).toHaveLength(4));
    expect(words).toHaveLength(16);
    expect(new Set(words).size).toBe(16);
    for (const w of words) {
      expect(w).toMatch(/^[A-Z][A-Z-]*$/);
      expect(w.length).toBeLessThanOrEqual(12);
    }
  });

  it('never reuses the exact same set of sixteen words', () => {
    const keys = PUZZLES.map((p) => p.groups.flatMap((g) => g.words).sort().join(','));
    expect(new Set(keys).size).toBe(keys.length);
  });
});
