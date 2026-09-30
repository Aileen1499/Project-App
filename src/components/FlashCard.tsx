import { useState, useCallback } from 'react';
import type { HskWord } from '../data/hskMasterData';
import { getWordsByLevels } from '../data/hskMasterData';
import type { SrsQuality } from '../engine/srsEngine';
import { HskBadge, IconVolume, IconRefresh } from './shared';

interface FlashCardProps {
  selectedLevels: number[];
  speak: (text: string, rate?: number) => void;
  reviewWord: (wordId: string, quality: SrsQuality) => void;
  activeRecallMode: boolean;
}

type QuizMode = 'hanzi-to-meaning' | 'pinyin-to-hanzi' | 'listening';

interface QuizQuestion {
  options: string[];
  correct: string;
  prompt: string;
  promptSub: string;
  /** true when the correct answer is a hanzi string (affects typography) */
  answerIsHanzi: boolean;
  word: HskWord;
}

const MODES: { id: QuizMode; label: string; icon: string }[] = [
  { id: 'hanzi-to-meaning', label: 'Hanzi → Meaning', icon: '📖' },
  { id: 'pinyin-to-hanzi', label: 'Pinyin → Hanzi', icon: '🔤' },
  { id: 'listening', label: 'Listening', icon: '👂' },
];

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const pickDistractors = (pool: HskWord[], word: HskWord, field: 'hanzi' | 'meaning'): string[] =>
  shuffle(pool.filter(w => w.id !== word.id)).slice(0, 3).map(w => w[field]);

export default function FlashCard({ selectedLevels, speak, reviewWord, activeRecallMode }: FlashCardProps) {
  const [mode, setMode] = useState<QuizMode | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const current = questions[currentIdx];
  const isComplete = questions.length > 0 && currentIdx >= questions.length;

  const start = useCallback((nextMode: QuizMode) => {
    const pool = getWordsByLevels(selectedLevels.length > 0 ? selectedLevels : [1]);
    if (pool.length < 4) return;

    const built = shuffle(pool).slice(0, 10).map(word => {
      if (nextMode === 'hanzi-to-meaning') {
        return {
          options: shuffle([word.meaning, ...pickDistractors(pool, word, 'meaning')]),
          correct: word.meaning,
          prompt: word.hanzi,
          promptSub: word.pinyin,
          answerIsHanzi: false,
          word,
        };
      }
      return {
        options: shuffle([word.hanzi, ...pickDistractors(pool, word, 'hanzi')]),
        correct: word.hanzi,
        prompt: nextMode === 'listening' ? 'Listen and choose' : word.pinyin,
        promptSub: word.meaning,
        answerIsHanzi: true,
        word,
      };
    });

    setMode(nextMode);
    setQuestions(built);
    setCurrentIdx(0);
    setSelected(null);
    setScore({ correct: 0, total: 0 });
    // Listening quizzes need the first prompt spoken before it can be answered.
    if (nextMode === 'listening' && built[0]) {
      setTimeout(() => speak(built[0].word.hanzi), 0);
    }
  }, [selectedLevels, speak]);

  const answer = (option: string) => {
    if (selected !== null || !current) return;
    setSelected(option);
    const correct = option === current.correct;
    setScore(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }));
    reviewWord(current.word.id, correct ? 4 : 0);
  };

  const next = () => {
    const upcoming = questions[currentIdx + 1];
    setCurrentIdx(prev => prev + 1);
    setSelected(null);
    if (mode === 'listening' && upcoming) speak(upcoming.word.hanzi);
  };

  // ── Mode picker ──
  if (!mode) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-display font-bold gradient-text">Flashcards</h2>
        <div className="glass-card-elevated rounded-3xl p-8 text-center">
          <div className="text-6xl mb-6">🃏</div>
          <h3 className="text-xl font-semibold text-slate-200 mb-3">Pick a Drill</h3>
          <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
            Ten questions from your selected levels. Every answer feeds the SRS scheduler.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {selectedLevels.map(l => <HskBadge key={l} level={l} size="md" />)}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {MODES.map(m => (
              <button
                key={m.id}
                id={`btn-quiz-${m.id}`}
                onClick={() => start(m.id)}
                className="glass-card rounded-2xl py-5 px-3 hover:bg-white/10 active:scale-[0.97] transition-all group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{m.icon}</div>
                <div className="text-xs font-medium text-slate-300">{m.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Results ──
  if (isComplete) {
    const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    const feedback =
      pct >= 90 ? { emoji: '🏆', text: 'Outstanding!' } :
      pct >= 70 ? { emoji: '🎉', text: 'Great work!' } :
      pct >= 50 ? { emoji: '💪', text: 'Keep at it!' } :
                  { emoji: '📖', text: 'Review more first.' };

    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-display font-bold gradient-text">Drill Complete</h2>
        <div className="glass-card-elevated rounded-3xl p-8 text-center">
          <div className="text-7xl mb-4">{feedback.emoji}</div>
          <h3 className="text-2xl font-bold text-slate-200 mb-6">{feedback.text}</h3>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div>
              <div className="text-4xl font-bold text-indigo-400">{score.correct}</div>
              <div className="text-xs text-slate-500">Correct</div>
            </div>
            <div className="text-3xl text-slate-700">/</div>
            <div>
              <div className="text-4xl font-bold text-slate-400">{score.total}</div>
              <div className="text-xs text-slate-500">Total</div>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <button id="btn-restart-quiz" onClick={() => start(mode)} className="btn-primary inline-flex items-center gap-2">
              <IconRefresh size={18} /> Try Again
            </button>
            <button id="btn-change-mode" onClick={() => setMode(null)} className="btn-ghost">
              Change Drill
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const isCorrect = selected === current.correct;
  const showPinyin = mode === 'hanzi-to-meaning' && !activeRecallMode;
  const showHint = mode !== 'listening' && !activeRecallMode;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold gradient-text">Flashcards</h2>
        <div className="glass-card rounded-xl px-3 py-1.5 text-sm">
          <span className="text-slate-500">Q </span>
          <span className="font-semibold text-indigo-400">{currentIdx + 1}</span>
          <span className="text-slate-600">/{questions.length}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
        <div className="text-sm font-medium text-emerald-400">{score.correct}✓</div>
      </div>

      <div className="glass-card-elevated rounded-3xl p-6">
        <HskBadge level={current.word.level} size="md" />

        <div className="text-center my-6">
          {mode === 'listening' ? (
            <div>
              <p className="text-lg text-slate-300 mb-4">{current.prompt}</p>
              <button
                id="btn-replay-audio"
                onClick={() => speak(current.word.hanzi)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/25 active:scale-95 transition-all"
              >
                <IconVolume size={20} />
                <span className="text-sm font-medium">Play Again</span>
              </button>
            </div>
          ) : (
            <div>
              <div
                className={`font-hanzi font-bold hanzi-shadow ${mode === 'hanzi-to-meaning' ? 'text-6xl' : 'text-4xl'}`}
              >
                {current.prompt}
              </div>
              {showPinyin && <p className="text-xl text-indigo-300 mt-2">{current.word.pinyin}</p>}
              {showHint && <p className="text-sm text-slate-500 mt-1">{current.promptSub}</p>}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {current.options.map((opt, i) => {
            let cls = `glass-card rounded-2xl py-4 px-3 text-center transition-all ${current.answerIsHanzi ? 'font-hanzi text-xl' : 'text-sm'}`;
            if (selected === null) {
              cls += ' hover:bg-white/10 active:scale-[0.97]';
            } else if (opt === current.correct) {
              cls += ' bg-emerald-500/20 border-emerald-500/40 text-emerald-300 ring-2 ring-emerald-500/30';
            } else if (opt === selected) {
              cls += ' bg-red-500/20 border-red-500/40 text-red-300';
            } else {
              cls += ' opacity-30';
            }
            return (
              <button key={i} disabled={selected !== null} onClick={() => answer(opt)} className={cls}>
                {opt}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="mt-5 animate-slide-up space-y-3">
            <div className={`flex items-center gap-2 p-3 rounded-xl ${isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              <span>{isCorrect ? '✓' : '✕'}</span>
              <span className="text-sm font-medium">
                {isCorrect ? 'Correct!' : `Answer: ${current.correct} (${current.word.pinyin})`}
              </span>
              <button onClick={() => speak(current.word.hanzi)} className="ml-auto p-1.5 rounded-lg hover:bg-white/10 transition-all">
                <IconVolume size={16} />
              </button>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed pl-1">
              {current.word.sentences[0].zh} — <span className="text-indigo-400">{current.word.sentences[0].pinyin}</span>
            </p>
            <button id="btn-next-flashcard" onClick={next} className="btn-primary w-full">
              {currentIdx + 1 >= questions.length ? 'See Results' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
