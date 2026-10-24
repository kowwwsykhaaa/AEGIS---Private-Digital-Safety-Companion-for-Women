import React, { useState } from 'react';
import { 
  Lock, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  LogOut,
  Info,
  HeartHandshake
} from 'lucide-react';
import { wipeAllData } from '../lib/api';

interface PrivacyCenterViewProps {
  onDataWiped: () => void;
}

export const PrivacyCenterView: React.FC<PrivacyCenterViewProps> = ({ onDataWiped }) => {
  const [confirmWipe, setConfirmWipe] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const [wipedSuccess, setWipedSuccess] = useState(false);

  const handleExecuteWipe = async () => {
    setIsWiping(true);
    try {
      await wipeAllData();
      setWipedSuccess(true);
      setConfirmWipe(false);
      onDataWiped();
    } catch (err) {
      console.error(err);
    } finally {
      setIsWiping(false);
    }
  };

  const guarantees = [
    {
      title: "Zero Third-Party Tracking",
      detail: "AEGIS includes no Google Analytics, advertising pixels, or session tracking trackers. Your activity remains strictly private on your device."
    },
    {
      title: "No Automatic Reporting",
      detail: "AEGIS never forwards complaints, messages, or files to police, platforms, or anyone else. You decide whether, when, and how to submit reports."
    },
    {
      title: "Blur for Disturbing Content",
      detail: "Files or messages that contain intimidating language or sensitive images are kept behind a tap-to-reveal blur filter to protect your peace of mind."
    },
    {
      title: "Tamper-Proof Safety Stamps",
      detail: "Every piece of proof receives an SHA-256 safety stamp so you can prove to investigators that the file has never been edited."
    },
    {
      title: "No Invasive Web Crawling",
      detail: "AEGIS only analyzes the messages and accounts you choose to save. It never secretly scrapes the internet or searches your contacts."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Editorial Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          <span>Safety Guarantees</span>
          <span>·</span>
          <span>Privacy Center</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
          Privacy & Data Protection
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          When dealing with online harassment, privacy is personal safety. You have absolute control over your records, data, and emergency exits.
        </p>
      </div>

      {/* Quick Exit Settings Card */}
      <div className="card-warm p-6 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          <LogOut className="w-4 h-4 text-aegis-rose-text" />
          <span>Quick Exit (<kbd className="bg-[var(--border-color)] px-1 rounded font-mono">Esc</kbd>)</span>
        </div>

        <p className="text-sm text-[var(--text-primary)] leading-relaxed font-normal">
          If someone approaches your screen or walks into the room, press the <kbd className="font-mono bg-[var(--border-color)] text-[var(--text-primary)] px-2 py-0.5 rounded text-xs font-bold">Esc</kbd> key or tap the "Quick Exit" button in the top navigation. The screen instantly swaps for everyday notes and a schedule.
        </p>

        <div className="flex items-center space-x-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-card-subtle)] p-3 rounded-xl border border-[var(--border-color)]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Quick Exit shortcut is active at all times on every page.</span>
        </div>
      </div>

      {/* Core Privacy Guarantees */}
      <div className="card-warm p-6 space-y-4">
        <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          Our Privacy Promises
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guarantees.map((g, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-1">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">{g.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">{g.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Zero-Trace Wipe Card */}
      <div className="card-warm p-6 border-2 border-aegis-rose-border space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-aegis-rose-text uppercase tracking-wider">
          <Trash2 className="w-4 h-4 text-aegis-rose-accent" />
          <span>Emergency Wipe</span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">
            Permanently Erase All Data
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed max-w-xl font-normal">
            Instantly deletes all saved cases, screenshots, audio notes, and safety stamp records from this device. This cannot be undone.
          </p>
        </div>

        {wipedSuccess ? (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>All cases and saved proof have been permanently wiped from this device.</span>
          </div>
        ) : confirmWipe ? (
          <div className="p-4 rounded-xl bg-aegis-rose-light/50 border border-aegis-rose-border space-y-3">
            <p className="text-xs font-bold text-aegis-rose-text">
              Are you sure? This will permanently delete all case notes and proof from this device.
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExecuteWipe}
                disabled={isWiping}
                className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-full text-xs font-bold shadow-sm transition-colors"
              >
                {isWiping ? "Erasing..." : "Yes, Erase Everything Now"}
              </button>
              <button
                onClick={() => setConfirmWipe(false)}
                className="bg-[var(--bg-card-subtle)] hover:bg-[var(--border-color)] text-[var(--text-primary)] border border-[var(--border-color)] px-4 py-2 rounded-full text-xs font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setConfirmWipe(true)}
              className="bg-[var(--bg-card)] hover:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-900 px-5 py-2.5 rounded-full text-xs font-bold transition-colors shadow-sm"
            >
              Wipe All Data from this Device
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
