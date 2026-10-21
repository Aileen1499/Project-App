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

  const downloadWallpaper = () => {
    if (!dailyWord) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
    bgGrad.addColorStop(0, '#0a0f1d');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Subtle Radial Glow behind Hanzi
    const radGlow = ctx.createRadialGradient(540, 800, 20, 540, 800, 450);
    radGlow.addColorStop(0, 'rgba(99, 102, 241, 0.28)');
    radGlow.addColorStop(0.5, 'rgba(168, 85, 247, 0.12)');
    radGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radGlow;
    ctx.fillRect(0, 350, 1080, 900);

    // Header Date & Subtitle
    ctx.textAlign = 'center';
    ctx.fillStyle = '#818cf8';
    ctx.font = '600 32px sans-serif';
    ctx.fillText('HANZIGO • KATA MANDARIN HARI INI', 540, 360);

    const dateStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 28px sans-serif';
    ctx.fillText(dateStr, 540, 415);

    // HSK Badge Pill
    const badgeText = `HSK ${dailyWord.level}`;
    ctx.fillStyle = 'rgba(99, 102, 241, 0.25)';
    ctx.beginPath();
    ctx.roundRect(440, 460, 200, 56, 28);
    ctx.fill();
    ctx.strokeStyle = 'rgba(129, 140, 248, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#a5b4fc';
    ctx.font = '700 26px sans-serif';
    ctx.fillText(badgeText, 540, 498);

    // Main Hanzi
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 260px "Noto Sans SC", sans-serif';
    ctx.shadowColor = 'rgba(129, 140, 248, 0.5)';
    ctx.shadowBlur = 40;
    ctx.fillText(dailyWord.hanzi, 540, 820);
    ctx.shadowBlur = 0; // reset

    // Pinyin
    ctx.fillStyle = '#c084fc';
    ctx.font = '600 64px sans-serif';
    ctx.fillText(dailyWord.pinyin, 540, 930);

    // Meaning (Indonesian)
    ctx.fillStyle = '#f8fafc';
    ctx.font = '500 48px sans-serif';
    ctx.fillText(dailyWord.meaningId || dailyWord.meaning, 540, 1010);

    if (dailyWord.meaning && dailyWord.meaningId && dailyWord.meaning !== dailyWord.meaningId) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '400 32px sans-serif';
      ctx.fillText(dailyWord.meaning, 540, 1070);
    }

    // Sentence Card Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.roundRect(100, 1170, 880, 360, 32);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#6366f1';
    ctx.font = '700 24px sans-serif';
    ctx.fillText('CONTOH KALIMAT', 540, 1235);

    const sentence = dailyWord.sentences && dailyWord.sentences[0]
      ? dailyWord.sentences[0]
      : { zh: `这是“${dailyWord.hanzi}”。`, pinyin: `Zhè shì "${dailyWord.pinyin}".`, id: `Ini adalah "${dailyWord.meaningId}".` };

    ctx.fillStyle = '#f1f5f9';
    ctx.font = '500 44px "Noto Sans SC", sans-serif';
    ctx.fillText(sentence.zh, 540, 1315);

    ctx.fillStyle = '#818cf8';
    ctx.font = '400 32px sans-serif';
    ctx.fillText(sentence.pinyin, 540, 1380);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 30px sans-serif';
    ctx.fillText(sentence.id, 540, 1445);

    // Watermark footer
    ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.font = '400 24px sans-serif';
    ctx.fillText('Hanzigo • Lockscreen Word Card', 540, 1780);

    // Download Image
    const link = document.createElement('a');
    link.download = `hanzigo-lockscreen-${dailyWord.hanzi}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

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

      {/* Lockscreen Wallpaper Download Button */}
      <button
        id="btn-download-lockscreen"
        onClick={downloadWallpaper}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer"
      >
        <span className="text-lg">📱</span>
        <span className="font-semibold text-sm">Download Wallpaper Lockscreen (HD)</span>
      </button>

      {/* Mobile & Lockscreen Tip */}
      <div className="glass-card rounded-2xl p-4 text-xs space-y-2 border border-indigo-500/20">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
          <span>✨</span>
          <span>Tips Akses di HP (Lockscreen & App)</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          1. <strong>Muncul di Lockscreen HP:</strong> Download gambar di atas, lalu atur sebagai <em>Wallpaper Layar Kunci (Lock Screen)</em> di galeri HP kamu.
        </p>
        <p className="text-slate-400 leading-relaxed">
          2. <strong>Buka Seperti Aplikasi:</strong> Di browser HP (Safari iOS atau Chrome Android), tekan tombol <strong>Bagikan (Share)</strong> lalu pilih <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>.
        </p>
      </div>
    </div>
  );
}
