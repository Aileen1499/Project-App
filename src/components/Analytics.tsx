import { useMemo } from 'react';
import { HSK_LEVELS, hskMasterData, getWordsByLevels } from '../data/hskMasterData';
import type { SrsCard } from '../engine/srsEngine';
import { getMasteryLevel, loadDailyStats } from '../engine/srsEngine';
import { ProgressRing } from './shared';

interface AnalyticsProps {
  srsCards: Record<string, SrsCard>;
}

export default function Analytics({ srsCards }: AnalyticsProps) {
  const stats = useMemo(() => loadDailyStats(), []);

  const overallStats = useMemo(() => {
    const total = hskMasterData.length;
    const reviewed = Object.keys(srsCards).length;
    const mastered = Object.values(srsCards).filter(c => getMasteryLevel(c) > 0.8).length;
    const learning = Object.values(srsCards).filter(c => {
      const m = getMasteryLevel(c);
      return m > 0 && m <= 0.8;
    }).length;
    return { total, reviewed, mastered, learning, unreviewed: total - reviewed };
  }, [srsCards]);

  const levelStats = useMemo(() => {
    return HSK_LEVELS.map(l => {
      const words = getWordsByLevels([l.level]);
      const reviewed = words.filter(w => srsCards[w.id]).length;
      const mastery = words.reduce((sum, w) => {
        const card = srsCards[w.id];
        return sum + (card ? getMasteryLevel(card) : 0);
      }, 0) / (words.length || 1);
      return { ...l, reviewed, totalInData: words.length, mastery };
    });
  }, [srsCards]);

  const recentStats = useMemo(() => {
    const last7 = stats.slice(-7);
    const totalReviewed = last7.reduce((s, d) => s + d.reviewed, 0);
    const totalCorrect = last7.reduce((s, d) => s + d.correct, 0);
    const totalNew = last7.reduce((s, d) => s + d.newLearned, 0);
    return { totalReviewed, totalCorrect, totalNew, days: last7 };
  }, [stats]);

  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (stats.find(s => s.date === dateStr && s.reviewed > 0)) {
        count++;
      } else if (i > 0) {
        break;
      }
    }
    return count;
  }, [stats]);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-display font-bold gradient-text">Analytics</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Words" value={overallStats.total} icon="📚" color="indigo" />
        <StatCard label="Reviewed" value={overallStats.reviewed} icon="✅" color="emerald" />
        <StatCard label="Mastered" value={overallStats.mastered} icon="⭐" color="amber" />
        <StatCard label="Streak" value={`${streak}d`} icon="🔥" color="rose" />
      </div>

      {/* 7-Day Summary */}
      <div className="glass-card-elevated rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Last 7 Days</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-indigo-400">{recentStats.totalReviewed}</div>
            <div className="text-xs text-slate-500 mt-1">Reviews</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">{recentStats.totalCorrect}</div>
            <div className="text-xs text-slate-500 mt-1">Correct</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">{recentStats.totalNew}</div>
            <div className="text-xs text-slate-500 mt-1">New Words</div>
          </div>
        </div>

        {/* Mini Activity Chart */}
        <div className="mt-5 flex items-end gap-1.5 h-16 justify-center">
          {recentStats.days.map((day, i) => {
            const maxReviews = Math.max(...recentStats.days.map(d => d.reviewed), 1);
            const h = Math.max((day.reviewed / maxReviews) * 100, 4);
            const dayLabel = new Date(day.date).toLocaleDateString('en', { weekday: 'short' }).slice(0, 2);
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-6 rounded-t-md bg-gradient-to-t from-indigo-600 to-purple-500 transition-all duration-500"
                  style={{ height: `${h}%` }}
                  title={`${day.date}: ${day.reviewed} reviews`}
                />
                <span className="text-[10px] text-slate-600">{dayLabel}</span>
              </div>
            );
          })}
          {recentStats.days.length === 0 && (
            <p className="text-sm text-slate-600">No activity yet</p>
          )}
        </div>
      </div>

      {/* HSK Level Mastery Rings */}
      <div className="glass-card-elevated rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">Mastery by Level</h3>
        <div className="grid grid-cols-3 gap-4">
          {levelStats.map(l => (
            <div key={l.level} className="flex flex-col items-center gap-2">
              <ProgressRing
                progress={l.mastery}
                size={72}
                strokeWidth={5}
                color={l.color}
              >
                <span className="text-lg font-bold" style={{ color: l.color }}>
                  {Math.round(l.mastery * 100)}%
                </span>
              </ProgressRing>
              <div className="text-center">
                <div className="text-xs font-semibold" style={{ color: l.color }}>HSK {l.level}</div>
                <div className="text-[10px] text-slate-500">{l.reviewed}/{l.totalInData}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Breakdown */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Progress Breakdown</h3>
        <div className="space-y-3">
          {levelStats.map(l => (
            <div key={l.level} className="flex items-center gap-3">
              <span className="text-xs font-semibold w-12" style={{ color: l.color }}>
                HSK {l.level}
              </span>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${l.mastery * 100}%`, backgroundColor: l.color }}
                />
              </div>
              <span className="text-xs text-slate-500 w-10 text-right">
                {Math.round(l.mastery * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  const colorMap: Record<string, string> = {
    indigo: 'from-indigo-500/10 to-indigo-500/5 border-indigo-500/15',
    emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/15',
    amber: 'from-amber-500/10 to-amber-500/5 border-amber-500/15',
    rose: 'from-rose-500/10 to-rose-500/5 border-rose-500/15',
  };
  const textColorMap: Record<string, string> = {
    indigo: 'text-indigo-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
  };

  return (
    <div className={`rounded-2xl p-4 bg-gradient-to-br ${colorMap[color]} border`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg">{icon}</span>
      </div>
      <div className={`text-2xl font-bold ${textColorMap[color]}`}>{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
  );
}
