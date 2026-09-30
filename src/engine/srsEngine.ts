// ─────────────────────────────────────────────
// srsEngine.ts — SuperMemo SM-2 Spaced Repetition Engine
// ─────────────────────────────────────────────

export interface SrsCard {
  wordId: string;
  interval: number;        // days until next review
  repetitions: number;     // consecutive correct responses
  easeFactor: number;      // difficulty factor (≥ 1.3)
  nextReviewDate: number;  // timestamp (ms)
  lastReviewDate: number;  // timestamp (ms)
  totalReviews: number;
  correctReviews: number;
}

/**
 * SM-2 Quality ratings:
 * 0 = Complete blackout (Forgot)
 * 1 = Incorrect, but recognized upon reveal
 * 2 = Incorrect, but easy to remember
 * 3 = Correct with significant difficulty (Hard)
 * 4 = Correct with minor hesitation (Good)
 * 5 = Perfect response (Mastered)
 */
export type SrsQuality = 0 | 1 | 2 | 3 | 4 | 5;

export const SRS_LABELS: Record<number, { label: string; quality: SrsQuality; color: string; icon: string }> = {
  0: { label: 'Forgot',   quality: 0, color: '#ef4444', icon: '✕' },
  3: { label: 'Hard',     quality: 3, color: '#f59e0b', icon: '◐' },
  4: { label: 'Good',     quality: 4, color: '#22c55e', icon: '✓' },
  5: { label: 'Mastered', quality: 5, color: '#8b5cf6', icon: '★' },
};

/**
 * Creates a brand-new SRS card for a word.
 */
export function createSrsCard(wordId: string): SrsCard {
  return {
    wordId,
    interval: 0,
    repetitions: 0,
    easeFactor: 2.5,
    nextReviewDate: Date.now(),
    lastReviewDate: 0,
    totalReviews: 0,
    correctReviews: 0,
  };
}

/**
 * Core SM-2 Algorithm:
 * Computes the next interval, repetitions, and ease factor
 * based on the user's quality rating.
 */
export function computeSm2(card: SrsCard, quality: SrsQuality): SrsCard {
  const now = Date.now();
  let { interval, repetitions, easeFactor } = card;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Incorrect response — reset
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor using SM-2 formula
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  // Calculate next review date
  const nextReviewDate = now + interval * 24 * 60 * 60 * 1000;

  return {
    ...card,
    interval,
    repetitions,
    easeFactor: Math.round(easeFactor * 100) / 100,
    nextReviewDate,
    lastReviewDate: now,
    totalReviews: card.totalReviews + 1,
    correctReviews: card.correctReviews + (quality >= 3 ? 1 : 0),
  };
}

/**
 * Determine mastery level from SRS card data.
 * Returns a value from 0 to 1.
 */
export function getMasteryLevel(card: SrsCard): number {
  if (card.totalReviews === 0) return 0;
  const accuracy = card.correctReviews / card.totalReviews;
  const intervalFactor = Math.min(card.interval / 30, 1); // caps at 30 days
  const easeFactor = Math.min((card.easeFactor - 1.3) / (2.5 - 1.3), 1);
  return Math.min((accuracy * 0.4 + intervalFactor * 0.35 + easeFactor * 0.25), 1);
}

/**
 * Get cards due for review from a list.
 */
export function getDueCards(cards: SrsCard[]): SrsCard[] {
  const now = Date.now();
  return cards.filter(c => c.nextReviewDate <= now);
}

// ─────────────────────────────────────────────
// LOCAL STORAGE PERSISTENCE
// ─────────────────────────────────────────────

const STORAGE_KEYS = {
  SRS_DATA: 'hanzi-daily-srs',
  SETTINGS: 'hanzi-daily-settings',
  STATS: 'hanzi-daily-stats',
} as const;

export interface AppSettings {
  selectedLevels: number[];
  theme: 'dark' | 'light' | 'auto';
  ambientInterval: number; // minutes
  blurMode: 'hanzi' | 'pinyin' | 'meaning' | 'none';
  showTraditional: boolean;
  showIndonesian: boolean;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  reviewed: number;
  correct: number;
  newLearned: number;
  streak: number; // consecutive days with at least one review
  longestStreak: number; // longest streak on record
}

export const DEFAULT_SETTINGS: AppSettings = {
  selectedLevels: [1],
  theme: 'dark',
  ambientInterval: 30,
  blurMode: 'pinyin',
  showTraditional: false,
  showIndonesian: true,
};

/**
 * Persist SRS card map to localStorage.
 */
export function saveSrsData(cards: Record<string, SrsCard>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SRS_DATA, JSON.stringify(cards));
  } catch (e) {
    console.error('Failed to save SRS data:', e);
  }
}

/**
 * Load SRS card map from localStorage.
 */
export function loadSrsData(): Record<string, SrsCard> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SRS_DATA);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save app settings to localStorage.
 */
export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

/**
 * Load app settings from localStorage.
 */
export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Save daily stats.
 */
export function saveDailyStats(stats: DailyStats[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
}

/**
 * Load daily stats.
 */
export function loadDailyStats(): DailyStats[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Returns YYYY-MM-DD in local time.
 */
function localDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Compute the current and longest streak from persisted daily stats.
 * A day counts toward the streak once at least one review is recorded.
 */
export function getStreakFromStats(stats: DailyStats[]): { current: number; longest: number } {
  if (stats.length === 0) return { current: 0, longest: 0 };

  const activeDays = new Set(stats.filter(s => s.reviewed > 0).map(s => s.date));
  const sorted = [...activeDays].sort();

  let longest = 0;
  let run = 0;
  let prev: Date | null = null;

  for (const dateStr of sorted) {
    const d = new Date(dateStr + 'T00:00:00');
    if (prev && (d.getTime() - prev.getTime()) / 86400000 === 1) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    prev = d;
  }

  // Current streak must include today or yesterday to still be alive
  const today = new Date();
  const todayStr = localDateStr(today);
  const yesterday = new Date(today.getTime() - 86400000);
  const yesterdayStr = localDateStr(yesterday);

  let current = 0;
  if (activeDays.has(todayStr)) {
    // Walk back from today
    let d = today;
    while (activeDays.has(localDateStr(d))) {
      current += 1;
      d = new Date(d.getTime() - 86400000);
    }
  } else if (activeDays.has(yesterdayStr)) {
    // Streak still alive: walk back from yesterday
    let d = yesterday;
    while (activeDays.has(localDateStr(d))) {
      current += 1;
      d = new Date(d.getTime() - 86400000);
    }
  }

  return { current, longest };
}

/**
 * Record a review action in daily stats and update the streak.
 */
export function recordReview(isCorrect: boolean, isNew: boolean): void {
  const stats = loadDailyStats();
  const today = localDateStr(new Date());
  let todayStats = stats.find(s => s.date === today);

  if (!todayStats) {
    todayStats = { date: today, reviewed: 0, correct: 0, newLearned: 0, streak: 0, longestStreak: 0 };
    stats.push(todayStats);
  }

  todayStats.reviewed += 1;
  if (isCorrect) todayStats.correct += 1;
  if (isNew) todayStats.newLearned += 1;

  // Keep only last 90 days for storage, but compute streak on full history
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const filtered = stats.filter(s => new Date(s.date) >= cutoff);

  // Compute streak on full stats, persist only filtered
  const { current, longest } = getStreakFromStats(stats);
  for (const s of filtered) {
    s.streak = current;
    s.longestStreak = longest;
  }

  saveDailyStats(filtered);
}

// ─────────────────────────────────────────────
// CUSTOM WORDS
// ─────────────────────────────────────────────

const CUSTOM_WORDS_KEY = 'hanzi-daily-custom-words';

export interface CustomWord {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  meaningId: string;
  level: number;
  createdAt: number;
}

export function loadCustomWords(): CustomWord[] {
  try {
    const raw = localStorage.getItem(CUSTOM_WORDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomWords(words: CustomWord[]): void {
  try {
    localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(words));
  } catch (e) {
    console.error('Failed to save custom words:', e);
  }
}

export function addCustomWord(word: Omit<CustomWord, 'id' | 'createdAt'>): CustomWord {
  const words = loadCustomWords();
  const newWord: CustomWord = {
    ...word,
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now(),
  };
  words.push(newWord);
  saveCustomWords(words);
  return newWord;
}

export function removeCustomWord(id: string): void {
  const words = loadCustomWords().filter(w => w.id !== id);
  saveCustomWords(words);
}
