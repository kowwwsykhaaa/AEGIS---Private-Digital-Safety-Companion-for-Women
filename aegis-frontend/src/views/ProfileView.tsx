import React, { useState } from 'react';
import { User, HeartHandshake, Eye, Moon, Sun, Sparkles, Check, RefreshCw } from 'lucide-react';

interface ProfileViewProps {
  onThemeToggle: (theme: 'light' | 'dark') => void;
  currentTheme: 'light' | 'dark';
  onLoadSampleData?: () => void;
  onSimulateUpdate?: () => void;
  userName?: string;
  onUpdateUserName?: (name: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  onThemeToggle, 
  currentTheme,
  onLoadSampleData,
  onSimulateUpdate,
  userName = 'Ananya',
  onUpdateUserName
}) => {
  const [name, setName] = useState(userName);
  const [helperName, setHelperName] = useState(() => localStorage.getItem('aegis_helper_name') || '');
  const [helperPhone, setHelperPhone] = useState(() => localStorage.getItem('aegis_helper_phone') || '');
  const [disguise, setDisguise] = useState(() => localStorage.getItem('aegis_disguise') === 'true');
  const [saved, setSaved] = useState(false);
  const [sampleLoadedMsg, setSampleLoadedMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('aegis_user_name', name);
    localStorage.setItem('aegis_helper_name', helperName);
    localStorage.setItem('aegis_helper_phone', helperPhone);
    localStorage.setItem('aegis_disguise', String(disguise));
    if (onUpdateUserName) onUpdateUserName(name);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLoadSample = async () => {
    if (onLoadSampleData) {
      await onLoadSampleData();
      setSampleLoadedMsg("Sample situation loaded successfully.");
      setTimeout(() => setSampleLoadedMsg(null), 3000);
    }
  };

  const handleSimulate = async () => {
    if (onSimulateUpdate) {
      await onSimulateUpdate();
      setSampleLoadedMsg("Sample follow-up update added to active case.");
      setTimeout(() => setSampleLoadedMsg(null), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">My Safety Profile</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Customize your experience. Your preferences remain strictly on this device.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Name / Avatar Card */}
        <div className="card-warm p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-[var(--accent-rose)] text-white flex items-center justify-center text-2xl font-bold shadow-sm">
              {(name.trim()[0] || 'A').toUpperCase()}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                What should we call you? (a nickname is fine)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] px-3.5 py-2 text-sm text-[var(--text-primary)] bg-[var(--bg-input)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-rose)]/40 transition-colors"
                placeholder="Your preferred name"
              />
            </div>
          </div>
        </div>

        {/* Someone I Trust Card */}
        <div className="card-warm p-6 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4 text-[var(--accent-rose)]" />
            <span>Someone I Trust (Optional)</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            We will never contact them for you. They will simply appear on your Help page so you can call them with one tap if you feel overwhelmed.
          </p>

          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Their Name</label>
              <input
                type="text"
                value={helperName}
                onChange={(e) => setHelperName(e.target.value)}
                placeholder="e.g. Sister, Best Friend, Mentor"
                className="w-full rounded-xl border border-[var(--border-color)] px-3.5 py-2 text-sm text-[var(--text-primary)] bg-[var(--bg-input)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-rose)]/40 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Their Phone Number</label>
              <input
                type="tel"
                value={helperPhone}
                onChange={(e) => setHelperPhone(e.target.value)}
                placeholder="+91 ..."
                className="w-full rounded-xl border border-[var(--border-color)] px-3.5 py-2 text-sm text-[var(--text-primary)] bg-[var(--bg-input)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-rose)]/40 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Appearance & Stealth Card */}
        <div className="card-warm p-6 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            <Sun className="w-4 h-4 text-[var(--accent-rose)]" />
            <span>Look & Disguise</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Color Theme</label>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => onThemeToggle('light')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-2 ${
                  currentTheme === 'light'
                    ? 'bg-[var(--accent-rose-light)] text-[var(--accent-rose)] border-[var(--accent-rose-border)] shadow-sm'
                    : 'bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] border-[var(--border-color)] hover:bg-[var(--border-subtle)]'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Soft Light (Blush Ivory)</span>
              </button>

              <button
                type="button"
                onClick={() => onThemeToggle('dark')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-2 ${
                  currentTheme === 'dark'
                    ? 'bg-[var(--accent-rose-light)] text-[var(--accent-rose)] border-[var(--accent-rose-border)] shadow-sm'
                    : 'bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] border-[var(--border-color)] hover:bg-[var(--border-subtle)]'
                }`}
              >
                <Moon className="w-4 h-4 text-blue-400" />
                <span>Warm Dark (Night Mode)</span>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={disguise}
                onChange={(e) => setDisguise(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-[var(--accent-rose)] focus:ring-0 cursor-pointer"
              />
              <span className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Show app title and header as <strong>"Notes"</strong> so it looks ordinary if someone glances at your screen.
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Profile preferences saved</span>
            </span>
          )}
          <button
            type="submit"
            className="ml-auto bg-[var(--accent-rose)] hover:bg-[var(--accent-rose-hover)] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-sm transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Practice / Sample Data Section (Discreet, zero emojis) */}
      {(onLoadSampleData || onSimulateUpdate) && (
        <div className="card-warm p-6 space-y-3 border-dashed border-[var(--border-color)]">
          <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[var(--accent-rose)]" />
            <span>Practice & Exploring AEGIS</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            If you want to see how AEGIS tracks an escalating situation before using it with your own data, you can load sample practice items.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            {onLoadSampleData && (
              <button
                type="button"
                onClick={handleLoadSample}
                className="flex items-center space-x-2 bg-[var(--bg-card-subtle)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>Load Sample Case</span>
              </button>
            )}

            {onSimulateUpdate && (
              <button
                type="button"
                onClick={handleSimulate}
                className="flex items-center space-x-2 bg-[var(--accent-rose-light)] hover:opacity-90 text-[var(--accent-rose)] border border-[var(--accent-rose-border)] px-4 py-2 rounded-full text-xs font-bold transition-all"
              >
                <span>Add Sample Update</span>
              </button>
            )}
          </div>

          {sampleLoadedMsg && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold pt-1">
              {sampleLoadedMsg}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
