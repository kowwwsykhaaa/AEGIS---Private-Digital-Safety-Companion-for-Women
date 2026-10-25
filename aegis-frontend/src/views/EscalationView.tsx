import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ShieldAlert, 
  ArrowUpRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { fetchEscalation, EscalationReport } from '../lib/api';

interface EscalationViewProps {
  incidentId: string;
}

export const EscalationView: React.FC<EscalationViewProps> = ({ incidentId }) => {
  const navigate = useNavigate();
  const [report, setReport] = useState<EscalationReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!incidentId) {
      setLoading(false);
      return;
    }
    fetchEscalation(incidentId)
      .then(setReport)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [incidentId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-[var(--text-muted)]">
        <p className="font-bold text-lg">Checking how messages have progressed...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[var(--accent-rose-light)] text-[var(--accent-rose)] flex items-center justify-center mx-auto shadow-sm">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">No Progression Report Available</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Select an active case or add proof to observe progression and shifts in tone over time.
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

  const isCritical = report.risk_level === 'CRITICAL';
  const isHigh = report.risk_level === 'HIGH';

  const formatLevel = (lvl: string) => {
    if (lvl === 'CRITICAL') return 'Very Serious';
    if (lvl === 'HIGH') return 'Serious';
    if (lvl === 'MODERATE') return 'Needs Attention';
    return 'Low Worry';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Editorial Headline */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          <span>Pattern Tracking</span>
          <span>·</span>
          <span>How Things Changed</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
          How the Situation is Progressing
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          AEGIS checks how messages developed over time, highlighting when casual unwanted messages shifted toward location stalking or blackmail.
        </p>
      </div>

      {/* Trajectory Status Overview */}
      <div className="card-warm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
          <div>
            <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-bold">Current Worry Level</div>
            <div className="text-2xl font-extrabold text-[var(--text-primary)] mt-0.5">
              {formatLevel(report.risk_level)} ({report.current_stage.replace(/_/g, ' ')})
            </div>
          </div>

          <div className="bg-[var(--bg-card-subtle)] px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs">
            <span className="text-[var(--text-muted)] block uppercase tracking-wider text-[10px] font-bold">Pacing of Messages</span>
            <span className="font-bold text-[var(--text-primary)]">{report.escalation_velocity}</span>
          </div>
        </div>

        {/* Visual Stepper / Progression */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Stages of What Happened
          </h2>

          <div className="relative border-l-2 border-[var(--border-color)] ml-4 pl-6 space-y-8">
            {report.trajectory.map((stage) => (
              <div key={stage.stage_key} className="relative">
                {/* Node indicator */}
                <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 bg-[var(--bg-card)] flex items-center justify-center ${
                  stage.is_current
                    ? isCritical ? 'border-aegis-rose-accent bg-aegis-rose-light' : 'border-aegis-amber-accent bg-aegis-amber-light'
                    : stage.is_reached
                    ? 'border-[var(--text-secondary)] bg-[var(--border-color)]'
                    : 'border-[var(--border-color)] bg-[var(--bg-card-subtle)]'
                }`}>
                  {stage.is_reached && (
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      stage.is_current
                        ? isCritical ? 'bg-aegis-rose-accent' : 'bg-aegis-amber-accent'
                        : 'bg-[var(--text-primary)]'
                    }`} />
                  )}
                </div>

                <div className={`p-4 rounded-xl border transition-all ${
                  stage.is_current
                    ? isCritical
                      ? 'bg-aegis-rose-light/40 border-aegis-rose-border'
                      : 'bg-aegis-amber-light/40 border-aegis-amber-border'
                    : stage.is_reached
                    ? 'bg-[var(--bg-card)] border-[var(--border-color)] shadow-sm'
                    : 'bg-[var(--bg-card-subtle)]/50 border-[var(--border-color)] opacity-60'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-[var(--text-muted)]">
                      Stage {stage.order}: {stage.stage_name}
                    </span>

                    {stage.is_current && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isCritical ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                        Current Active Stage
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-[var(--text-primary)] mt-1">
                    {stage.milestone_summary || 'No milestones logged yet.'}
                  </p>

                  {stage.reached_at && (
                    <div className="text-[11px] text-[var(--text-muted)] mt-2 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Noticed on: {new Date(stage.reached_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why did it escalate? */}
        <div className="pt-4 border-t border-[var(--border-color)] space-y-3">
          <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Why It Shifted
          </h2>
          <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] leading-relaxed font-normal">
            {report.why_it_escalated}
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Warning Signs Detected
            </span>
            <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
              {report.key_drivers.map((kd, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <span className="text-[var(--text-muted)]">•</span>
                  <span>{kd}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reassuring Disclaimer */}
        <div className="flex items-start space-x-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-card-subtle)] p-3 rounded-lg border border-[var(--border-color)]">
          <Info className="w-4 h-4 shrink-0 text-[var(--text-muted)] mt-0.5" />
          <span>{report.disclaimer}</span>
        </div>
      </div>
    </div>
  );
};
