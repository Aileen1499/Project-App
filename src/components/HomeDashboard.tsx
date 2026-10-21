import { useState, useCallback, useEffect } from 'react';
import type { HskWord } from '../data/hskMasterData';
import { getWordsByLevels } from '../data/hskMasterData';
import type { SrsQuality, AppSettings } from '../engine/srsEngine';
import { SRS_LABELS, getMasteryLevel } from '../engine/srsEngine';
import type { SrsCard } from '../engine/srsEngine';
import { HskBadge, IconVolume, IconRefresh, IconEye, IconEyeOff } from './shared';
import BatchStudyMode from './BatchStudyMode';

interface HomeDashboardProps {
  settings: AppSettings;
  srsCards: Record<string, SrsCard>;
  getOrCreateCard: (id: string) => SrsCard;
  reviewWord: (id: string, quality: SrsQuality) => void;
  getDueWords: () => HskWord[];
  getTodayReviewCount: () => number;
  speak: (text: string, rate?: number) => void;
}

export default function HomeDashboard({
  settings,
  srsCards,
  getOrCreateCard,
  reviewWord,
  getDueWords,
  getTodayReviewCount,
  speak,
}: HomeDashboardProps) {
  const [studyMode, setStudyMode] = useState<'batch' | 'srs'>('batch');
  const [currentWord, setCurrentWord] = useState<HskWord | null>(null);
  const [blurStates, setBlurStates] = useState({ hanzi: false, pinyin: false, meaning: false });
  const [showDetails, setShowDetails] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);

  // Initialize with a word
  useEffect(() => {
    if (!currentWord) {
      pickNextWord();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.selectedLevels]);

  // Apply blur mode from settings
  useEffect(() => {
    const mode = settings.blurMode;
    setBlurStates({
      hanzi: mode === 'hanzi',
      pinyin: mode === 'pinyin',
      meaning: mode === 'meaning',
    });
  }, [settings.blurMode, currentWord]);

  const pickNextWord = useCallback(() => {
    setShowDetails(false);
    setReviewFeedback(null);

    // Prioritize due words
    const due = getDueWords();
    if (due.length > 0) {
      setCurrentWord(due[Math.floor(Math.random() * due.length)]);
      return;
    }

    // Fall back to random from selected levels
    const pool = getWordsByLevels(settings.selectedLevels);
    if (pool.length > 0) {
      setCurrentWord(pool[Math.floor(Math.random() * pool.length)]);
    }
  }, [settings.selectedLevels, getDueWords]);

  const handleReview = useCallback((quality: SrsQuality) => {
    if (!currentWord) return;
    reviewWord(currentWord.id, quality);
    const label = SRS_LABELS[quality]?.label || '';
    setReviewFeedback(label);
    setTimeout(() => {
      pickNextWord();
    }, 600);
  }, [currentWord, reviewWord, pickNextWord]);

  const toggleBlur = useCallback((field: 'hanzi' | 'pinyin' | 'meaning') => {
    setBlurStates(prev => ({ ...prev, [field]: !prev[field] }));
  }, []);

  if (!currentWord) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-semibold text-slate-300 mb-2">No words available</h2>
          <p className="text-slate-500">Select an HSK level in settings to begin</p>
        </div>
      </div>
    );
  }

  const card = getOrCreateCard(currentWord.id);
  const mastery = getMasteryLevel(card);
  const dueCount = getDueWords().length;
  const todayCount = getTodayReviewCount();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Study Mode Selector Pill Toggle */}
      <div className="flex p-1 rounded-2xl glass-card bg-black/10 dark:bg-white/5 border border-white/5">
        <button
          id="btn-mode-batch"
          onClick={() => setStudyMode('batch')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            studyMode === 'batch'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>📖</span>
          <span>Unit & Cerita (Batch 10 Kata)</span>
        </button>
        <button
          id="btn-mode-srs"
          onClick={() => setStudyMode('srs')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            studyMode === 'srs'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>⚡</span>
          <span>Review SRS Acak</span>
        </button>
      </div>

      {studyMode === 'batch' ? (
        <BatchStudyMode
          initialLevel={settings.selectedLevels[0] || 1}
          speak={speak}
          showIndonesian={settings.showIndonesian}
        />
      ) : (
        <>
          {/* Stats Bar */}
          <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="glass-card rounded-xl px-3 py-1.5 text-sm">
            <span className="text-slate-400">Due: </span>
            <span className="font-semibold text-indigo-400">{dueCount}</span>
          </div>
          <div className="glass-card rounded-xl px-3 py-1.5 text-sm">
            <span className="text-slate-400">Today: </span>
            <span className="font-semibold text-emerald-400">{todayCount}</span>
          </div>
        </div>
        <button
          id="btn-next-word"
          onClick={pickNextWord}
          className="glass-card rounded-xl p-2.5 hover:bg-white/10 active:scale-95 transition-all"
          title="Next word"
        >
          <IconRefresh size={18} className="text-slate-400" />
        </button>
      </div>

      {/* Main Hanzi Card */}
      <div className="glass-card-elevated rounded-3xl p-8 relative overflow-hidden ambient-glow">
        {/* Review feedback flash */}
        {reviewFeedback && (
          <div className="absolute inset-0 flex items-center justify-center z-20 animate-scale-in">
            <div className="text-3xl font-bold text-white/80 bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-4">
              {reviewFeedback}
            </div>
          </div>
        )}

        {/* Level Badge & Mastery */}
        <div className="flex items-center justify-between mb-6">
          <HskBadge level={currentWord.level} size="md" />
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                style={{ width: `${mastery * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-400">{Math.round(mastery * 100)}%</span>
          </div>
        </div>

        {/* Hanzi Display */}
        <div className="text-center mb-6">
          <div
            className={`font-hanzi font-bold hanzi-shadow cursor-pointer transition-all duration-500 select-none
              ${blurStates.hanzi ? 'blur-reveal' : ''}`}
            style={{ fontSize: 'clamp(4rem, 15vw, 8rem)', lineHeight: 1.1 }}
            onClick={() => {
              if (blurStates.hanzi) toggleBlur('hanzi');
              speak(currentWord.hanzi);
            }}
          >
            {currentWord.hanzi}
          </div>

          {settings.showTraditional && currentWord.traditional !== currentWord.hanzi && (
            <div className="text-lg text-slate-500 mt-1 font-hanzi">
              ({currentWord.traditional})
            </div>
          )}
        </div>

        {/* Pinyin */}
        <div className="text-center mb-3">
          <span
            className={`text-2xl font-medium text-indigo-300 cursor-pointer select-none transition-all duration-400
              ${blurStates.pinyin ? 'blur-reveal' : ''}`}
            onClick={() => blurStates.pinyin && toggleBlur('pinyin')}
          >
            {currentWord.pinyin}
          </span>
        </div>

        {/* Meaning */}
        <div className="text-center mb-2">
          <p
            className={`text-lg text-slate-300 cursor-pointer select-none transition-all duration-400
              ${blurStates.meaning ? 'blur-reveal' : ''}`}
            onClick={() => blurStates.meaning && toggleBlur('meaning')}
          >
            {currentWord.meaning}
          </p>
          {settings.showIndonesian && (
            <p
              className={`text-sm text-slate-500 mt-1 cursor-pointer select-none transition-all duration-400
                ${blurStates.meaning ? 'blur-reveal' : ''}`}
              onClick={() => blurStates.meaning && toggleBlur('meaning')}
            >
              {currentWord.meaningId}
            </p>
          )}
        </div>

        {/* Audio Button */}
        <div className="flex justify-center mt-4">
          <button
            id="btn-speak"
            onClick={() => speak(currentWord.hanzi)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 active:scale-95 transition-all border border-indigo-500/20"
          >
            <IconVolume size={18} />
            <span className="text-sm font-medium">Listen</span>
          </button>
        </div>

        {/* Blur toggle indicator */}
        <div className="flex justify-center mt-3 gap-2">
          {(['hanzi', 'pinyin', 'meaning'] as const).map(field => (
            <button
              key={field}
              onClick={() => toggleBlur(field)}
              className={`text-xs px-2 py-1 rounded-lg transition-all ${
                blurStates[field]
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-white/5 text-slate-500 border border-transparent'
              }`}
            >
              {blurStates[field] ? <IconEyeOff size={12} /> : <IconEye size={12} />}
              <span className="ml-1 capitalize">{field}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SRS Review Buttons */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(SRS_LABELS).map(([key, { label, quality, color, icon }]) => (
          <button
            key={key}
            id={`btn-srs-${label.toLowerCase()}`}
            onClick={() => handleReview(quality)}
            className="glass-card rounded-2xl py-4 px-2 text-center hover:bg-white/10 active:scale-[0.96] transition-all group"
          >
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform" style={{ color }}>
              {icon}
            </div>
            <div className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
              {label}
            </div>
          </button>
        ))}
      </div>

      {/* Expandable Details */}
      <button
        id="btn-toggle-details"
        onClick={() => setShowDetails(!showDetails)}
        className="w-full glass-card rounded-2xl py-3 px-4 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all flex items-center justify-between"
      >
        <span>Collocations & Examples</span>
        <span className={`transition-transform duration-300 ${showDetails ? 'rotate-90' : ''}`}>→</span>
      </button>

      {showDetails && (
        <div className="glass-card rounded-2xl p-5 space-y-4 animate-slide-up">
          {/* Collocations */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Collocations</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{currentWord.collocations}</p>
          </div>

          {/* Nuances (HSK 4+) */}
          {currentWord.nuances && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">辨析 Nuances</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{currentWord.nuances}</p>
            </div>
          )}

          {/* Components (HSK 4+) */}
          {currentWord.components && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Components</h4>
              <p className="text-sm text-indigo-300">{currentWord.components}</p>
            </div>
          )}

          {/* Example Sentences */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Example Sentences</h4>
            {currentWord.sentences.map((s, i) => (
              <div key={i} className="mb-3 last:mb-0 p-3 rounded-xl bg-white/5">
                <button
                  onClick={() => speak(s.zh, 0.8)}
                  className="flex items-start gap-2 text-left w-full group"
                >
                  <IconVolume size={14} className="text-slate-500 mt-1 flex-shrink-0 group-hover:text-indigo-400 transition-colors" />
                  <div>
                    <p className="text-sm font-hanzi text-slate-200">{s.zh}</p>
                    <p className="text-xs text-indigo-400 mt-0.5">{s.pinyin}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{s.en}</p>
                    {settings.showIndonesian && (
                      <p className="text-xs text-slate-500 mt-0.5">{s.id}</p>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
