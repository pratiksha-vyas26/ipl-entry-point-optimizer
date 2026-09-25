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
  overNumber: number;
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
  efficiencyScore: number;
  isGreenZone?: boolean;
  bowlersFaced: BowlerInOverStat[];
}

export interface BowlingTypeStat {
  category: string;
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
  primaryOver: number;
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
  entryPointWindow: string;
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
  powerplay: {
    balls: number;
    runs: number;
    dotPercentage: number;
    boundaryPercentage: number;
    strikeRate: number;
  };
  middleOvers: {
    balls: number;
    runs: number;
    dotPercentage: number;
    boundaryPercentage: number;
    strikeRate: number;
  };
  deathOvers: {
    balls: number;
    runs: number;
    dotPercentage: number;
    boundaryPercentage: number;
    strikeRate: number;
  };
  overs: OverStat[];
  middleOversOnly: OverStat[];
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
