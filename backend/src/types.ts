export interface BowlerMeta {
  name: string;
  paceOrSpin: 'Pace' | 'Spin';
  arm: 'Right-arm' | 'Left-arm';
  style: string;
}

export interface BallRecord {
  matchId: string;
  season?: string;
  date?: string;
  venue?: string;
  innings: number;
  team: string;
  over: number; // 0-indexed in Cricsheet (0..19), cricket over is over + 1 (1..20)
  cricketOver: number; // 1-indexed (1..20)
  ballInOver: number;
  batter: string;
  bowler: string;
  nonStriker: string;
  batterRuns: number;
  extraRuns: number;
  totalRuns: number;
  isDot: boolean;
  isFour: boolean;
  isSix: boolean;
  isBoundary: boolean;
  isWide: boolean;
  isNoBall: boolean;
  isWicket: boolean;
  playerDismissed?: string;
  dismissalType?: string;
  bowlerType: 'Pace' | 'Spin';
  bowlerArm: 'Right-arm' | 'Left-arm';
  bowlerStyle: string;
}

export interface BowlerInOverStat {
  bowler: string;
  bowlerType: 'Pace' | 'Spin';
  bowlerArm: 'Right-arm' | 'Left-arm';
  bowlerStyle: string;
  balls: number;
  runs: number;
  dots: number;
  fours: number;
  sixes: number;
  boundaries: number;
  dotPercentage: number;
  boundaryPercentage: number;
  strikeRate: number;
  dismissals: number;
}

export interface OverStat {
  overNumber: number; // 1..20
  balls: number;
  runs: number;
  dots: number;
  fours: number;
  sixes: number;
  boundaries: number;
  dotPercentage: number;
  boundaryPercentage: number;
  strikeRate: number;
  dismissals: number;
  efficiencyScore: number; // (boundaryPercentage - dotPercentage)
  isGreenZone?: boolean;
  bowlersFaced: BowlerInOverStat[];
}

export interface BowlingTypeStat {
  category: string; // e.g. 'Pace', 'Spin', 'Right-arm Pace', etc.
  type: 'Pace' | 'Spin' | 'Other';
  arm?: 'Right-arm' | 'Left-arm';
  balls: number;
  runs: number;
  dots: number;
  fours: number;
  sixes: number;
  boundaries: number;
  dotPercentage: number;
  boundaryPercentage: number;
  strikeRate: number;
  dismissals: number;
}

export interface BowlerMatchupStat {
  bowler: string;
  bowlerType: 'Pace' | 'Spin';
  bowlerArm: 'Right-arm' | 'Left-arm';
  bowlerStyle: string;
  balls: number;
  runs: number;
  dots: number;
  singles: number;
  twos: number;
  threes: number;
  boundaries: number;
  fours: number;
  sixes: number;
  dotPercentage: number;
  boundaryPercentage: number;
  strikeRate: number;
  dismissals: number;
  dismissalTypes: string[];
  oversFaced: number[];
  middleOversBalls: number;
  middleOversRuns: number;
  middleOversDots: number;
  middleOversBoundaries: number;
  economy: number;
  dominance: 'Batsman Dominates' | 'Balanced Contest' | 'Bowler Advantage';
}

export interface GreenZoneAnalysis {
  primaryOver: number; // 1..20 (e.g. 11)
  middleOversRanked: {
    overNumber: number;
    dotPercentage: number;
    boundaryPercentage: number;
    strikeRate: number;
    balls: number;
    score: number;
  }[];
  summary: string;
  optimalEntryPointRecommendation: string;
  paceVsSpinSuitability: string;
  entryPointWindow: string; // e.g. "Overs 9–11"
}

export interface BatsmanDetailedStats {
  batsman: string;
  totalMatches: number;
  totalBallsFaced: number;
  totalRuns: number;
  totalDots: number;
  totalFours: number;
  totalSixes: number;
  totalBoundaries: number;
  overallDotPercentage: number;
  overallBoundaryPercentage: number;
  overallStrikeRate: number;
  dismissals: number;
  // Phase aggregates
  powerplay: {
    balls: number;
    runs: number;
    dotPercentage: number;
    boundaryPercentage: number;
    strikeRate: number;
  };
  middleOvers: { // 7-15
    balls: number;
    runs: number;
    dotPercentage: number;
    boundaryPercentage: number;
    strikeRate: number;
  };
  deathOvers: { // 16-20
    balls: number;
    runs: number;
    dotPercentage: number;
    boundaryPercentage: number;
    strikeRate: number;
  };
  overs: OverStat[]; // All 1..20
  middleOversOnly: OverStat[]; // 7..15
  greenZone: GreenZoneAnalysis;
  bowlingStyleBreakdown: {
    paceVsSpin: BowlingTypeStat[];
    armBreakdown: BowlingTypeStat[];
    detailedStyleBreakdown: BowlingTypeStat[];
  };
  topBowlerMatchups: BowlerMatchupStat[];
  recentMatches: {
    matchId: string;
    date?: string;
    venue?: string;
    teams: string[];
    runs: number;
    balls: number;
  }[];
}

export interface BatsmanSummary {
  name: string;
  fullName?: string;
  team?: string;
  role?: string;
  totalRuns: number;
  ballsFaced: number;
  strikeRate: number;
  dotPercentage: number;
  boundaryPercentage: number;
  middleOversDotPercentage: number;
  middleOversBoundaryPercentage: number;
  matchesCount: number;
  greenZoneOver: number;
}
