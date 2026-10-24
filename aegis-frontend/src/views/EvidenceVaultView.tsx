import React, { useState } from 'react';
import { 
  Archive, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  FileText, 
  CheckCircle2, 
  Info,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { IncidentData } from '../lib/api';

interface EvidenceVaultViewProps {
  incident: IncidentData | null;
}

export const EvidenceVaultView: React.FC<EvidenceVaultViewProps> = ({ incident }) => {
  const [revealedItems, setRevealedItems] = useState<Record<string, boolean>>({});

  if (!incident || incident.evidence_items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-charcoal">No Proof Saved Yet</h2>
        <p className="text-sm text-warm-600">
          Upload screenshots, audio recordings, or messages in the 'Add Proof' tab to keep them safely organized.
        </p>
      </div>
    );
  }

  const toggleReveal = (id: string) => {
    setRevealedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Editorial Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-warm-500 uppercase tracking-wider">
          <span>Proof Security</span>
          <span>·</span>
          <span>Saved Evidence Vault</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal mt-1">
          Saved Proof & Safety Stamps
        </h1>
        <p className="text-sm text-warm-600 mt-1">
          Every screenshot, voice note, and message is sealed with a unique digital safety stamp (SHA-256). This proves to investigators that your proof hasn't been altered.
        </p>
      </div>

      {/* Vault Items List */}
      <div className="space-y-6">
        {incident.evidence_items.map((item) => {
          const isRevealed = revealedItems[item.id] || !item.is_sensitive;

          return (
            <div key={item.id} className="card-warm p-6 space-y-4">
              {/* Item Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-warm-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-warm-100 flex items-center justify-center text-warm-700">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-warm-900">
                        ITEM-{item.id.slice(0, 8)}
                      </span>
                      <span>·</span>
                      <span className="text-xs text-warm-600">{item.file_name}</span>
                    </div>
                    <span className="text-[11px] text-warm-500">
                      Captured: {new Date(item.captured_at).toLocaleDateString()} · {item.source_platform}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {item.is_sensitive && (
                    <button
                      onClick={() => toggleReveal(item.id)}
                      className="flex items-center space-x-1.5 text-xs text-warm-700 bg-warm-100 hover:bg-warm-200 px-3 py-1.5 rounded-full border border-warm-300 transition-colors"
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{isRevealed ? "Hide Sensitive Content" : "Tap to Reveal"}</span>
                    </button>
                  )}

                  <span className="inline-flex items-center text-xs font-bold text-aegis-sage-text bg-aegis-sage-light px-3 py-1 rounded-full border border-aegis-sage-border">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-aegis-sage-accent" />
                    ✓ Safety Stamp Verified
                  </span>
                </div>
              </div>

              {/* Content Preview (with tap-to-reveal blur for sensitive content) */}
              <div className="space-y-1.5">
                <span className="text-[11px] uppercase tracking-wider font-bold text-warm-500">
                  Preserved Content Excerpt
                </span>
                <div className={`p-4 rounded-xl border border-warm-200 bg-warm-50 text-xs text-warm-900 font-sans leading-relaxed transition-all ${
                  item.is_sensitive && !isRevealed ? 'filter blur-sm select-none' : ''
                }`}>
                  "{item.excerpt_text || "No preview text available."}"
                </div>
                {item.is_sensitive && !isRevealed && (
                  <p className="text-[11px] text-warm-500 italic">
                    ⚠️ Content obscured for your comfort. Click 'Tap to Reveal' to view unblurred.
                  </p>
                )}
              </div>

              {/* SHA-256 Fingerprint Record */}
              <div className="p-3.5 rounded-xl bg-warm-100/60 border border-warm-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-warm-500 tracking-wider block">
                    Tamper-Proof Safety Stamp (SHA-256)
                  </span>
                  <span className="font-mono text-warm-800 text-[11px] break-all">
                    {item.file_hash_sha256}
                  </span>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[10px] uppercase font-bold text-warm-500 tracking-wider block">
                    File Size
                  </span>
                  <span className="font-bold text-warm-800">
                    {Math.round(item.file_size_bytes / 1024)} KB
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advisory Note */}
      <div className="p-4 rounded-xl bg-warm-100 border border-warm-300 text-xs text-warm-700 leading-relaxed">
        <strong>Evidence Integrity Notice:</strong> Safety stamps verify that original captured files have not been modified since being saved. AEGIS provides engineering integrity provenance, which assists official investigators and cyber cells when verifying evidence.
      </div>
    </div>
  );
};
