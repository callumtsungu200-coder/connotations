import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PUZZLES, getPuzzle, puzzleNumber } from '../data/puzzles';
import {
  createGame,
  deselectAll,
  evaluateGuess,
  isValidSavedGame,
  shuffleBoard,
  submitGuess,
  toggleWord,
  unsolvedGroups,
} from './logic';
import { loadHistory, pickNextPuzzle, pushHistory, saveHistory } from './picker';
import { clearStats, loadStats, recordGame, saveStats, type Stats } from './stats';
import { KEYS, readJson, writeJson } from './storage';
import type { GameState, Puzzle } from './types';

/** Animation timings in ms. Kept here so the CSS and the game flow stay in step. */
export const TIMING = {
  hopStagger: 90,
  hopDuration: 320,
  shake: 480,
  revealStep: 750,
  resultDelay: 1000,
};
const HOP_TOTAL = TIMING.hopStagger * 3 + TIMING.hopDuration;

const WIN_MESSAGES = ['Perfect!', 'Splendid!', 'Great!', 'Phew!'];

interface Session {
  puzzle: Puzzle;
  game: GameState;
}

function startNewSession(excludeId?: string): Session {
  const history = loadHistory();
  const puzzle = pickNextPuzzle(PUZZLES, history, Math.random, excludeId);
  saveHistory(pushHistory(history, puzzle.id, PUZZLES.length));
  return { puzzle, game: createGame(puzzle) };
}

function restoreSession(): Session {
  const saved = readJson<GameState>(KEYS.progress);
  const puzzle = saved && getPuzzle(saved.puzzleId);
  if (puzzle && isValidSavedGame(puzzle, saved)) return { puzzle, game: saved };
  return startNewSession();
}

export function useGame(toast: (message: string) => void) {
  const [{ puzzle, game }, setSession] = useState(restoreSession);
  const [stats, setStats] = useState<Stats>(loadStats);
  const [busy, setBusy] = useState(false);
  const [hopping, setHopping] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [lastSolved, setLastSolved] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(() =>
    game.status === 'lost' ? unsolvedGroups(puzzle, game).length : 0,
  );
  const [showResult, setShowResult] = useState(false);

  const timers = useRef<number[]>([]);
  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    writeJson(KEYS.progress, game);
  }, [game]);

  const update = useCallback((fn: (g: GameState) => GameState) => {
    setSession((s) => ({ ...s, game: fn(s.game) }));
  }, []);

  const finish = useCallback(
    (next: GameState) => {
      if (next.replay) return;
      setStats((prev) => {
        const updated = recordGame(prev, { won: next.status === 'won', mistakes: next.mistakes });
        saveStats(updated);
        return updated;
      });
    },
    [],
  );

  const toggle = useCallback(
    (word: string) => {
      if (!busy) update((g) => toggleWord(g, word));
    },
    [busy, update],
  );

  const shuffle = useCallback(() => {
    if (!busy) update((g) => shuffleBoard(g));
  }, [busy, update]);

  const deselect = useCallback(() => {
    if (!busy) update(deselectAll);
  }, [busy, update]);

  const submit = useCallback(() => {
    if (busy || game.status !== 'playing' || game.selected.length !== 4) return;
    const preview = evaluateGuess(puzzle, game);
    if (preview.type === 'duplicate') {
      toast('Already guessed!');
      return;
    }
    if (preview.type === 'invalid') return;

    setBusy(true);
    setHopping(true);
    later(HOP_TOTAL, () => {
      setHopping(false);
      const { state: next, outcome } = submitGuess(puzzle, game);
      setSession((s) => ({ ...s, game: next }));
      if (next.status !== 'playing') finish(next);

      if (outcome.type === 'correct') {
        setLastSolved(outcome.groupIndex);
        if (next.status === 'won') {
          later(450, () => toast(WIN_MESSAGES[Math.min(next.mistakes, 3)]));
          later(TIMING.resultDelay + 400, () => {
            setShowResult(true);
            setBusy(false);
          });
        } else {
          setBusy(false);
        }
        return;
      }

      setShaking(true);
      if (next.status === 'lost') toast('Next time!');
      else if (outcome.type === 'one-away') toast('One away…');
      later(TIMING.shake, () => {
        setShaking(false);
        if (next.status !== 'lost') {
          setBusy(false);
          return;
        }
        // Reveal the remaining groups one at a time, then show the result.
        setSession((s) => ({ ...s, game: { ...s.game, selected: [] } }));
        const remaining = unsolvedGroups(puzzle, next).length;
        for (let k = 1; k <= remaining; k++) later(k * TIMING.revealStep, () => setRevealed(k));
        later(remaining * TIMING.revealStep + TIMING.resultDelay, () => {
          setShowResult(true);
          setBusy(false);
        });
      });
    });
  }, [busy, game, puzzle, later, finish, toast]);

  const reset = useCallback(
    (session: Session) => {
      clearTimers();
      setSession(session);
      setBusy(false);
      setHopping(false);
      setShaking(false);
      setLastSolved(null);
      setRevealed(0);
      setShowResult(false);
    },
    [clearTimers],
  );

  const nextPuzzle = useCallback(() => reset(startNewSession(puzzle.id)), [reset, puzzle.id]);
  const replay = useCallback(
    () => reset({ puzzle, game: createGame(puzzle, Math.random, true) }),
    [reset, puzzle],
  );

  const resetStats = useCallback(() => setStats(clearStats()), []);

  /** Groups currently shown above the board: found ones, then any revealed after a loss. */
  const shownGroups = useMemo(
    () => [...game.solved, ...unsolvedGroups(puzzle, game).slice(0, revealed)],
    [game, puzzle, revealed],
  );

  const boardWords = useMemo(() => {
    const hidden = new Set(shownGroups.flatMap((i) => puzzle.groups[i].words));
    return game.board.filter((w) => !hidden.has(w));
  }, [game.board, shownGroups, puzzle]);

  return {
    puzzle,
    puzzleNo: puzzleNumber(puzzle.id),
    game,
    stats,
    busy,
    hopping,
    shaking,
    lastSolved,
    shownGroups,
    boardWords,
    showResult,
    setShowResult,
    toggle,
    shuffle,
    deselect,
    submit,
    nextPuzzle,
    replay,
    resetStats,
  };
}
