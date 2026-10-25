import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, FileText, Lock, Eye, AlertCircle, ArrowUpRight, Plus } from 'lucide-react';
import { IncidentData } from '../lib/api';

interface TimelineViewProps {
  incident: IncidentData | null;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ incident }) => {
  const navigate = useNavigate();

  if (!incident || !incident.events || incident.events.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[var(--accent-rose-light)] text-[var(--accent-rose)] flex items-center justify-center mx-auto shadow-sm">
          <Clock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">No Timeline Events Logged Yet</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Events are ordered chronologically with dates and safety stamps once you add proof to your case.
        </p>
        <button
          onClick={() => navigate('/analyze')}
          className="bg-[var(--accent-rose)] hover:bg-[var(--accent-rose-hover)] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-all"
        >
          Add Proof
        </button>
      </div>
    );
  }

  const sortedEvents = [...incident.events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            <span>Order of Events</span>
            <span>·</span>
            <span>Case Timeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
            Case Timeline
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Every recorded message, voice note, and screenshot ordered chronologically with its saved date and safety stamp.
          </p>
        </div>

        <button
          onClick={() => navigate('/analyze')}
          className="bg-aegis-rose-accent hover:bg-aegis-rose-hover text-white px-5 py-2.5 rounded-full text-xs font-bold self-start shadow-sm transition-all flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Proof</span>
        </button>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-[var(--border-color)] ml-4 pl-6 space-y-6">
        {sortedEvents.map((evt, idx) => {
          const isCoercion = evt.stage === 'COERCION';
          const isIntimidation = evt.stage === 'INTIMIDATION';

          return (
            <div key={evt.id} className="relative">
              {/* Timeline marker */}
              <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-[var(--bg-card)] flex items-center justify-center ${
                isCoercion
                  ? 'border-aegis-rose-accent bg-aegis-rose-light'
                  : isIntimidation
                  ? 'border-aegis-amber-accent bg-aegis-amber-light'
                  : 'border-[var(--text-secondary)] bg-[var(--border-color)]'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  isCoercion ? 'bg-aegis-rose-accent' : isIntimidation ? 'bg-aegis-amber-accent' : 'bg-[var(--text-primary)]'
                }`} />
              </div>

              {/* Event Card */}
              <div className="card-warm p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-[var(--border-color)]">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs uppercase tracking-wider font-extrabold text-[var(--text-muted)]">
                      Day 0{idx + 1}
                    </span>
                    <span>·</span>
                    <span className="text-xs text-[var(--text-primary)] font-bold">
                      {new Date(evt.timestamp).toLocaleDateString()}
                    </span>
                    <span>·</span>
                    <span className="text-xs font-mono text-[var(--text-primary)] bg-[var(--bg-card-subtle)] px-2 py-0.5 rounded-md border border-[var(--border-color)]">
                      {evt.account_handle || 'Unknown Account'}
                    </span>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border self-start ${
                    isCoercion
                      ? 'bg-aegis-rose-light/50 text-aegis-rose-text border-aegis-rose-border'
                      : isIntimidation
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      : 'bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] border-[var(--border-color)]'
                  }`}>
                    {evt.stage.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-sm text-[var(--text-primary)]">
                    {evt.summary}
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                    "{evt.raw_content}"
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1">
                  <span>Platform: {evt.source_platform}</span>
                  {evt.evidence_id && (
                    <button
                      onClick={() => navigate('/vault')}
                      className="font-mono text-aegis-rose-text hover:underline flex items-center space-x-1"
                    >
                      <span>Item #{evt.evidence_id.slice(0, 8)}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
