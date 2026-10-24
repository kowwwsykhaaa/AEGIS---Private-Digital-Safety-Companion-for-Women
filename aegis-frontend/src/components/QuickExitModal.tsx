import React, { useEffect, useState } from 'react';
import { CloudSun, Calendar, CheckSquare, ShieldOff } from 'lucide-react';

interface QuickExitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickExitModal: React.FC<QuickExitModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isOpen) {
        onClose(); // Invert or trigger parent open
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#F4F4F1] text-charcoal font-sans overflow-y-auto">
      {/* Stealth disguise screen: A mundane personal task and weather note */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="flex justify-between items-center border-b border-warm-300 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-medium text-warm-900">Personal Daily Notes</h1>
            <p className="text-sm text-warm-600 mt-1">Saturday, October 24, 2026</p>
          </div>
          <div className="flex items-center space-x-2 text-warm-700 bg-white px-3 py-1.5 rounded-lg border border-warm-300 text-sm">
            <CloudSun className="w-4 h-4 text-warm-500" />
            <span>28°C · Pune Partly Cloudy</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-warm-300 shadow-sm">
            <div className="flex items-center space-x-2 text-warm-800 font-medium mb-4">
              <CheckSquare className="w-4 h-4 text-warm-500" />
              <span>Study & Project Tasks</span>
            </div>
            <ul className="space-y-3 text-sm text-warm-700">
              <li className="flex items-center space-x-2 line-through text-warm-400">
                <span>•</span>
                <span>Review database normalization lecture</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>•</span>
                <span>Prepare lab report chapter 4</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>•</span>
                <span>Return library books by Monday</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-warm-300 shadow-sm">
            <div className="flex items-center space-x-2 text-warm-800 font-medium mb-4">
              <Calendar className="w-4 h-4 text-warm-500" />
              <span>Weekly Schedule</span>
            </div>
            <div className="space-y-2 text-sm text-warm-700">
              <p><span className="font-medium text-warm-900">Mon 10:00 AM:</span> Signals & Systems tutorial</p>
              <p><span className="font-medium text-warm-900">Wed 02:00 PM:</span> Academic project sync</p>
              <p><span className="font-medium text-warm-900">Fri 11:30 AM:</span> Department seminar</p>
            </div>
          </div>
        </div>

        {/* Subtle, unnoticeable return trigger at bottom */}
        <div className="mt-16 text-center">
          <button
            onClick={onClose}
            className="text-xs text-warm-400 hover:text-warm-700 transition-colors py-2 px-4 rounded border border-transparent hover:border-warm-300"
          >
            Resume session
          </button>
        </div>
      </div>
    </div>
  );
};
