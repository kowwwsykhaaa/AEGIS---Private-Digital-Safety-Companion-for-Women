import React, { useEffect, useState } from 'react';
import { 
  PhoneCall, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck, 
  Info,
  Clock,
  HeartHandshake
} from 'lucide-react';
import { fetchHelplines } from '../lib/api';

export const ImmediateHelpView: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const helperName = localStorage.getItem('aegis_helper_name');
  const helperPhone = localStorage.getItem('aegis_helper_phone');

  useEffect(() => {
    fetchHelplines()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const helplines = data?.helplines || [
    {
      number: "112",
      title: "National Emergency Helpline (India)",
      description: "Direct immediate dispatch for police, emergency rescue, or medical assistance.",
      type: "emergency",
      available: "24/7 Toll-Free"
    },
    {
      number: "181",
      title: "Women Helpline (India)",
      description: "Crisis counseling, stalking support, domestic safety, and immediate guidance.",
      type: "support",
      available: "24/7 Toll-Free"
    },
    {
      number: "1930",
      title: "National Cyber Crime Helpline",
      description: "Dedicated assistance for online harassment, blackmail, stalking, and cybercrime (cybercrime.gov.in).",
      type: "cybercrime",
      available: "24/7 Toll-Free"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Editorial Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          <span>Emergency Assistance</span>
          <span>·</span>
          <span>Verified Helplines</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
          Immediate Official Help & Helplines
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          AEGIS is your personal safety companion, not an emergency dispatcher. If you feel in physical danger right now, please reach out to official emergency authorities immediately.
        </p>
      </div>

      {/* Someone I Trust Card (if configured) */}
      {helperPhone && (
        <div className="card-warm p-6 bg-aegis-rose-light/40 border-2 border-aegis-rose-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-aegis-rose-accent text-white flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold text-aegis-rose-text tracking-wider">
                Someone You Trust
              </span>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                {helperName || "Trusted Contact"}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">Saved in your private safety profile</p>
            </div>
          </div>

          <a
            href={`tel:${helperPhone}`}
            className="bg-aegis-rose-accent hover:bg-aegis-rose-hover text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-sm flex items-center space-x-2 transition-all self-start sm:self-auto"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call {helperPhone}</span>
          </a>
        </div>
      )}

      {/* Safety Notice Banner */}
      <div className="bg-[var(--bg-card-subtle)] rounded-2xl border border-[var(--border-color)] p-5 flex items-start space-x-3">
        <Info className="w-5 h-5 text-[var(--text-muted)] shrink-0 mt-0.5" />
        <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
          <strong className="font-bold block mb-0.5 text-[var(--text-primary)]">Direct Official Support:</strong>
          Calling the toll-free numbers below connects you immediately to trained personnel, women's support counselors, and national cyber cell officers who can act upon your report.
        </div>
      </div>

      {/* Verified Helplines Cards */}
      <div className="space-y-4">
        {helplines.map((h: any, idx: number) => {
          const isEmergency = h.number === '112';

          return (
            <div
              key={idx}
              className={`card-warm p-6 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isEmergency ? 'border-2 border-red-500/40 bg-red-50/10' : ''
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className={`text-2xl font-extrabold font-mono tracking-tight ${
                    isEmergency ? 'text-red-600 dark:text-red-400' : 'text-[var(--text-primary)]'
                  }`}>
                    {h.number}
                  </span>
                  <span>·</span>
                  <span className="text-base font-bold text-[var(--text-primary)]">
                    {h.title}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] max-w-xl leading-relaxed font-normal">
                  {h.description}
                </p>

                <div className="flex items-center space-x-2 text-[11px] text-[var(--text-muted)] font-bold pt-1">
                  <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>Availability: {h.available}</span>
                </div>
              </div>

              <div className="shrink-0 self-start sm:self-center">
                <a
                  href={`tel:${h.number}`}
                  className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-bold shadow-sm transition-colors ${
                    isEmergency
                      ? 'bg-red-700 hover:bg-red-800 text-white'
                      : 'bg-aegis-rose-accent hover:bg-aegis-rose-hover text-white'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Dial {h.number}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Online Official Portals */}
      <div className="card-warm p-6 space-y-4">
        <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          Official Online Portals (Non-Emergency)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] hover:border-aegis-rose-border transition-colors group block space-y-1"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--text-primary)] group-hover:underline">
                National Cyber Crime Reporting Portal
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-normal">
              Official Government of India portal for filing cyber harassment, cyber stalking, and online threat complaints.
            </p>
            <span className="text-[11px] font-mono text-[var(--text-muted)] block pt-1">cybercrime.gov.in</span>
          </a>

          <a
            href="https://stopncii.org"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] hover:border-aegis-rose-border transition-colors group block space-y-1"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--text-primary)] group-hover:underline">
                StopNCII.org
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-normal">
              Non-consensual intimate image protection tool that operates client-side on your phone without uploading your pictures anywhere.
            </p>
            <span className="text-[11px] font-mono text-[var(--text-muted)] block pt-1">stopncii.org</span>
          </a>
        </div>
      </div>
    </div>
  );
};
