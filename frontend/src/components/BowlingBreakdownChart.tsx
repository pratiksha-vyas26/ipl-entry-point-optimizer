import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BatsmanDetailedStats, BowlingTypeStat } from '../types.ts';
import { ShieldAlert, Award } from 'lucide-react';

interface BowlingBreakdownChartProps {
  stats: BatsmanDetailedStats;
}

export const BowlingBreakdownChart: React.FC<BowlingBreakdownChartProps> = ({ stats }) => {
  const [viewMode, setViewMode] = useState<'paceVsSpin' | 'arm' | 'detailed'>('paceVsSpin');

  const { bowlingStyleBreakdown } = stats;

  let activeDataList: BowlingTypeStat[] = [];
  if (viewMode === 'paceVsSpin') {
    activeDataList = bowlingStyleBreakdown.paceVsSpin.filter(s => s.balls > 0);
  } else if (viewMode === 'arm') {
    activeDataList = bowlingStyleBreakdown.armBreakdown.filter(s => s.balls > 0);
  } else {
    activeDataList = bowlingStyleBreakdown.detailedStyleBreakdown.filter(s => s.balls > 0);
  }

  const sortedByBoundary = [...activeDataList].sort((a, b) => b.boundaryPercentage - a.boundaryPercentage);
  const bestMatchup = sortedByBoundary.length > 0 ? sortedByBoundary[0] : null;

  const sortedByDot = [...activeDataList].sort((a, b) => b.dotPercentage - a.dotPercentage);
  const trickiestMatchup = sortedByDot.length > 0 ? sortedByDot[0] : null;

  const chartData = {
    labels: activeDataList.map(item => item.category),
    datasets: [
      {
        label: 'Boundary %',
        data: activeDataList.map(item => item.boundaryPercentage),
        backgroundColor: 'rgba(99, 102, 241, 0.85)',
        borderColor: '#6366f1',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Dot-Ball %',
        data: activeDataList.map(item => item.dotPercentage),
        backgroundColor: 'rgba(245, 158, 11, 0.75)',
        borderColor: '#f59e0b',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Strike Rate / 2 (Normalized)',
        data: activeDataList.map(item => Math.round((item.strikeRate / 2) * 10) / 10),
        backgroundColor: 'rgba(16, 185, 129, 0.65)',
        borderColor: '#10b981',
        borderWidth: 1,
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
          footer: (items: any[]) => {
            const idx = items[0].dataIndex;
            const item = activeDataList[idx];
            return `Balls: ${item.balls} | Runs: ${item.runs} | Actual SR: ${item.strikeRate}\nDots: ${item.dots} | Bdys: ${item.boundaries} (${item.fours}×4, ${item.sixes}×6)\nDismissals: ${item.dismissals}`;
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
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Bowling Style & Matchup Breakdown
          </h3>
          <p className="text-xs text-slate-400">
            Analysis across bowling disciplines derived from Cricsheet delivery records
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('paceVsSpin')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'paceVsSpin'
                ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pace vs Spin
          </button>
          <button
            onClick={() => setViewMode('arm')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'arm'
                ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Arm Trajectory
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'detailed'
                ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Detailed Sub-Types
          </button>
        </div>
      </div>

      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {bestMatchup && (
          <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-2.5 text-xs text-slate-300">
            <Award className="h-4 w-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold text-emerald-400">Primary Scoring Matchup: </span>
              <span className="text-white font-medium">{bestMatchup.category}</span>
              <span className="text-slate-400 font-mono text-[11px]">
                {' '}({bestMatchup.boundaryPercentage}% boundaries, SR {bestMatchup.strikeRate})
              </span>
            </div>
          </div>
        )}

        {trickiestMatchup && (
          <div className="flex items-center gap-2.5 rounded-lg border border-amber-500/20 bg-amber-950/20 p-2.5 text-xs text-slate-300">
            <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-semibold text-amber-400">Containment Matchup: </span>
              <span className="text-white font-medium">{trickiestMatchup.category}</span>
              <span className="text-slate-400 font-mono text-[11px]">
                {' '}({trickiestMatchup.dotPercentage}% dots, {trickiestMatchup.dismissals} outs)
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 h-72 sm:h-80 w-full">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-slate-800/80 bg-slate-950/70">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3">Bowling Discipline</th>
              <th className="py-2.5 px-3 text-right">Balls</th>
              <th className="py-2.5 px-3 text-right">Runs</th>
              <th className="py-2.5 px-3 text-right">Dot %</th>
              <th className="py-2.5 px-3 text-right">Boundary %</th>
              <th className="py-2.5 px-3 text-right">Strike Rate</th>
              <th className="py-2.5 px-3 text-right">Outs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {activeDataList.map(item => (
              <tr key={item.category} className="hover:bg-slate-900/50 transition-colors">
                <td className="py-2 px-3 font-sans font-medium text-white">{item.category}</td>
                <td className="py-2 px-3 text-right text-slate-300 tabular-nums">{item.balls}</td>
                <td className="py-2 px-3 text-right text-slate-300 tabular-nums">{item.runs}</td>
                <td className="py-2 px-3 text-right text-amber-400 font-semibold tabular-nums">{item.dotPercentage}%</td>
                <td className="py-2 px-3 text-right text-indigo-400 font-semibold tabular-nums">{item.boundaryPercentage}%</td>
                <td className="py-2 px-3 text-right text-emerald-400 font-semibold tabular-nums">{item.strikeRate}</td>
                <td className="py-2 px-3 text-right text-slate-400 tabular-nums">{item.dismissals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
