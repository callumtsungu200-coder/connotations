import { useCallback, useRef, useState } from 'react';
import { Board } from './components/Board';
import { HelpContent } from './components/HelpContent';
import { HelpIcon, MoonIcon, StatsIcon, SunIcon } from './components/Icons';
import { Modal } from './components/Modal';
import { ResultContent } from './components/ResultContent';
import { SolvedGroup } from './components/SolvedGroup';
import { StatsPanel } from './components/StatsPanel';
import { MAX_MISTAKES } from './game/logic';
import { readString, writeString } from './game/storage';
import { useGame } from './game/useGame';
import { useTheme } from './useTheme';

const SEEN_HELP = 'seen-help';

interface ToastState {
  id: number;
  text: string;
}

export default function App() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const showToast = useCallback((text: string) => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), text });
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
  }, []);

  const g = useGame(showToast);
  const { theme, toggle: toggleTheme } = useTheme();
  const [helpOpen, setHelpOpen] = useState(() => readString(SEEN_HELP) == null);
  const [statsOpen, setStatsOpen] = useState(false);

  const closeHelp = useCallback(() => {
    writeString(SEEN_HELP, '1');
    setHelpOpen(false);
  }, []);
  const closeStats = useCallback(() => setStatsOpen(false), []);
  const { setShowResult } = g;
  const closeResult = useCallback(() => setShowResult(false), [setShowResult]);

  const { game, puzzle } = g;
  const playing = game.status === 'playing';
  const finishedAndSettled = !playing && !g.busy;
  const livesLeft = MAX_MISTAKES - game.mistakes;

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="logo" aria-hidden="true">
            <i className="level-0" />
            <i className="level-1" />
            <i className="level-2" />
            <i className="level-3" />
          </span>
          <h1>Quartets</h1>
        </div>
        <nav className="header-actions" aria-label="Game menu">
          <button type="button" className="icon-button" aria-label="How to play" onClick={() => setHelpOpen(true)}>
            <HelpIcon />
          </button>
          <button type="button" className="icon-button" aria-label="Statistics" onClick={() => setStatsOpen(true)}>
            <StatsIcon />
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </nav>
      </header>

      <main className="main">
        <div className="intro">
          <p>Create four groups of four!</p>
          <span className="badge">
            Puzzle #{g.puzzleNo}
            {game.replay && ' · Replay'}
          </span>
        </div>

        <section className="play-area" aria-label="Puzzle">
          {g.shownGroups.map((i) => (
            <SolvedGroup
              key={puzzle.groups[i].category}
              group={puzzle.groups[i]}
              animate={i === g.lastSolved || !game.solved.includes(i)}
              revealed={!game.solved.includes(i)}
            />
          ))}
          <Board
            words={g.boardWords}
            selected={game.selected}
            hopping={g.hopping}
            shaking={g.shaking}
            disabled={!playing || g.busy}
            onToggle={g.toggle}
          />
        </section>

        {playing ? (
          <>
            <div className="mistakes" aria-live="polite">
              <span>Mistakes remaining:</span>
              <span className="dots" aria-label={`${livesLeft} of ${MAX_MISTAKES}`}>
                {Array.from({ length: MAX_MISTAKES }, (_, i) => (
                  <span key={i} className={`dot${i < livesLeft ? '' : ' used'}`} />
                ))}
              </span>
            </div>
            <div className="controls">
              <button type="button" className="btn" onClick={g.shuffle} disabled={g.busy}>
                Shuffle
              </button>
              <button
                type="button"
                className="btn"
                onClick={g.deselect}
                disabled={g.busy || game.selected.length === 0}
              >
                Deselect all
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={g.submit}
                disabled={g.busy || game.selected.length !== 4}
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <div className={`controls end${finishedAndSettled ? ' visible' : ''}`}>
            <button type="button" className="btn" onClick={() => g.setShowResult(true)} disabled={g.busy}>
              View results
            </button>
            <button type="button" className="btn" onClick={g.replay} disabled={g.busy}>
              Replay
            </button>
            <button type="button" className="btn primary" onClick={g.nextPuzzle} disabled={g.busy}>
              Next puzzle
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <span>Unlimited puzzles · stats saved on this device</span>
      </footer>

      <div className="toast-layer" aria-live="assertive">
        {toast && (
          <div key={toast.id} className="toast" role="status">
            {toast.text}
          </div>
        )}
      </div>

      <Modal open={helpOpen} title="How to play" onClose={closeHelp}>
        <HelpContent />
        <button type="button" className="btn primary block" onClick={closeHelp}>
          Let’s play
        </button>
      </Modal>

      <Modal open={statsOpen} title="Statistics" onClose={closeStats}>
        <StatsPanel stats={g.stats} onReset={g.resetStats} />
      </Modal>

      <Modal
        open={g.showResult && !playing}
        title={game.status === 'won' ? 'Nicely done!' : 'So close!'}
        onClose={closeResult}
        className="result-modal"
      >
        <ResultContent
          puzzle={puzzle}
          puzzleNo={g.puzzleNo}
          game={game}
          stats={g.stats}
          onNext={g.nextPuzzle}
          onReplay={g.replay}
        />
      </Modal>
    </div>
  );
}

