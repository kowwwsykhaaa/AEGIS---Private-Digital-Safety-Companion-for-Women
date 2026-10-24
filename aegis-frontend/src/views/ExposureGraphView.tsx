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
        <div className="flex items-center space-x-2 text-xs font-semibold text-warm-500 uppercase tracking-wider">
          <span>Privacy Check</span>
          <span>·</span>
          <span>Personal Information</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal mt-1">
          What Info Might Be Exposed
        </h1>
        <p className="text-sm text-warm-600 mt-1">
          We check the messages you saved to see if someone mentioned where you study, live, or work. Knowing what they know helps you tighten the right privacy settings.
        </p>
      </div>

      {/* Exposure Graph Visual Canvas */}
      <div className="card-warm p-6 sm:p-8 space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-warm-600 uppercase tracking-wider">
              Personal Information Overview
            </h2>
            <div className="flex items-center space-x-3 text-[11px] font-bold">
              <span className="flex items-center space-x-1 text-aegis-rose-text">
                <span className="w-2 h-2 rounded-full bg-aegis-rose-accent inline-block" />
                <span>Mentioned by Sender</span>
              </span>
              <span className="flex items-center space-x-1 text-aegis-amber-text">
                <span className="w-2 h-2 rounded-full bg-aegis-amber-accent inline-block" />
                <span>Partially Visible</span>
              </span>
              <span className="flex items-center space-x-1 text-aegis-sage-text">
                <span className="w-2 h-2 rounded-full bg-aegis-sage-accent inline-block" />
                <span>Protected</span>
              </span>
            </div>
          </div>

          {/* Node Grid representation */}
          <div className="p-6 rounded-xl bg-warm-50/70 border border-warm-200/80 space-y-6">
            {/* Level 1: Root */}
            <div className="flex justify-center">
              <div className="bg-white px-5 py-3 rounded-xl border-2 border-warm-300 shadow-sm text-center max-w-xs">
                <span className="text-[10px] uppercase font-bold text-warm-500 tracking-wider">Your Space</span>
                <div className="font-extrabold text-charcoal text-sm">You (Personal Identity)</div>
                <div className="text-[11px] text-aegis-sage-text font-bold mt-0.5">PROTECTED & PRIVATE</div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-0.5 h-6 bg-warm-300" />
            </div>

            {/* Level 2: Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-warm-300 shadow-sm text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-warm-500">Platform</span>
                <div className="font-bold text-xs text-charcoal">Instagram Account</div>
                <div className="text-[11px] text-aegis-amber-text font-bold">MODERATE VISIBILITY</div>
                <p className="text-[11px] text-warm-500 pt-1">Direct message channel</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-warm-300 shadow-sm text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-warm-500">Contact</span>
                <div className="font-bold text-xs text-charcoal">Email Address</div>
                <div className="text-[11px] text-aegis-amber-text font-bold">PARTIALLY MASKED</div>
                <p className="text-[11px] text-warm-500 pt-1">Personal email</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-warm-300 shadow-sm text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-warm-500">Institution</span>
                <div className="font-bold text-xs text-charcoal">College Campus</div>
                <div className="text-[11px] text-aegis-rose-text font-bold">EXPLICITLY MENTIONED</div>
                <p className="text-[11px] text-warm-500 pt-1">Targeted by sender</p>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-0.5 h-6 bg-warm-300" />
            </div>

            {/* Level 3: Leaf threat vectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-warm-300 shadow-sm space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-charcoal">
                  <span>Residential Vicinity</span>
                  <span className="text-aegis-rose-text font-bold text-[10px] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    MENTIONED IN CHAT
                  </span>
                </div>
                <p className="text-xs text-warm-600 font-normal">
                  The sender claimed "I know where you live." Check if your neighborhood or residential photos are visible on public feeds.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-warm-300 shadow-sm space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-charcoal">
                  <span>Intimate Privacy</span>
                  <span className="text-aegis-rose-text font-bold text-[10px] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    BLACKMAIL THREAT
                  </span>
                </div>
                <p className="text-xs text-warm-600 font-normal">
                  The sender threatened exposure. StopNCII.org can block uploads across tech platforms without you having to share the pictures with anyone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Exposure Reductions */}
        <div className="pt-4 border-t border-warm-200 space-y-4">
          <h2 className="text-xs font-bold text-warm-600 uppercase tracking-wider">
            Steps to Protect Exposed Info
          </h2>

          <div className="space-y-3">
            {graphData.summary.remediation_steps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-warm-50 border border-warm-200 flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-aegis-rose-accent shrink-0 mt-0.5" />
                <p className="text-xs text-warm-800 font-normal leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
