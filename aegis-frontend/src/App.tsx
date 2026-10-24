import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { QuickExitModal } from './components/QuickExitModal';
import { WelcomeView } from './views/WelcomeView';
import { OverviewView } from './views/OverviewView';
import { AnalyzeView } from './views/AnalyzeView';
import { EscalationView } from './views/EscalationView';
import { TimelineView } from './views/TimelineView';
import { WhatChangedView } from './views/WhatChangedView';
import { ExposureGraphView } from './views/ExposureGraphView';
import { ThreatLinkageView } from './views/ThreatLinkageView';
import { CaseReconstructionView } from './views/CaseReconstructionView';
import { EvidenceVaultView } from './views/EvidenceVaultView';
import { RapidResponseView } from './views/RapidResponseView';
import { ComplaintView } from './views/ComplaintView';
import { PrivacyCenterView } from './views/PrivacyCenterView';
import { ImmediateHelpView } from './views/ImmediateHelpView';
import { ProfileView } from './views/ProfileView';
import { 
  fetchAllIncidents,
  fetchIncidentById,
  fetchActiveIncident, 
  fetchChanges, 
  createIncident,
  loadDemoCase, 
  injectDay7, 
  IncidentData, 
  ChangeComparison 
} from './lib/api';

const MainLayout: React.FC = () => {
  const [incident, setIncident] = useState<IncidentData | null>(null);
  const [casesList, setCasesList] = useState<Array<any>>([]);
  const [activeCaseId, setActiveCaseId] = useState<string>('');
  const [changes, setChanges] = useState<ChangeComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [isQuickExit, setIsQuickExit] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('aegis_theme') as 'light' | 'dark') || 'light';
  });
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('aegis_user_name') || 'Ananya';
  });

  const applyTheme = (t: 'light' | 'dark') => {
    setTheme(t);
    localStorage.setItem('aegis_theme', t);
    document.documentElement.dataset.theme = t;
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const loadAllCases = async (targetId?: string) => {
    try {
      setLoading(true);
      let all = await fetchAllIncidents();
      if (!all || all.length === 0) {
        await loadDemoCase(true);
        all = await fetchAllIncidents();
      }
      setCasesList(all);

      const target = targetId || activeCaseId || (all.length > 0 ? all[0].id : null);
      if (target) {
        setActiveCaseId(target);
        const detailed = await fetchIncidentById(target);
        setIncident(detailed);
        try {
          const chg = await fetchChanges(target);
          setChanges(chg);
        } catch {
          setChanges(null);
        }
      }
    } catch (err) {
      console.error(err);
      try {
        const active = await fetchActiveIncident();
        setIncident(active);
        setActiveCaseId(active.id);
        setCasesList([active]);
      } catch (e) {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCase = async (id: string) => {
    try {
      setLoading(true);
      setActiveCaseId(id);
      const detailed = await fetchIncidentById(id);
      setIncident(detailed);
      try {
        const chg = await fetchChanges(id);
        setChanges(chg);
      } catch {
        setChanges(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCase = async (title: string, desc: string = '') => {
    try {
      setLoading(true);
      const created = await createIncident(title, desc);
      await loadAllCases(created.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyTheme(theme);
    loadAllCases();

    // Global Esc shortcut listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsQuickExit(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleResetDemo = async () => {
    try {
      await loadDemoCase(false);
      await loadAllCases();
    } catch (err) {
      console.error(err);
    }
  };

  const handleInjectDay7 = async () => {
    try {
      await injectDay7();
      await loadAllCases();
    } catch (err) {
      console.error(err);
    }
  };

  const currentIncidentId = incident?.id || activeCaseId || 'inc-demo-ananya-2026';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] font-sans antialiased transition-colors duration-200">
      <Navigation
        onQuickExit={() => setIsQuickExit(true)}
        onToggleTheme={() => applyTheme(theme === 'light' ? 'dark' : 'light')}
        currentTheme={theme}
        userName={userName}
        isEscalated={incident?.risk_level === 'CRITICAL'}
      />

      <QuickExitModal
        isOpen={isQuickExit}
        onClose={() => setIsQuickExit(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<WelcomeView onStart={() => loadAllCases()} />} />
          <Route 
            path="/overview" 
            element={
              <OverviewView 
                incident={incident} 
                casesList={casesList}
                activeCaseId={activeCaseId}
                onSelectCase={handleSelectCase}
                onCreateCase={handleCreateCase}
                changes={changes} 
                loading={loading} 
                onRefresh={() => loadAllCases()} 
              />
            } 
          />
          <Route 
            path="/cases" 
            element={
              <OverviewView 
                incident={incident} 
                casesList={casesList}
                activeCaseId={activeCaseId}
                onSelectCase={handleSelectCase}
                onCreateCase={handleCreateCase}
                changes={changes} 
                loading={loading} 
                onRefresh={() => loadAllCases()} 
              />
            } 
          />
          <Route 
            path="/analyze" 
            element={
              <AnalyzeView 
                incident={incident} 
                casesList={casesList}
                onEvidenceAdded={() => loadAllCases()} 
              />
            } 
          />
          <Route path="/escalation" element={<EscalationView incidentId={currentIncidentId} />} />
          <Route path="/timeline" element={<TimelineView incident={incident} />} />
          <Route path="/changes" element={<WhatChangedView incidentId={currentIncidentId} />} />
          <Route path="/exposure" element={<ExposureGraphView incidentId={currentIncidentId} />} />
          <Route path="/linkage" element={<ThreatLinkageView incidentId={currentIncidentId} />} />
          <Route path="/reconstruction" element={<CaseReconstructionView incidentId={currentIncidentId} />} />
          <Route path="/vault" element={<EvidenceVaultView incident={incident} />} />
          <Route path="/rapid-response" element={<RapidResponseView />} />
          <Route path="/complaint" element={<ComplaintView incidentId={currentIncidentId} />} />
          <Route path="/privacy" element={<PrivacyCenterView onDataWiped={() => { setIncident(null); setChanges(null); setCasesList([]); }} />} />
          <Route path="/help" element={<ImmediateHelpView />} />
          <Route 
            path="/profile" 
            element={
              <ProfileView 
                onThemeToggle={applyTheme} 
                currentTheme={theme} 
                userName={userName}
                onUpdateUserName={(name) => setUserName(name)}
                onLoadSampleData={handleResetDemo}
                onSimulateUpdate={handleInjectDay7}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Reassuring Footer */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--bg-card)]/80 py-6 text-center text-xs text-[var(--text-muted)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-aegis-rose-text">AEGIS</span>
            <span>·</span>
            <span>Your private digital safety companion</span>
          </div>

          <div className="flex items-center space-x-4 font-bold text-[var(--text-secondary)]">
            <span>24/7 Helplines:</span>
            <a href="tel:112" className="hover:underline text-red-600">112 (Emergency)</a>
            <span>·</span>
            <a href="tel:181" className="hover:underline">181 (Women)</a>
            <span>·</span>
            <a href="tel:1930" className="hover:underline text-blue-600">1930 (Cyber Crime)</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
};

export default App;
