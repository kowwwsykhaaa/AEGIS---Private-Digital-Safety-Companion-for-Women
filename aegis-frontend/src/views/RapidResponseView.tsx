import React, { useState } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldAlert, 
  Lock,
  ChevronDown,
  Info,
  HeartHandshake
} from 'lucide-react';

export const RapidResponseView: React.FC = () => {
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (num: string) => {
    setCompletedSteps(prev => ({ ...prev, [num]: !prev[num] }));
  };

  const grievanceTemplate = `To: Grievance Officer,

I am writing to formally report targeted harassment and online intimidation perpetrated against me by account @unknown_user01 and @unknown_user_01 in violation of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.

The harasser has sent persistent unwanted threats, claimed knowledge of my physical location, and made intimidating demands.

Details:
- Reported Handles: @unknown_user01, @unknown_user_01
- Offenses: Cyberstalking, Criminal Intimidation (Bharatiya Nyaya Sanhita / IT Act 2000).
- Proof preserved with tamper-proof safety stamps via AEGIS.

I request immediate review, disabling/removal of the infringing accounts, and preservation of access logs in accordance with Rule 3(2)(b) of the IT Rules.

Complainant.`;

  const copyNotice = () => {
    navigator.clipboard.writeText(grievanceTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const steps = [
    {
      num: "01",
      title: "Save Proof Before Blocking",
      detail: "Do not delete chats immediately. Screenshots showing sender usernames and complete messages provide crucial proof for police."
    },
    {
      num: "02",
      title: "Do Not Reply or Negotiate",
      detail: "Avoid arguing, pleading, or answering questions. Harassers often use replies to test your boundaries. Silence gives them less leverage."
    },
    {
      num: "03",
      title: "Tighten Social Media Privacy",
      detail: "Switch accounts to Private, restrict message requests from unknown accounts, and turn off active status and read receipts."
    },
    {
      num: "04",
      title: "Remove Location & College Mentions",
      detail: "Remove mentions of your college campus, workplace, gym, or neighborhood check-ins from public bios and highlight stories."
    },
    {
      num: "05",
      title: "Protect Private Photos via StopNCII.org",
      detail: "If intimate photographs are threatened, visit StopNCII.org. It creates private digital safety fingerprints directly on your device to block re-uploading across major platforms without exposing your photos."
    },
    {
      num: "06",
      title: "Ready Your Report Pack for Cyber Crime (1930)",
      detail: "When ready, download your pre-formatted AEGIS Report Pack for direct submission to cybercrime.gov.in."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Editorial Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          <span>Actionable Guidance</span>
          <span>·</span>
          <span>Safety Checklist</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
          Immediate Action Checklist
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          A calm, practical sequence of steps to protect your peace of mind and secure your digital presence right now.
        </p>
      </div>

      {/* Six Prioritized Steps */}
      <div className="space-y-4">
        {steps.map((st) => {
          const isDone = completedSteps[st.num];
          return (
            <div 
              key={st.num}
              onClick={() => toggleStep(st.num)}
              className={`card-warm p-5 cursor-pointer transition-all ${
                isDone ? 'bg-[var(--bg-card-subtle)] opacity-80' : 'hover:border-aegis-rose-border'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                  isDone 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-aegis-rose-light text-aegis-rose-text border border-aegis-rose-border'
                }`}>
                  {isDone ? <Check className="w-4 h-4" /> : st.num}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-base font-bold text-[var(--text-primary)] ${isDone ? 'line-through text-[var(--text-muted)]' : ''}`}>
                      {st.title}
                    </h3>
                    <span className="text-xs text-[var(--text-muted)] font-normal">
                      {isDone ? "Completed" : "Tap when done"}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
                    {st.detail}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Platform Grievance Template Card */}
      <div className="card-warm p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-color)]">
          <div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Platform Reporting
            </span>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mt-0.5">
              Notice to Platform Grievance Officer (India IT Rules)
            </h2>
          </div>

          <button
            onClick={copyNotice}
            className="flex items-center space-x-1.5 text-xs text-[var(--text-primary)] bg-[var(--bg-card-subtle)] hover:bg-[var(--border-color)] px-4 py-2 rounded-full border border-[var(--border-color)] transition-colors font-bold shadow-sm self-start sm:self-auto"
          >
            {copiedTemplate ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Notice Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>Copy Notice Template</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-[var(--bg-card-subtle)] p-4 rounded-xl border border-[var(--border-color)] font-mono text-xs text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
          {grievanceTemplate}
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] space-y-1">
          <strong className="font-bold block text-[var(--text-primary)]">
            How to Send:
          </strong>
          <p>Under Rule 3(2)(b) of the Information Technology Rules 2021, platforms in India are required to acknowledge grievance complaints within 24 hours and resolve harassment or blackmail reports promptly.</p>
        </div>
      </div>
    </div>
  );
};
