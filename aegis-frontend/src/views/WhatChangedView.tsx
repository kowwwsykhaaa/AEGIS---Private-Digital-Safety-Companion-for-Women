import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GitCompare, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  PlusCircle, 
  Lock,
  Sparkles,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { fetchChanges, ChangeComparison } from '../lib/api';

interface WhatChangedViewProps {
  incidentId: string;
}

export const WhatChangedView: React.FC<WhatChangedViewProps> = ({ incidentId }) => {
  const navigate = useNavigate();
  const [changes, setChanges] = useState<ChangeComparison | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChanges(incidentId)
      .then(setChanges)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [incidentId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-warm-600">
        <p className="font-bold text-lg">Checking what is new since earlier messages...</p>
      </div>
    );
  }

  if (!changes) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-warm-600">
        <p>No earlier messages recorded to compare against.</p>
      </div>
    );
  }

  const formatLevel = (lvl: string) => {
    if (lvl === 'CRITICAL') return 'Very Serious';
    if (lvl === 'HIGH') return 'Serious';
    if (lvl === 'MODERATE') return 'Needs Attention';
    return 'Low Worry';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Editorial Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          <span>Comparing Messages</span>
          <span>·</span>
          <span>What is New</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
          What Changed?
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          AEGIS compares your latest messages with previous ones to explain exactly what escalated and what new warning signs appeared.
        </p>
      </div>

      {/* Main State Comparison Card (BEFORE ➔ NEW EVIDENCE ➔ AFTER) */}
      <div className="card-warm p-6 sm:p-8 space-y-8">
        {/* Progression Stage Bar */}
        <div>
          <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">
            Earlier vs. Now
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* 1. BEFORE STATE */}
            <div className="bg-[var(--bg-card-subtle)] rounded-2xl border border-[var(--border-color)] p-5 text-center space-y-2">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Earlier Messages
              </span>
              <div className="text-xl font-extrabold text-[var(--text-primary)]">
                {formatLevel(changes.before_risk)}
              </div>
              <div className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[var(--border-color)] text-[var(--text-primary)]">
                {changes.before_stage.replace(/_/g, ' ')}
              </div>
              <p className="text-[11px] text-[var(--text-muted)] pt-1">
                Initial baseline
              </p>
            </div>

            {/* 2. THE TRANSITION: NEW EVIDENCE */}
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-aegis-rose-light/50 border border-aegis-rose-border flex items-center justify-center text-aegis-rose-text mb-2 shadow-sm">
                <ArrowRight className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[var(--text-primary)]">
                New Proof Added
              </span>
              <span className="text-[11px] text-[var(--text-secondary)] mt-0.5 max-w-[200px]">
                New messages with higher pressure or threats
              </span>
            </div>

            {/* 3. AFTER STATE */}
            <div className="bg-aegis-rose-light/30 rounded-2xl border-2 border-aegis-rose-border p-5 text-center space-y-2">
              <span className="text-[11px] font-bold text-aegis-rose-text uppercase tracking-wider">
                Current Situation
              </span>
              <div className="text-xl font-extrabold text-aegis-rose-text">
                {formatLevel(changes.after_risk)}
              </div>
              <div className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-aegis-rose-light text-aegis-rose-text border border-aegis-rose-border">
                {changes.after_stage.replace(/_/g, ' ')}
              </div>
              <p className="text-[11px] text-aegis-rose-text font-bold pt-1">
                More Serious Now
              </p>
            </div>
          </div>
        </div>

        {/* SECTION: WHAT CHANGED? */}
        <div className="pt-6 border-t border-[var(--border-color)] space-y-4">
          <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Newly Detected Warning Signs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {changes.new_threat_signals.map((sig, i) => (
              <div key={i} className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs">
                <PlusCircle className="w-4 h-4 text-aegis-rose-accent shrink-0 mt-0.5" />
                <span className="font-bold text-[var(--text-primary)]">{sig}</span>
              </div>
            ))}

            {changes.new_accounts_detected.map((acc, i) => (
              <div key={i} className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs">
                <PlusCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="font-bold text-[var(--text-primary)]">
                  New account appeared: <span className="font-mono">{acc}</span>
                </span>
              </div>
            ))}

            {changes.new_exposure_elements.map((exp, i) => (
              <div key={i} className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs">
                <PlusCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span className="font-bold text-[var(--text-primary)]">
                  Mentioned personal info: {exp}
                </span>
              </div>
            ))}

            <div className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs">
              <TrendingUp className="w-4 h-4 text-aegis-rose-accent shrink-0 mt-0.5" />
              <span className="font-bold text-[var(--text-primary)]">
                Worry level shifted: {formatLevel(changes.before_risk)} ➔ {formatLevel(changes.after_risk)}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION: WHY? */}
        <div className="pt-6 border-t border-[var(--border-color)] space-y-3">
          <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Why Did It Change?
          </h2>

          <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] leading-relaxed font-normal">
            {changes.why_it_changed}
          </div>
        </div>

        {/* SECTION: RECOMMENDED ACTION */}
        <div className="pt-6 border-t border-[var(--border-color)] bg-[var(--bg-card-subtle)] -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 sm:p-8 rounded-b-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              Suggested Next Step
            </span>
            <p className="text-sm font-bold text-[var(--text-primary)]">
              {changes.recommended_priority_action}
            </p>
          </div>

          <button
            onClick={() => navigate('/rapid-response')}
            className="bg-aegis-rose-accent hover:bg-aegis-rose-hover text-white px-6 py-2.5 rounded-full text-xs font-bold shrink-0 shadow-sm transition-colors"
          >
            Review Protective Next Steps
          </button>
        </div>
      </div>
    </div>
  );
};
