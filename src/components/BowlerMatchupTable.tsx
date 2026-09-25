import React, { useState } from 'react';
import { BowlerMatchupStat } from '../types.ts';
import { Search, ChevronDown, ChevronUp, ShieldAlert, Award, ExternalLink, X, Activity } from 'lucide-react';

interface BowlerMatchupTableProps {
  matchups: BowlerMatchupStat[];
  batsmanName: string;
  selectedBowlerFilter?: string;
  onSelectBowlerFilter?: (bowler: string) => void;
}

export const BowlerMatchupTable: React.FC<BowlerMatchupTableProps> = ({
  matchups,
  batsmanName,
  selectedBowlerFilter = 'All',
  onSelectBowlerFilter,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Pace' | 'Spin'>('All');
  const [sortField, setSortField] = useState<keyof BowlerMatchupStat>('balls');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedBowler, setSelectedBowler] = useState<BowlerMatchupStat | null>(null);

  const filtered = matchups
    .filter(m => {
      const matchName = m.bowler.toLowerCase().includes(search.toLowerCase()) ||
        m.bowlerStyle.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'All' || m.bowlerType === typeFilter;
      return matchName && matchType;
    })
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

  const handleSort = (field: keyof BowlerMatchupStat) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-sm space-y-4">
      {/* Top Header & Search Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Particular Bowler Matchups & Head-to-Head Records
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {matchups.length} Bowlers Faced
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Ball-by-ball analysis, dot balls, boundary conversion, and dismissals against each opposing bowler
          </p>
        </div>

        {/* Search & Style Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search bowler or style..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="rounded-lg border border-slate-800 bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1">
            {(['All', 'Pace', 'Spin'] as const).map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  typeFilter === type
                    ? 'bg-slate-800 text-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Matchups Table with Particular Stats */}
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/70">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <tr>
              <th
                onClick={() => handleSort('bowler')}
                className="py-2.5 px-3 cursor-pointer hover:text-white"
              >
                Bowler Name
              </th>
              <th className="py-2.5 px-3">Discipline</th>
              <th
                onClick={() => handleSort('balls')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
              >
                Balls
              </th>
              <th
                onClick={() => handleSort('runs')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
              >
                Runs
              </th>
              <th
                onClick={() => handleSort('dots')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
              >
                Dots (Dot %)
              </th>
              <th
                onClick={() => handleSort('singles')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
              >
                1s / 2s
              </th>
              <th
                onClick={() => handleSort('fours')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
              >
                4s / 6s
              </th>
              <th
                onClick={() => handleSort('boundaryPercentage')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
              >
                Boundary %
              </th>
              <th
                onClick={() => handleSort('strikeRate')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
              >
                Strike Rate
              </th>
              <th
                onClick={() => handleSort('dismissals')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
              >
                Outs
              </th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-xs text-slate-500 font-sans">
                  No bowler matchups found matching &ldquo;{search}&rdquo;
                </td>
              </tr>
            ) : (
              filtered.map(b => (
                <tr
                  key={b.bowler}
                  onClick={() => setSelectedBowler(b)}
                  className={`hover:bg-slate-900/70 transition-colors cursor-pointer ${
                    selectedBowler?.bowler === b.bowler ? 'bg-slate-900/90' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-sans font-semibold text-white">
                    <div className="flex items-center gap-1.5">
                      <span>{b.bowler}</span>
                      {b.strikeRate >= 200 && b.balls >= 6 && (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/20 px-1 py-0.2 rounded">
                          DOMINANT
                        </span>
                      )}
                      {b.dismissals >= 1 && (
                        <span className="text-[9px] font-mono text-rose-400 bg-rose-500/20 px-1 py-0.2 rounded">
                          DISMISSED
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px]">
                    <span className="text-slate-300">{b.bowlerArm}</span> {b.bowlerType}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300 tabular-nums">{b.balls}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-semibold tabular-nums">{b.runs}</td>
                  <td className="py-2.5 px-3 text-right text-amber-400 tabular-nums">
                    {b.dots} <span className="text-slate-500 text-[10px]">({b.dotPercentage}%)</span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300 tabular-nums">
                    {b.singles} / {b.twos}
                  </td>
                  <td className="py-2.5 px-3 text-right text-indigo-400 font-semibold tabular-nums">
                    {b.fours} / {b.sixes}
                  </td>
                  <td className="py-2.5 px-3 text-right text-indigo-400 font-bold tabular-nums">
                    {b.boundaryPercentage}%
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold tabular-nums">
                    {b.strikeRate}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums">
                    {b.dismissals > 0 ? (
                      <span className="text-rose-400 font-bold">{b.dismissals}</span>
                    ) : (
                      <span className="text-slate-600">0</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedBowler(b);
                        }}
                        className="rounded bg-slate-800 hover:bg-slate-700 px-2 py-0.5 text-[10px] text-slate-300 transition-colors"
                      >
                        Stats
                      </button>
                      {onSelectBowlerFilter && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onSelectBowlerFilter(selectedBowlerFilter === b.bowler ? 'All' : b.bowler);
                          }}
                          className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                            selectedBowlerFilter === b.bowler
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30'
                          }`}
                        >
                          {selectedBowlerFilter === b.bowler ? 'Active' : 'Filter'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* BOWLER SPOTLIGHT DOSSIER MODAL / DRAWER */}
      {selectedBowler && (
        <div className="rounded-xl border border-emerald-500/30 bg-slate-950 p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">
                Detailed Matchup Dossier: {batsmanName} vs {selectedBowler.bowler}
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                ({selectedBowler.bowlerStyle})
              </span>
            </div>
            <button
              onClick={() => setSelectedBowler(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <span className="text-slate-400 block text-[11px]">Deliveries Faced</span>
              <span className="text-xl font-bold font-mono text-white tabular-nums">{selectedBowler.balls} balls</span>
              <span className="text-slate-500 text-[10px] block mt-0.5">
                {selectedBowler.middleOversBalls} balls in middle overs (7–15)
              </span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <span className="text-slate-400 block text-[11px]">Runs & Strike Rate</span>
              <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                {selectedBowler.runs} runs (SR {selectedBowler.strikeRate})
              </span>
              <span className="text-slate-500 text-[10px] block mt-0.5">
                {selectedBowler.middleOversRuns} runs in middle overs
              </span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <span className="text-slate-400 block text-[11px]">Dot Ball Resistance</span>
              <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                {selectedBowler.dotPercentage}% dots
              </span>
              <span className="text-slate-500 text-[10px] block mt-0.5">
                {selectedBowler.dots} dot balls out of {selectedBowler.balls}
              </span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <span className="text-slate-400 block text-[11px]">Boundary Conversion</span>
              <span className="text-xl font-bold font-mono text-indigo-400 tabular-nums">
                {selectedBowler.boundaryPercentage}% bdys
              </span>
              <span className="text-slate-500 text-[10px] block mt-0.5">
                {selectedBowler.fours}×4, {selectedBowler.sixes}×6
              </span>
            </div>
          </div>

          {/* Granular Ball Distribution Strip */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider block mb-2">
              Granular Run Breakdown Against {selectedBowler.bowler}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 font-mono text-[11px] text-center">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-amber-400 block font-bold text-sm">{selectedBowler.dots}</span>
                <span className="text-slate-500 text-[10px]">Dot Balls</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-white block font-bold text-sm">{selectedBowler.singles}</span>
                <span className="text-slate-500 text-[10px]">Singles (1s)</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-white block font-bold text-sm">{selectedBowler.twos}</span>
                <span className="text-slate-500 text-[10px]">Twos (2s)</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-indigo-400 block font-bold text-sm">{selectedBowler.fours}</span>
                <span className="text-slate-500 text-[10px]">Fours (4s)</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-indigo-400 block font-bold text-sm">{selectedBowler.sixes}</span>
                <span className="text-slate-500 text-[10px]">Sixes (6s)</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-rose-400 block font-bold text-sm">{selectedBowler.dismissals}</span>
                <span className="text-slate-500 text-[10px]">Dismissals</span>
              </div>
            </div>

            {selectedBowler.oversFaced && selectedBowler.oversFaced.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-300">Encountered in Overs:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedBowler.oversFaced.map(ov => (
                      <span
                        key={ov}
                        className={`px-1.5 py-0.5 rounded font-mono ${
                          ov >= 7 && ov <= 15
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        Over {ov}
                      </span>
                    ))}
                  </div>
                </div>
                {onSelectBowlerFilter && (
                  <button
                    onClick={() => {
                      onSelectBowlerFilter(selectedBowlerFilter === selectedBowler.bowler ? 'All' : selectedBowler.bowler);
                    }}
                    className={`rounded px-3 py-1 text-xs font-semibold transition-colors ${
                      selectedBowlerFilter === selectedBowler.bowler
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                    }`}
                  >
                    {selectedBowlerFilter === selectedBowler.bowler ? 'Reset to All Bowlers' : `Filter Dashboard vs ${selectedBowler.bowler}`}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
