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
 * Record a review action in daily stats.
 */
export function recordReview(isCorrect: boolean, isNew: boolean): void {
  const stats = loadDailyStats();
  const today = new Date().toISOString().split('T')[0];
  let todayStats = stats.find(s => s.date === today);

  if (!todayStats) {
    todayStats = { date: today, reviewed: 0, correct: 0, newLearned: 0 };
    stats.push(todayStats);
  }

  todayStats.reviewed += 1;
  if (isCorrect) todayStats.correct += 1;
  if (isNew) todayStats.newLearned += 1;

  // Keep only last 90 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const filtered = stats.filter(s => new Date(s.date) >= cutoff);

  saveDailyStats(filtered);
}
