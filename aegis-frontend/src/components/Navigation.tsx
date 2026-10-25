import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  userName = '',
  isEscalated 
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const initial = (userName.trim()[0] || 'U').toUpperCase();

  const mainTabs = [
    { to: "/overview", label: "My Cases" },
    { to: "/analyze", label: "Add Proof" },
    { to: "/changes", label: "What Changed", badge: isEscalated ? "New" : undefined },
    { to: "/complaint", label: "Report Pack" },
    { to: "/help", label: "Helplines", highlight: true },
    { to: "/privacy", label: "Privacy" },
  ];

  const moreTools = [
    { to: "/timeline", label: "Timeline", desc: "Day-by-day story of all events", icon: Clock },
    { to: "/linkage", label: "Connected Clues", desc: "Linked accounts, phone numbers & phrases", icon: Link2 },
    { to: "/exposure", label: "Exposed Info", desc: "Where photos or details were leaked", icon: Network },
    { to: "/rapid-response", label: "Safety Action Checklist", desc: "Immediate actions to protect yourself", icon: Compass },
    { to: "/escalation", label: "How It Changed", desc: "Changes in tone and pacing over time", icon: TrendingUp },
    { to: "/reconstruction", label: "Incident Story", desc: "Formatted summary for authorities", icon: FileText },
    { to: "/vault", label: "Saved Proof Vault", desc: "All sealed evidence items and safety stamps", icon: Archive },
  ];

  const isMoreToolActive = moreTools.some(t => location.pathname === t.to);

  // Close dropdown when user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    if (showMoreMenu) {
      document.addEventListener('pointerdown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [showMoreMenu]);

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

        {/* Primary Navigation Tabs (Flex-wrap, zero scrollbars, clean professional aesthetics) */}
        <nav className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-semibold">
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
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowMoreMenu(prev => !prev)}
              aria-expanded={showMoreMenu}
              aria-haspopup="true"
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                showMoreMenu || isMoreToolActive
                  ? 'bg-[var(--accent-rose-light)] text-[var(--accent-rose)] border-[var(--accent-rose-border)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)] border-transparent'
              }`}
            >
              <span>More tools</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showMoreMenu ? 'rotate-180' : ''}`} />
            </button>

            {showMoreMenu && (
              <div 
                className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-72 bg-[var(--bg-card)] rounded-2xl shadow-xl border border-[var(--border-color)] py-2 z-50 animate-in fade-in slide-in-from-top-1"
                style={{ filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15))' }}
              >
                <div className="px-4 py-2 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-subtle)]">
                  More Safety Tools
                </div>
                <div className="py-1 max-h-[70vh] overflow-y-auto no-scrollbar">
                  {moreTools.map((t) => {
                    const Icon = t.icon;
                    return (
                      <NavLink
                        key={t.to}
                        to={t.to}
                        onClick={() => setShowMoreMenu(false)}
                        className={({ isActive }) =>
                          `flex items-start space-x-3 px-4 py-2.5 text-xs font-medium transition-colors ${
                            isActive
                              ? 'bg-[var(--accent-rose-light)] text-[var(--accent-rose)] font-bold'
                              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-subtle)] hover:text-[var(--text-primary)]'
                          }`
                        }
                      >
                        <div className="w-7 h-7 rounded-lg bg-[var(--bg-card-subtle)] flex items-center justify-center text-[var(--text-secondary)] shrink-0 mt-0.5">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="truncate">{t.label}</span>
                          <span className="text-[10px] text-[var(--text-muted)] font-normal leading-tight mt-0.5">
                            {t.desc}
                          </span>
                        </div>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

