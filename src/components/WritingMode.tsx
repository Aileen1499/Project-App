import { useState, useRef, useEffect, useCallback } from 'react';
import type { HskWord } from '../data/hskMasterData';
import { getWordsByLevels } from '../data/hskMasterData';
import { HskBadge, IconVolume, IconRefresh, IconEye, IconEyeOff } from './shared';

interface WritingModeProps {
  selectedLevels: number[];
  speak: (text: string, rate?: number) => void;
}

type PracticeMode = 'trace' | 'free';

export default function WritingMode({ selectedLevels, speak }: WritingModeProps) {
  const [currentWord, setCurrentWord] = useState<HskWord | null>(null);
  const [mode, setMode] = useState<PracticeMode>('trace');
  const [showGuide, setShowGuide] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const pickWord = useCallback(() => {
    const pool = getWordsByLevels(selectedLevels.length > 0 ? selectedLevels : [1]);
    if (pool.length > 0) {
      // Pick single-character words preferentially for writing practice
      const single = pool.filter(w => w.hanzi.length === 1);
      const choicePool = single.length > 0 ? single : pool;
      setCurrentWord(choicePool[Math.floor(Math.random() * choicePool.length)]);
      setHasDrawn(false);
      clearCanvas();
    }
  }, [selectedLevels]);

  useEffect(() => {
    pickWord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLevels]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawn(false);
  };

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * e.currentTarget.width,
      y: ((e.clientY - rect.top) / rect.height) * e.currentTarget.height,
    };
  };

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    lastPos.current = getPos(e);
    setHasDrawn(true);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPos.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(129, 140, 248, 0.9)';
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  if (!currentWord) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">No words available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold gradient-text">Writing Practice</h2>
        <button
          id="btn-next-writing"
          onClick={pickWord}
          className="glass-card rounded-xl p-2.5 hover:bg-white/10 active:scale-95 transition-all"
          title="Next word"
        >
          <IconRefresh size={18} className="text-slate-400" />
        </button>
      </div>

      {/* Word info card */}
      <div className="glass-card-elevated rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <HskBadge level={currentWord.level} size="md" />
          <div className="flex gap-2">
            <button
              onClick={() => setMode('trace')}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                mode === 'trace'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-white/5 text-slate-500 border border-transparent hover:bg-white/10'
              }`}
            >
              Trace Mode
            </button>
            <button
              onClick={() => setMode('free')}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                mode === 'free'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-white/5 text-slate-500 border border-transparent hover:bg-white/10'
              }`}
            >
              Free Write
            </button>
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-3">
            <span className="font-hanzi font-bold hanzi-shadow text-5xl">{currentWord.hanzi}</span>
            <button
              onClick={() => speak(currentWord.hanzi)}
              className="p-2 rounded-xl hover:bg-white/10 active:scale-90 transition-all"
            >
              <IconVolume size={20} className="text-indigo-400" />
            </button>
          </div>
          <p className="text-lg text-indigo-300 mt-2">{currentWord.pinyin}</p>
          <p className="text-sm text-slate-400 mt-1">{currentWord.meaning}</p>
        </div>

        {/* Canvas */}
        <div className="relative">
          <div className="relative w-full max-w-xs mx-auto aspect-square rounded-2xl overflow-hidden border border-white/10 bg-slate-900/50">
            {/* Guide character (ghost) */}
            {mode === 'trace' && showGuide && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span
                  className="font-hanzi text-slate-600/40 select-none"
                  style={{ fontSize: '10rem', lineHeight: 1 }}
                >
                  {currentWord.hanzi}
                </span>
              </div>
            )}

            {/* Tian-zi-ge grid lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200">
              <line x1="100" y1="0" x2="100" y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="6 4" />
              <line x1="0" y1="100" x2="200" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="6 4" />
              <line x1="0" y1="0" x2="200" y2="200" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 6" />
              <line x1="200" y1="0" x2="0" y2="200" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 6" />
            </svg>

            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
              onPointerDown={startDraw}
              onPointerMove={draw}
              onPointerUp={endDraw}
              onPointerLeave={endDraw}
            />
          </div>

          {/* Canvas controls */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              id="btn-clear-canvas"
              onClick={clearCanvas}
              className="btn-ghost text-sm"
            >
              Clear
            </button>
            <button
              id="btn-toggle-guide"
              onClick={() => setShowGuide(!showGuide)}
              className="btn-ghost text-sm inline-flex items-center gap-1.5"
            >
              {showGuide ? <IconEye size={14} /> : <IconEyeOff size={14} />}
              {showGuide ? 'Hide Guide' : 'Show Guide'}
            </button>
            <button
              onClick={() => speak(currentWord.hanzi)}
              className="btn-ghost text-sm"
            >
              Listen
            </button>
          </div>
        </div>
      </div>

      {/* Reference card */}
      <div className="glass-card rounded-2xl p-5 space-y-3">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reference</h4>
        {currentWord.traditional !== currentWord.hanzi && (
          <p className="text-sm text-slate-300">
            <span className="text-slate-500">Traditional: </span>
            <span className="font-hanzi">{currentWord.traditional}</span>
          </p>
        )}
        {currentWord.components && (
          <p className="text-sm text-indigo-300">{currentWord.components}</p>
        )}
        <p className="text-sm text-slate-400 leading-relaxed">{currentWord.collocations}</p>
        <div className="pt-2 border-t border-white/5">
          <p className="text-sm font-hanzi text-slate-200">{currentWord.sentences[0].zh}</p>
          <p className="text-xs text-slate-500 mt-1">{currentWord.sentences[0].pinyin}</p>
          <p className="text-xs text-slate-400">{currentWord.sentences[0].en}</p>
        </div>
      </div>
    </div>
  );
}
