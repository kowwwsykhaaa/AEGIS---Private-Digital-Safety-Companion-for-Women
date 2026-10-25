import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Network } from 'lucide-react';
import { fetchExposure, ExposureGraphData } from '../lib/api';

interface ExposureGraphViewProps {
  incidentId: string;
}

export const ExposureGraphView: React.FC<ExposureGraphViewProps> = ({ incidentId }) => {
  const navigate = useNavigate();
  const [graphData, setGraphData] = useState<ExposureGraphData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!incidentId) {
      setLoading(false);
      return;
    }
    fetchExposure(incidentId)
      .then(setGraphData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [incidentId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-[var(--text-muted)]">
        <p className="font-bold text-lg">Reviewing what personal details were mentioned...</p>
      </div>
    );
  }

  if (!graphData) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[var(--accent-rose-light)] text-[var(--accent-rose)] flex items-center justify-center mx-auto shadow-sm">
          <Network className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">No Exposure Information Available</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Select an active case or save messages to examine potential personal information exposure.
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
  const rootNode = graphData.nodes.find(n => n.type === 'root');
  const platformNodes = graphData.nodes.filter(n => n.type === 'platform');
  const identifierNodes = graphData.nodes.filter(n => n.type === 'identifier');
  const vectorNodes = graphData.nodes.filter(n => n.type !== 'root' && n.type !== 'platform' && n.type !== 'identifier');

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">CRITICAL EXPOSURE</span>;
      case 'HIGH':
        return <span className="text-[10px] font-bold text-aegis-rose-text bg-aegis-rose-light/50 border border-aegis-rose-border px-2 py-0.5 rounded">EXPLICITLY REFERENCED</span>;
      case 'MODERATE':
        return <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">MODERATE VISIBILITY</span>;
      default:
        return <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">PROTECTED</span>;
    }
  };

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
          AEGIS analyzes the messages and proof you save to identify mentioned platforms, accounts, location references, or sensitive media.
        </p>
      </div>

      {/* Exposure Graph Visual Canvas */}
      <div className="card-warm p-6 sm:p-8 space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Personal Information Overview ({graphData.summary.total_nodes} nodes mapped)
            </h2>
            <div className="flex items-center space-x-3 text-[11px] font-bold">
              <span className="flex items-center space-x-1 text-aegis-rose-text">
                <span className="w-2 h-2 rounded-full bg-aegis-rose-accent inline-block" />
                <span>Referenced by Sender</span>
              </span>
              <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                <span>Visible Channels</span>
              </span>
              <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>Protected</span>
              </span>
            </div>
          </div>

          {/* Node Grid representation */}
          <div className="p-6 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-6">
            {/* Level 1: Root */}
            {rootNode && (
              <div className="flex justify-center">
                <div className="bg-[var(--bg-card)] px-5 py-3 rounded-xl border-2 border-[var(--border-color)] shadow-sm text-center max-w-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Your Space</span>
                  <div className="font-extrabold text-[var(--text-primary)] text-sm">{rootNode.value}</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">PROTECTED & PRIVATE</div>
                  <p className="text-[11px] text-[var(--text-muted)] pt-0.5">{rootNode.description}</p>
                </div>
              </div>
            )}

            {/* Level 2: Channels / Platforms */}
            {platformNodes.length > 0 && (
              <>
                <div className="flex justify-center">
                  <div className="w-0.5 h-6 bg-[var(--border-color)]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {platformNodes.map(plat => (
                    <div key={plat.id} className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm text-center space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Platform</span>
                      <div className="font-bold text-xs text-[var(--text-primary)]">{plat.value}</div>
                      <div className="pt-0.5">{getLevelBadge(plat.exposure_level)}</div>
                      <p className="text-[11px] text-[var(--text-muted)] pt-1">{plat.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Level 3: Handles / Identifiers */}
            {identifierNodes.length > 0 && (
              <>
                <div className="flex justify-center">
                  <div className="w-0.5 h-6 bg-[var(--border-color)]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {identifierNodes.map(h => (
                    <div key={h.id} className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm text-center space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Sender Account</span>
                      <div className="font-mono font-bold text-xs text-[var(--text-primary)]">{h.value}</div>
                      <div className="pt-0.5">{getLevelBadge(h.exposure_level)}</div>
                      <p className="text-[11px] text-[var(--text-muted)] pt-1">{h.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Level 4: Discovered Exposure Vectors */}
            {vectorNodes.length > 0 && (
              <>
                <div className="flex justify-center">
                  <div className="w-0.5 h-6 bg-[var(--border-color)]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vectorNodes.map(node => (
                    <div key={node.id} className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-[var(--text-primary)]">
                        <span>{node.label}</span>
                        {getLevelBadge(node.exposure_level)}
                      </div>
                      <div className="font-semibold text-xs text-[var(--text-primary)]">{node.value}</div>
                      <p className="text-xs text-[var(--text-secondary)] font-normal">{node.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {graphData.nodes.length <= 1 && (
              <div className="text-center py-6 text-xs text-[var(--text-muted)]">
                No active exposure vectors identified yet. Add messages or screenshots in this case to see what personal info may be referenced.
              </div>
            )}
          </div>
        </div>

        {/* Actionable Exposure Reductions */}
        {graphData.summary.remediation_steps.length > 0 && (
          <div className="pt-4 border-t border-[var(--border-color)] space-y-4">
            <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Recommended Protective Steps
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
        )}
      </div>
    </div>
  );
};
