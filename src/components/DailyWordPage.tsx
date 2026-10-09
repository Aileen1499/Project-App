import { useState, useMemo } from 'react';
import { getWordsByLevels } from '../data/hskMasterData';
import { HskBadge, IconRefresh, IconVolume } from './shared';

interface DailyWordPageProps {
  selectedLevels: number[];
  speak: (text: string, rate?: number) => void;
}

function getDaySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export default function DailyWordPage({ selectedLevels, speak }: DailyWordPageProps) {
  const [shuffleKey, setShuffleKey] = useState(0);
  const [revealed, setRevealed] = useState({ pinyin: true, meaning: true });

  const pool = useMemo(() => {
    const levels = selectedLevels.length > 0 ? selectedLevels : [1];
    return getWordsByLevels(levels);
  }, [selectedLevels]);

  // Deterministic pick: same word for everyone on the same day
  const dailyWord = useMemo(() => {
    const seed = getDaySeed();
    return pool[seed % pool.length];
  }, [pool]);

  // Shuffle which card shows which field
  const shuffled = useMemo(() => {
    const fields = [
      { key: 'hanzi', label: 'Shengci', value: dailyWord.hanzi },
      { key: 'pinyin', label: 'Pinyin', value: dailyWord.pinyin },
      { key: 'meaning', label: 'Arti', value: dailyWord.meaning },
    ];
    // Fisher-Yates with shuffleKey as seed
    const arr = [...fields];
    let s = shuffleKey + 1;
    for (let i = arr.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor((s / 233280) * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [dailyWord, shuffleKey]);

  if (!dailyWord) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="text-slate-500">No words available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold gradient-text">Daily Word</h2>
          <p className="text-xs text-slate-500 mt-1">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setShuffleKey(k => k + 1)}
          className="glass-card rounded-xl p-2.5 hover:bg-white/10 active:scale-95 transition-all"
          title="Shuffle"
        >
          <IconRefresh size={18} className="text-slate-400" />
        </button>
      </div>

      {/* Main word card */}
      <div className="glass-card-elevated rounded-3xl p-8 text-center relative overflow-hidden">
        <div className="ambient-glow">
          <HskBadge level={dailyWord.level} size="md" />
          <div className="font-hanzi font-bold hanzi-shadow text-7xl my-4">{dailyWord.hanzi}</div>
          <button
            onClick={() => speak(dailyWord.hanzi)}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <IconVolume size={14} /> Dengar
          </button>
        </div>
      </div>

      {/* Shuffled info cards */}
      <div className="grid grid-cols-3 gap-3">
        {shuffled.map(field => (
          <div key={field.key} className="glass-card rounded-2xl p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{field.label}</p>
            {field.key === 'hanzi' ? (
              <p className="font-hanzi text-lg font-bold">{field.value}</p>
            ) : field.key === 'pinyin' ? (
              <p className="text-sm text-indigo-300 font-medium">
                {revealed.pinyin ? field.value : '•••'}
              </p>
            ) : (
              <p className="text-sm text-slate-300">
                {revealed.meaning ? field.value : '•••'}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Reveal toggles */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setRevealed(r => ({ ...r, pinyin: !r.pinyin }))}
          className={`nav-pill ${revealed.pinyin ? 'active' : ''}`}
        >
          Pinyin
        </button>
        <button
          onClick={() => setRevealed(r => ({ ...r, meaning: !r.meaning }))}
          className={`nav-pill ${revealed.meaning ? 'active' : ''}`}
        >
          Arti
        </button>
      </div>

      {/* Sentence example */}
      <div className="glass-card rounded-2xl p-5 space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contoh</p>
        <p className="font-hanzi text-lg text-slate-200">{dailyWord.sentences[0].zh}</p>
        <p className="text-sm text-indigo-300">{dailyWord.sentences[0].pinyin}</p>
        <p className="text-sm text-slate-400">{dailyWord.sentences[0].id}</p>
      </div>
    </div>
  );
}
