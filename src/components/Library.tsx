import { useState, useMemo } from 'react';
import { hskMasterData, HSK_LEVELS } from '../data/hskMasterData';
import type { HskWord } from '../data/hskMasterData';
import type { SrsCard } from '../engine/srsEngine';
import { getMasteryLevel } from '../engine/srsEngine';
import { HskBadge, IconSearch, IconVolume, ProgressRing } from './shared';

interface LibraryProps {
  srsCards: Record<string, SrsCard>;
  speak: (text: string, rate?: number) => void;
  showIndonesian: boolean;
}

export default function Library({ srsCards, speak, showIndonesian }: LibraryProps) {
  const [filterLevel, setFilterLevel] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState(60);

  const handleLevelChange = (lvl: number | null) => {
    setFilterLevel(lvl);
    setDisplayLimit(60);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setDisplayLimit(60);
  };

  const filteredWords = useMemo(() => {
    let words = hskMasterData;
    if (filterLevel) {
      words = words.filter(w => w.level === filterLevel);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      words = words.filter(w =>
        w.hanzi.includes(q) ||
        (w.traditional && w.traditional.includes(q)) ||
        w.pinyin.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q) ||
        (w.meaningId && w.meaningId.toLowerCase().includes(q))
      );
    }
    return words;
  }, [filterLevel, searchQuery]);

  const levelCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    hskMasterData.forEach(w => {
      counts[w.level] = (counts[w.level] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-display font-bold gradient-text">Word Library</h2>

      {/* Search Bar */}
      <div className="relative">
        <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input
          id="library-search"
          type="text"
          placeholder="Search hanzi, pinyin, or meaning..."
          value={searchQuery}
          onChange={e => handleSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl glass-card bg-transparent border-0 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
        />
      </div>

      {/* Level Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <button
          onClick={() => handleLevelChange(null)}
          className={`nav-pill whitespace-nowrap flex-shrink-0 ${filterLevel === null ? 'active' : ''}`}
        >
          All ({hskMasterData.length})
        </button>
        {HSK_LEVELS.map(l => (
          <button
            key={l.level}
            onClick={() => handleLevelChange(filterLevel === l.level ? null : l.level)}
            className={`nav-pill whitespace-nowrap flex-shrink-0 ${filterLevel === l.level ? 'active' : ''}`}
          >
            HSK {l.level} ({levelCounts[l.level] || 0})
          </button>
        ))}
      </div>

      {/* Word Count */}
      <div className="text-sm text-slate-500 flex items-center justify-between">
        <span>Showing {Math.min(filteredWords.length, displayLimit)} of {filteredWords.length} words</span>
        {displayLimit < filteredWords.length && (
          <span className="text-xs text-indigo-400 font-medium">HSK 3.0 Complete</span>
        )}
      </div>

      {/* Word List */}
      <div className="space-y-2">
        {filteredWords.slice(0, displayLimit).map(word => (
          <WordCard
            key={word.id}
            word={word}
            card={srsCards[word.id]}
            isExpanded={expandedId === word.id}
            onToggle={() => setExpandedId(expandedId === word.id ? null : word.id)}
            speak={speak}
            showIndonesian={showIndonesian}
          />
        ))}
      </div>

      {filteredWords.length > displayLimit && (
        <div className="pt-2 text-center">
          <button
            onClick={() => setDisplayLimit(prev => prev + 60)}
            className="w-full py-3.5 px-4 rounded-2xl glass-card font-medium text-sm text-indigo-300 hover:text-white hover:bg-white/10 active:scale-[0.98] transition-all border border-indigo-500/20"
          >
            Tampilkan Lebih Banyak (+60) — Masih ada {filteredWords.length - displayLimit} kosakata
          </button>
        </div>
      )}

      {filteredWords.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-slate-500">No words found matching your search</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────
// Individual Word Card
// ─────────────────────────────
function WordCard({
  word,
  card,
  isExpanded,
  onToggle,
  speak,
  showIndonesian,
}: {
  word: HskWord;
  card?: SrsCard;
  isExpanded: boolean;
  onToggle: () => void;
  speak: (text: string, rate?: number) => void;
  showIndonesian: boolean;
}) {
  const mastery = card ? getMasteryLevel(card) : 0;
  const masteryColor = mastery > 0.7 ? '#22c55e' : mastery > 0.3 ? '#f59e0b' : '#64748b';

  return (
    <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/[0.06]">
      {/* Header Row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        {/* Mastery Ring */}
        <ProgressRing progress={mastery} size={44} strokeWidth={3} color={masteryColor}>
          <span className="text-xl font-hanzi font-bold">{word.hanzi}</span>
        </ProgressRing>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-medium text-indigo-300">{word.pinyin}</span>
            <HskBadge level={word.level} />
          </div>
          <p className="text-sm text-slate-400 truncate">{word.meaning}</p>
          {showIndonesian && (
            <p className="text-xs text-slate-600 truncate">{word.meaningId}</p>
          )}
        </div>

        {/* Audio */}
        <button
          onClick={e => { e.stopPropagation(); speak(word.hanzi); }}
          className="p-2 rounded-lg hover:bg-white/10 active:scale-90 transition-all flex-shrink-0"
        >
          <IconVolume size={16} className="text-slate-500" />
        </button>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 space-y-3 animate-slide-up border-t border-white/5">
          <div className="pt-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Collocations</span>
            <p className="text-sm text-slate-300 mt-1">{word.collocations}</p>
          </div>

          {word.components && (
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Components</span>
              <p className="text-sm text-indigo-300 mt-1">{word.components}</p>
            </div>
          )}

          {word.nuances && (
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">辨析 Nuances</span>
              <p className="text-sm text-slate-300 mt-1">{word.nuances}</p>
            </div>
          )}

          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Examples</span>
            {word.sentences.map((s, i) => (
              <div key={i} className="mt-2 p-2.5 rounded-xl bg-white/5">
                <button onClick={() => speak(s.zh, 0.8)} className="text-left w-full group">
                  <p className="text-sm font-hanzi text-slate-200 group-hover:text-white transition-colors">{s.zh}</p>
                  <p className="text-xs text-indigo-400 mt-0.5">{s.pinyin}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.en}</p>
                  {showIndonesian && <p className="text-xs text-slate-500 mt-0.5">{s.id}</p>}
                </button>
              </div>
            ))}
          </div>

          {card && (
            <div className="flex gap-4 pt-2 text-xs text-slate-500">
              <span>Reviews: {card.totalReviews}</span>
              <span>Accuracy: {card.totalReviews > 0 ? Math.round(card.correctReviews / card.totalReviews * 100) : 0}%</span>
              <span>Interval: {card.interval}d</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
