import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { PUZZLES } from './data/puzzles';
import { createGame } from './game/logic';

const puzzle = PUZZLES[0];

function startWith(p = puzzle) {
  localStorage.setItem('connotations:seen-help', '1');
  localStorage.setItem('connotations:progress', JSON.stringify(createGame(p)));
  localStorage.setItem('connotations:history', JSON.stringify([p.id]));
  return render(<App />);
}

function tile(word: string) {
  return within(screen.getByRole('group', { name: 'Word grid' })).getByRole('button', { name: word });
}

function pick(words: string[]) {
  words.forEach((w) => fireEvent.click(tile(w)));
}

function submit() {
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
  act(() => {
    vi.advanceTimersByTime(1500);
  });
}

function storedStats() {
  return JSON.parse(localStorage.getItem('connotations:stats') ?? 'null');
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Connotations app', () => {
  it('shows the how-to-play guide on the first visit only', () => {
    const { unmount } = render(<App />);
    expect(screen.getByRole('dialog', { name: 'How to play' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Let’s play' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    unmount();
    render(<App />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders sixteen tiles and enables Submit at four selections', () => {
    startWith();
    const grid = screen.getByRole('group', { name: 'Word grid' });
    expect(within(grid).getAllByRole('button')).toHaveLength(16);

    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    expect(submitBtn).toBeDisabled();
    pick(puzzle.groups[0].words.slice(0, 3));
    expect(submitBtn).toBeDisabled();
    pick([puzzle.groups[0].words[3]]);
    expect(submitBtn).toBeEnabled();
    expect(tile(puzzle.groups[0].words[0])).toHaveAttribute('aria-pressed', 'true');
  });

  it('deselects all words', () => {
    startWith();
    pick(puzzle.groups[1].words.slice(0, 2));
    fireEvent.click(screen.getByRole('button', { name: 'Deselect all' }));
    puzzle.groups[1].words.forEach((w) => expect(tile(w)).toHaveAttribute('aria-pressed', 'false'));
  });

  it('shuffles the board without losing words', () => {
    startWith();
    const grid = screen.getByRole('group', { name: 'Word grid' });
    const order = () => within(grid).getAllByRole('button').map((b) => b.textContent);
    const before = order();
    fireEvent.click(screen.getByRole('button', { name: 'Shuffle' }));
    const after = order();
    expect(after).not.toEqual(before);
    expect([...after].sort()).toEqual([...before].sort());
  });

  it('reveals a correct group as a solved row', () => {
    startWith();
    const group = puzzle.groups[2];
    pick(group.words);
    submit();
    expect(screen.getByRole('group', { name: `${group.category}: ${group.words.join(', ')}` })).toBeInTheDocument();
    expect(within(screen.getByRole('group', { name: 'Word grid' })).getAllByRole('button')).toHaveLength(12);
  });

  it('warns when one away and spends a mistake', () => {
    startWith();
    const [a, b] = puzzle.groups;
    pick([...a.words.slice(0, 3), b.words[0]]);
    submit();
    expect(screen.getByRole('status')).toHaveTextContent('One away…');
    expect(screen.getByLabelText('3 of 4')).toBeInTheDocument();
  });

  it('says so when a guess is repeated, without spending a mistake', () => {
    startWith();
    const [a, b] = puzzle.groups;
    const guess = [a.words[0], a.words[1], b.words[0], b.words[1]];
    pick(guess);
    submit();
    expect(screen.getByLabelText('3 of 4')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByRole('status')).toHaveTextContent('Already guessed!');
    expect(screen.getByLabelText('3 of 4')).toBeInTheDocument();
  });

  it('plays a winning game, records stats and deals a fresh puzzle', () => {
    startWith();
    for (const g of puzzle.groups) {
      pick(g.words);
      submit();
    }
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    const dialog = screen.getByRole('dialog', { name: 'Nicely done!' });
    expect(dialog).toHaveTextContent('Flawless');
    expect(storedStats()).toMatchObject({ played: 1, won: 1, lost: 0, currentStreak: 1, maxStreak: 1 });

    fireEvent.click(within(dialog).getByRole('button', { name: 'Next puzzle' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText(/Puzzle #/)).not.toHaveTextContent('Puzzle #1');
    expect(within(screen.getByRole('group', { name: 'Word grid' })).getAllByRole('button')).toHaveLength(16);
  });

  it('reveals every answer after four mistakes', () => {
    startWith();
    const [a, b, c, d] = puzzle.groups.map((g) => g.words);
    const wrong = [
      [a[0], b[0], c[0], d[0]],
      [a[1], b[1], c[1], d[1]],
      [a[2], b[2], c[2], d[2]],
      [a[3], b[3], c[3], d[3]],
    ];
    for (const w of wrong) {
      fireEvent.click(screen.getByRole('button', { name: 'Deselect all' }));
      pick(w);
      submit();
    }
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    const dialog = screen.getByRole('dialog', { name: 'So close!' });
    const answers = within(dialog).getByRole('list', { name: 'Correct answers' });
    puzzle.groups.forEach((g) => expect(answers).toHaveTextContent(g.category));
    expect(storedStats()).toMatchObject({ played: 1, won: 0, lost: 1, currentStreak: 0, totalMistakes: 4 });

    fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }));
    puzzle.groups.forEach((g) =>
      expect(screen.getByRole('group', { name: `${g.category}: ${g.words.join(', ')}` })).toBeInTheDocument(),
    );
  });

  it('does not count replays towards statistics', () => {
    startWith();
    for (const g of puzzle.groups) {
      pick(g.words);
      submit();
    }
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Replay' }));
    expect(screen.getByText(/Replay/, { selector: '.badge' })).toBeInTheDocument();
    for (const g of puzzle.groups) {
      pick(g.words);
      submit();
    }
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByRole('dialog')).toHaveTextContent('Replays aren’t counted');
    expect(storedStats()).toMatchObject({ played: 1, won: 1 });
  });

  it('resumes an in-progress game after a reload', () => {
    const { unmount } = startWith();
    pick(puzzle.groups[3].words);
    submit();
    unmount();
    render(<App />);
    expect(within(screen.getByRole('group', { name: 'Word grid' })).getAllByRole('button')).toHaveLength(12);
  });

  it('resets statistics after confirmation', () => {
    localStorage.setItem(
      'connotations:stats',
      JSON.stringify({
        played: 3,
        won: 2,
        lost: 1,
        currentStreak: 2,
        maxStreak: 2,
        totalMistakes: 5,
        winsByMistakes: [1, 1, 0, 0],
      }),
    );
    startWith();
    fireEvent.click(screen.getByRole('button', { name: 'Statistics' }));
    const dialog = screen.getByRole('dialog', { name: 'Statistics' });
    expect(dialog).toHaveTextContent('67');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Reset statistics' }));
    fireEvent.click(within(dialog).getByRole('button', { name: 'Yes, reset' }));
    expect(localStorage.getItem('connotations:stats')).toBeNull();
    expect(within(dialog).getAllByText('0').length).toBeGreaterThan(3);
  });

  it('toggles between light and dark mode', () => {
    startWith();
    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('connotations:theme')).toBe('dark');
    fireEvent.click(screen.getByRole('button', { name: 'Switch to light mode' }));
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
