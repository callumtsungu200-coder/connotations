import { useState } from 'react';
import { guessGrid, shareText } from '../game/logic';
import type { Stats } from '../game/stats';
import type { GameState, Puzzle } from '../game/types';
import { Distribution, StatGrid } from './StatsPanel';

interface Props {
  puzzle: Puzzle;
  puzzleNo: number;
  game: GameState;
  stats: Stats;
  onNext: () => void;
  onReplay: () => void;
}

export function ResultContent({ puzzle, puzzleNo, game, stats, onNext, onReplay }: Props) {
  const [copied, setCopied] = useState(false);
  const won = game.status === 'won';
  const grid = guessGrid(puzzle, game);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareText(puzzle, game, puzzleNo));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="result">
      <p className="result-summary">
        {won
          ? game.mistakes === 0
            ? 'Flawless — not a single mistake.'
            : `Solved with ${game.mistakes} mistake${game.mistakes === 1 ? '' : 's'}.`
          : 'Out of mistakes. Here’s how it fit together:'}
      </p>

      <div className="guess-grid" aria-label="Your guesses">
        {grid.map((row, r) => (
          <div key={r} className="guess-row">
            {row.map((level, c) => (
              <span key={c} className={`guess-cell level-${level}`} />
            ))}
          </div>
        ))}
      </div>

      {!won && (
        <ul className="answers" aria-label="Correct answers">
          {puzzle.groups.map((g) => (
            <li key={g.category} className={`answer level-${g.level}`}>
              <strong>{g.category}</strong>
              <span>{g.words.join(', ')}</span>
            </li>
          ))}
        </ul>
      )}

      {game.replay ? (
        <p className="muted center">Replays aren’t counted in your statistics.</p>
      ) : (
        <>
          <StatGrid stats={stats} compact />
          {won && <Distribution stats={stats} highlight={game.mistakes} />}
        </>
      )}

      <div className="result-actions">
        <button type="button" className="btn primary" onClick={onNext} data-autofocus>
          Next puzzle
        </button>
        <button type="button" className="btn" onClick={onReplay}>
          Replay
        </button>
        <button type="button" className="btn ghost" onClick={copy}>
          {copied ? 'Copied!' : 'Copy result'}
        </button>
      </div>
    </div>
  );
}
