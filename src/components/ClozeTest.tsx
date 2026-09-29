import { useState, useEffect } from 'react';
import type { ClozeQuestion } from '../hooks/useAppHooks';
import { HskBadge, IconVolume, IconRefresh } from './shared';

interface ClozeTestProps {
  currentQuestion: ClozeQuestion | null;
  currentIndex: number;
  score: { correct: number; total: number };
  isComplete: boolean;
  generateQuestions: (count?: number) => void;
  answerQuestion: (answer: string) => boolean;
  nextQuestion: () => void;
  speak: (text: string, rate?: number) => void;
  selectedLevels: number[];
}

export default function ClozeTest({
  currentQuestion,
  currentIndex,
  score,
  isComplete,
  generateQuestions,
  answerQuestion,
  nextQuestion,
  speak,
  selectedLevels,
}: ClozeTestProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [currentIndex]);

  const handleStart = () => {
    generateQuestions(10);
    setHasStarted(true);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return; // already answered
    setSelectedAnswer(answer);
    const correct = answerQuestion(answer);
    setIsCorrect(correct);
  };

  const handleNext = () => {
    nextQuestion();
  };

  // Not started
  if (!hasStarted) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-display font-bold gradient-text">Cloze Test</h2>
        <div className="glass-card-elevated rounded-3xl p-8 text-center">
          <div className="text-6xl mb-6">📝</div>
          <h3 className="text-xl font-semibold text-slate-200 mb-3">Gap-Fill Challenge</h3>
          <p className="text-sm text-slate-400 mb-2 max-w-sm mx-auto">
            Test your knowledge by filling in the blanks in real Chinese sentences.
            Questions are generated from your selected HSK levels.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {selectedLevels.map(l => (
              <HskBadge key={l} level={l} size="md" />
            ))}
          </div>
          <button id="btn-start-cloze" onClick={handleStart} className="btn-primary text-lg px-10 py-4">
            Start Test (10 Questions)
          </button>
        </div>
      </div>
    );
  }

  // Completed
  if (isComplete) {
    const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '💪' : '📖';
    const message = pct >= 90 ? 'Outstanding!' : pct >= 70 ? 'Great work!' : pct >= 50 ? 'Keep practicing!' : 'Review more words!';

    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-display font-bold gradient-text">Test Complete!</h2>
        <div className="glass-card-elevated rounded-3xl p-8 text-center">
          <div className="text-7xl mb-4">{emoji}</div>
          <h3 className="text-2xl font-bold text-slate-200 mb-2">{message}</h3>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-400">{score.correct}</div>
              <div className="text-xs text-slate-500">Correct</div>
            </div>
            <div className="text-3xl text-slate-600">/</div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-400">{score.total}</div>
              <div className="text-xs text-slate-500">Total</div>
            </div>
          </div>

          {/* Score Ring */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <svg className="progress-ring w-full h-full" viewBox="0 0 100 100">
                <circle stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="transparent" r="42" cx="50" cy="50" />
                <circle
                  stroke={pct >= 70 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-slate-200">{pct}%</span>
              </div>
            </div>
          </div>

          <button
            id="btn-restart-cloze"
            onClick={handleStart}
            className="btn-primary inline-flex items-center gap-2"
          >
            <IconRefresh size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Active Question
  if (!currentQuestion) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold gradient-text">Cloze Test</h2>
        <div className="glass-card rounded-xl px-3 py-1.5 text-sm">
          <span className="text-slate-400">Q </span>
          <span className="font-semibold text-indigo-400">{currentIndex + 1}</span>
          <span className="text-slate-600">/10</span>
        </div>
      </div>

      {/* Score Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / 10) * 100}%` }}
          />
        </div>
        <div className="text-sm text-emerald-400 font-medium">{score.correct}✓</div>
      </div>

      {/* Question Card */}
      <div className="glass-card-elevated rounded-3xl p-6">
        <HskBadge level={currentQuestion.word.level} size="md" />

        {/* Sentence with blank */}
        <div className="mt-5 mb-6">
          <p className="text-xl font-hanzi text-slate-200 leading-relaxed">
            {currentQuestion.sentence.split('______').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className={`inline-block min-w-[3em] border-b-2 mx-1 text-center font-bold
                    ${selectedAnswer !== null
                      ? (isCorrect ? 'border-emerald-500 text-emerald-400' : 'border-red-500 text-red-400')
                      : 'border-indigo-500/50 text-indigo-400'
                    }`}
                  >
                    {selectedAnswer || '　　'}
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>

        {/* Pinyin hint */}
        <p className="text-sm text-indigo-400/60 mb-1">{currentQuestion.pinyin}</p>
        <p className="text-sm text-slate-500 mb-6">{currentQuestion.translation}</p>

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-3">
          {currentQuestion.options.map((opt, i) => {
            let btnClass = 'glass-card rounded-2xl py-4 px-4 text-center font-hanzi text-lg transition-all';
            if (selectedAnswer !== null) {
              if (opt === currentQuestion.answer) {
                btnClass += ' bg-emerald-500/20 border-emerald-500/40 text-emerald-300 ring-2 ring-emerald-500/30';
              } else if (opt === selectedAnswer && !isCorrect) {
                btnClass += ' bg-red-500/20 border-red-500/40 text-red-300';
              } else {
                btnClass += ' opacity-40';
              }
            } else {
              btnClass += ' hover:bg-white/10 active:scale-[0.97] cursor-pointer';
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                disabled={selectedAnswer !== null}
                className={btnClass}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Feedback & Next */}
        {selectedAnswer !== null && (
          <div className="mt-5 animate-slide-up">
            <div className={`flex items-center gap-2 mb-4 p-3 rounded-xl ${
              isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}>
              <span className="text-lg">{isCorrect ? '✓' : '✕'}</span>
              <span className="text-sm font-medium">
                {isCorrect ? 'Correct!' : `The answer is: ${currentQuestion.answer}`}
              </span>
              <button
                onClick={() => speak(currentQuestion.word.hanzi)}
                className="ml-auto p-1.5 rounded-lg hover:bg-white/10 transition-all"
              >
                <IconVolume size={16} />
              </button>
            </div>
            <button
              id="btn-next-question"
              onClick={handleNext}
              className="btn-primary w-full"
            >
              Next Question →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
