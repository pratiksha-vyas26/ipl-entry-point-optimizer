import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BatsmanDetailedStats, OverStat, BowlerInOverStat } from '../types.ts';
import { UserCheck } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface OversChartProps {
  stats: BatsmanDetailedStats;
  selectedBowlerFilter?: string;
  onSelectBowlerFilter?: (bowler: string) => void;
}

export const OversChart: React.FC<OversChartProps> = ({
  stats,
  selectedBowlerFilter = 'All',
  onSelectBowlerFilter,
}) => {
  const [phaseFilter, setPhaseFilter] = useState<'middle' | 'all' | 'powerplay' | 'death'>('middle');
  const [selectedOver, setSelectedOver] = useState<number | null>(stats.greenZone.primaryOver);

  let displayedOvers: OverStat[] = [];
  if (phaseFilter === 'middle') {
    displayedOvers = stats.overs.filter(o => o.overNumber >= 7 && o.overNumber <= 15);
  } else if (phaseFilter === 'powerplay') {
    displayedOvers = stats.overs.filter(o => o.overNumber >= 1 && o.overNumber <= 6);
  } else if (phaseFilter === 'death') {
    displayedOvers = stats.overs.filter(o => o.overNumber >= 16 && o.overNumber <= 20);
  } else {
    displayedOvers = stats.overs;
  }

  const allBowlersFaced = useMemo(() => {
    const list = stats.topBowlerMatchups.map(m => m.bowler);
    return ['All', ...list];
  }, [stats]);

  const greenZoneOver = stats.greenZone.primaryOver;

  const labels = displayedOvers.map(o => `Over ${o.overNumber}`);

  const dotBarColors = displayedOvers.map(o =>
    o.overNumber === greenZoneOver ? 'rgba(16, 185, 129, 0.9)' : 'rgba(245, 158, 11, 0.75)'
  );

  const boundaryBarColors = displayedOvers.map(o =>
    o.overNumber === greenZoneOver ? 'rgba(52, 211, 153, 1)' : 'rgba(99, 102, 241, 0.85)'
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Boundary % (4s & 6s)',
        data: displayedOvers.map(o => o.boundaryPercentage),
        backgroundColor: boundaryBarColors,
        borderColor: displayedOvers.map(o =>
          o.overNumber === greenZoneOver ? '#10b981' : '#6366f1'
        ),
        borderWidth: displayedOvers.map(o => (o.overNumber === greenZoneOver ? 2.5 : 1)),
        borderRadius: 4,
      },
      {
        label: 'Dot-Ball %',
        data: displayedOvers.map(o => o.dotPercentage),
        backgroundColor: dotBarColors,
        borderColor: displayedOvers.map(o =>
          o.overNumber === greenZoneOver ? '#059669' : '#f59e0b'
        ),
        borderWidth: displayedOvers.map(o => (o.overNumber === greenZoneOver ? 2.5 : 1)),
        borderRadius: 4,
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: '#94a3b8',
          font: { family: 'Plus Jakarta Sans', size: 12 },
          boxWidth: 12,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: 'bold' },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
        callbacks: {
          afterTitle: (items: any[]) => {
            const index = items[0].dataIndex;
            const overStat = displayedOvers[index];
            if (overStat.overNumber === greenZoneOver) {
              return '★ PRIMARY GREEN ZONE SWEET SPOT';
            }
            return '';
          },
          footer: (items: any[]) => {
            const index = items[0].dataIndex;
            const overStat = displayedOvers[index];
            const bowlersList = overStat.bowlersFaced && overStat.bowlersFaced.length > 0
              ? `\nBowlers Faced: ${overStat.bowlersFaced.map(b => `${b.bowler} (${b.balls}b)`).join(', ')}`
              : '';
            return `Balls: ${overStat.balls} | Runs: ${overStat.runs} | SR: ${overStat.strikeRate}\nDots: ${overStat.dots} | Bdys: ${overStat.boundaries} (${overStat.fours}×4, ${overStat.sixes}×6)\nDismissals: ${overStat.dismissals}${bowlersList}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } },
      },
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: {
          color: '#94a3b8',
          font: { family: 'JetBrains Mono', size: 11 },
          callback: (value: any) => `${value}%`,
        },
        max: 100,
        beginAtZero: true,
      },
    },
    onClick: (_event: any, elements: any[]) => {
      if (elements.length > 0) {
        const idx = elements[0].index;
        setSelectedOver(displayedOvers[idx].overNumber);
      }
    },
  };

  const selectedOverStat = stats.overs.find(o => o.overNumber === selectedOver) || displayedOvers[0];
  const bowlersInCurrentOver: BowlerInOverStat[] = selectedOverStat?.bowlersFaced || [];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-sm space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Dot-Ball % vs Boundary % by Over
            </h3>
            {displayedOvers.some(o => o.overNumber === greenZoneOver) && (
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                Green Zone: Over {greenZoneOver}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Targeting low dot-ball % (&lt;30%) and elevated boundary % (&gt;20%) for optimal entry
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onSelectBowlerFilter && allBowlersFaced.length > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Bowler:</span>
              <select
                value={selectedBowlerFilter}
                onChange={e => onSelectBowlerFilter(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-emerald-400 font-semibold focus:border-emerald-500 focus:outline-none"
              >
                {allBowlersFaced.map(b => (
                  <option key={b} value={b}>
                    {b === 'All' ? 'All Bowlers Faced' : b}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1 self-start sm:self-auto">
            <button
              onClick={() => setPhaseFilter('middle')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                phaseFilter === 'middle'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Middle Overs (7–15)
            </button>
            <button
              onClick={() => setPhaseFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                phaseFilter === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All (1–20)
            </button>
            <button
              onClick={() => setPhaseFilter('powerplay')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                phaseFilter === 'powerplay'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Powerplay (1–6)
            </button>
            <button
              onClick={() => setPhaseFilter('death')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                phaseFilter === 'death'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Death (16–20)
            </button>
          </div>
        </div>
      </div>

      <div className="h-72 sm:h-80 w-full">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {selectedOverStat && (
        <div className="rounded-xl border border-slate-800/90 bg-slate-950/80 p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">
                Over {selectedOverStat.overNumber} Analysis
              </span>
              {selectedOverStat.overNumber === greenZoneOver && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                  OPTIMAL GREEN ZONE
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Click any bar above to inspect that specific over
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-6 font-mono text-[11px]">
            <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-2.5">
              <span className="text-slate-400 block text-[10px]">Balls Faced</span>
              <span className="text-white font-bold text-sm tabular-nums">{selectedOverStat.balls}</span>
            </div>
            <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-2.5">
              <span className="text-slate-400 block text-[10px]">Runs Scored</span>
              <span className="text-white font-bold text-sm tabular-nums">{selectedOverStat.runs}</span>
            </div>
            <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-2.5">
              <span className="text-slate-400 block text-[10px]">Dot-Ball %</span>
              <span className="text-amber-400 font-bold text-sm tabular-nums">{selectedOverStat.dotPercentage}%</span>
              <span className="text-[10px] text-slate-500 block">({selectedOverStat.dots} dots)</span>
            </div>
            <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-2.5">
              <span className="text-slate-400 block text-[10px]">Boundary %</span>
              <span className="text-indigo-400 font-bold text-sm tabular-nums">{selectedOverStat.boundaryPercentage}%</span>
              <span className="text-[10px] text-slate-500 block">({selectedOverStat.boundaries} bdys)</span>
            </div>
            <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-2.5">
              <span className="text-slate-400 block text-[10px]">Strike Rate</span>
              <span className="text-emerald-400 font-bold text-sm tabular-nums">{selectedOverStat.strikeRate}</span>
            </div>
            <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-2.5">
              <span className="text-slate-400 block text-[10px]">4s / 6s / Outs</span>
              <span className="text-white font-bold text-sm tabular-nums">
                {selectedOverStat.fours} / {selectedOverStat.sixes} / <span className="text-rose-400">{selectedOverStat.dismissals}</span>
              </span>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <UserCheck className="h-4 w-4 text-emerald-400" />
                <span>Bowlers Faced in Over {selectedOverStat.overNumber}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {bowlersInCurrentOver.length} {bowlersInCurrentOver.length === 1 ? 'Bowler' : 'Bowlers'} Faced
              </span>
            </div>

            {bowlersInCurrentOver.length === 0 ? (
              <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-3 text-xs text-slate-500 text-center">
                No deliveries recorded in this over
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/70">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/90 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-2 px-3">Bowler</th>
                      <th className="py-2 px-3">Discipline</th>
                      <th className="py-2 px-3 text-right">Balls</th>
                      <th className="py-2 px-3 text-right">Runs</th>
                      <th className="py-2 px-3 text-right">Dots</th>
                      <th className="py-2 px-3 text-right">Dot %</th>
                      <th className="py-2 px-3 text-right">Bdys (4s/6s)</th>
                      <th className="py-2 px-3 text-right">Boundary %</th>
                      <th className="py-2 px-3 text-right">Strike Rate</th>
                      <th className="py-2 px-3 text-right">Dismissals</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {bowlersInCurrentOver.map(b => (
                      <tr key={b.bowler} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2 px-3 font-sans font-semibold text-white">
                          {b.bowler}
                        </td>
                        <td className="py-2 px-3 font-sans text-slate-300 text-[11px]">
                          <span className="text-slate-400">{b.bowlerArm}</span> {b.bowlerType}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-200 tabular-nums">{b.balls}</td>
                        <td className="py-2 px-3 text-right text-emerald-400 font-semibold tabular-nums">{b.runs}</td>
                        <td className="py-2 px-3 text-right text-slate-300 tabular-nums">{b.dots}</td>
                        <td className="py-2 px-3 text-right text-amber-400 font-semibold tabular-nums">{b.dotPercentage}%</td>
                        <td className="py-2 px-3 text-right text-indigo-400 font-semibold tabular-nums">
                          {b.boundaries} <span className="text-slate-500 font-normal">({b.fours}/{b.sixes})</span>
                        </td>
                        <td className="py-2 px-3 text-right text-indigo-400 font-semibold tabular-nums">{b.boundaryPercentage}%</td>
                        <td className="py-2 px-3 text-right text-emerald-400 font-semibold tabular-nums">{b.strikeRate}</td>
                        <td className="py-2 px-3 text-right tabular-nums">
                          {b.dismissals > 0 ? (
                            <span className="text-rose-400 font-bold">{b.dismissals}</span>
                          ) : (
                            <span className="text-slate-500">0</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
