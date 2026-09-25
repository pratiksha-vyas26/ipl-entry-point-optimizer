import React, { useState, useMemo } from 'react';
import { User, Search, ChevronDown, Check, Sparkles } from 'lucide-react';
import { BatsmanSummary, BatsmanDetailedStats } from '../types.ts';

interface BatsmanSelectorProps {
  batsmen: BatsmanSummary[];
  selectedBatsman: string;
  onSelectBatsman: (name: string) => void;
  detailedStats: BatsmanDetailedStats | null;
  loading: boolean;
}

// Popular name alias table to match both full names and scorecard abbreviations
const ALIAS_LOOKUP: Record<string, string[]> = {
  'V Kohli': ['virat', 'kohli', 'virat kohli', 'vk', 'rcb'],
  'RG Sharma': ['rohit', 'sharma', 'rohit sharma', 'hitman', 'mi'],
  'RR Pant': ['rishabh', 'pant', 'rishabh pant', 'dc'],
  'SV Samson': ['sanju', 'samson', 'sanju samson', 'rr'],
  'SA Yadav': ['surya', 'suryakumar', 'suryakumar yadav', 'sky', 'mi'],
  'RD Gaikwad': ['ruturaj', 'gaikwad', 'ruturaj gaikwad', 'csk'],
  'H Klaasen': ['heinrich', 'klaasen', 'heinrich klaasen', 'srh'],
  'TM Head': ['travis', 'head', 'travis head', 'srh'],
  'SP Narine': ['sunil', 'narine', 'sunil narine', 'kkr'],
  'JC Buttler': ['jos', 'buttler', 'jos buttler', 'rr'],
  'YBK Jaiswal': ['yashasvi', 'jaiswal', 'yashasvi jaiswal', 'rr'],
  'S Dube': ['shivam', 'dube', 'shivam dube', 'csk'],
  'VR Iyer': ['venkatesh', 'iyer', 'venkatesh iyer', 'kkr'],
  'AD Russell': ['andre', 'russell', 'andre russell', 'dre russ', 'kkr'],
  'AK Markram': ['aiden', 'markram', 'aiden markram', 'srh'],
  'MP Stoinis': ['marcus', 'stoinis', 'marcus stoinis', 'lsg'],
  'LS Livingstone': ['liam', 'livingstone', 'liam livingstone', 'pbks'],
  'JM Bairstow': ['jonny', 'bairstow', 'jonny bairstow', 'pbks'],
  'DA Miller': ['david', 'miller', 'david miller', 'killer miller', 'gt'],
  'B Sai Sudharsan': ['sai', 'sudharsan', 'sai sudharsan', 'gt'],
  'AR Patel': ['axar', 'patel', 'axar patel', 'dc'],
  'RA Jadeja': ['ravindra', 'jadeja', 'ravindra jadeja', 'jaddu', 'csk'],
  'SM Curran': ['sam', 'curran', 'sam curran', 'pbks'],
  'NK Reddy': ['nitish', 'reddy', 'nitish kumar reddy', 'srh'],
  'J Fraser-McGurk': ['jake', 'fraser', 'mcgurk', 'jfm', 'dc'],
  'T Stubbs': ['tristan', 'stubbs', 'tristan stubbs', 'dc'],
  'PJ Cummins': ['pat', 'cummins', 'pat cummins', 'srh'],
  'Dinesh Karthik': ['dinesh', 'karthik', 'dk', 'rcb'],
  'MS Dhoni': ['ms', 'dhoni', 'thala', 'msd', 'csk'],
  'KL Rahul': ['kl', 'rahul', 'kl rahul', 'lsg'],
  'Shubman Gill': ['shubman', 'gill', 'shubman gill', 'gt'],
  'Nicholas Pooran': ['nicholas', 'pooran', 'nicky p', 'lsg'],
  'Shikhar Dhawan': ['shikhar', 'dhawan', 'gabbar', 'pbks'],
  'Shashank Singh': ['shashank', 'singh', 'shashank singh', 'pbks'],
  'Ashutosh Sharma': ['ashutosh', 'sharma', 'ashutosh sharma', 'pbks'],
  'Abhishek Sharma': ['abhishek', 'sharma', 'abhishek sharma', 'srh'],
  'Rinku Singh': ['rinku', 'singh', 'rinku singh', 'kkr'],
  'Shreyas Iyer': ['shreyas', 'iyer', 'shreyas iyer', 'kkr'],
  'R Parag': ['riyan', 'parag', 'riyan parag', 'rr'],
  'F du Plessis': ['faf', 'du plessis', 'faf du plessis', 'rcb'],
  'Rajat Patidar': ['rajat', 'patidar', 'rajat patidar', 'rcb'],
  'GJ Maxwell': ['glenn', 'maxwell', 'maxi', 'rcb'],
  'Tilak Varma': ['tilak', 'varma', 'tilak varma', 'mi'],
  'Ishan Kishan': ['ishan', 'kishan', 'ishan kishan', 'mi'],
  'Hardik Pandya': ['hardik', 'pandya', 'hardik pandya', 'mi'],
  'Rahul Tewatia': ['tewatia', 'rahul tewatia', 'gt'],
  'Ayush Badoni': ['ayush', 'badoni', 'ayush badoni', 'lsg'],
  'Shahrukh Khan': ['shahrukh', 'khan', 'shahrukh khan', 'gt'],
  'Nehal Wadhera': ['nehal', 'wadhera', 'nehal wadhera', 'mi'],
};

export const BatsmanSelector: React.FC<BatsmanSelectorProps> = ({
  batsmen,
  selectedBatsman,
  onSelectBatsman,
  detailedStats,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [isOpen, setIsOpen] = useState(false);

  // Teams list
  const TEAMS = ['All', 'CSK', 'MI', 'RCB', 'KKR', 'SRH', 'RR', 'GT', 'DC', 'LSG', 'PBKS'];
  const ROLES = ['All', 'Top-Order', 'Middle-Order', 'Finisher', 'All-Rounder'];

  // Search filter matching name, fullName, team, role, and aliases
  const filteredBatsmen = useMemo(() => {
    return batsmen.filter(b => {
      // Team filter
      if (selectedTeam !== 'All' && b.team !== selectedTeam) return false;

      // Role filter
      if (selectedRole !== 'All' && b.role !== selectedRole) return false;

      // Search term
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase().trim();

      // Direct name match
      if (b.name.toLowerCase().includes(term)) return true;

      // Full name match
      if (b.fullName && b.fullName.toLowerCase().includes(term)) return true;

      // Team match
      if (b.team && b.team.toLowerCase().includes(term)) return true;

      // Role match
      if (b.role && b.role.toLowerCase().includes(term)) return true;

      // Alias lookup match
      const aliases = ALIAS_LOOKUP[b.name] || [];
      if (aliases.some(a => a.includes(term) || term.includes(a))) return true;

      return false;
    });
  }, [batsmen, searchTerm, selectedTeam, selectedRole]);

  // Featured quick picks
  const quickPicks = useMemo(() => {
    const priority = [
      'V Kohli',
      'RG Sharma',
      'H Klaasen',
      'RR Pant',
      'KL Rahul',
      'Shubman Gill',
      'SV Samson',
      'YBK Jaiswal',
      'TM Head',
      'SA Yadav',
      'SP Narine',
      'Nicholas Pooran',
      'S Dube',
      'MS Dhoni',
      'Dinesh Karthik',
    ];
    return priority.filter(name => batsmen.some(b => b.name === name));
  }, [batsmen]);

  // Find readable display name
  const getDisplayName = (codeName: string) => {
    for (const [key, aliases] of Object.entries(ALIAS_LOOKUP)) {
      if (key === codeName) {
        // e.g. "V Kohli (Virat Kohli)"
        const fullName = aliases.find(a => a.includes(' ') && !['virat kohli', 'rohit sharma'].includes(codeName.toLowerCase()));
        if (fullName) {
          const capitalized = fullName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          if (capitalized.toLowerCase() !== codeName.toLowerCase()) {
            return `${codeName} (${capitalized})`;
          }
        }
      }
    }
    return codeName;
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Dynamic Dropdown Selector */}
        <div className="relative w-full lg:max-w-md">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400">
              Select Batsman from Cricsheet Dataset
            </label>
            <span className="text-[11px] font-mono text-emerald-400">
              {batsmen.length} IPL Batsmen Indexed
            </span>
          </div>
          
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-left text-sm text-white hover:border-slate-600 focus:border-emerald-500 focus:outline-none transition-colors"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-emerald-400">
                  <User className="h-4 w-4" />
                </div>
                <span className="font-semibold text-white truncate">
                  {selectedBatsman ? getDisplayName(selectedBatsman) : (loading ? 'Loading batsmen...' : 'Choose a batsman')}
                </span>
              </div>
              <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute left-0 right-0 z-50 mt-1 max-h-80 w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-950 shadow-2xl">
                <div className="border-b border-slate-800 p-2 space-y-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search by name, team (e.g. CSK, RCB), role, or initials..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full rounded-md border border-slate-800 bg-slate-900 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                      autoFocus
                    />
                  </div>

                  {/* Team Filter Chips */}
                  <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none text-[10px]">
                    <span className="text-slate-500 shrink-0 font-medium mr-0.5">Team:</span>
                    {TEAMS.map(team => (
                      <button
                        key={team}
                        type="button"
                        onClick={() => setSelectedTeam(team)}
                        className={`rounded px-1.5 py-0.5 font-mono shrink-0 transition-colors ${
                          selectedTeam === team
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {team}
                      </button>
                    ))}
                  </div>

                  {/* Role Filter Chips */}
                  <div className="flex items-center gap-1 overflow-x-auto text-[10px]">
                    <span className="text-slate-500 shrink-0 font-medium mr-0.5">Role:</span>
                    {ROLES.map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`rounded px-1.5 py-0.5 shrink-0 transition-colors ${
                          selectedRole === role
                            ? 'bg-indigo-600 text-white font-medium'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between px-1 text-[10px] text-slate-400 pt-0.5">
                    <span>Showing {filteredBatsmen.length} matching batsmen</span>
                    {(searchTerm || selectedTeam !== 'All' || selectedRole !== 'All') && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedTeam('All');
                          setSelectedRole('All');
                        }}
                        className="text-emerald-400 hover:underline"
                      >
                        Reset filters
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto py-1 divide-y divide-slate-800/40">
                  {filteredBatsmen.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-slate-500">
                      No batsman matching &ldquo;{searchTerm}&rdquo;
                    </div>
                  ) : (
                    filteredBatsmen.map(b => (
                      <button
                        key={b.name}
                        onClick={() => {
                          onSelectBatsman(b.name);
                          setIsOpen(false);
                          setSearchTerm('');
                        }}
                        className={`flex w-full items-center justify-between px-3.5 py-2 text-xs transition-colors hover:bg-slate-900 ${
                          b.name === selectedBatsman ? 'bg-slate-900/80 text-emerald-400 font-semibold' : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          {b.name === selectedBatsman && <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />}
                          {b.team && (
                            <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400 shrink-0">
                              {b.team}
                            </span>
                          )}
                          <div className="truncate text-left">
                            <span className="truncate font-medium">{b.fullName ? `${b.fullName} (${b.name})` : getDisplayName(b.name)}</span>
                            {b.role && <span className="block text-[10px] text-slate-500">{b.role}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums text-slate-400 shrink-0">
                          <span className="text-emerald-400 font-medium">{b.totalRuns}r</span>
                          <span>·</span>
                          <span>SR {b.strikeRate}</span>
                          <span>·</span>
                          <span className="text-amber-400">Dot {b.dotPercentage}%</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Unboxed High-Density Metadata Ribbon */}
        {detailedStats && (
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-300 border-t border-slate-800/80 pt-3 lg:border-t-0 lg:pt-0">
            <div>
              <span className="text-slate-500">Matches:</span>{' '}
              <span className="font-semibold text-white font-mono tabular-nums">{detailedStats.totalMatches}</span>
            </div>
            <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
            <div>
              <span className="text-slate-500">Runs:</span>{' '}
              <span className="font-semibold text-emerald-400 font-mono tabular-nums">{detailedStats.totalRuns}</span>
              <span className="text-slate-500 font-mono text-[11px]"> ({detailedStats.totalBallsFaced}b)</span>
            </div>
            <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
            <div>
              <span className="text-slate-500">Strike Rate:</span>{' '}
              <span className="font-semibold text-white font-mono tabular-nums">{detailedStats.overallStrikeRate}</span>
            </div>
            <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
            <div>
              <span className="text-slate-500">Dot %:</span>{' '}
              <span className="font-semibold text-amber-400 font-mono tabular-nums">{detailedStats.overallDotPercentage}%</span>
            </div>
            <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
            <div>
              <span className="text-slate-500">Boundary %:</span>{' '}
              <span className="font-semibold text-indigo-400 font-mono tabular-nums">{detailedStats.overallBoundaryPercentage}%</span>
            </div>
            <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
            <div>
              <span className="text-slate-500">Sweet Spot:</span>{' '}
              <span className="font-semibold text-emerald-400 font-mono">Over {detailedStats.greenZone.primaryOver}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Access Bar */}
      {quickPicks.length > 0 && (
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5 border-t border-slate-800/60 pt-2.5">
          <span className="text-[11px] font-medium text-slate-500 mr-1">Star Batsmen:</span>
          {quickPicks.map(name => (
            <button
              key={name}
              onClick={() => onSelectBatsman(name)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                selectedBatsman === name
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                  : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
