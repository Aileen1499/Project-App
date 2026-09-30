import { useMemo } from 'react';
import type { HskWord } from '../data/hskMasterData';
import { hskMasterData, getWordsByLevels, HSK_LEVELS } from '../data/hskMasterData';
import type { SrsCard, AppSettings } from '../engine/srsEngine';
import { getMasteryLevel } from '../engine/srsEngine';
import { ProgressRing, HskBadge, IconVolume, IconRefresh } from './shared';
import { loadDailyStats, getStreakFromStats } from '../engine/srsEngine';

interface ProfileProps {
  settings: AppSettings;
  srsCards: Record<string, SrsCard>;
  getMasteryByLevel: (level: number) => number;
}

interface MemoryBucket {
  label: string;
  color: string;
  bg: string;
  border: string;
  words: HskWord[];
}

export default function Profile({ settings, srsCards, getMasteryByLevel }: ProfileProps) {
  const stats = loadDailyStats();
  const { current: streak, longest } = getStreakFromStats(stats);
  const todayStats = stats.find(s => s.date === new Date().toISOString().split('T')[0]);
  const todayReviewed = todayStats?.reviewed ?? 0;

  // Categorise all studied words by SRS memory state
  const buckets = useMemo((): MemoryBucket[] => {
    const allWords = hskMasterData;
    const red: HskWord[] = [];
    const yellow: HskWord[] = [];
    const green: HskWord[] = [];

    for (const w of allWords) {
      const card = srsCards[w.id];
      if (!card) continue; // unseen
      const mastery = getMasteryLevel(card);
      if (mastery >= 0.7) green.push(w);
      else if (mastery >= 0.35) yellow.push(w);
      else red.push(w);
    }

    return [
      { label: 'Still Learning', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', words: red },
      { label: 'Almost There', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', words: yellow },
      { label: 'Learned', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', words: green },
    ];
  }, [srsCards]);

  const totalReviewed = Object.keys(srsCards).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-display font-bold gradient-text">Your Profile</h2>

      {/* Stats overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="text-3xl mb-1">🔥</div>
          <div className="text-2xl font-bold text-orange-400">{streak}</div>
          <div className="text-xs text-slate-500">Day Streak</div>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="text-3xl mb-1">📚</div>
          <div className="text-2xl font-bold text-indigo-400">{totalReviewed}</div>
          <div className="text-xs text-slate-500">Words Seen</div>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="text-3xl mb-1">⭐</div>
          <div className="text-2xl font-bold text-purple-400">{longest}</div>
          <div className="text-xs text-slate-500">Best Streak</div>
        </div>
      </div>

      {/* HSK Level Progress Rings */}
      <div className="glass-card-elevated rounded-3xl p-6">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-5">Level Progress</h3>
        <div className="grid grid-cols-3 gap-6">
          {HSK_LEVELS.map(level => {
            const pct = Math.round(getMasteryByLevel(level.level) * 100);
            return (
              <div key={level.level} className="flex flex-col items-center gap-2">
                <ProgressRing
                  progress={pct / 100}
                  size={72}
                  strokeWidth={5}
                  color={level.color}
                >
                  <span className="text-sm font-bold text-slate-200">{pct}%</span>
                </ProgressRing>
                <HskBadge level={level.level} size="sm" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Memory Status Overview */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Memory Status</h3>
        {buckets.map(bucket => (
          <div key={bucket.label} className={`glass-card rounded-2xl p-4 border ${bucket.border}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${bucket.bg.replace('/10', '')}`} />
                <span className={`text-sm font-semibold ${bucket.color}`}>{bucket.label}</span>
              </div>
              <span className="text-xs text-slate-500">{bucket.words.length} words</span>
            </div>
            {bucket.words.length === 0 ? (
              <p className="text-xs text-slate-600">No words in this category yet.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {bucket.words.slice(0, 20).map(w => (
                  <span
                    key={w.id}
                    className="font-hanzi text-sm px-2 py-0.5 rounded-lg bg-white/5 text-slate-300"
                  >
                    {w.hanzi}
                  </span>
                ))}
                {bucket.words.length > 20 && (
                  <span className="text-xs text-slate-500 px-2 py-0.5">
                    +{bucket.words.length - 20} more
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Weekly Activity */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">This Week</h3>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dateStr = d.toISOString().split('T')[0];
            const dayStats = stats.find(s => s.date === dateStr);
            const count = dayStats?.reviewed ?? 0;
            const maxBar = 20;
            const height = count > 0 ? Math.max(12, (count / maxBar) * 100) : 0;
            const dayLabel = d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2);

            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[9px] text-slate-600">{dayLabel}</span>
                <div className="w-full h-16 flex items-end justify-center">
                  <div
                    className={`w-full rounded-t transition-all duration-500 ${
                      count > 0 ? 'bg-indigo-500/60' : 'bg-white/5'
                    }`}
                    style={{ height: count > 0 ? `${Math.max(12, (count / maxBar) * 100)}%` : '4px' }}
                  />
                </div>
                <span className="text-[9px] text-slate-600">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
