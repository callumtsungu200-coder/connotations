/**
 * Thin, failure-tolerant wrapper around localStorage. Private browsing modes
 * and blocked storage can throw on access, so every call is guarded and the
 * game keeps working (just without persistence).
 */
const PREFIX = 'quartets:';

export const KEYS = {
  stats: 'stats',
  progress: 'progress',
  history: 'history',
  theme: 'theme',
} as const;

export function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? null : (JSON.parse(raw) as T);
  } catch {
    return null;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable or full — ignore */
  }
}

export function readString(key: string): string | null {
  try {
    return localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function writeString(key: string, value: string): void {
  try {
    localStorage.setItem(PREFIX + key, value);
  } catch {
    /* ignore */
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}
