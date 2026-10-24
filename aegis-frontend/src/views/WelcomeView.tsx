import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Lock, EyeOff, HeartHandshake, PhoneCall } from 'lucide-react';

interface WelcomeViewProps {
  onStart: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-12">
      {/* Editorial Headline */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="inline-block text-xs uppercase tracking-wider text-[var(--accent-rose)] bg-[var(--accent-rose-light)] px-3.5 py-1 rounded-full font-bold border border-[var(--accent-rose-border)]">
          Private Digital Safety Companion
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[var(--text-primary)] leading-tight">
          You are not alone.<br />
          <span className="text-[var(--accent-rose)] font-serif">Let's make sense of this together.</span>
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] font-normal leading-relaxed pt-2">
          When someone bothers, threatens, or blackmails you online, AEGIS helps you understand what is happening, organizes your proof safely, and helps you decide what to do next — at your own pace.
        </p>
      </div>

      {/* Primary Action Button */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            onStart();
            navigate('/overview');
          }}
          className="flex items-center space-x-2.5 bg-[var(--accent-rose)] hover:bg-[var(--accent-rose-hover)] text-white px-8 py-3.5 rounded-full font-bold shadow-md transition-all text-base transform hover:-translate-y-0.5"
        >
          <span>Open my safety space</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* 3 Calming Safety Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-4">
        <div className="card-warm p-6 space-y-3">
          <div className="w-10 h-10 rounded-full bg-[var(--accent-rose-light)] text-[var(--accent-rose)] flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h2 className="text-base font-bold text-[var(--text-primary)]">See the full picture</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            One message might seem small on its own. Looking at them together reveals persistence, patterns, and whether things are getting more serious.
          </p>
        </div>

        <div className="card-warm p-6 space-y-3">
          <div className="w-10 h-10 rounded-full bg-[var(--accent-rose-light)] text-[var(--accent-rose)] flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h2 className="text-base font-bold text-[var(--text-primary)]">Keep proof safe</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Save screenshots, voice notes, and messages with an automatic date and tamper-proof safety stamp, so nobody can accuse you of altering them.
          </p>
        </div>

        <div className="card-warm p-6 space-y-3">
          <div className="w-10 h-10 rounded-full bg-[var(--accent-rose-light)] text-[var(--accent-rose)] flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h2 className="text-base font-bold text-[var(--text-primary)]">Always in your control</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Everything stays on your device. Nothing is reported or shared without your permission. One-tap wipe and instant Quick Exit (<kbd className="font-mono text-xs bg-[var(--border-subtle)] px-1.5 py-0.5 rounded">Esc</kbd>).
          </p>
        </div>
      </div>

      {/* Emergency Helplines Notice (Clean, Zero Emojis) */}
      <div className="card-warm p-6 text-center space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">Official Emergency Helplines (India)</h3>
        <p className="text-xs text-[var(--text-muted)]">If you feel in physical danger right now, official help is available 24/7:</p>
        <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-sm font-semibold">
          <a href="tel:112" className="flex items-center space-x-1.5 text-red-600 hover:underline">
            <PhoneCall className="w-4 h-4" />
            <span>112 Emergency</span>
          </a>
          <a href="tel:181" className="flex items-center space-x-1.5 text-[var(--text-primary)] hover:underline">
            <Shield className="w-4 h-4 text-[var(--accent-rose)]" />
            <span>181 Women Helpline</span>
          </a>
          <a href="tel:1930" className="flex items-center space-x-1.5 text-blue-600 hover:underline">
            <Lock className="w-4 h-4" />
            <span>1930 Cyber Crime</span>
          </a>
        </div>
      </div>
    </div>
  );
};
