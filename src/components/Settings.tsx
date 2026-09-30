import { useState } from 'react';
import type { AppSettings } from '../engine/srsEngine';
import { HSK_LEVELS } from '../data/hskMasterData';
import { hskMasterData } from '../data/hskMasterData';

interface SettingsProps {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  onClose: () => void;
}

export default function Settings({ settings, updateSettings, onClose }: SettingsProps) {
  const [tab, setTab] = useState<'levels' | 'preferences'>('levels');

  const toggleLevel = (level: number) => {
    const current = settings.selectedLevels;
    const next = current.includes(level)
      ? current.filter(l => l !== level)
      : [...current, level].sort((a, b) => a - b);
    if (next.length === 0) return; // must have at least one
    updateSettings({ selectedLevels: next });
  };

  const levelCount = (level: number) => hskMasterData.filter(w => w.level === level).length;

  const clearAll = () => {
    if (confirm('Clear all SRS progress, stats, and settings? This cannot be undone.')) {
      localStorage.removeItem('hanzi-daily-srs');
      localStorage.removeItem('hanzi-daily-stats');
      localStorage.removeItem('hanzi-daily-settings');
      location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full max-w-lg glass-card-elevated rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto custom-scrollbar safe-bottom">
        {/* Header */}
        <div className="sticky top-0 z-10 glass-card-elevated px-5 py-4 flex items-center justify-between border-b border-white/5 rounded-t-3xl">
          <h2 className="text-lg font-bold font-display text-slate-200">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 active:scale-90 transition-all text-slate-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-5 py-3">
          <button onClick={() => setTab('levels')} className={`nav-pill ${tab === 'levels' ? 'active' : ''}`}>
            HSK Levels
          </button>
          <button onClick={() => setTab('preferences')} className={`nav-pill ${tab === 'preferences' ? 'active' : ''}`}>
            Preferences
          </button>
        </div>

        <div className="px-5 pb-6 space-y-6">
          {tab === 'levels' && (
            <>
              <div>
                <p className="text-sm text-slate-400 mb-3">
                  Select which HSK levels to study. Words from selected levels appear in your review queue.
                </p>
                <div className="space-y-2">
                  {HSK_LEVELS.map(l => {
                    const selected = settings.selectedLevels.includes(l.level);
                    const count = levelCount(l.level);
                    return (
                      <button
                        key={l.level}
                        onClick={() => toggleLevel(l.level)}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all ${
                          selected
                            ? 'bg-indigo-500/10 border border-indigo-500/30'
                            : 'glass-card border-transparent hover:bg-white/5'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all ${
                            selected ? 'bg-indigo-500 text-white' : 'bg-white/10 text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-semibold" style={{ color: selected ? l.color : undefined }}>
                            {l.name} — {l.label}
                          </div>
                          <div className="text-xs text-slate-500">{count} words available</div>
                        </div>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {tab === 'preferences' && (
            <>
              {/* Theme */}
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">Theme</label>
                <div className="flex gap-2">
                  {(['dark', 'light', 'auto'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => updateSettings({ theme: t })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                        settings.theme === t
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'glass-card text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blur Mode */}
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">Blur Mode</label>
                <p className="text-xs text-slate-500 mb-3">
                  Which part of the word is hidden by default. Tap to reveal.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(['hanzi', 'pinyin', 'meaning', 'none'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => updateSettings({ blurMode: m })}
                      className={`py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                        settings.blurMode === m
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'glass-card text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ambient Interval */}
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">
                  Ambient Learning Interval
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  Show a random word reminder every N minutes.
                </p>
                <div className="flex gap-2">
                  {[5, 15, 30, 60, 120].map(m => (
                    <button
                      key={m}
                      onClick={() => updateSettings({ ambientInterval: m })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        settings.ambientInterval === m
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'glass-card text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      {m < 60 ? `${m}m` : `${m / 60}h`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <ToggleRow
                  label="Show Traditional Characters"
                  description="Display traditional script alongside simplified"
                  checked={settings.showTraditional}
                  onChange={v => updateSettings({ showTraditional: v })}
                />
                <ToggleRow
                  label="Show Indonesian Meanings"
                  description="Display Bahasa Indonesia translations"
                  checked={settings.showIndonesian}
                  onChange={v => updateSettings({ showIndonesian: v })}
                />
              </div>

              {/* Data Management */}
              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={clearAll}
                  className="w-full py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 active:scale-[0.98] transition-all text-sm font-medium"
                >
                  Clear All Data
                </button>
                <p className="text-xs text-slate-600 mt-2 text-center">
                  All progress is stored locally on your device. No account, no server.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 glass-card rounded-2xl p-4">
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-200">{label}</div>
        <div className="text-xs text-slate-500 mt-0.5">{description}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`relative w-12 h-7 rounded-full transition-colors duration-300 flex-shrink-0 ${
          checked ? 'bg-indigo-500' : 'bg-white/10'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5.5 h-5.5 w-[22px] h-[22px] bg-white rounded-full shadow-md transition-all duration-300 ${
            checked ? 'left-[26px]' : 'left-0.5'
          }`}
          style={{ width: 22, height: 22 }}
        />
      </button>
    </div>
  );
}
