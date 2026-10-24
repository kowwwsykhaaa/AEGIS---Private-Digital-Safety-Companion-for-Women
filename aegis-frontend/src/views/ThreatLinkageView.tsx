import React, { useEffect, useState } from 'react';
import { 
  Link2, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Clock,
  Sparkles,
  GitMerge,
  ShieldCheck
} from 'lucide-react';
import { fetchLinkage, ThreatLinkageData } from '../lib/api';

interface ThreatLinkageViewProps {
  incidentId: string;
}

export const ThreatLinkageView: React.FC<ThreatLinkageViewProps> = ({ incidentId }) => {
  const [linkageData, setLinkageData] = useState<ThreatLinkageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinkage(incidentId)
      .then(setLinkageData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [incidentId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-warm-600">
        <p className="font-bold text-lg">Looking for matching clues between accounts...</p>
      </div>
    );
  }

  if (!linkageData || linkageData.connections_found.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-charcoal">No Linked Accounts Yet</h2>
        <p className="text-sm text-warm-600">
          When messages come from more than one account or handle in a case, AEGIS automatically checks them for matching patterns.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Editorial Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-warm-500 uppercase tracking-wider">
          <span>Clue Comparison</span>
          <span>·</span>
          <span>Connected Accounts</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal mt-1">
          Connected Accounts & Clues
        </h1>
        <p className="text-sm text-warm-600 mt-1">
          Could different accounts belong to the same person? AEGIS highlights matching patterns — such as similar usernames, timing right after each other, and identical phrasing.
        </p>
      </div>

      {/* Linkage Cards */}
      <div className="space-y-6">
        {linkageData.connections_found.map((conn, idx) => (
          <div key={idx} className="card-warm p-6 sm:p-8 space-y-6">
            {/* Account Comparison Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-warm-200">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-sm font-bold bg-warm-100 text-warm-900 px-3 py-1.5 rounded-xl border border-warm-300">
                  {conn.account_a}
                </span>
                <span className="text-warm-400 font-bold">↔</span>
                <span className="font-mono text-sm font-bold bg-warm-100 text-warm-900 px-3 py-1.5 rounded-xl border border-warm-300">
                  {conn.account_b}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-aegis-amber-light text-aegis-amber-text border border-aegis-amber-border">
                  <span className="w-1.5 h-1.5 rounded-full bg-aegis-amber-accent mr-1.5" />
                  {conn.verdict} ({conn.confidence_level} Confidence)
                </span>
              </div>
            </div>

            {/* Natural language summary */}
            <div>
              <h2 className="text-xs font-bold text-warm-600 uppercase tracking-wider mb-2">
                What We Noticed
              </h2>
              <div className="p-4 rounded-xl bg-warm-50 border border-warm-200 text-sm text-warm-900 leading-relaxed font-normal">
                {conn.plain_explanation}
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div>
              <h2 className="text-xs font-bold text-warm-600 uppercase tracking-wider mb-3">
                Clues Compared
              </h2>

              <div className="space-y-3">
                {conn.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="p-4 rounded-xl bg-white border border-warm-200 space-y-1.5 shadow-sm">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-warm-900">{m.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        m.level === 'High'
                          ? 'bg-aegis-rose-light text-aegis-rose-text border-aegis-rose-border'
                          : m.level === 'Moderate'
                          ? 'bg-aegis-amber-light text-aegis-amber-text border-aegis-amber-border'
                          : 'bg-warm-100 text-warm-700 border-warm-300'
                      }`}>
                        {m.level} Match ({Math.round(m.score * 100)}%)
                      </span>
                    </div>

                    <p className="text-xs text-warm-700 font-normal">
                      {m.description}
                    </p>

                  </div>
                ))}
              </div>

              {conn.shared_signals && conn.shared_signals.length > 0 && (
                <div className="pt-3 flex flex-wrap gap-2">
                  {conn.shared_signals.map((sig, sIdx) => (
                    <span key={sIdx} className="text-[11px] bg-warm-100 text-warm-800 border border-warm-300 px-2.5 py-1 rounded-md font-bold">
                      Matched: {sig}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Reassuring Guardrail Notice */}
            <div className="flex items-start space-x-2 text-xs text-warm-500 bg-warm-50/60 p-3.5 rounded-xl border border-warm-200">
              <Info className="w-4 h-4 shrink-0 text-warm-400 mt-0.5" />
              <span>
                <strong>Important note:</strong> AEGIS highlights observable patterns to help you explain what happened. Definitive proof of identity requires official cyber cell investigation via platform IP logs.
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
