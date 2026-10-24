import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderLock, 
  Archive, 
  Clock, 
  GitCompare, 
  Plus, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  Image as ImageIcon,
  Headphones,
  MessageSquare,
  Link as LinkIcon,
  FileText,
  AlertTriangle,
  Compass,
  FileCheck2,
  Lock,
  ChevronRight,
  ShieldCheck,
  Shield
} from 'lucide-react';
import { IncidentData, ChangeComparison } from '../lib/api';

interface OverviewViewProps {
  incident: IncidentData | null;
  casesList?: Array<any>;
  activeCaseId?: string;
  onSelectCase?: (id: string) => void;
  onCreateCase?: (title: string, desc?: string) => void;
  changes: ChangeComparison | null;
  loading: boolean;
  onRefresh: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ 
  incident, 
  casesList = [],
  activeCaseId,
  onSelectCase,
  onCreateCase,
  changes, 
  loading,
  onRefresh
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'proof' | 'changes' | 'timeline' | 'connected' | 'todo'>('proof');
  const [revealedItems, setRevealedItems] = useState<Record<string, boolean>>({});
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const toggleBlur = (id: string) => {
    setRevealedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateNewCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    if (onCreateCase) {
      onCreateCase(newTitle.trim(), newDesc.trim());
      setNewTitle('');
      setNewDesc('');
      setShowNewCaseModal(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-[var(--text-muted)]">
        <p className="text-base font-semibold">Opening your safety space...</p>
      </div>
    );
  }

  const severityPill = (level: string) => {
    if (level === 'CRITICAL') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
          Very Serious
        </span>
      );
    }
    if (level === 'HIGH') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
          Serious
        </span>
      );
    }
    if (level === 'MODERATE') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
          Needs Attention
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
        Low Worry
      </span>
    );
  };

  const getProofIcon = (mimeType?: string, fileName?: string) => {
    const fn = (fileName || '').toLowerCase();
    const mt = (mimeType || '').toLowerCase();
    if (mt.startsWith('image/') || fn.endsWith('.png') || fn.endsWith('.jpg') || fn.endsWith('.jpeg')) {
      return <ImageIcon className="w-4 h-4 text-[var(--accent-rose)]" />;
    }
    if (mt.startsWith('audio/') || fn.endsWith('.mp3') || fn.endsWith('.m4a') || fn.endsWith('.wav')) {
      return <Headphones className="w-4 h-4 text-blue-500" />;
    }
    if (fn.includes('link') || fn.includes('url')) {
      return <LinkIcon className="w-4 h-4 text-amber-500" />;
    }
    if (fn.includes('note')) {
      return <FileText className="w-4 h-4 text-emerald-500" />;
    }
    return <MessageSquare className="w-4 h-4 text-[var(--text-muted)]" />;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Header and Case Creator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border-color)]">
        <div>
          <span className="text-xs uppercase font-bold text-[var(--text-muted)] tracking-wider">Safety Workspace</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-0.5">
            My Cases & Proof
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Each case organizes all screenshots, audio, and messages about a specific situation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowNewCaseModal(true)}
            className="flex items-center space-x-1.5 bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-[var(--accent-rose)]" />
            <span>New Case</span>
          </button>
          <button
            onClick={() => navigate('/analyze')}
            className="flex items-center space-x-1.5 bg-[var(--accent-rose)] hover:bg-[var(--accent-rose-hover)] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all"
          >
            <span>Add Proof</span>
          </button>
        </div>
      </div>

      {/* New Case Creator Modal */}
      {showNewCaseModal && (
        <div className="card-warm p-6 border-2 border-[var(--accent-rose-border)] shadow-md space-y-4 animate-in fade-in">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-base font-bold text-[var(--text-primary)]">Start a New Case</h3>
            <button 
              onClick={() => setShowNewCaseModal(false)}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] font-semibold"
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleCreateNewCaseSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Case Name or Description
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Unwanted messages from Instagram, Suspicious caller"
                className="w-full rounded-xl border border-[var(--border-color)] px-3.5 py-2 text-sm text-[var(--text-primary)] bg-[var(--bg-input)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-rose)]/40 transition-colors"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Any quick notes (optional)
              </label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="e.g. Started reaching out last week"
                className="w-full rounded-xl border border-[var(--border-color)] px-3.5 py-2 text-sm text-[var(--text-primary)] bg-[var(--bg-input)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-rose)]/40 transition-colors"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setShowNewCaseModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="bg-[var(--accent-rose)] hover:bg-[var(--accent-rose-hover)] disabled:opacity-50 text-white px-5 py-2 rounded-full text-xs font-semibold shadow-sm"
              >
                Create Case
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Multi-Case Switcher Chips */}
      {casesList.length > 1 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
            Select a Situation ({casesList.length} total)
          </label>
          <div className="flex flex-wrap items-center gap-2 pb-1">
            {casesList.map((c) => {
              const isSelected = (incident?.id === c.id) || (activeCaseId === c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCase && onSelectCase(c.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-[var(--accent-rose-light)] text-[var(--accent-rose)] border-[var(--accent-rose-border)] shadow-sm'
                      : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:bg-[var(--bg-card-subtle)]'
                  }`}
                >
                  <span>{c.title}</span>
                  {severityPill(c.risk_level)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Case Main Card */}
      {incident ? (
        <div className="card-warm p-6 sm:p-8 space-y-6">
          {/* Active Case Title and Severity */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-color)]">
            <div>
              <span className="text-[11px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Active Case</span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-0.5">
                {incident.title}
              </h2>
              {incident.description && (
                <p className="text-xs text-[var(--text-secondary)] mt-1">{incident.description}</p>
              )}
            </div>
            <div className="self-start sm:self-auto">
              {severityPill(incident.risk_level)}
            </div>
          </div>

          {/* Case Navigation Tabs (Flex-wrap, zero scrollbars) */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-color)] pb-3 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('proof')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'proof'
                  ? 'bg-[var(--accent-rose-light)] text-[var(--accent-rose)] border border-[var(--accent-rose-border)] font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)]'
              }`}
            >
              Saved Proof ({incident.evidence_items.length})
            </button>

            <button
              onClick={() => setActiveTab('changes')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1 ${
                activeTab === 'changes'
                  ? 'bg-[var(--accent-rose-light)] text-[var(--accent-rose)] border border-[var(--accent-rose-border)] font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)]'
              }`}
            >
              <span>What Changed</span>
              {changes && changes.new_threat_signals.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'timeline'
                  ? 'bg-[var(--accent-rose-light)] text-[var(--accent-rose)] border border-[var(--accent-rose-border)] font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)]'
              }`}
            >
              Timeline ({incident.events.length})
            </button>

            <button
              onClick={() => setActiveTab('connected')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'connected'
                  ? 'bg-[var(--accent-rose-light)] text-[var(--accent-rose)] border border-[var(--accent-rose-border)] font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)]'
              }`}
            >
              Connected Info ({incident.accounts.length})
            </button>

            <button
              onClick={() => setActiveTab('todo')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'todo'
                  ? 'bg-[var(--accent-rose-light)] text-[var(--accent-rose)] border border-[var(--accent-rose-border)] font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)]'
              }`}
            >
              What To Do
            </button>
          </div>

          {/* TAB 1: SAVED PROOF */}
          {activeTab === 'proof' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">
                  Screenshots, voice notes, and messages saved with tamper-proof safety stamps.
                </span>
                <button
                  onClick={() => navigate('/analyze')}
                  className="text-xs font-semibold text-[var(--accent-rose)] hover:underline flex items-center space-x-1"
                >
                  <span>Add screenshot or audio</span>
                </button>
              </div>

              {incident.evidence_items.length === 0 ? (
                <div className="p-8 text-center bg-[var(--bg-card-subtle)] rounded-xl border border-[var(--border-color)] space-y-2">
                  <p className="text-sm font-bold text-[var(--text-primary)]">No proof items in this case yet</p>
                  <p className="text-xs text-[var(--text-muted)]">You can upload a screenshot, audio note, or chat message to begin.</p>
                  <button
                    onClick={() => navigate('/analyze')}
                    className="mt-2 bg-[var(--accent-rose)] text-white px-4 py-2 rounded-full text-xs font-semibold"
                  >
                    Add first proof item
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {incident.evidence_items.map((item) => {
                    const isRevealed = revealedItems[item.id] || !item.is_sensitive;

                    return (
                      <div key={item.id} className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs space-y-2.5 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2 font-semibold text-[var(--text-primary)]">
                            {getProofIcon(item.mime_type, item.file_name)}
                            <span>{item.file_name}</span>
                            <span className="text-[var(--text-muted)]">·</span>
                            <span className="font-normal text-[var(--text-secondary)]">{item.source_platform}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            {item.is_sensitive && (
                              <button
                                onClick={() => toggleBlur(item.id)}
                                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline flex items-center space-x-1"
                              >
                                {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                <span>{isRevealed ? "Hide" : "Reveal"}</span>
                              </button>
                            )}
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/25">
                              Sealed
                            </span>
                          </div>
                        </div>

                        {/* Content text or preview */}
                        <div className={`p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-sans leading-relaxed transition-all ${
                          item.is_sensitive && !isRevealed ? 'filter blur-sm select-none' : ''
                        }`}>
                          "{item.excerpt_text || "Content safely saved."}"
                        </div>

                        {/* Footer stamp */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[var(--text-muted)] font-mono gap-1 pt-1">
                          <span>Safety Stamp: {item.file_hash_sha256.slice(0, 18)}…</span>
                          <span>Saved: {new Date(item.captured_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WHAT CHANGED */}
          {activeTab === 'changes' && (
            <div className="space-y-4">
              {changes ? (
                <div className="bg-[var(--bg-card-subtle)] p-5 rounded-xl border border-[var(--border-color)] space-y-4 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <GitCompare className="w-4 h-4 text-amber-500" />
                      <span>Comparison with Earlier Messages</span>
                    </span>
                    <button
                      onClick={() => navigate('/changes')}
                      className="text-xs font-semibold text-[var(--accent-rose)] hover:underline"
                    >
                      Full side-by-side view
                    </button>
                  </div>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
                    {changes.why_it_changed}
                  </p>

                  {changes.new_threat_signals.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-[var(--text-primary)] block mb-2">New warning signs detected:</span>
                      <div className="flex flex-wrap gap-2">
                        {changes.new_threat_signals.map((sig, i) => (
                          <span key={i} className="text-xs bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)] px-3 py-1 rounded-md font-semibold">
                            + {sig}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-[var(--text-muted)]">No recent changes detected yet.</p>
              )}
            </div>
          )}

          {/* TAB 3: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-muted)]">Events in the order they took place:</span>
                <button
                  onClick={() => navigate('/timeline')}
                  className="text-xs font-semibold text-[var(--accent-rose)] hover:underline"
                >
                  Expanded timeline
                </button>
              </div>

              <div className="space-y-3">
                {incident.events.map((ev, idx) => (
                  <div key={ev.id} className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs space-y-1.5 transition-colors">
                    <div className="flex justify-between items-center font-semibold text-[var(--text-primary)]">
                      <span>Event #{idx + 1} · {ev.stage.replace(/_/g, ' ')}</span>
                      <span className="text-[var(--text-muted)] font-normal">{new Date(ev.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="p-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)]">
                      "{ev.raw_content}"
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      Platform: {ev.source_platform} {ev.account_handle ? `· From: ${ev.account_handle}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CONNECTED INFO */}
          {activeTab === 'connected' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-muted)]">Accounts and matching clues linked to this case:</span>
                <button
                  onClick={() => navigate('/linkage')}
                  className="text-xs font-semibold text-[var(--accent-rose)] hover:underline"
                >
                  Full clue analysis
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {incident.accounts.map((acc) => (
                  <div key={acc.id} className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs space-y-1 transition-colors">
                    <span className="font-bold text-sm text-[var(--text-primary)]">{acc.handle}</span>
                    <p className="text-[var(--text-secondary)] font-normal">Platform: {acc.platform}</p>
                    <p className="text-[var(--text-muted)] text-[11px]">First seen: {new Date(acc.first_seen).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: WHAT TO DO */}
          {activeTab === 'todo' && (
            <div className="space-y-4">
              <span className="text-xs text-[var(--text-muted)] block">Recommended immediate steps for this situation:</span>
              <div className="space-y-2">
                <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs space-y-1 transition-colors">
                  <span className="font-bold text-[var(--text-primary)]">1. Keep this proof safe before blocking</span>
                  <p className="text-[var(--text-secondary)] leading-relaxed font-normal">
                    Do not delete the chat yet. AEGIS has safely stamped the messages and screenshots. Once proof is saved, you can restrict or mute the user so they cannot disturb you.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs space-y-1 transition-colors">
                  <span className="font-bold text-[var(--text-primary)]">2. Generate a police-ready report pack</span>
                  <p className="text-[var(--text-secondary)] leading-relaxed font-normal">
                    AEGIS creates a formal summary citing relevant provisions (IPC 354D, IT Act 66E/67A) and lists all evidence with dates and safety stamps.
                  </p>
                  <button
                    onClick={() => navigate('/complaint')}
                    className="mt-2 bg-[var(--accent-rose)] hover:bg-[var(--accent-rose-hover)] text-white px-4 py-2 rounded-full font-semibold text-xs transition-all shadow-sm"
                  >
                    Open Report Pack
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs space-y-1 transition-colors">
                  <span className="font-bold text-[var(--text-primary)]">3. Talk to someone you trust or official helplines</span>
                  <p className="text-[var(--text-secondary)] leading-relaxed font-normal">
                    You do not have to handle this in isolation. Support is available 24/7 on 181 (Women Helpline) and 1930 (National Cyber Crime).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Row at Bottom of Case (Zero Emojis) */}
          <div className="pt-4 border-t border-[var(--border-color)] flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/complaint')}
              className="bg-[var(--accent-rose)] hover:bg-[var(--accent-rose-hover)] text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-all shadow-sm flex items-center space-x-1.5"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Open Official Report Pack</span>
            </button>
            <button
              onClick={() => navigate('/rapid-response')}
              className="bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] px-5 py-2.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5"
            >
              <Compass className="w-4 h-4 text-[var(--text-muted)]" />
              <span>Next Steps Checklist</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="card-warm p-8 text-center space-y-3">
          <h2 className="font-serif text-xl font-bold text-[var(--text-primary)]">No Active Case Selected</h2>
          <p className="text-sm text-[var(--text-secondary)]">Start a case or load sample data from your profile to begin.</p>
          <button
            onClick={() => setShowNewCaseModal(true)}
            className="bg-[var(--accent-rose)] text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-sm"
          >
            Start a Case
          </button>
        </div>
      )}

      {/* Helpful Guidance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="card-warm p-5 space-y-1">
          <h4 className="font-bold text-sm text-[var(--text-primary)]">Multiple Situations</h4>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Dealing with more than one person? You can keep separate cases to prevent confusing screenshots from different senders.
          </p>
        </div>
        <div className="card-warm p-5 space-y-1">
          <h4 className="font-bold text-sm text-[var(--text-primary)]">Quick Exit (<kbd className="font-mono text-[11px] bg-[var(--border-subtle)] px-1.5 py-0.5 rounded">Esc</kbd>)</h4>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Press the Esc key at any time to instantly replace this entire app with an ordinary personal notes and weather screen.
          </p>
        </div>
      </div>
    </div>
  );
};
