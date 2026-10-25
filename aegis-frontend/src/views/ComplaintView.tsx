import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileCheck2, 
  Copy, 
  Check, 
  Download, 
  Info, 
  Scale, 
  ExternalLink,
  ShieldAlert,
  Edit3
} from 'lucide-react';
import { fetchComplaintPack, generateCustomComplaint, ComplaintPackData } from '../lib/api';

interface ComplaintViewProps {
  incidentId: string;
}

export const ComplaintView: React.FC<ComplaintViewProps> = ({ incidentId }) => {
  const navigate = useNavigate();
  const [pack, setPack] = useState<ComplaintPackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userStatement, setUserStatement] = useState('');
  const [suspectIdentifiers, setSuspectIdentifiers] = useState('');
  const [copied, setCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!incidentId) {
      setLoading(false);
      return;
    }
    fetchComplaintPack(incidentId)
      .then(data => {
        setPack(data);
        if (data.user_statement) setUserStatement(data.user_statement);
        if (data.suspect_identifiers) setSuspectIdentifiers(data.suspect_identifiers);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [incidentId]);

  const handleUpdateDossier = async () => {
    setIsUpdating(true);
    try {
      const res = await generateCustomComplaint(incidentId, {
        user_statement: userStatement,
        suspect_identifiers: suspectIdentifiers
      });
      setPack(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const copyDossier = () => {
    if (!pack) return;
    navigator.clipboard.writeText(pack.formatted_dossier_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTextFile = () => {
    if (!pack) return;
    const blob = new Blob([pack.formatted_dossier_text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AEGIS_Complaint_Pack_${pack.incident_id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-[var(--text-muted)]">
        <p className="font-bold text-lg">Preparing your official report pack...</p>
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[var(--accent-rose-light)] text-[var(--accent-rose)] flex items-center justify-center mx-auto shadow-sm">
          <FileCheck2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">No Report Pack Available</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Select an active case or save messages to prepare a police-ready report pack.
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
          <span>Ready to File</span>
          <span>·</span>
          <span>Official Report Pack</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
          Prepare Official Report Pack
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Organizes your timeline, proof items with safety stamps, and sender accounts into a formal statement ready for cybercrime.gov.in or local police stations.
        </p>
      </div>

      {/* Strict Privacy & Action Banner */}
      <div className="bg-[var(--bg-card-subtle)] rounded-2xl border border-[var(--border-color)] p-5 flex items-start space-x-3">
        <Info className="w-5 h-5 text-[var(--text-muted)] shrink-0 mt-0.5" />
        <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
          <strong className="font-bold block text-[var(--text-primary)] mb-0.5">
            You Remain in Full Control
          </strong>
          {pack.disclaimer} You can edit your personal statement, review every statutory section, and copy or download the file when you are ready to file independently.
        </div>
      </div>

      {/* Interactive Statement & Suspect Editor */}
      <div className="card-warm p-6 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          <Edit3 className="w-4 h-4 text-[var(--text-muted)]" />
          <span>Customize Your Complainant Statement</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              Your Incident Statement
            </label>
            <textarea
              rows={3}
              value={userStatement}
              onChange={(e) => setUserStatement(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-color)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] bg-[var(--bg-input)] focus:outline-none focus:ring-2 focus:ring-aegis-rose-accent/40"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              Suspect Handles / Identifiers
            </label>
            <input
              type="text"
              value={suspectIdentifiers}
              onChange={(e) => setSuspectIdentifiers(e.target.value)}
              placeholder="e.g. @account_handle (Instagram)"
              className="w-full rounded-xl border border-[var(--border-color)] px-3.5 py-2 text-xs text-[var(--text-primary)] bg-[var(--bg-input)] focus:outline-none focus:ring-2 focus:ring-aegis-rose-accent/40"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={handleUpdateDossier}
              disabled={isUpdating}
              className="bg-[var(--bg-card-subtle)] hover:bg-[var(--border-color)] text-[var(--text-primary)] border border-[var(--border-color)] px-4 py-2 rounded-full text-xs font-bold transition-colors"
            >
              {isUpdating ? "Updating..." : "Update Report Text"}
            </button>
          </div>
        </div>
      </div>

      {/* Statutory Legal Sections (India) */}
      <div className="card-warm p-6 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          <Scale className="w-4 h-4 text-[var(--text-muted)]" />
          <span>Provisions that may be relevant (confirm with a lawyer or legal-aid clinic)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pack.legal_provisions.map((sec, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-1 text-xs">
              <span className="font-bold text-[var(--text-primary)] block">{sec.act} — {sec.section}</span>
              <span className="font-semibold text-[var(--text-secondary)] block text-[11px]">{sec.offense}</span>
              <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed font-normal">{sec.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Generated Dossier Preview & Export */}
      <div className="card-warm p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-color)]">
          <div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Report Output
            </span>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mt-0.5">
              Structured Complaint Report (National Cyber Crime Format)
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyDossier}
              className="flex items-center space-x-1.5 text-xs text-[var(--text-primary)] bg-[var(--bg-card-subtle)] hover:bg-[var(--border-color)] px-4 py-2 rounded-full border border-[var(--border-color)] transition-colors font-bold shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              onClick={downloadTextFile}
              className="flex items-center space-x-1.5 text-xs text-white bg-aegis-rose-accent hover:bg-aegis-rose-hover px-4 py-2 rounded-full shadow-sm transition-colors font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.txt)</span>
            </button>
          </div>
        </div>

        <div className="bg-[var(--bg-card-subtle)] p-4 rounded-xl border border-[var(--border-color)] font-mono text-xs text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto select-all">
          {pack.formatted_dossier_text}
        </div>

        {/* Portal submission guidance */}
        <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] space-y-1">
          <strong className="font-bold block text-[var(--text-primary)]">
            How to Submit on cybercrime.gov.in:
          </strong>
          <p>1. Open <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="underline font-bold text-[var(--text-primary)]">cybercrime.gov.in</a> or dial <strong>1930</strong>.</p>
          <p>2. Select "Report Women/Child Related Crime" ➔ "Cyber Stalking / Blackmailing".</p>
          <p>3. Paste the report text above into the complaint details box and attach original screenshots.</p>
        </div>
      </div>
    </div>
  );
};
