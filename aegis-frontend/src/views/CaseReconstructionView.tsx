import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  Info, 
  Archive, 
  ArrowRight 
} from 'lucide-react';
import { fetchReconstruction, CaseReconstructionData } from '../lib/api';

interface CaseReconstructionViewProps {
  incidentId: string;
}

export const CaseReconstructionView: React.FC<CaseReconstructionViewProps> = ({ incidentId }) => {
  const navigate = useNavigate();
  const [data, setData] = useState<CaseReconstructionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!incidentId) {
      setLoading(false);
      return;
    }
    fetchReconstruction(incidentId)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [incidentId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-[var(--text-muted)]">
        <p className="font-bold text-lg">Organizing events into chronological order...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[var(--accent-rose-light)] text-[var(--accent-rose)] flex items-center justify-center mx-auto shadow-sm">
          <FileText className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">No Story Summary Available</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Select an active case or add proof to view the synthesized chronological story.
        </p>
        <button
          onClick={() => navigate('/overview')}
          className="bg-[var(--accent-rose)] hover:bg-[var(--accent-rose-hover)] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-all"
        >
          View Cases
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Editorial Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          <span>The Full Story</span>
          <span>·</span>
          <span>Chronological Summary</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
          The Full Story
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Brings together messages, voice notes, and screenshots into an orderly chronological story, linking each statement to its preserved proof item.
        </p>
      </div>

      {/* Formal Narrative Summary */}
      <div className="card-warm p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Summary of What Happened
            </span>
            <span className="text-xs text-[var(--text-secondary)]">
              {data.total_events} Milestones · {data.total_evidence_pieces} Proof Items
            </span>
          </div>

          <div className="mt-4 p-5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-base sm:text-lg text-[var(--text-primary)] leading-relaxed font-normal">
            "{data.formal_narrative}"
          </div>
        </div>

        {/* Milestone Sequence with Evidence Citations */}
        <div className="pt-4 border-t border-[var(--border-color)] space-y-4">
          <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Step-by-Step Events
          </h2>

          <div className="space-y-4">
            {data.chronological_milestones.map((m) => (
              <div key={m.event_id} className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[var(--text-primary)]">{m.date_label}</span>
                    <span>·</span>
                    <span className="text-[var(--text-secondary)]">{m.timestamp}</span>
                    <span>·</span>
                    <span className="font-mono text-[var(--text-primary)] bg-[var(--bg-card)] px-2 py-0.5 rounded border border-[var(--border-color)]">
                      {m.account_handle}
                    </span>
                  </div>

                  <span className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                    {m.stage.replace(/_/g, ' ')}
                  </span>
                </div>

                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {m.summary}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[var(--border-color)] text-xs">
                  <span className="text-[var(--text-secondary)] italic">
                    Original message: "{m.raw_excerpt}"
                  </span>

                  {m.evidence_ref && (
                    <button
                      onClick={() => navigate('/vault')}
                      className="inline-flex items-center space-x-1 font-mono text-[11px] text-aegis-rose-text hover:underline shrink-0"
                    >
                      <span>Item #{m.evidence_ref.slice(0, 8)}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-[var(--border-color)] flex justify-end">
          <button
            onClick={() => navigate('/complaint')}
            className="bg-aegis-rose-accent hover:bg-aegis-rose-hover text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-sm transition-all flex items-center space-x-2"
          >
            <span>Proceed to Official Report Pack</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
