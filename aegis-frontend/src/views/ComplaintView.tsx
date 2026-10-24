import React, { useEffect, useState } from 'react';
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
  const [pack, setPack] = useState<ComplaintPackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userStatement, setUserStatement] = useState('');
  const [suspectIdentifiers, setSuspectIdentifiers] = useState('@unknown_user01, @unknown_user_01 (Instagram)');
  const [copied, setCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-warm-600">
        <p className="font-bold text-lg">Preparing your official report pack...</p>
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-warm-600">
        <p>No report pack available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Editorial Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-warm-500 uppercase tracking-wider">
          <span>Ready to File</span>
          <span>·</span>
          <span>Official Report Pack</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal mt-1">
          Prepare Official Report Pack
        </h1>
        <p className="text-sm text-warm-600 mt-1">
          Organizes your timeline, proof items with safety stamps, and sender accounts into a formal statement ready for cybercrime.gov.in or local police stations.
        </p>
      </div>

      {/* Strict Privacy & Action Banner */}
      <div className="bg-warm-100 rounded-2xl border border-warm-300 p-5 flex items-start space-x-3">
        <Info className="w-5 h-5 text-warm-600 shrink-0 mt-0.5" />
        <div className="text-xs text-warm-800 leading-relaxed">
          <strong className="font-bold block text-warm-900 mb-0.5">
            You Remain in Full Control
          </strong>
          {pack.disclaimer} You can edit your personal statement, review every statutory section, and copy or download the file when you are ready to file independently.
        </div>
      </div>

      {/* Interactive Statement & Suspect Editor */}
      <div className="card-warm p-6 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-warm-600 uppercase tracking-wider">
          <Edit3 className="w-4 h-4 text-warm-500" />
          <span>Customize Your Complainant Statement</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-warm-700 mb-1">
              Your Incident Statement
            </label>
            <textarea
              rows={3}
              value={userStatement}
              onChange={(e) => setUserStatement(e.target.value)}
              className="w-full rounded-xl border border-warm-300 px-3.5 py-2.5 text-xs text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-aegis-rose-accent/40"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-warm-700 mb-1">
              Suspect Handles / Identifiers
            </label>
            <input
              type="text"
              value={suspectIdentifiers}
              onChange={(e) => setSuspectIdentifiers(e.target.value)}
              className="w-full rounded-xl border border-warm-300 px-3.5 py-2 text-xs text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-aegis-rose-accent/40"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={handleUpdateDossier}
              disabled={isUpdating}
              className="bg-warm-100 hover:bg-warm-200 text-warm-800 border border-warm-300 px-4 py-2 rounded-full text-xs font-bold transition-colors"
            >
              {isUpdating ? "Updating..." : "Update Report Text"}
            </button>
          </div>
        </div>
      </div>

      {/* Statutory Legal Sections (India) */}
      <div className="card-warm p-6 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-warm-600 uppercase tracking-wider">
          <Scale className="w-4 h-4 text-warm-500" />
          <span>Applicable Indian Statutory Sections</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pack.legal_provisions.map((sec, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-warm-50 border border-warm-200 space-y-1 text-xs">
              <span className="font-bold text-warm-900 block">{sec.act} — {sec.section}</span>
              <span className="font-semibold text-warm-700 block text-[11px]">{sec.offense}</span>
              <p className="text-warm-600 text-[11px] leading-relaxed font-normal">{sec.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Generated Dossier Preview & Export */}
      <div className="card-warm p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-warm-200">
          <div>
            <span className="text-xs font-bold text-warm-500 uppercase tracking-wider">
              Report Output
            </span>
            <h2 className="text-lg font-bold text-charcoal mt-0.5">
              Structured Complaint Report (National Cyber Crime Format)
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyDossier}
              className="flex items-center space-x-1.5 text-xs text-warm-800 bg-white hover:bg-warm-100 px-4 py-2 rounded-full border border-warm-300 transition-colors font-bold shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-aegis-sage-accent" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-warm-600" />
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

        <div className="bg-warm-50 p-4 rounded-xl border border-warm-200 font-mono text-xs text-warm-900 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto select-all">
          {pack.formatted_dossier_text}
        </div>

        {/* Portal submission guidance */}
        <div className="p-4 rounded-xl bg-warm-100/70 border border-warm-300 text-xs text-warm-800 space-y-1">
          <strong className="font-bold block text-warm-900">
            How to Submit on cybercrime.gov.in:
          </strong>
          <p>1. Open <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="underline font-bold text-charcoal">cybercrime.gov.in</a> or dial <strong>1930</strong>.</p>
          <p>2. Select "Report Women/Child Related Crime" ➔ "Cyber Stalking / Blackmailing".</p>
          <p>3. Paste the report text above into the complaint details box and attach original screenshots.</p>
        </div>
      </div>
    </div>
  );
};
