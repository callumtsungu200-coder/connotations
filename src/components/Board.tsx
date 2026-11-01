import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { TIMING } from '../game/useGame';

/** Lets very long words wrap (with a hyphen) on narrow screens instead of shrinking to illegibility. */
function softBreak(word: string): string {
  if (word.length < 9) return word;
  const mid = Math.ceil(word.length / 2);
  return word.slice(0, mid) + '­' + word.slice(mid);
}

interface Props {
  words: string[];
  selected: string[];
  hopping: boolean;
  shaking: boolean;
  disabled: boolean;
  onToggle: (word: string) => void;
}

/**
 * The 4×4 (or smaller, as groups are solved) grid of word tiles. Tiles glide
 * to their new positions when the board is shuffled or a row is removed,
 * using a small FLIP animation.
 */
export function Board({ words, selected, hopping, shaking, disabled, onToggle }: Props) {
  const tiles = useRef(new Map<string, HTMLButtonElement>());
  const before = useRef(new Map<string, DOMRect>());
  const layoutKey = words.join('|');
  const lastKey = useRef(layoutKey);

  // Capture positions during render, while the DOM still shows the old layout.
  if (lastKey.current !== layoutKey) {
    before.current = new Map();
    tiles.current.forEach((el, w) => before.current.set(w, el.getBoundingClientRect()));
  }

  useLayoutEffect(() => {
    if (lastKey.current === layoutKey) return;
    lastKey.current = layoutKey;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    tiles.current.forEach((el, w) => {
      const prev = before.current.get(w);
      if (!prev || reduce || typeof el.animate !== 'function') return;
      const now = el.getBoundingClientRect();
      const dx = prev.left - now.left;
      const dy = prev.top - now.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      el.animate([{ translate: `${dx}px ${dy}px` }, { translate: '0 0' }], {
        duration: 420,
        easing: 'cubic-bezier(.2,.8,.2,1)',
      });
    });
  }, [layoutKey]);

  return (
    <div className="board" role="group" aria-label="Word grid">
      {words.map((word) => {
        const pick = selected.indexOf(word);
        const isSelected = pick !== -1;
        const classes = ['tile'];
        if (isSelected) classes.push('selected');
        if (isSelected && hopping) classes.push('hop');
        if (isSelected && shaking) classes.push('shake');
        const style = {
          '--hop-delay': `${Math.max(pick, 0) * TIMING.hopStagger}ms`,
          '--len': Math.max(word.length, 6),
        } as CSSProperties;
        return (
          <button
            key={word}
            ref={(el) => {
              if (el) tiles.current.set(word, el);
              else tiles.current.delete(word);
            }}
            type="button"
            className={classes.join(' ')}
            style={style}
            aria-label={word}
            aria-pressed={isSelected}
            disabled={disabled}
            onClick={() => onToggle(word)}
          >
            <span className="tile-word">{softBreak(word)}</span>
          </button>
        );
      })}
    </div>
  );
}
