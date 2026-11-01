/**
 * Thin, failure-tolerant wrapper around localStorage. Private browsing modes
 * and blocked storage can throw on access, so every call is guarded and the
 * game keeps working (just without persistence).
 */
const PREFIX = 'connotations:';
/** The game was first released as "Quartets"; data saved under that name is carried over once. */
const LEGACY_PREFIX = 'quartets:';

export function migrateLegacyKeys(): void {
  try {
    for (const key of Object.keys(localStorage)) {
      if (!key.startsWith(LEGACY_PREFIX)) continue;
      const name = PREFIX + key.slice(LEGACY_PREFIX.length);
      if (localStorage.getItem(name) == null) localStorage.setItem(name, localStorage.getItem(key)!);
      localStorage.removeItem(key);
    }
  } catch {
    /* storage unavailable — nothing to migrate */
  }
}

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
