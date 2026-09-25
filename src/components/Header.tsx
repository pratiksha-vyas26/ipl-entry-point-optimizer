import React from 'react';
import { Upload, Download, Flame, ShieldAlert, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenUpload: () => void;
  onExport: () => void;
  activeTab: 'overs' | 'bowling' | 'simulator' | 'matchups';
  setActiveTab: (tab: 'overs' | 'bowling' | 'simulator' | 'matchups') => void;
  matchesLoaded?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenUpload,
  onExport,
  activeTab,
  setActiveTab,
  matchesLoaded,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single Brand Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Flame className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <a href="/" className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors">
              IPL Entry-Point Optimizer
            </a>
            <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono">
              Cricsheet Ball-by-Ball Middle-Overs Engine
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 p-1">
          <button
            onClick={() => setActiveTab('overs')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'overs'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overs Matrix (7–15)
          </button>
          <button
            onClick={() => setActiveTab('bowling')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'bowling'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bowling Styles
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'simulator'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Entry Simulator
          </button>
          <button
            onClick={() => setActiveTab('matchups')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'matchups'
                ? 'bg-slate-800 text-emerald-400 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bowlers Faced (Particular Stats)
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition-colors whitespace-nowrap"
            title="Import Cricsheet match JSON"
          >
            <Upload className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Add Cricsheet JSON</span>
            <span className="sm:hidden">Import</span>
          </button>

          <button
            onClick={onExport}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm whitespace-nowrap"
            title="Export player dossier report"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export Dossier</span>
            <span className="sm:hidden">Dossier</span>
          </button>
        </div>
      </div>
    </header>
  );
};
