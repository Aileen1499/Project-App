// src/components/BatchStudyMode.tsx
import { useState, useMemo, useEffect } from 'react';
import { getBatchesForLevel, getCompletedBatches, saveBatchCompleted, type WordBatch } from '../engine/batchStoryEngine';
import { HSK_LEVELS, type HskWord } from '../data/hskMasterData';
import { HskBadge, IconVolume, IconRefresh } from './shared';

interface BatchStudyModeProps {
  initialLevel?: number;
  speak: (text: string, rate?: number) => void;
  showIndonesian: boolean;
}

type SubTab = 'words' | 'story' | 'quiz';

export default function BatchStudyMode({ initialLevel = 1, speak, showIndonesian }: BatchStudyModeProps) {
  const [selectedLevel, setSelectedLevel] = useState<number>(initialLevel);
  const [currentBatchIndex, setCurrentBatchIndex] = useState<number>(0);
  const [subTab, setSubTab] = useState<SubTab>('words');
  const [completedBatches, setCompletedBatches] = useState<Record<string, boolean>>(getCompletedBatches);

  // Story display toggles
  const [showPinyin, setShowPinyin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [selectedHanziModal, setSelectedHanziModal] = useState<HskWord | null>(null);

  // Quiz state
  const [quizScore, setQuizScore] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  // Load batches for selected level
  const batches = useMemo(() => {
    return getBatchesForLevel(selectedLevel, 10);
  }, [selectedLevel]);

  const currentBatch: WordBatch | undefined = batches[currentBatchIndex] || batches[0];

  // Reset quiz when batch changes
  useEffect(() => {
    setQuizIndex(0);
    setQuizScore(0);
    setQuizAnswered(false);
    setQuizSelectedAnswer(null);
    setQuizFinished(false);
  }, [currentBatchIndex, selectedLevel]);

  // Quiz questions generated from current batch
  const quizQuestions = useMemo(() => {
    if (!currentBatch) return [];
    return currentBatch.words.slice(0, 5).map(word => {
      // Pick 3 distractors from the same batch
      const distractors = currentBatch.words
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.meaningId || w.meaning);

      const correctAnswer = word.meaningId || word.meaning;
      const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);

      return {
        word,
        prompt: word.hanzi,
        pinyin: word.pinyin,
        options,
        answer: correctAnswer
      };
    });
  }, [currentBatch]);

  if (!currentBatch) return null;

  const isCompleted = completedBatches[currentBatch.id] || false;

  const handleCompleteBatch = () => {
    saveBatchCompleted(currentBatch.id);
    setCompletedBatches(getCompletedBatches());
  };

  const handleNextBatch = () => {
    if (currentBatchIndex < batches.length - 1) {
      setCurrentBatchIndex(prev => prev + 1);
      setSubTab('words');
    }
  };

  // Helper to render story with highlighted interactive target words
  const renderInteractiveStory = (text: string) => {
    // Sort words by length descending to match longest phrases first
    const sortedWords = [...currentBatch.words].sort((a, b) => b.hanzi.length - a.hanzi.length);
    const regex = new RegExp(`(${sortedWords.map(w => w.hanzi).join('|')})`, 'g');
    const parts = text.split(regex);

    return parts.map((part, idx) => {
      const matched = currentBatch.words.find(w => w.hanzi === part);
      if (matched) {
        return (
          <button
            key={idx}
            onClick={() => {
              speak(matched.hanzi);
              setSelectedHanziModal(matched);
            }}
            className="inline-block px-1.5 py-0.5 mx-0.5 my-0.5 rounded-lg font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 hover:text-white transition-all cursor-pointer"
            title={`${matched.pinyin} — ${matched.meaningId || matched.meaning}`}
          >
            {part}
          </button>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ─── Level Selector ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold gradient-text">Belajar per Unit & Cerita</h2>
          <p className="text-xs text-slate-400 mt-0.5">Kuasai 10 kata per bab dengan alur cerita terhubung</p>
        </div>
      </div>

      {/* Level Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {HSK_LEVELS.map(l => (
          <button
            key={l.level}
            onClick={() => {
              setSelectedLevel(l.level);
              setCurrentBatchIndex(0);
            }}
            className={`nav-pill whitespace-nowrap text-xs font-semibold ${selectedLevel === l.level ? 'active' : ''}`}
          >
            HSK {l.level}
          </button>
        ))}
      </div>

      {/* ─── Batch Carousel / Navigator ─── */}
      <div className="glass-card-elevated rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300">
              Unit {currentBatch.batchNumber} / {currentBatch.totalBatches}
            </span>
            <HskBadge level={selectedLevel} size="sm" />
            {isCompleted && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                ✓ Selesai
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {currentBatch.words.length} Kosakata
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-100 font-display">
          {currentBatch.title}
        </h3>

        {/* Batch Slider Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {batches.slice(0, 30).map((b, idx) => {
            const isDone = completedBatches[b.id];
            const isCurrent = idx === currentBatchIndex;
            return (
              <button
                key={b.id}
                onClick={() => setCurrentBatchIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-105'
                    : isDone
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'glass-card text-slate-400 hover:text-white'
                }`}
              >
                Bab {b.batchNumber} {isDone ? '✓' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Step Tabs within Batch ─── */}
      <div className="flex gap-2 border-b border-white/5 pb-2">
        <button
          onClick={() => setSubTab('words')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'words' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          1. Target Kata ({currentBatch.words.length})
        </button>
        <button
          onClick={() => setSubTab('story')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'story' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          2. Bacaan Cerita 📖
        </button>
        <button
          onClick={() => setSubTab('quiz')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'quiz' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          3. Kuis Penguasaan 🎯
        </button>
      </div>

      {/* ─── SUBTAB 1: WORDS LIST ─── */}
      {subTab === 'words' && (
        <div className="space-y-3 animate-fade-in">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Pelajari {currentBatch.words.length} kosakata kunci bab ini:</span>
            <button
              onClick={() => setSubTab('story')}
              className="text-indigo-400 hover:underline font-semibold"
            >
              Lanjut ke Cerita →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentBatch.words.map((word, i) => (
              <div
                key={word.id}
                className="glass-card rounded-2xl p-3.5 flex items-center justify-between hover:border-indigo-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-mono w-4">{i + 1}.</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-hanzi text-xl font-bold text-slate-100">{word.hanzi}</span>
                      <span className="text-xs font-medium text-indigo-300">{word.pinyin}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{word.meaningId || word.meaning}</p>
                  </div>
                </div>

                <button
                  onClick={() => speak(word.hanzi)}
                  className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-indigo-300 transition-all flex-shrink-0"
                  title="Dengarkan pelafalan"
                >
                  <IconVolume size={16} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setSubTab('story')}
            className="btn-primary w-full py-3.5 mt-2 flex items-center justify-center gap-2"
          >
            <span>Baca Cerita dengan Kata-Kata Ini →</span>
          </button>
        </div>
      )}

      {/* ─── SUBTAB 2: CONNECTED STORY ─── */}
      {subTab === 'story' && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass-card-elevated rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Cerita Kontekstual</span>
                <h3 className="font-hanzi text-xl font-bold text-slate-100 mt-0.5">{currentBatch.story.titleZh}</h3>
                <p className="text-xs text-slate-400">{currentBatch.story.titleId}</p>
              </div>

              <button
                onClick={() => speak(currentBatch.story.paragraphs.map(p => p.zh).join(' '), 0.85)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 transition-all text-xs font-semibold border border-indigo-500/20"
              >
                <IconVolume size={14} /> Putar Cerita
              </button>
            </div>

            {/* Display Toggles */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowPinyin(!showPinyin)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                  showPinyin ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-slate-400'
                }`}
              >
                {showPinyin ? '✓ Pinyin Aktif' : 'Pinyin Mati'}
              </button>
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                  showTranslation ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-slate-400'
                }`}
              >
                {showTranslation ? '✓ Arti Indonesia' : 'Arti Mati'}
              </button>
            </div>

            {/* Story Paragraphs */}
            <div className="space-y-5 pt-2">
              {currentBatch.story.paragraphs.map((p, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 space-y-2 border border-white/5">
                  <p className="font-hanzi text-lg leading-relaxed text-slate-100">
                    {renderInteractiveStory(p.zh)}
                  </p>
                  {showPinyin && (
                    <p className="text-xs text-indigo-300/90 leading-relaxed font-sans">{p.pinyin}</p>
                  )}
                  {showTranslation && (
                    <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-white/5">
                      {p.id}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400 text-center italic">
              💡 Tips: Klik kata yang berwarna ungu di dalam cerita untuk mendengar suara & artinya!
            </p>
          </div>

          <button
            onClick={() => setSubTab('quiz')}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
          >
            <span>Lanjut ke Kuis Penguasaan Bab Ini →</span>
          </button>
        </div>
      )}

      {/* ─── SUBTAB 3: BATCH QUIZ ─── */}
      {subTab === 'quiz' && (
        <div className="space-y-4 animate-fade-in">
          {!quizFinished ? (
            <div className="glass-card-elevated rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Pertanyaan {quizIndex + 1} dari {quizQuestions.length}</span>
                <span>Skor: {quizScore}</span>
              </div>

              {quizQuestions[quizIndex] && (
                <div className="text-center py-4 space-y-2">
                  <div className="font-hanzi text-6xl font-bold text-slate-100 hanzi-shadow">
                    {quizQuestions[quizIndex].prompt}
                  </div>
                  <div className="text-lg text-indigo-300 font-medium">
                    {quizQuestions[quizIndex].pinyin}
                  </div>

                  <button
                    onClick={() => speak(quizQuestions[quizIndex].prompt)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    <IconVolume size={18} />
                  </button>
                </div>
              )}

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {quizQuestions[quizIndex]?.options.map((opt, i) => {
                  const isCorrect = opt === quizQuestions[quizIndex].answer;
                  const isSelected = quizSelectedAnswer === opt;
                  let btnStyle = 'glass-card text-slate-200 hover:bg-white/10';

                  if (quizAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-bold';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={quizAnswered}
                      onClick={() => {
                        setQuizSelectedAnswer(opt);
                        setQuizAnswered(true);
                        if (isCorrect) {
                          setQuizScore(s => s + 1);
                        }
                      }}
                      className={`w-full p-3.5 rounded-2xl text-left text-sm font-medium transition-all ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizAnswered && (
                <button
                  onClick={() => {
                    if (quizIndex < quizQuestions.length - 1) {
                      setQuizIndex(i => i + 1);
                      setQuizAnswered(false);
                      setQuizSelectedAnswer(null);
                    } else {
                      setQuizFinished(true);
                      handleCompleteBatch();
                    }
                  }}
                  className="btn-primary w-full py-3 mt-4"
                >
                  {quizIndex < quizQuestions.length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil & Buka Unit!'}
                </button>
              )}
            </div>
          ) : (
            /* Quiz Result & Next Batch Unlock */
            <div className="glass-card-elevated rounded-3xl p-8 text-center space-y-5 animate-scale-in">
              <div className="text-5xl">🎉</div>
              <h3 className="text-2xl font-display font-bold gradient-text">
                Selamat! Unit {currentBatch.batchNumber} Selesai!
              </h3>
              <p className="text-sm text-slate-300">
                Kamu menjawab benar <strong>{quizScore} dari {quizQuestions.length}</strong> pertanyaan. Kosakata di unit ini sudah tercatat ke progres belajarmu!
              </p>

              <div className="pt-2 flex flex-col gap-3">
                {currentBatchIndex < batches.length - 1 ? (
                  <button
                    onClick={handleNextBatch}
                    className="btn-primary w-full py-3.5 font-bold shadow-lg shadow-indigo-500/30"
                  >
                    Lanjut ke Unit {currentBatch.batchNumber + 1} ({batches[currentBatchIndex + 1]?.title}) →
                  </button>
                ) : (
                  <p className="text-emerald-400 font-bold">Semua unit di level HSK {selectedLevel} telah diselesaikan!</p>
                )}

                <button
                  onClick={() => {
                    setQuizIndex(0);
                    setQuizScore(0);
                    setQuizAnswered(false);
                    setQuizSelectedAnswer(null);
                    setQuizFinished(false);
                  }}
                  className="glass-card py-2.5 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Ulangi Kuis Bab Ini
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Word Detail Modal (when clicking word in story) ─── */}
      {selectedHanziModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card-elevated rounded-3xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-hanzi text-4xl font-bold text-slate-100">{selectedHanziModal.hanzi}</span>
                <p className="text-base text-indigo-300 font-medium mt-1">{selectedHanziModal.pinyin}</p>
              </div>
              <button
                onClick={() => setSelectedHanziModal(null)}
                className="p-1 text-slate-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">Arti</span>
              <p className="text-sm font-medium text-slate-200">{selectedHanziModal.meaningId || selectedHanziModal.meaning}</p>
              {selectedHanziModal.meaningId && selectedHanziModal.meaningId !== selectedHanziModal.meaning && (
                <p className="text-xs text-slate-400">{selectedHanziModal.meaning}</p>
              )}
            </div>

            <button
              onClick={() => speak(selectedHanziModal.hanzi)}
              className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5"
            >
              <IconVolume size={14} /> Dengarkan Pelafalan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
