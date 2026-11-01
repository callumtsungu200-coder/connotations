import { useState } from 'react';
import { averageMistakes, bestPerformance, winRate, type Stats } from '../game/stats';

function describeBest(best: number | null): string {
  if (best === null) return '—';
  if (best === 0) return 'Flawless';
  return `${best} mistake${best === 1 ? '' : 's'}`;
}

export function StatGrid({ stats, compact }: { stats: Stats; compact?: boolean }) {
  const items: [string, string | number][] = compact
    ? [
        ['Played', stats.played],
        ['Win %', winRate(stats)],
        ['Streak', stats.currentStreak],
        ['Max streak', stats.maxStreak],
      ]
    : [
        ['Played', stats.played],
        ['Won', stats.won],
        ['Lost', stats.lost],
        ['Win %', winRate(stats)],
        ['Current streak', stats.currentStreak],
        ['Longest streak', stats.maxStreak],
        ['Avg. mistakes', averageMistakes(stats).toFixed(1)],
        ['Best game', describeBest(bestPerformance(stats))],
      ];
  return (
    <dl className={`stat-grid${compact ? ' compact' : ''}`}>
      {items.map(([label, value]) => (
        <div key={label} className="stat">
          <dt className="stat-label">{label}</dt>
          <dd className="stat-value">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Distribution({ stats, highlight }: { stats: Stats; highlight?: number }) {
  const max = Math.max(1, ...stats.winsByMistakes);
  return (
    <div className="distribution">
      <h3 className="section-title">Wins by mistakes made</h3>
      {stats.winsByMistakes.map((count, mistakes) => (
        <div key={mistakes} className="dist-row">
          <span className="dist-label">{mistakes}</span>
          <div className="dist-track">
            <div
              className={`dist-bar${highlight === mistakes ? ' highlight' : ''}`}
              style={{ width: `${Math.max(8, (count / max) * 100)}%` }}
            >
              {count}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsPanel({ stats, onReset }: { stats: Stats; onReset: () => void }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <>
      <StatGrid stats={stats} />
      <Distribution stats={stats} />
      <div className="reset-row">
        {confirming ? (
          <>
            <span className="muted">Erase all statistics?</span>
            <button type="button" className="btn small" onClick={() => setConfirming(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn small danger"
              onClick={() => {
                onReset();
                setConfirming(false);
              }}
            >
              Yes, reset
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn small ghost"
            onClick={() => setConfirming(true)}
            disabled={stats.played === 0}
          >
            Reset statistics
          </button>
        )}
      </div>
    </>
  );
}
