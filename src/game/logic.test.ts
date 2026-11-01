import { describe, expect, it } from 'vitest';
import {
  createGame,
  deselectAll,
  evaluateGuess,
  guessGrid,
  isValidSavedGame,
  reshuffle,
  shareText,
  shuffle,
  submitGuess,
  toggleWord,
  unsolvedGroups,
} from './logic';
import type { GameState, Puzzle } from './types';

const puzzle: Puzzle = {
  id: 't1',
  groups: [
    { level: 0, category: 'A', words: ['A1', 'A2', 'A3', 'A4'] },
    { level: 1, category: 'B', words: ['B1', 'B2', 'B3', 'B4'] },
    { level: 2, category: 'C', words: ['C1', 'C2', 'C3', 'C4'] },
    { level: 3, category: 'D', words: ['D1', 'D2', 'D3', 'D4'] },
  ],
};

/** Deterministic pseudo-random generator for repeatable shuffles. */
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function select(state: GameState, words: string[]) {
  return words.reduce(toggleWord, deselectAll(state));
}

function guess(state: GameState, words: string[]) {
  return submitGuess(puzzle, select(state, words));
}

describe('shuffle', () => {
  it('keeps every item exactly once', () => {
    const items = Array.from({ length: 16 }, (_, i) => i);
    expect(shuffle(items, seeded(3)).sort((a, b) => a - b)).toEqual(items);
  });

  it('reshuffle always changes the order when possible', () => {
    const items = ['a', 'b', 'c', 'd'];
    for (let s = 1; s < 50; s++) expect(reshuffle(items, seeded(s))).not.toEqual(items);
    expect(reshuffle(items, () => 0)).not.toEqual(items);
  });
});

describe('selection', () => {
  it('starts with all sixteen words on the board', () => {
    const g = createGame(puzzle, seeded(1));
    expect(g.board).toHaveLength(16);
    expect(g.status).toBe('playing');
    expect(g.mistakes).toBe(0);
  });

  it('toggles words and caps selection at four', () => {
    let g = createGame(puzzle, seeded(1));
    g = select(g, ['A1', 'B1', 'C1', 'D1', 'A2']);
    expect(g.selected).toEqual(['A1', 'B1', 'C1', 'D1']);
    g = toggleWord(g, 'B1');
    expect(g.selected).toEqual(['A1', 'C1', 'D1']);
    expect(deselectAll(g).selected).toEqual([]);
  });

  it('ignores words that are not on the board', () => {
    const g = createGame(puzzle, seeded(1));
    expect(toggleWord(g, 'NOPE')).toBe(g);
  });
});

describe('guessing', () => {
  it('reveals a correct group and removes its words from the board', () => {
    const { state, outcome } = guess(createGame(puzzle, seeded(1)), ['C3', 'C1', 'C4', 'C2']);
    expect(outcome).toEqual({ type: 'correct', groupIndex: 2 });
    expect(state.solved).toEqual([2]);
    expect(state.board).toHaveLength(12);
    expect(state.board.some((w) => w.startsWith('C'))).toBe(false);
    expect(state.selected).toEqual([]);
    expect(state.mistakes).toBe(0);
  });

  it('flags a one-away guess and counts it as a mistake', () => {
    const { state, outcome } = guess(createGame(puzzle, seeded(1)), ['A1', 'A2', 'A3', 'B1']);
    expect(outcome.type).toBe('one-away');
    expect(state.mistakes).toBe(1);
    expect(state.selected).toHaveLength(4);
  });

  it('treats a scattered guess as plain wrong', () => {
    const { outcome } = guess(createGame(puzzle, seeded(1)), ['A1', 'A2', 'B1', 'B2']);
    expect(outcome.type).toBe('wrong');
  });

  it('does not charge a mistake for repeating a guess', () => {
    const first = guess(createGame(puzzle, seeded(1)), ['A1', 'A2', 'B1', 'B2']).state;
    const again = guess(first, ['B2', 'A2', 'B1', 'A1']);
    expect(again.outcome.type).toBe('duplicate');
    expect(again.state.mistakes).toBe(1);
  });

  it('rejects submissions without exactly four words', () => {
    const g = select(createGame(puzzle, seeded(1)), ['A1', 'A2']);
    expect(evaluateGuess(puzzle, g).type).toBe('invalid');
  });

  it('wins once all four groups are found', () => {
    let g = createGame(puzzle, seeded(1));
    for (const group of puzzle.groups) g = guess(g, group.words).state;
    expect(g.status).toBe('won');
    expect(g.board).toEqual([]);
    expect(unsolvedGroups(puzzle, g)).toEqual([]);
  });

  it('loses after four mistakes and ignores further input', () => {
    let g = createGame(puzzle, seeded(1));
    g = guess(g, ['A1', 'B1', 'C1', 'D1']).state;
    g = guess(g, ['A2', 'B2', 'C2', 'D2']).state;
    g = guess(g, ['A3', 'B3', 'C3', 'D3']).state;
    expect(g.status).toBe('playing');
    g = guess(g, ['A4', 'B4', 'C4', 'D4']).state;
    expect(g.status).toBe('lost');
    expect(g.mistakes).toBe(4);
    expect(toggleWord(g, 'A1')).toBe(g);
    expect(unsolvedGroups(puzzle, g)).toEqual([0, 1, 2, 3]);
  });

  it('builds a colour grid and share text from the history', () => {
    let g = createGame(puzzle, seeded(1));
    g = guess(g, ['A1', 'A2', 'A3', 'B1']).state;
    g = guess(g, ['A1', 'A2', 'A3', 'A4']).state;
    expect(guessGrid(puzzle, g)).toEqual([
      [0, 0, 0, 1],
      [0, 0, 0, 0],
    ]);
    expect(shareText(puzzle, g, 7)).toBe('Quartets #7\n🟨🟨🟨🟩\n🟨🟨🟨🟨');
  });
});

describe('saved game validation', () => {
  it('accepts a genuine in-progress game', () => {
    const g = guess(createGame(puzzle, seeded(1)), puzzle.groups[0].words).state;
    expect(isValidSavedGame(puzzle, JSON.parse(JSON.stringify(g)))).toBe(true);
  });

  it('rejects corrupted or mismatched data', () => {
    const g = createGame(puzzle, seeded(1));
    expect(isValidSavedGame(puzzle, null)).toBe(false);
    expect(isValidSavedGame(puzzle, { ...g, puzzleId: 'other' })).toBe(false);
    expect(isValidSavedGame(puzzle, { ...g, board: g.board.slice(1) })).toBe(false);
    expect(isValidSavedGame(puzzle, { ...g, solved: [0] })).toBe(false);
    expect(isValidSavedGame(puzzle, { ...g, status: 'paused' })).toBe(false);
  });
});
