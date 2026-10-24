import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Image as ImageIcon, 
  Headphones, 
  MessageSquare, 
  Link as LinkIcon, 
  FileText, 
  CheckCircle2, 
  Plus, 
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight
} from 'lucide-react';
import { analyzeInput, createIncident, IncidentData } from '../lib/api';

interface AnalyzeViewProps {
  incident: IncidentData | null;
  casesList?: Array<any>;
  onEvidenceAdded: () => void;
}

export const AnalyzeView: React.FC<AnalyzeViewProps> = ({ 
  incident, 
  casesList = [], 
  onEvidenceAdded 
}) => {
  const navigate = useNavigate();
  const [selectedCaseId, setSelectedCaseId] = useState<string>(incident?.id || (casesList.length > 0 ? casesList[0].id : 'new'));
  const [isCreatingNew, setIsCreatingNew] = useState(casesList.length === 0 && !incident);
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [proofType, setProofType] = useState<'screenshot' | 'audio' | 'message' | 'link' | 'note'>('screenshot');
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('Instagram Direct');
  const [handle, setHandle] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const proofTypes = [
    { id: 'screenshot', label: 'Screenshot', hint: 'Upload a screenshot from Instagram, WhatsApp, etc.' },
    { id: 'audio', label: 'Audio Note', hint: 'Voice message or call recording' },
    { id: 'message', label: 'Message Text', hint: 'Paste text from a chat or SMS' },
    { id: 'link', label: 'Link / Profile', hint: 'Paste an account or post URL' },
    { id: 'note', label: 'Personal Note', hint: 'Write down what happened in your own words' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => setFilePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleRunAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim() && !fileName) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAddedSuccess(false);

    try {
      const res = await analyzeInput({
        content: content.trim() || `Uploaded ${proofType}: ${fileName}`,
        content_type: proofType,
        source_platform: platform,
        account_handle: handle.trim() ? handle.trim() : undefined,
        incident_id: selectedCaseId !== 'new' ? selectedCaseId : undefined,
        auto_add_to_case: false
      });
      setAnalysisResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCommitToCase = async () => {
    setIsAnalyzing(true);
    try {
      let targetId = selectedCaseId;
      if (isCreatingNew || targetId === 'new') {
        const titleToUse = newCaseTitle.trim() || 'New Situation';
        const newCase = await createIncident(titleToUse, `Started with ${proofType} proof`);
        targetId = newCase.id;
      }

      await analyzeInput({
        content: content.trim() || `Uploaded ${proofType}: ${fileName}`,
        content_type: proofType,
        source_platform: platform,
        account_handle: handle.trim() ? handle.trim() : undefined,
        incident_id: targetId,
        auto_add_to_case: true
      });

      setAddedSuccess(true);
      onEvidenceAdded();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Editorial Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Add Proof or Notes
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Save screenshots, audio notes, messages, or links. AEGIS checks the words for warning signs and seals the proof safely with a date and safety stamp.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="card-warm p-6 sm:p-8 space-y-6">
        {/* Step 1: Case Selection */}
        <div>
          <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            1. Which case does this belong to?
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={isCreatingNew ? 'new' : selectedCaseId}
              onChange={(e) => {
                if (e.target.value === 'new') {
                  setIsCreatingNew(true);
                  setSelectedCaseId('new');
                } else {
                  setIsCreatingNew(false);
                  setSelectedCaseId(e.target.value);
                }
              }}
              className="flex-1 rounded-xl border border-[var(--border-color)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] bg-[var(--bg-input)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-rose)]/40 transition-colors"
            >
              {casesList.length > 0 ? (
                casesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    Case: {c.title}
                  </option>
                ))
              ) : (
                <option value={incident?.id || 'default'}>
                  Case: {incident?.title || 'Current Situation'}
                </option>
              )}
              <option value="new">+ Start a new case</option>
            </select>
          </div>

          {isCreatingNew && (
            <div className="mt-3">
              <input
                type="text"
                value={newCaseTitle}
                onChange={(e) => setNewCaseTitle(e.target.value)}
                placeholder="Name this situation (e.g. Unwanted messages from stranger, WhatsApp caller)"
                className="w-full rounded-xl border border-[var(--border-color)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] bg-[var(--bg-input)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-rose)]/40 transition-colors"
              />
            </div>
          )}
        </div>

        {/* Step 2: Proof Type Tabs (Clean, zero emojis) */}
        <div>
          <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            2. What kind of proof is it?
          </label>
          <div className="flex flex-wrap gap-2">
            {proofTypes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setProofType(t.id as any);
                  setAnalysisResult(null);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                  proofType === t.id
                    ? 'bg-[var(--accent-rose)] text-white border-[var(--accent-rose)] shadow-sm'
                    : 'bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] border-[var(--border-color)] hover:bg-[var(--border-subtle)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: File Upload Area (Screenshots / Audio) */}
        {(proofType === 'screenshot' || proofType === 'audio') && (
          <div className="bg-[var(--bg-card-subtle)] p-5 rounded-2xl border-2 border-dashed border-[var(--border-color)] space-y-3 transition-colors">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--text-primary)]">
              {proofType === 'screenshot' ? <ImageIcon className="w-4 h-4 text-[var(--accent-rose)]" /> : <Headphones className="w-4 h-4 text-blue-500" />}
              <span>Choose your {proofType === 'screenshot' ? 'screenshot file' : 'audio recording'}</span>
            </div>

            <input
              type="file"
              onChange={handleFileChange}
              accept={proofType === 'screenshot' ? "image/*" : "audio/*"}
              className="text-xs text-[var(--text-secondary)] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[var(--accent-rose-light)] file:text-[var(--accent-rose)] hover:file:opacity-90 cursor-pointer"
            />

            {filePreview && proofType === 'screenshot' && (
              <div className="pt-2">
                <img
                  src={filePreview}
                  alt="Upload preview"
                  className="max-h-48 rounded-xl border border-[var(--border-color)] shadow-sm"
                />
              </div>
            )}

            <p className="text-xs text-[var(--text-muted)]">
              The file remains safely on your device. Type or quote what is shown below so AEGIS can check the words.
            </p>
          </div>
        )}

        {/* Step 4: Text Content */}
        <form onSubmit={handleRunAnalysis} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              {proofType === 'screenshot' ? 'What does this screenshot say or show? (Quote any threats or demands)' :
               proofType === 'audio' ? 'What was said in this audio recording?' :
               proofType === 'message' ? 'Message text' :
               proofType === 'link' ? 'Paste profile link or post URL' :
               'Write what happened'}
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type or paste text here…"
              className="w-full rounded-xl border border-[var(--border-color)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] bg-[var(--bg-input)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-rose)]/40 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Sender Handle or Phone Number (Optional)
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="e.g. @unknown_user01, +91 ..."
                className="w-full rounded-xl border border-[var(--border-color)] px-3.5 py-2 text-sm text-[var(--text-primary)] bg-[var(--bg-input)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-rose)]/40 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Where did this happen?
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] px-3.5 py-2 text-sm text-[var(--text-primary)] bg-[var(--bg-input)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-rose)]/40 transition-colors"
              >
                <option value="Instagram Direct">Instagram</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Snapchat">Snapchat</option>
                <option value="Telegram">Telegram</option>
                <option value="Phone Call / SMS">Phone / SMS</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isAnalyzing || (!content.trim() && !fileName)}
              className="bg-[var(--accent-rose)] hover:bg-[var(--accent-rose-hover)] text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-sm disabled:opacity-50 transition-all flex items-center space-x-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isAnalyzing ? "Checking words..." : "Check this item"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Result Card */}
      {analysisResult && (
        <div className="card-warm p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-color)]">
            <h2 className="font-serif text-lg font-bold text-[var(--text-primary)]">
              What We Noticed
            </h2>
            <span className="text-xs font-semibold text-[var(--text-primary)] bg-[var(--bg-card-subtle)] px-3 py-1 rounded-full border border-[var(--border-color)]">
              Severity: {analysisResult.risk_level.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-3">
            {analysisResult.signals.map((sig: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs space-y-1">
                <div className="font-bold text-[var(--text-primary)]">{sig.signal_type}</div>
                <p className="text-[var(--text-secondary)] leading-relaxed font-normal">{sig.rationale}</p>
                {sig.excerpt && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 italic">
                    Found phrase: "{sig.excerpt}"
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="bg-[var(--bg-card-subtle)] p-4 rounded-xl text-xs text-[var(--text-primary)] leading-relaxed border border-[var(--border-color)]">
            <strong className="block text-[var(--text-primary)] mb-0.5">Why this matters:</strong>
            {analysisResult.why_it_matters}
          </div>

          <div className="pt-4 border-t border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-[var(--text-muted)]">
              Ready to store this in your case?
            </span>

            {addedSuccess ? (
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/25">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Proof saved with safety stamp
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/overview')}
                  className="bg-[var(--accent-rose)] hover:bg-[var(--accent-rose-hover)] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all flex items-center space-x-1"
                >
                  <span>View in Case</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleCommitToCase}
                disabled={isAnalyzing}
                className="bg-[var(--accent-rose)] hover:bg-[var(--accent-rose-hover)] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save to this case</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
