import React from 'react';
import { Target, TrendingUp, Zap } from 'lucide-react';
import { BatsmanDetailedStats } from '../types.ts';

interface GreenZoneCardProps {
  stats: BatsmanDetailedStats;
}

export const GreenZoneCard: React.FC<GreenZoneCardProps> = ({ stats }) => {
  const { greenZone, middleOvers, overs } = stats;
  const targetOverStat = overs.find(o => o.overNumber === greenZone.primaryOver);

  const dotDiff = targetOverStat
    ? Math.round((middleOvers.dotPercentage - targetOverStat.dotPercentage) * 10) / 10
    : 0;

  const boundDiff = targetOverStat
    ? Math.round((targetOverStat.boundaryPercentage - middleOvers.boundaryPercentage) * 10) / 10
    : 0;

  return (
    <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-950 p-5 shadow-lg shadow-emerald-950/20">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        {/* Left Column: Primary Green Zone Hero Metric */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-400">
              <Target className="h-4 w-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Optimal Entry-Point: Green Zone
            </span>
            <span className="text-slate-500 text-xs">·</span>
            <span className="text-xs text-slate-400 font-mono">Middle-Overs Sweet Spot</span>
          </div>

          <div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Over {greenZone.primaryOver}
              </h2>
              <span className="text-sm font-medium text-emerald-300">
                Recommended Window: {greenZone.entryPointWindow}
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {greenZone.summary}
            </p>
          </div>

          {/* Tactical Recommendation Bar */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Analyst Take: </span>
                <span>{greenZone.optimalEntryPointRecommendation}</span>
              </div>
            </div>
            <div className="mt-2 border-t border-slate-800/80 pt-2 flex items-start gap-2 text-slate-400">
              <TrendingUp className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>{greenZone.paceVsSpinSuitability}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Quantitative Key Comparison Metrics */}
        {targetOverStat && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 lg:w-80 shrink-0">
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-[11px] font-medium text-slate-400">Dot-Ball %</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono tabular-nums text-emerald-400">
                  {targetOverStat.dotPercentage}%
                </span>
                {dotDiff > 0 && (
                  <span className="text-[10px] text-emerald-300 font-mono">
                    (-{dotDiff}% vs mid)
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {targetOverStat.dots} dots in {targetOverStat.balls} balls
              </span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-[11px] font-medium text-slate-400">Boundary %</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono tabular-nums text-indigo-400">
                  {targetOverStat.boundaryPercentage}%
                </span>
                {boundDiff > 0 && (
                  <span className="text-[10px] text-emerald-300 font-mono">
                    (+{boundDiff}% vs mid)
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {targetOverStat.boundaries} bdys ({targetOverStat.fours}×4, {targetOverStat.sixes}×6)
              </span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-[11px] font-medium text-slate-400">Phase Strike Rate</span>
              <div className="mt-1">
                <span className="text-xl font-bold font-mono tabular-nums text-white">
                  {targetOverStat.strikeRate}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {targetOverStat.runs} runs scored
              </span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-[11px] font-medium text-slate-400">Wicket Exposure</span>
              <div className="mt-1">
                <span className="text-xl font-bold font-mono tabular-nums text-amber-400">
                  {targetOverStat.dismissals}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {targetOverStat.dismissals === 0 ? 'Zero dismissals' : 'Dismissal recorded'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
