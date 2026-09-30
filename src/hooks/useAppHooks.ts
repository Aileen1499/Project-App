import { useState, useEffect, useCallback, useRef } from 'react';
import type { HskWord } from '../data/hskMasterData';
import { hskMasterData, getWordsByLevels } from '../data/hskMasterData';
import {
  type SrsCard, type SrsQuality, type AppSettings,
  createSrsCard, computeSm2, getMasteryLevel,
  loadSrsData, saveSrsData, loadSettings, saveSettings, recordReview,
  loadDailyStats, getStreakFromStats,
  loadCustomWords, saveCustomWords, addCustomWord, removeCustomWord, type CustomWord,
} from '../engine/srsEngine';

// ─────────────────────────────────────────
// useAppSettings
// ─────────────────────────────────────────
export function useAppSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(loadSettings);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettingsState(prev => {
      const next = { ...prev, ...partial };
      saveSettings(next);
      return next;
    });
  }, []);

  // Apply theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.className = prefersDark ? 'dark' : 'light';
    } else {
      root.className = settings.theme;
    }
  }, [settings.theme]);

  return { settings, updateSettings };
}

// ─────────────────────────────────────────
// useSrsSystem
// ─────────────────────────────────────────
export function useSrsSystem(selectedLevels: number[]) {
  const [srsCards, setSrsCards] = useState<Record<string, SrsCard>>(loadSrsData);

  const getOrCreateCard = useCallback((wordId: string): SrsCard => {
    return srsCards[wordId] || createSrsCard(wordId);
  }, [srsCards]);

  const reviewWord = useCallback((wordId: string, quality: SrsQuality) => {
    setSrsCards(prev => {
      const card = prev[wordId] || createSrsCard(wordId);
      const isNew = !prev[wordId];
      const updated = computeSm2(card, quality);
      const next = { ...prev, [wordId]: updated };
      saveSrsData(next);
      recordReview(quality >= 3, isNew);
      return next;
    });
  }, []);

  // Get mastery stats per level
  const getMasteryByLevel = useCallback((level: number): number => {
    const words = getWordsByLevels([level]);
    if (words.length === 0) return 0;
    const totalMastery = words.reduce((sum, w) => {
      const card = srsCards[w.id];
      return sum + (card ? getMasteryLevel(card) : 0);
    }, 0);
    return totalMastery / words.length;
  }, [srsCards]);

  // Get due words
  const getDueWords = useCallback((): HskWord[] => {
    const now = Date.now();
    const pool = getWordsByLevels(selectedLevels);
    return pool.filter(w => {
      const card = srsCards[w.id];
      if (!card) return true; // never reviewed = due
      return card.nextReviewDate <= now;
    });
  }, [srsCards, selectedLevels]);

  // Get review count for today
  const getTodayReviewCount = useCallback((): number => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return Object.values(srsCards).filter(c => c.lastReviewDate >= todayStart.getTime()).length;
  }, [srsCards]);

  // Get current and longest streak
  const getStreak = useCallback((): { current: number; longest: number } => {
    return getStreakFromStats(loadDailyStats());
  }, []);

  return { srsCards, getOrCreateCard, reviewWord, getMasteryByLevel, getDueWords, getTodayReviewCount, getStreak };
}

// ─────────────────────────────────────────
// useAmbientTimer
// ─────────────────────────────────────────
export function useAmbientTimer(
  intervalMinutes: number,
  selectedLevels: number[],
  onNewWord: (word: HskWord) => void
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getNextWord = useCallback(() => {
    const pool = getWordsByLevels(selectedLevels.length > 0 ? selectedLevels : [1]);
    if (pool.length > 0) {
      onNewWord(pool[Math.floor(Math.random() * pool.length)]);
    }
  }, [selectedLevels, onNewWord]);

  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Set new interval
    const ms = intervalMinutes * 60 * 1000;
    intervalRef.current = setInterval(getNextWord, ms);

    // Also trigger on visibility change (tab focus)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        getNextWord();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [intervalMinutes, getNextWord]);

  return { triggerNext: getNextWord };
}

// ─────────────────────────────────────────
// useSpeech
// ─────────────────────────────────────────
export function useSpeech() {
  const speak = useCallback((text: string, rate: number = 0.85) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = rate;
    utterance.pitch = 1;

    // Try to find a Chinese voice
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(v => v.lang.startsWith('zh'));
    if (zhVoice) utterance.voice = zhVoice;

    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
}

// ─────────────────────────────────────────
// useClozeTest
// ─────────────────────────────────────────
export interface ClozeQuestion {
  sentence: string;
  pinyin: string;
  translation: string;
  answer: string;
  options: string[];
  word: HskWord;
}

export function useClozeTest(selectedLevels: number[]) {
  const [questions, setQuestions] = useState<ClozeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const generateQuestions = useCallback((count: number = 10) => {
    const pool = getWordsByLevels(selectedLevels.length > 0 ? selectedLevels : [1]);
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);

    const qs: ClozeQuestion[] = shuffled.map(word => {
      const sentenceIdx = Math.random() > 0.5 ? 1 : 0;
      const sentence = word.sentences[sentenceIdx];
      const blanked = sentence.zh.replace(word.hanzi, '______');

      // Generate distractors from same level
      const distractors = pool
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.hanzi);

      const options = [word.hanzi, ...distractors].sort(() => Math.random() - 0.5);

      return {
        sentence: blanked,
        pinyin: sentence.pinyin,
        translation: sentence.en,
        answer: word.hanzi,
        options,
        word,
      };
    });

    setQuestions(qs);
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
  }, [selectedLevels]);

  const answerQuestion = useCallback((selectedAnswer: string) => {
    const q = questions[currentIndex];
    if (!q) return false;
    const isCorrect = selectedAnswer === q.answer;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    return isCorrect;
  }, [questions, currentIndex]);

  const nextQuestion = useCallback(() => {
    setCurrentIndex(prev => prev + 1);
  }, []);

  return {
    questions,
    currentQuestion: questions[currentIndex] || null,
    currentIndex,
    score,
    isComplete: currentIndex >= questions.length && questions.length > 0,
    generateQuestions,
    answerQuestion,
    nextQuestion,
  };
}

// ─────────────────────────────────────────
// useCustomWords
// ─────────────────────────────────────────
export function useCustomWords() {
  const [customWords, setCustomWords] = useState<CustomWord[]>(loadCustomWords);

  const addWord = useCallback((word: Omit<CustomWord, 'id' | 'createdAt'>) => {
    const newWord = addCustomWord(word);
    setCustomWords(loadCustomWords());
    return newWord;
  }, []);

  const removeWord = useCallback((id: string) => {
    removeCustomWord(id);
    setCustomWords(loadCustomWords());
  }, []);

  return { customWords, addWord, removeWord };
}

// ─────────────────────────────────────────
// useCustomWords
// ─────────────────────────────────────────
export function useCustomWords() {
  const [customWords, setCustomWords] = useState<CustomWord[]>(loadCustomWords);

  const addWord = useCallback((word: Omit<CustomWord, 'id' | 'createdAt'>) => {
    const newWord = addCustomWord(word);
    setCustomWords(loadCustomWords());
    return newWord;
  }, []);

  const removeWord = useCallback((id: string) => {
    removeCustomWord(id);
    setCustomWords(loadCustomWords());
  }, []);

  return { customWords, addWord, removeWord };
}
