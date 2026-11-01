import { useCallback, useState } from 'react';
import { KEYS, writeString } from './game/storage';

export type Theme = 'light' | 'dark';

function currentTheme(): Theme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === 'light' || explicit === 'dark') return explicit;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Follows the system theme until the player picks one, then remembers it. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(currentTheme);
  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    writeString(KEYS.theme, next);
    setTheme(next);
  }, []);
  return { theme, toggle };
}
