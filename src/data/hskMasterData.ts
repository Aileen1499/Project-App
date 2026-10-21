// ─────────────────────────────────────────────
// hskMasterData.ts — Official HSK 3.0 Universal Dataset (Levels 1-6, 5,363 words)
// ─────────────────────────────────────────────

import hsk30Raw from './hsk30Data.json';

export interface HskSentence {
  zh: string;
  pinyin: string;
  en: string;
  id: string; // Indonesian
}

export interface HskWord {
  id: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  hanzi: string;
  traditional: string;
  pinyin: string;
  meaning: string;
  meaningId: string; // Indonesian
  components?: string;
  collocations: string;
  nuances?: string;
  sentences: HskSentence[];
}

export const hskMasterData: HskWord[] = hsk30Raw as HskWord[];

/**
 * Utility: Get all words for a specific HSK level or set of levels.
 */
export function getWordsByLevels(levels: number[]): HskWord[] {
  return hskMasterData.filter(w => levels.includes(w.level));
}

/**
 * Utility: Get a random word from specific levels.
 */
export function getRandomWord(levels: number[]): HskWord {
  const pool = getWordsByLevels(levels);
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Official HSK 3.0 Level metadata
 */
export const HSK_LEVELS = [
  { level: 1, name: 'HSK 1', label: 'Beginner', color: '#22c55e', words: 506 },
  { level: 2, name: 'HSK 2', label: 'Elementary', color: '#3b82f6', words: 750 },
  { level: 3, name: 'HSK 3', label: 'Intermediate', color: '#f59e0b', words: 953 },
  { level: 4, name: 'HSK 4', label: 'Upper-Intermediate', color: '#ef4444', words: 972 },
  { level: 5, name: 'HSK 5', label: 'Advanced', color: '#8b5cf6', words: 1059 },
  { level: 6, name: 'HSK 6', label: 'Mastery', color: '#d97706', words: 1123 },
] as const;
