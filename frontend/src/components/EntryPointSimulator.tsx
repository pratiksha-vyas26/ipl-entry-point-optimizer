import React, { useState } from 'react';
import { BatsmanDetailedStats } from '../types.ts';
import { Sliders, AlertCircle, CheckCircle2 } from 'lucide-react';

interface EntryPointSimulatorProps {
  stats: BatsmanDetailedStats;
}

export const EntryPointSimulator: React.FC<EntryPointSimulatorProps> = ({ stats }) => {
  const { batsman, greenZone, middleOvers, overs } = stats;
  const [entryOver, setEntryOver] = useState<number>(greenZone.primaryOver);

  const optimalOver = greenZone.primaryOver;
  const selectedOverStat = overs.find(o => o.overNumber === entryOver);
  const optimalOverStat = overs.find(o => o.overNumber === optimalOver);

  const isGreenZone = entryOver === optimalOver;
  const isEarlier = entryOver < optimalOver;

  const currentEff = selectedOverStat ? selectedOverStat.efficiencyScore : 0;
  const optimalEff = optimalOverStat ? optimalOverStat.efficiencyScore : 0;
  const efficiencyLoss = Math.round((optimalEff - currentEff) * 10) / 10;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-sm">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5 text-emerald-400" />
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Tactical Entry-Point Scenario Simulator
          </h3>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Simulate match outcomes when deploying {batsman} at different middle-over intervention points (7–15)
        </p>
      </div>

      <div className="mt-5 space-y-6">
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-300">Target Entry Over:</span>
            <span className="font-mono text-emerald-400 font-bold text-sm">
              Over {entryOver} {isGreenZone && '(Optimal Green Zone)'}
            </span>
          </div>

          <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
            {[7, 8, 9, 10, 11, 12, 13, 14, 15].map(ov => (
              <button
                key={ov}
                onClick={() => setEntryOver(ov)}
                className={`py-2 px-1 text-xs font-mono font-bold rounded-lg transition-all ${
                  entryOver === ov
                    ? ov === optimalOver
                      ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400/50'
                      : 'bg-indigo-600 text-white shadow-md'
                    : ov === optimalOver
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900/50'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                Ov {ov}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Dot Ball Suppression
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                {selectedOverStat ? `${selectedOverStat.dotPercentage}%` : 'N/A'}
              </span>
              <span className="text-xs text-slate-500">
                (Mid Avg: {middleOvers.dotPercentage}%)
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400 leading-normal">
              {selectedOverStat && selectedOverStat.dotPercentage < middleOvers.dotPercentage
                ? 'Strong dot suppression: Batter rotates strike with confidence.'
                : 'Elevated dot ball risk: Batter may consume scoring momentum.'}
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Boundary Impact Potential
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-indigo-400 tabular-nums">
                {selectedOverStat ? `${selectedOverStat.boundaryPercentage}%` : 'N/A'}
              </span>
              <span className="text-xs text-slate-500">
                (Mid Avg: {middleOvers.boundaryPercentage}%)
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400 leading-normal">
              {selectedOverStat && selectedOverStat.boundaryPercentage >= 25
                ? 'High boundary potency: Rapid boundary acceleration probable.'
                : 'Moderate boundary strike: Scoring relies on running singles/twos.'}
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Expected Strike Rate
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {selectedOverStat ? selectedOverStat.strikeRate : 'N/A'}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {selectedOverStat ? `${selectedOverStat.runs} runs (${selectedOverStat.balls}b)` : ''}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400 leading-normal">
              Projected run production index during this over phase.
            </p>
          </div>
        </div>

        <div className={`rounded-lg border p-4 text-xs ${
          isGreenZone
            ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
            : 'border-slate-800 bg-slate-950/60 text-slate-300'
        }`}>
          <div className="flex items-start gap-2.5">
            {isGreenZone ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-white text-sm">
                {isGreenZone
                  ? `Over ${entryOver} is ${batsman}'s Prime Entry Window`
                  : `Sub-Optimal Efficiency Differential (-${efficiencyLoss}% vs Green Zone)`}
              </h4>
              <p className="mt-1 text-slate-300 leading-relaxed">
                {isGreenZone
                  ? `Entering at Over ${entryOver} aligns directly with ${batsman}'s historical peak boundary conversion (${selectedOverStat?.boundaryPercentage}%) and lowest stalling rate (${selectedOverStat?.dotPercentage}%). This entry timing breaks opposition middle-over containment.`
                  : isEarlier
                  ? `Entering early at Over ${entryOver} carries a higher dot-ball friction risk before settling in. Contrast with Over ${optimalOver}, where boundary clearance accelerates sharply.`
                  : `Delaying entry until Over ${entryOver} leaves fewer middle overs to exploit opposition spin overs and forces immediate high-risk shot execution.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
