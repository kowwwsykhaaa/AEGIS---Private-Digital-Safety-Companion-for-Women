import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FolderLock, 
  PlusCircle, 
  GitCompare, 
  FileCheck2, 
  PhoneCall, 
  Lock, 
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  Clock,
  TrendingUp,
  Network,
  Link2,
  FileText,
  Archive,
  Compass,
  Shield
} from 'lucide-react';

interface NavigationProps {
  onQuickExit: () => void;
  onToggleTheme?: () => void;
  currentTheme?: 'light' | 'dark';
  userName?: string;
  isEscalated?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  onQuickExit, 
  onToggleTheme,
  currentTheme = 'light',
  userName = 'Ananya',
  isEscalated 
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const initial = (userName.trim()[0] || 'A').toUpperCase();

  const mainTabs = [
    { to: "/overview", label: "My Cases" },
    { to: "/analyze", label: "Add Proof" },
    { to: "/changes", label: "What Changed", badge: isEscalated ? "New" : undefined },
    { to: "/complaint", label: "Report Pack" },
    { to: "/help", label: "Helplines", highlight: true },
    { to: "/privacy", label: "Privacy" },
  ];

  const moreTools = [
    { to: "/escalation", label: "How it changed", icon: TrendingUp },
    { to: "/timeline", label: "Chronological timeline", icon: Clock },
    { to: "/exposure", label: "Exposed information", icon: Network },
    { to: "/linkage", label: "Connected clues & accounts", icon: Link2 },
    { to: "/reconstruction", label: "Full story summary", icon: FileText },
    { to: "/vault", label: "Saved proof vault", icon: Archive },
    { to: "/rapid-response", label: "Safety action checklist", icon: Compass },
  ];

  return (
    <header className="border-b border-[var(--border-color)] bg-[var(--bg-card)]/95 sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 py-2.5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col gap-2">
        {/* Top bar with branding, theme switcher, profile, and Quick Exit */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <NavLink to="/" className="flex items-baseline space-x-2 text-decoration-none group">
              <span className="font-extrabold text-2xl tracking-wide text-[var(--accent-rose)] group-hover:opacity-90 transition-opacity">
                AEGIS
              </span>
              <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold hidden sm:inline">
                Digital Safety Companion
              </span>
            </NavLink>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Theme Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                aria-label="Toggle theme"
                title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
                className="w-8 h-8 rounded-full border border-[var(--border-color)] bg-[var(--bg-card-subtle)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] flex items-center justify-center transition-all"
              >
                {currentTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
              </button>
            )}

            {/* Quick Exit Button (High Priority) */}
            <button
              onClick={onQuickExit}
              className="flex items-center space-x-1.5 bg-[var(--accent-rose)] hover:bg-[var(--accent-rose-hover)] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all"
              title="Instantly hides AEGIS and shows everyday notes (Shortcut: Esc)"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Quick Exit</span>
              <kbd className="hidden sm:inline bg-black/20 text-white text-[10px] px-1.5 py-0.5 rounded font-mono ml-1">
                Esc
              </kbd>
            </button>

            {/* User Profile Avatar Link */}
            <NavLink
              to="/profile"
              title="My Profile & Settings"
              className="w-8 h-8 rounded-full bg-[var(--accent-rose)] hover:bg-[var(--accent-rose-hover)] text-white flex items-center justify-center font-bold text-xs shadow-sm transition-all"
            >
              {initial}
            </NavLink>
          </div>
        </div>

        {/* Primary Navigation Tabs (Zero Emojis, Clean Professional Aesthetics) */}
        <nav className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none text-xs sm:text-sm font-semibold">
          {mainTabs.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-1 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[var(--accent-rose-light)] text-[var(--accent-rose)] border border-[var(--accent-rose-border)] font-bold shadow-sm'
                    : item.highlight
                    ? 'text-red-600 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)]'
                }`
              }
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-[var(--accent-rose)] text-white rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}

          {/* More Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(prev => !prev)}
              onBlur={() => setTimeout(() => setShowMoreMenu(false), 250)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)] whitespace-nowrap transition-all"
            >
              <span>More tools</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showMoreMenu && (
              <div className="absolute left-0 mt-2 w-64 bg-[var(--bg-card)] rounded-xl shadow-lg border border-[var(--border-color)] py-2 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1.5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-subtle)]">
                  Detailed Case Analysis
                </div>
                {moreTools.map((t) => {
                  const Icon = t.icon;
                  return (
                    <NavLink
                      key={t.to}
                      to={t.to}
                      onClick={() => setShowMoreMenu(false)}
                      className="flex items-center space-x-2.5 px-3.5 py-2 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-card-subtle)] hover:text-[var(--accent-rose)] transition-colors"
                    >
                      <Icon className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>{t.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
