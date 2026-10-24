import React, { useEffect, useState } from 'react';
import { 
  Network, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  Info,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { fetchExposure, ExposureGraphData } from '../lib/api';

interface ExposureGraphViewProps {
  incidentId: string;
}

export const ExposureGraphView: React.FC<ExposureGraphViewProps> = ({ incidentId }) => {
  const [graphData, setGraphData] = useState<ExposureGraphData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExposure(incidentId)
      .then(setGraphData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [incidentId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-warm-600">
        <p className="font-bold text-lg">Reviewing what personal details were mentioned...</p>
      </div>
    );
  }

  if (!graphData) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-warm-600">
        <p>No exposure information available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Editorial Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          <span>Privacy Check</span>
          <span>·</span>
          <span>Personal Information</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
          What Info Might Be Exposed
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          We check the messages you saved to see if someone mentioned where you study, live, or work. Knowing what they know helps you tighten the right privacy settings.
        </p>
      </div>

      {/* Exposure Graph Visual Canvas */}
      <div className="card-warm p-6 sm:p-8 space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Personal Information Overview
            </h2>
            <div className="flex items-center space-x-3 text-[11px] font-bold">
              <span className="flex items-center space-x-1 text-aegis-rose-text">
                <span className="w-2 h-2 rounded-full bg-aegis-rose-accent inline-block" />
                <span>Mentioned by Sender</span>
              </span>
              <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                <span>Partially Visible</span>
              </span>
              <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>Protected</span>
              </span>
            </div>
          </div>

          {/* Node Grid representation */}
          <div className="p-6 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-6">
            {/* Level 1: Root */}
            <div className="flex justify-center">
              <div className="bg-[var(--bg-card)] px-5 py-3 rounded-xl border-2 border-[var(--border-color)] shadow-sm text-center max-w-xs">
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Your Space</span>
                <div className="font-extrabold text-[var(--text-primary)] text-sm">You (Personal Identity)</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">PROTECTED & PRIVATE</div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-0.5 h-6 bg-[var(--border-color)]" />
            </div>

            {/* Level 2: Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Platform</span>
                <div className="font-bold text-xs text-[var(--text-primary)]">Instagram Account</div>
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">MODERATE VISIBILITY</div>
                <p className="text-[11px] text-[var(--text-muted)] pt-1">Direct message channel</p>
              </div>

              <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Contact</span>
                <div className="font-bold text-xs text-[var(--text-primary)]">Email Address</div>
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">PARTIALLY MASKED</div>
                <p className="text-[11px] text-[var(--text-muted)] pt-1">Personal email</p>
              </div>

              <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Institution</span>
                <div className="font-bold text-xs text-[var(--text-primary)]">College Campus</div>
                <div className="text-[11px] text-aegis-rose-text font-bold">EXPLICITLY MENTIONED</div>
                <p className="text-[11px] text-[var(--text-muted)] pt-1">Targeted by sender</p>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-0.5 h-6 bg-[var(--border-color)]" />
            </div>

            {/* Level 3: Leaf threat vectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-[var(--text-primary)]">
                  <span>Residential Vicinity</span>
                  <span className="text-aegis-rose-text font-bold text-[10px] bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                    MENTIONED IN CHAT
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-normal">
                  The sender claimed "I know where you live." Check if your neighborhood or residential photos are visible on public feeds.
                </p>
              </div>

              <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-[var(--text-primary)]">
                  <span>Intimate Privacy</span>
                  <span className="text-aegis-rose-text font-bold text-[10px] bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                    BLACKMAIL THREAT
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-normal">
                  The sender threatened exposure. StopNCII.org can block uploads across tech platforms without you having to share the pictures with anyone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Exposure Reductions */}
        <div className="pt-4 border-t border-[var(--border-color)] space-y-4">
          <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Steps to Protect Exposed Info
          </h2>

          <div className="space-y-3">
            {graphData.summary.remediation_steps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-aegis-rose-accent shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--text-secondary)] font-normal leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
