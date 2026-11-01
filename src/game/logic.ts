import type { GameState, GuessOutcome, Level, Puzzle } from './types';

export const GROUP_SIZE = 4;
export const MAX_MISTAKES = 4;

export type Rng = () => number;

/** Fisher–Yates shuffle that returns a new array. */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Shuffles, retrying a few times so the order visibly changes when it can. */
export function reshuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  if (items.length < 2) return items.slice();
  for (let attempt = 0; attempt < 8; attempt++) {
    const next = shuffle(items, rng);
    if (next.some((item, i) => item !== items[i])) return next;
  }
  return items.slice(1).concat(items[0]);
}

export function allWords(puzzle: Puzzle): string[] {
  return puzzle.groups.flatMap((g) => g.words);
}

export function createGame(puzzle: Puzzle, rng: Rng = Math.random, replay = false): GameState {
  return {
    puzzleId: puzzle.id,
    board: shuffle(allWords(puzzle), rng),
    selected: [],
    solved: [],
    mistakes: 0,
    history: [],
    status: 'playing',
    replay,
  };
}

export function toggleWord(state: GameState, word: string): GameState {
  if (state.status !== 'playing' || !state.board.includes(word)) return state;
  if (state.selected.includes(word)) {
    return { ...state, selected: state.selected.filter((w) => w !== word) };
  }
  if (state.selected.length >= GROUP_SIZE) return state;
  return { ...state, selected: [...state.selected, word] };
}

export function deselectAll(state: GameState): GameState {
  return state.selected.length ? { ...state, selected: [] } : state;
}

export function shuffleBoard(state: GameState, rng: Rng = Math.random): GameState {
  return { ...state, board: reshuffle(state.board, rng) };
}

const guessKey = (words: readonly string[]) => [...words].sort().join('|');

/** Works out what a submission would do, without changing any state. */
export function evaluateGuess(puzzle: Puzzle, state: GameState): GuessOutcome {
  const { selected } = state;
  if (state.status !== 'playing' || selected.length !== GROUP_SIZE) return { type: 'invalid' };

  const key = guessKey(selected);
  if (state.history.some((guess) => guessKey(guess) === key)) return { type: 'duplicate' };

  let bestOverlap = 0;
  for (let i = 0; i < puzzle.groups.length; i++) {
    if (state.solved.includes(i)) continue;
    const overlap = puzzle.groups[i].words.filter((w) => selected.includes(w)).length;
    if (overlap === GROUP_SIZE) return { type: 'correct', groupIndex: i };
    bestOverlap = Math.max(bestOverlap, overlap);
  }
  return bestOverlap === GROUP_SIZE - 1 ? { type: 'one-away' } : { type: 'wrong' };
}

/** Submits the current selection. Duplicate and invalid guesses leave the state untouched. */
export function submitGuess(
  puzzle: Puzzle,
  state: GameState,
): { state: GameState; outcome: GuessOutcome } {
  const outcome = evaluateGuess(puzzle, state);
  if (outcome.type === 'invalid' || outcome.type === 'duplicate') return { state, outcome };

  const history = [...state.history, state.selected];

  if (outcome.type === 'correct') {
    const groupWords = puzzle.groups[outcome.groupIndex].words;
    const solved = [...state.solved, outcome.groupIndex];
    return {
      outcome,
      state: {
        ...state,
        history,
        solved,
        selected: [],
        board: state.board.filter((w) => !groupWords.includes(w)),
        status: solved.length === puzzle.groups.length ? 'won' : 'playing',
      },
    };
  }

  const mistakes = state.mistakes + 1;
  return {
    outcome,
    state: {
      ...state,
      history,
      mistakes,
      status: mistakes >= MAX_MISTAKES ? 'lost' : 'playing',
    },
  };
}

/** Groups the player didn't find, easiest first — revealed after a loss. */
export function unsolvedGroups(puzzle: Puzzle, state: GameState): number[] {
  return puzzle.groups.map((_, i) => i).filter((i) => !state.solved.includes(i));
}

export function levelOf(puzzle: Puzzle, word: string): Level {
  const group = puzzle.groups.find((g) => g.words.includes(word));
  if (!group) throw new Error(`Word "${word}" is not in puzzle ${puzzle.id}`);
  return group.level;
}

/** The colour pattern of every guess, for the result summary. */
export function guessGrid(puzzle: Puzzle, state: GameState): Level[][] {
  return state.history.map((guess) => guess.map((w) => levelOf(puzzle, w)));
}

const LEVEL_EMOJI = ['🟨', '🟩', '🟦', '🟪'] as const;

export function shareText(puzzle: Puzzle, state: GameState, puzzleNo: number): string {
  const rows = guessGrid(puzzle, state).map((row) => row.map((l) => LEVEL_EMOJI[l]).join(''));
  return [`Quartets #${puzzleNo}`, ...rows].join('\n');
}

/** Checks that persisted state still matches the puzzle it claims to belong to. */
export function isValidSavedGame(puzzle: Puzzle, value: unknown): value is GameState {
  if (!value || typeof value !== 'object') return false;
  const s = value as Partial<GameState>;
  if (s.puzzleId !== puzzle.id) return false;
  if (!Array.isArray(s.board) || !Array.isArray(s.selected) || !Array.isArray(s.solved)) return false;
  if (!Array.isArray(s.history) || typeof s.mistakes !== 'number') return false;
  if (s.status !== 'playing' && s.status !== 'won' && s.status !== 'lost') return false;

  const words = new Set(allWords(puzzle));
  const solvedWords = s.solved.flatMap((i) => puzzle.groups[i]?.words ?? []);
  if (solvedWords.length !== s.solved.length * GROUP_SIZE) return false;
  if (s.board.length + solvedWords.length !== words.size) return false;
  const seen = new Set([...s.board, ...solvedWords]);
  if (seen.size !== words.size || [...seen].some((w) => !words.has(w))) return false;
  if (!s.selected.every((w) => s.board!.includes(w))) return false;
  return s.history.every((g) => Array.isArray(g) && g.every((w) => words.has(w)));
}
