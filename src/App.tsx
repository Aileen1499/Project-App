import { useState, useCallback } from 'react';
import type React from 'react';
import { useAppSettings, useSrsSystem, useAmbientTimer, useSpeech, useClozeTest } from './hooks/useAppHooks';
import HomeDashboard from './components/HomeDashboard';
import Library from './components/Library';
import ClozeTest from './components/ClozeTest';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import WritingMode from './components/WritingMode';
import FlashCard from './components/FlashCard';
import Profile from './components/Profile';
import DailyWordPage from './components/DailyWordPage';
import { IconHome, IconBook, IconPencil, IconBarChart, IconSettings, IconSun, IconMoon, IconMonitor, IconEdit, IconLayers, IconUser, IconClock } from './components/shared';
import type { HskWord } from './data/hskMasterData';

type Tab = 'home' | 'daily' | 'library' | 'cloze' | 'analytics' | 'writing' | 'flashcards' | 'profile';

const TABS: { id: Tab; label: string; icon: (props: { size?: number; className?: string }) => React.ReactElement }[] = [
  { id: 'home', label: 'Study', icon: IconHome },
  { id: 'daily', label: 'Daily', icon: IconClock },
  { id: 'library', label: 'Library', icon: IconBook },
  { id: 'cloze', label: 'Cloze', icon: IconPencil },
  { id: 'analytics', label: 'Stats', icon: IconBarChart },
  { id: 'writing', label: 'Write', icon: IconEdit },
  { id: 'flashcards', label: 'Flash', icon: IconLayers },
  { id: 'profile', label: 'Profile', icon: IconUser },
];

export default function App() {
  const { settings, updateSettings } = useAppSettings();
  const { srsCards, getOrCreateCard, reviewWord, getDueWords, getTodayReviewCount, getMasteryByLevel } = useSrsSystem(settings.selectedLevels);
  const { speak } = useSpeech();
  const cloze = useClozeTest(settings.selectedLevels);

  const initialTab = (() => {
    const t = new URLSearchParams(window.location.search).get('tab');
    return (TABS.some(tab => tab.id === t) ? t : 'home') as Tab;
  })();

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [showSettings, setShowSettings] = useState(false);
  const [ambientWord, setAmbientWord] = useState<HskWord | null>(null);

  // Ambient timer — picks a new word periodically
  const handleAmbientWord = useCallback((word: HskWord) => {
    setAmbientWord(word);
  }, []);

  useAmbientTimer(settings.ambientInterval, settings.selectedLevels, handleAmbientWord);

  // Theme icon
  const ThemeIcon = settings.theme === 'light' ? IconSun : settings.theme === 'dark' ? IconMoon : IconMonitor;

  return (
    <div className="min-h-screen min-h-[100dvh] bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* ─── Top Bar ─── */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/5 safe-top">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold gradient-text font-display">Hanzigo</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const next = settings.theme === 'dark' ? 'light' : settings.theme === 'light' ? 'auto' : 'dark';
                updateSettings({ theme: next });
              }}
              className="p-2 rounded-xl hover:bg-white/10 active:scale-90 transition-all"
              title="Toggle theme"
            >
              <ThemeIcon size={18} className="text-slate-400" />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl hover:bg-white/10 active:scale-90 transition-all"
              title="Settings"
            >
              <IconSettings size={18} className="text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="max-w-lg mx-auto px-4 pb-36 pt-4 safe-bottom">
        {activeTab === 'home' && (
          <HomeDashboard
            settings={settings}
            srsCards={srsCards}
            getOrCreateCard={getOrCreateCard}
            reviewWord={reviewWord}
            getDueWords={getDueWords}
            getTodayReviewCount={getTodayReviewCount}
            speak={speak}
          />
        )}
        {activeTab === 'daily' && (
          <DailyWordPage
            selectedLevels={settings.selectedLevels}
            speak={speak}
          />
        )}
        {activeTab === 'library' && (
          <Library
            srsCards={srsCards}
            speak={speak}
            showIndonesian={settings.showIndonesian}
          />
        )}
        {activeTab === 'cloze' && (
          <ClozeTest
            currentQuestion={cloze.currentQuestion}
            currentIndex={cloze.currentIndex}
            score={cloze.score}
            isComplete={cloze.isComplete}
            generateQuestions={cloze.generateQuestions}
            answerQuestion={cloze.answerQuestion}
            nextQuestion={cloze.nextQuestion}
            speak={speak}
            selectedLevels={settings.selectedLevels}
          />
        )}
        {activeTab === 'analytics' && (
          <Analytics srsCards={srsCards} />
        )}
        {activeTab === 'writing' && (
          <WritingMode
            selectedLevels={settings.selectedLevels}
            speak={speak}
          />
        )}
        {activeTab === 'flashcards' && (
          <FlashCard
            selectedLevels={settings.selectedLevels}
            speak={speak}
            reviewWord={reviewWord}
            activeRecallMode={settings.blurMode !== 'none'}
          />
        )}
        {activeTab === 'profile' && (
          <Profile
            settings={settings}
            srsCards={srsCards}
            getMasteryByLevel={getMasteryByLevel}
          />
        )}
      </main>

      {/* ─── Ambient Word Toast ─── */}
      {ambientWord && activeTab === 'home' && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
          <button
            onClick={() => { speak(ambientWord.hanzi); setAmbientWord(null); }}
            className="glass-card-elevated rounded-2xl px-5 py-3 flex items-center gap-3 hover:bg-white/10 active:scale-95 transition-all"
          >
            <span className="text-2xl font-hanzi font-bold hanzi-shadow">{ambientWord.hanzi}</span>
            <span className="text-sm text-indigo-300">{ambientWord.pinyin}</span>
            <span className="text-xs text-slate-500">{ambientWord.meaning}</span>
          </button>
        </div>
      )}

      {/* ─── Bottom Navigation ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-white/5 safe-bottom">
        <div className="max-w-lg mx-auto px-2 py-2 flex items-center justify-around">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-pill flex flex-col items-center gap-0.5 min-w-[60px] ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} className={isActive ? 'text-indigo-400' : ''} />
                <span className="text-[10px]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ─── Settings Modal ─── */}
      {showSettings && (
        <Settings
          settings={settings}
          updateSettings={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
