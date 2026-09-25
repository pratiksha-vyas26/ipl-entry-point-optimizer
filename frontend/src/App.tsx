import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { BatsmanSelector } from './components/BatsmanSelector.tsx';
import { GreenZoneCard } from './components/GreenZoneCard.tsx';
import { OversChart } from './components/OversChart.tsx';
import { BowlingBreakdownChart } from './components/BowlingBreakdownChart.tsx';
import { BowlerMatchupTable } from './components/BowlerMatchupTable.tsx';
import { EntryPointSimulator } from './components/EntryPointSimulator.tsx';
import { DataUploadModal } from './components/DataUploadModal.tsx';
import { BatsmanSummary, BatsmanDetailedStats } from './types.ts';
import { fetchBatsmenList, fetchBatsmanData, fetchBackendHealth } from './services/api.ts';
import { Loader2, AlertCircle, RefreshCw, BarChart3, Database, Filter, X } from 'lucide-react';

export default function App() {
  const [batsmen, setBatsmen] = useState<BatsmanSummary[]>([]);
  const [selectedBatsman, setSelectedBatsman] = useState<string>('');
  const [selectedBowlerFilter, setSelectedBowlerFilter] = useState<string>('All');
  const [detailedStats, setDetailedStats] = useState<BatsmanDetailedStats | null>(null);
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overs' | 'bowling' | 'simulator' | 'matchups'>('overs');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [backendMeta, setBackendMeta] = useState<{ matchesLoaded?: number; deliveriesParsed?: number }>({});

  useEffect(() => {
    loadBatsmen();
    fetchBackendHealth()
      .then(res => {
        setBackendMeta({
          matchesLoaded: res.matchesLoaded,
          deliveriesParsed: res.deliveriesParsed,
        });
      })
      .catch(() => {});
  }, []);

  const loadBatsmen = async () => {
    setLoadingList(true);
    setError(null);
    try {
      const list = await fetchBatsmenList(1);
      setBatsmen(list);
      if (list.length > 0) {
        const preferred = list.find(b =>
          ['V Kohli', 'RG Sharma', 'H Klaasen', 'RR Pant', 'KL Rahul', 'Shubman Gill', 'TM Head'].includes(b.name)
        );
        const initial = preferred ? preferred.name : list[0].name;
        setSelectedBatsman(initial);
        setSelectedBowlerFilter('All');
        await loadBatsmanStats(initial);
      }
    } catch (err: any) {
      console.error('Failed to load batsmen:', err);
      setError(err?.message || 'Unable to connect to backend Cricsheet engine');
    } finally {
      setLoadingList(false);
    }
  };

  const loadBatsmanStats = async (name: string, bowler?: string) => {
    setLoadingData(true);
    setError(null);
    try {
      const stats = await fetchBatsmanData(name, bowler);
      setDetailedStats(stats);
    } catch (err: any) {
      console.error('Failed to fetch batsman data:', err);
      setError(err?.message || `Failed to fetch stats for ${name}`);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSelectBatsman = (name: string) => {
    setSelectedBatsman(name);
    setSelectedBowlerFilter('All');
    loadBatsmanStats(name);
  };

  const handleSelectBowlerFilter = (bowler: string) => {
    setSelectedBowlerFilter(bowler);
    loadBatsmanStats(selectedBatsman, bowler === 'All' ? undefined : bowler);
  };

  const handleExport = () => {
    if (!detailedStats) return;
    const { batsman, greenZone, middleOvers, overallStrikeRate, overallDotPercentage, overallBoundaryPercentage } = detailedStats;

    const report = `=====================================================
IPL ENTRY-POINT OPTIMIZER: CRICSHEET ANALYTICS DOSSIER
Batter: ${batsman} ${selectedBowlerFilter !== 'All' ? `[Filter: vs ${selectedBowlerFilter}]` : ''}
Generated: ${new Date().toLocaleDateString()}
=====================================================

1. GREEN ZONE ENTRY RECOMMENDATION:
- Optimal Entry Window: ${greenZone.entryPointWindow} (Primary Over: Over ${greenZone.primaryOver})
- Sweet Spot Analysis: ${greenZone.summary}
- Strategic Recommendation: ${greenZone.optimalEntryPointRecommendation}
- Matchup Suitability: ${greenZone.paceVsSpinSuitability}

2. MIDDLE-OVERS PROFILE (Overs 7-15):
- Middle Overs Dot %: ${middleOvers.dotPercentage}%
- Middle Overs Boundary %: ${middleOvers.boundaryPercentage}%
- Middle Overs Strike Rate: ${middleOvers.strikeRate}
- Total Balls in Middle Overs: ${middleOvers.balls}

3. CAREER STATS IN DATASET:
- Total Runs: ${detailedStats.totalRuns} (${detailedStats.totalBallsFaced} balls faced)
- Overall Strike Rate: ${overallStrikeRate}
- Overall Dot-Ball %: ${overallDotPercentage}%
- Overall Boundary %: ${overallBoundaryPercentage}%

4. BOWLING STYLE BREAKDOWN:
${detailedStats.bowlingStyleBreakdown.paceVsSpin.map(b => `  - ${b.category}: ${b.balls}b, ${b.runs}r, Dot ${b.dotPercentage}%, Bdy ${b.boundaryPercentage}%, SR ${b.strikeRate}`).join('\n')}

5. TOP BOWLER MATCHUPS FACED:
${detailedStats.topBowlerMatchups.slice(0, 10).map(b => `  - ${b.bowler} (${b.bowlerStyle}): ${b.balls}b, ${b.runs}r, ${b.dots} dots (${b.dotPercentage}%), ${b.boundaries} bdys (${b.boundaryPercentage}%), SR ${b.strikeRate}, ${b.dismissals} outs`).join('\n')}
=====================================================`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${batsman.replace(/\s+/g, '_')}_entry_point_dossier.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onExport={handleExport}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        matchesLoaded={backendMeta.matchesLoaded}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Notification */}
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-950/40 p-4 text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => {
                if (selectedBatsman) loadBatsmanStats(selectedBatsman, selectedBowlerFilter === 'All' ? undefined : selectedBowlerFilter);
                else loadBatsmen();
              }}
              className="flex items-center gap-1 rounded bg-rose-500/20 px-2.5 py-1 text-rose-200 hover:bg-rose-500/30"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Batsman Selector Card */}
        <BatsmanSelector
          batsmen={batsmen}
          selectedBatsman={selectedBatsman}
          onSelectBatsman={handleSelectBatsman}
          detailedStats={detailedStats}
          loading={loadingList}
        />

        {/* Bowlers Faced Quick Filter Ribbon */}
        {detailedStats && detailedStats.topBowlerMatchups.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
            <span className="font-semibold text-slate-400 shrink-0">Bowlers Faced:</span>
            <button
              onClick={() => handleSelectBowlerFilter('All')}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                selectedBowlerFilter === 'All'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Bowlers ({detailedStats.topBowlerMatchups.length})
            </button>
            {detailedStats.topBowlerMatchups.slice(0, 7).map(b => (
              <button
                key={b.bowler}
                onClick={() => handleSelectBowlerFilter(b.bowler)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  selectedBowlerFilter === b.bowler
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                vs {b.bowler} <span className="text-[10px] text-slate-400">({b.balls}b, SR {b.strikeRate})</span>
              </button>
            ))}
            <button
              onClick={() => setActiveTab('matchups')}
              className="text-emerald-400 hover:underline text-xs font-medium ml-auto"
            >
              View All Particular Bowler Stats →
            </button>
          </div>
        )}

        {/* Active Bowler Filter Banner */}
        {selectedBowlerFilter !== 'All' && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-4 py-2 text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-emerald-400" />
              <span>
                Isolated Head-to-Head Performance: <strong>{selectedBatsman}</strong> vs{' '}
                <strong>{selectedBowlerFilter}</strong>
              </span>
            </div>
            <button
              onClick={() => handleSelectBowlerFilter('All')}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
            >
              <X className="h-3 w-3" />
              <span>Reset to All Bowlers</span>
            </button>
          </div>
        )}

        {/* Content Loading State */}
        {loadingData && (
          <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
            <p className="text-xs text-slate-400 font-mono">
              Crunching ball-by-ball Cricsheet deliveries for {selectedBatsman}
              {selectedBowlerFilter !== 'All' ? ` against ${selectedBowlerFilter}` : ''}...
            </p>
          </div>
        )}

        {/* Populated State */}
        {!loadingData && detailedStats && (
          <div className="space-y-6">
            {/* 1. Green Zone Spotlight Hero */}
            <GreenZoneCard stats={detailedStats} />

            {/* 2. Main Viewport Tabs / Content */}
            <div className="grid grid-cols-1 gap-6">
              {activeTab === 'overs' && (
                <div className="space-y-6">
                  <OversChart
                    stats={detailedStats}
                    selectedBowlerFilter={selectedBowlerFilter}
                    onSelectBowlerFilter={handleSelectBowlerFilter}
                  />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BowlingBreakdownChart stats={detailedStats} />
                    <EntryPointSimulator stats={detailedStats} />
                  </div>
                  <BowlerMatchupTable
                    matchups={detailedStats.topBowlerMatchups}
                    batsmanName={detailedStats.batsman}
                    selectedBowlerFilter={selectedBowlerFilter}
                    onSelectBowlerFilter={handleSelectBowlerFilter}
                  />
                </div>
              )}

              {activeTab === 'bowling' && (
                <div className="space-y-6">
                  <BowlingBreakdownChart stats={detailedStats} />
                  <BowlerMatchupTable
                    matchups={detailedStats.topBowlerMatchups}
                    batsmanName={detailedStats.batsman}
                    selectedBowlerFilter={selectedBowlerFilter}
                    onSelectBowlerFilter={handleSelectBowlerFilter}
                  />
                </div>
              )}

              {activeTab === 'simulator' && (
                <div className="space-y-6">
                  <EntryPointSimulator stats={detailedStats} />
                  <OversChart
                    stats={detailedStats}
                    selectedBowlerFilter={selectedBowlerFilter}
                    onSelectBowlerFilter={handleSelectBowlerFilter}
                  />
                </div>
              )}

              {activeTab === 'matchups' && (
                <div className="space-y-6">
                  <BowlerMatchupTable
                    matchups={detailedStats.topBowlerMatchups}
                    batsmanName={detailedStats.batsman}
                    selectedBowlerFilter={selectedBowlerFilter}
                    onSelectBowlerFilter={handleSelectBowlerFilter}
                  />
                  <BowlingBreakdownChart stats={detailedStats} />
                </div>
              )}
            </div>

            {/* Ingested Matches Footer Info */}
            {detailedStats.recentMatches && detailedStats.recentMatches.length > 0 && (
              <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 text-xs">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Database className="h-4 w-4 text-emerald-400" />
                  <span className="font-semibold text-slate-300">
                    Cricsheet Source Matches Ingested ({detailedStats.recentMatches.length} matches featuring {detailedStats.batsman})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {detailedStats.recentMatches.map(m => (
                    <div
                      key={m.matchId}
                      className="rounded-md border border-slate-800 bg-slate-950/80 px-2.5 py-1.5 font-mono text-[11px] text-slate-300"
                    >
                      <span className="text-white font-semibold">{m.teams.join(' vs ')}</span>
                      <span className="text-slate-500"> · </span>
                      <span className="text-emerald-400 font-bold tabular-nums">{m.runs} runs ({m.balls}b)</span>
                      {m.date && <span className="text-slate-500"> · {m.date}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State when no data */}
        {!loadingList && !loadingData && batsmen.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center">
            <BarChart3 className="h-10 w-10 text-slate-500 mb-3" />
            <h3 className="text-base font-semibold text-white">No Cricsheet Data Loaded</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-md">
              The engine needs at least one Cricsheet IPL match JSON file in the data folder to calculate dot-ball and boundary rates.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Upload First Cricsheet File
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-4 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">IPL Entry-Point Optimizer</span>
            <span>·</span>
            <span>Cricsheet T20 Ball-by-Ball Analytics</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Focus: Overs 7–15 · Dot % · Boundary % · Bowling Matchups · Particular Bowler Stats
          </div>
        </div>
      </footer>

      {/* Upload Match Modal */}
      <DataUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={() => {
          loadBatsmen();
          fetchBackendHealth().then(res => {
            setBackendMeta({
              matchesLoaded: res.matchesLoaded,
              deliveriesParsed: res.deliveriesParsed,
            });
          }).catch(() => {});
        }}
      />
    </div>
  );
}
