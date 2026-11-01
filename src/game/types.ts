export type Level = 0 | 1 | 2 | 3;

export interface Group {
  category: string;
  words: string[];
  level: Level;
}

export interface Puzzle {
  id: string;
  /** Always four groups, ordered from easiest (level 0) to trickiest (level 3). */
  groups: Group[];
}

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  puzzleId: string;
  /** Unsolved words in their current on-screen order. */
  board: string[];
  /** Currently selected words, in the order they were picked. */
  selected: string[];
  /** Indices into `puzzle.groups`, in the order the player found them. */
  solved: number[];
  mistakes: number;
  /** Every submitted guess, used for duplicate detection and the result grid. */
  history: string[][];
  status: GameStatus;
  /** Replays of a puzzle don't count towards statistics. */
  replay: boolean;
}

export type GuessOutcome =
  | { type: 'correct'; groupIndex: number }
  | { type: 'one-away' }
  | { type: 'wrong' }
  | { type: 'duplicate' }
  | { type: 'invalid' };
