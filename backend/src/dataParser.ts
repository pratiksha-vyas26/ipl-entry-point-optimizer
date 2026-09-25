import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type {
  BallRecord,
  OverStat,
  BowlerInOverStat,
  BowlingTypeStat,
  BowlerMatchupStat,
  GreenZoneAnalysis,
  BatsmanDetailedStats,
  BatsmanSummary,
} from './types.ts';
import { getBowlerMeta } from './bowlerDatabase.ts';
import { generateComprehensiveIPLBalls } from './iplSeeder.ts';
import { IPL_BATSMEN_ROSTER } from './iplRosterData.ts';

interface RawDelivery {
  batter: string;
  bowler: string;
  non_striker?: string;
  runs: {
    batter: number;
    extras: number;
    total: number;
  };
  extras?: {
    wides?: number;
    noballs?: number;
    legbyes?: number;
    byes?: number;
    penalty?: number;
  };
  wickets?: Array<{
    player_out: string;
    kind: string;
    fielders?: Array<{ name: string }>;
  }>;
}

interface RawOver {
  over: number; // 0-indexed in Cricsheet
  deliveries: RawDelivery[];
}

interface RawInnings {
  team: string;
  overs: RawOver[];
}

interface RawMatch {
  info: {
    event?: { name?: string; match_number?: number };
    dates?: string[];
    city?: string;
    venue?: string;
    season?: string;
    teams?: string[];
    bowler_styles?: Record<string, { paceOrSpin: 'Pace' | 'Spin'; arm: 'Right-arm' | 'Left-arm'; style?: string }>;
  };
  innings: RawInnings[];
}

// Canonical name alias mapping for effortless searching
export const BATSMAN_NAME_MAP: Record<string, string> = {
  'virat kohli': 'V Kohli',
  'v kohli': 'V Kohli',
  'kohli': 'V Kohli',
  'rohit sharma': 'RG Sharma',
  'rg sharma': 'RG Sharma',
  'rohit': 'RG Sharma',
  'rishabh pant': 'RR Pant',
  'rr pant': 'RR Pant',
  'pant': 'RR Pant',
  'sanju samson': 'SV Samson',
  'sv samson': 'SV Samson',
  'samson': 'SV Samson',
  'suryakumar yadav': 'SA Yadav',
  'sa yadav': 'SA Yadav',
  'sky': 'SA Yadav',
  'ruturaj gaikwad': 'RD Gaikwad',
  'rd gaikwad': 'RD Gaikwad',
  'heinrich klaasen': 'H Klaasen',
  'h klaasen': 'H Klaasen',
  'klaasen': 'H Klaasen',
  'travis head': 'TM Head',
  'tm head': 'TM Head',
  'head': 'TM Head',
  'sunil narine': 'SP Narine',
  'sp narine': 'SP Narine',
  'narine': 'SP Narine',
  'jos buttler': 'JC Buttler',
  'jc buttler': 'JC Buttler',
  'buttler': 'JC Buttler',
  'yashasvi jaiswal': 'YBK Jaiswal',
  'ybk jaiswal': 'YBK Jaiswal',
  'jaiswal': 'YBK Jaiswal',
  'shivam dube': 'S Dube',
  's dube': 'S Dube',
  'dube': 'S Dube',
  'venkatesh iyer': 'VR Iyer',
  'vr iyer': 'VR Iyer',
  'andre russell': 'AD Russell',
  'ad russell': 'AD Russell',
  'russell': 'AD Russell',
  'aiden markram': 'AK Markram',
  'ak markram': 'AK Markram',
  'marcus stoinis': 'MP Stoinis',
  'mp stoinis': 'MP Stoinis',
  'stoinis': 'MP Stoinis',
  'liam livingstone': 'LS Livingstone',
  'ls livingstone': 'LS Livingstone',
  'livingstone': 'LS Livingstone',
  'jonny bairstow': 'JM Bairstow',
  'jm bairstow': 'JM Bairstow',
  'bairstow': 'JM Bairstow',
  'david miller': 'DA Miller',
  'da miller': 'DA Miller',
  'miller': 'DA Miller',
  'sai sudharsan': 'B Sai Sudharsan',
  'b sai sudharsan': 'B Sai Sudharsan',
  'axar patel': 'AR Patel',
  'ar patel': 'AR Patel',
  'ravindra jadeja': 'RA Jadeja',
  'ra jadeja': 'RA Jadeja',
  'sam curran': 'SM Curran',
  'sm curran': 'SM Curran',
  'nitish kumar reddy': 'NK Reddy',
  'nk reddy': 'NK Reddy',
  'jake fraser-mcgurk': 'J Fraser-McGurk',
  'j fraser-mcgurk': 'J Fraser-McGurk',
  'tristan stubbs': 'T Stubbs',
  't stubbs': 'T Stubbs',
  'pat cummins': 'PJ Cummins',
  'pj cummins': 'PJ Cummins',
  'dinesh karthik': 'Dinesh Karthik',
  'ms dhoni': 'MS Dhoni',
  'dhoni': 'MS Dhoni',
  'kl rahul': 'KL Rahul',
  'rahul': 'KL Rahul',
  'shubman gill': 'Shubman Gill',
  'gill': 'Shubman Gill',
  'nicholas pooran': 'Nicholas Pooran',
  'pooran': 'Nicholas Pooran',
  'shikhar dhawan': 'Shikhar Dhawan',
  'shashank singh': 'Shashank Singh',
  'ashutosh sharma': 'Ashutosh Sharma',
  'abhishek sharma': 'Abhishek Sharma',
  'rinku singh': 'Rinku Singh',
  'shreyas iyer': 'Shreyas Iyer',
  'riyan parag': 'R Parag',
  'r parag': 'R Parag',
  'faf du plessis': 'F du Plessis',
  'f du plessis': 'F du Plessis',
  'rajat patidar': 'Rajat Patidar',
  'glenn maxwell': 'GJ Maxwell',
  'gj maxwell': 'GJ Maxwell',
  'maxwell': 'GJ Maxwell',
};

export class CricketDataEngine {
  private dataDir: string;
  private ballRecords: BallRecord[] = [];
  private parsedMatchesCount = 0;
  private matchesMeta: Array<{
    id: string;
    season?: string;
    date?: string;
    venue?: string;
    teams: string[];
    deliveriesCount: number;
  }> = [];

  constructor(customDataDir?: string) {
    if (customDataDir) {
      this.dataDir = customDataDir;
    } else {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const potentialDirs = [
        path.resolve(process.cwd(), 'backend', 'data'),
        path.resolve(process.cwd(), 'data'),
        path.resolve(__dirname, '..', 'data'),
        path.resolve(__dirname, '..', '..', 'backend', 'data'),
      ];
      this.dataDir = potentialDirs.find(d => fs.existsSync(d)) || potentialDirs[0];
    }
  }

  public getDataDir(): string {
    return this.dataDir;
  }

  public getParsedMatchesMeta() {
    return {
      matchCount: this.parsedMatchesCount,
      totalDeliveries: this.ballRecords.length,
      matches: this.matchesMeta,
    };
  }

  /**
   * Scans and loads all .json match files in dataDir
   */
  public loadLocalMatches(): void {
    this.ballRecords = [];
    this.matchesMeta = [];
    this.parsedMatchesCount = 0;

    if (!fs.existsSync(this.dataDir)) {
      console.warn(`Data directory not found: ${this.dataDir}. Creating it...`);
      fs.mkdirSync(this.dataDir, { recursive: true });
      return;
    }

    const files = fs.readdirSync(this.dataDir).filter(f => f.endsWith('.json'));
    console.log(`Found ${files.length} Cricsheet match files in ${this.dataDir}`);

    for (const file of files) {
      try {
        const fullPath = path.join(this.dataDir, file);
        const content = fs.readFileSync(fullPath, 'utf8');
        const matchData: RawMatch = JSON.parse(content);
        const matchId = path.basename(file, '.json');
        this.parseSingleMatch(matchId, matchData);
        this.parsedMatchesCount++;
      } catch (err) {
        console.error(`Error parsing match file ${file}:`, err);
      }
    }

    // Inject comprehensive IPL ball records for all star batsmen and bowlers
    const seededBalls = generateComprehensiveIPLBalls();
    this.ballRecords.push(...seededBalls);

    console.log(
      `Loaded ${this.parsedMatchesCount} matches + comprehensive IPL dataset. Total deliveries: ${this.ballRecords.length}`
    );
  }

  /**
   * Parses a single Cricsheet JSON structure into ball records
   */
  public parseSingleMatch(matchId: string, match: RawMatch): void {
    const info = match.info || {};
    const teams = info.teams || [];
    const date = info.dates && info.dates.length > 0 ? info.dates[0] : undefined;
    const venue = info.venue || info.city || 'IPL Stadium';
    const season = info.season || '2024';

    let matchBallsCount = 0;

    if (!match.innings || !Array.isArray(match.innings)) {
      return;
    }

    match.innings.forEach((inning, innIdx) => {
      const inningTeam = inning.team || (teams[innIdx] ?? `Innings ${innIdx + 1}`);
      const overs = inning.overs || [];

      overs.forEach(ov => {
        const overIndex = ov.over; // 0-based
        const cricketOver = overIndex + 1; // 1-based (1..20)
        const deliveries = ov.deliveries || [];

        deliveries.forEach((del, bIdx) => {
          const isWide = Boolean(del.extras?.wides && del.extras.wides > 0);
          const isNoBall = Boolean(del.extras?.noballs && del.extras.noballs > 0);
          const batterRuns = del.runs?.batter || 0;
          const extraRuns = del.runs?.extras || 0;
          const totalRuns = del.runs?.total || 0;

          // Dot ball: batter faced delivery and scored 0 runs off bat
          const isDot = !isWide && batterRuns === 0;
          const isFour = batterRuns === 4;
          const isSix = batterRuns === 6;
          const isBoundary = isFour || isSix;

          // Bowler meta resolution
          const customBowlerMeta = info.bowler_styles?.[del.bowler];
          const bowlerMeta = getBowlerMeta(del.bowler, customBowlerMeta);

          let isWicket = false;
          let playerDismissed: string | undefined;
          let dismissalType: string | undefined;

          if (del.wickets && del.wickets.length > 0) {
            isWicket = true;
            playerDismissed = del.wickets[0].player_out;
            dismissalType = del.wickets[0].kind;
          }

          const record: BallRecord = {
            matchId,
            season,
            date,
            venue,
            innings: innIdx + 1,
            team: inningTeam,
            over: overIndex,
            cricketOver,
            ballInOver: bIdx + 1,
            batter: del.batter,
            bowler: del.bowler,
            nonStriker: del.non_striker || '',
            batterRuns,
            extraRuns,
            totalRuns,
            isDot,
            isFour,
            isSix,
            isBoundary,
            isWide,
            isNoBall,
            isWicket,
            playerDismissed,
            dismissalType,
            bowlerType: bowlerMeta.paceOrSpin,
            bowlerArm: bowlerMeta.arm,
            bowlerStyle: bowlerMeta.style,
          };

          this.ballRecords.push(record);
          matchBallsCount++;
        });
      });
    });

    this.matchesMeta.push({
      id: matchId,
      season,
      date,
      venue,
      teams,
      deliveriesCount: matchBallsCount,
    });
  }

  public addUploadedMatch(matchId: string, matchData: RawMatch): void {
    this.parseSingleMatch(matchId, matchData);
    this.parsedMatchesCount++;
  }

  /**
   * Resolves query string to canonical batsman name in dataset
   */
  public resolveBatsmanName(query: string): string | null {
    const qLower = query.toLowerCase().trim();

    // Check IPL roster by full name or code name
    const rosterMatch = IPL_BATSMEN_ROSTER.find(
      r => r.fullName.toLowerCase() === qLower || r.codeName.toLowerCase() === qLower
    );
    if (rosterMatch) {
      const foundInBalls = this.ballRecords.find(b => b.batter.toLowerCase() === rosterMatch.codeName.toLowerCase());
      if (foundInBalls) return foundInBalls.batter;
    }

    // Check alias map
    if (BATSMAN_NAME_MAP[qLower]) {
      const alias = BATSMAN_NAME_MAP[qLower];
      const match = this.ballRecords.find(b => b.batter.toLowerCase() === alias.toLowerCase());
      if (match) return match.batter;
    }

    // Direct exact match
    const exact = this.ballRecords.find(b => b.batter.toLowerCase() === qLower);
    if (exact) return exact.batter;

    // Substring match
    const partial = this.ballRecords.find(b => b.batter.toLowerCase().includes(qLower));
    if (partial) return partial.batter;

    // Search roster full name substring
    const rosterPartial = IPL_BATSMEN_ROSTER.find(
      r => r.fullName.toLowerCase().includes(qLower) || qLower.includes(r.fullName.toLowerCase())
    );
    if (rosterPartial) {
      const match = this.ballRecords.find(b => b.batter.toLowerCase() === rosterPartial.codeName.toLowerCase());
      if (match) return match.batter;
    }

    return null;
  }

  /**
   * Lists all batsmen who have faced balls in the dataset
   */
  public getAllBatsmenSummary(minBalls = 1): BatsmanSummary[] {
    const map = new Map<string, {
      runs: number;
      balls: number;
      dots: number;
      boundaries: number;
      middleBalls: number;
      middleDots: number;
      middleBoundaries: number;
      matches: Set<string>;
      overMap: Map<number, { balls: number; dots: number; boundaries: number }>;
    }>();

    for (const b of this.ballRecords) {
      if (b.isWide) continue;

      let entry = map.get(b.batter);
      if (!entry) {
        entry = {
          runs: 0,
          balls: 0,
          dots: 0,
          boundaries: 0,
          middleBalls: 0,
          middleDots: 0,
          middleBoundaries: 0,
          matches: new Set(),
          overMap: new Map(),
        };
        map.set(b.batter, entry);
      }

      entry.runs += b.batterRuns;
      entry.balls += 1;
      if (b.isDot) entry.dots += 1;
      if (b.isBoundary) entry.boundaries += 1;
      entry.matches.add(b.matchId);

      if (b.cricketOver >= 7 && b.cricketOver <= 15) {
        entry.middleBalls += 1;
        if (b.isDot) entry.middleDots += 1;
        if (b.isBoundary) entry.middleBoundaries += 1;
      }

      let ov = entry.overMap.get(b.cricketOver);
      if (!ov) {
        ov = { balls: 0, dots: 0, boundaries: 0 };
        entry.overMap.set(b.cricketOver, ov);
      }
      ov.balls += 1;
      if (b.isDot) ov.dots += 1;
      if (b.isBoundary) ov.boundaries += 1;
    }

    const summaries: BatsmanSummary[] = [];

    for (const [name, stats] of map.entries()) {
      if (stats.balls < minBalls) continue;

      const dotPercentage = Math.round((stats.dots / stats.balls) * 1000) / 10;
      const boundaryPercentage = Math.round((stats.boundaries / stats.balls) * 1000) / 10;
      const strikeRate = Math.round((stats.runs / stats.balls) * 1000) / 10;

      const midDot = stats.middleBalls > 0
        ? Math.round((stats.middleDots / stats.middleBalls) * 1000) / 10
        : 0;
      const midBound = stats.middleBalls > 0
        ? Math.round((stats.middleBoundaries / stats.middleBalls) * 1000) / 10
        : 0;

      let bestOver = 11;
      let bestScore = -999;
      for (let ovNum = 7; ovNum <= 15; ovNum++) {
        const ovData = stats.overMap.get(ovNum);
        if (ovData && ovData.balls >= 2) {
          const bPct = (ovData.boundaries / ovData.balls) * 100;
          const dPct = (ovData.dots / ovData.balls) * 100;
          const score = bPct - dPct;
          if (score > bestScore) {
            bestScore = score;
            bestOver = ovNum;
          }
        }
      }

      const rosterInfo = IPL_BATSMEN_ROSTER.find(
        r => r.codeName.toLowerCase() === name.toLowerCase() || r.fullName.toLowerCase() === name.toLowerCase()
      );

      summaries.push({
        name,
        fullName: rosterInfo?.fullName,
        team: rosterInfo?.team,
        role: rosterInfo?.role,
        totalRuns: stats.runs,
        ballsFaced: stats.balls,
        strikeRate,
        dotPercentage,
        boundaryPercentage,
        middleOversDotPercentage: midDot,
        middleOversBoundaryPercentage: midBound,
        matchesCount: stats.matches.size,
        greenZoneOver: bestOver,
      });
    }

    return summaries.sort((a, b) => b.totalRuns - a.totalRuns);
  }

  /**
   * Detailed ball-by-ball analysis for a specific batsman, optionally filtered by bowler
   */
  public getBatsmanAnalysis(batsmanQuery: string, filterBowler?: string): BatsmanDetailedStats | null {
    const resolvedName = this.resolveBatsmanName(batsmanQuery);
    if (!resolvedName) {
      return null;
    }

    const allBatterBalls = this.ballRecords.filter(
      b => b.batter.toLowerCase() === resolvedName.toLowerCase() && !b.isWide
    );

    if (allBatterBalls.length === 0) {
      return null;
    }

    // If filterBowler is active, filter deliveries
    const activeDeliveries = filterBowler
      ? allBatterBalls.filter(b => b.bowler.toLowerCase() === filterBowler.toLowerCase())
      : allBatterBalls;

    const officialName = resolvedName;
    const matchesMap = new Map<string, { date?: string; venue?: string; teams: string[]; runs: number; balls: number }>();

    let totalRuns = 0;
    let totalDots = 0;
    let totalFours = 0;
    let totalSixes = 0;
    let dismissals = 0;

    // Track overs 1..20
    const oversData: Record<number, {
      balls: number;
      runs: number;
      dots: number;
      fours: number;
      sixes: number;
      dismissals: number;
    }> = {};

    // Track bowlers faced per over
    const oversBowlersMap: Record<number, Map<string, {
      bowler: string;
      bowlerType: 'Pace' | 'Spin';
      bowlerArm: 'Right-arm' | 'Left-arm';
      bowlerStyle: string;
      balls: number;
      runs: number;
      dots: number;
      fours: number;
      sixes: number;
      dismissals: number;
    }>> = {};

    for (let i = 1; i <= 20; i++) {
      oversData[i] = { balls: 0, runs: 0, dots: 0, fours: 0, sixes: 0, dismissals: 0 };
      oversBowlersMap[i] = new Map();
    }

    // Disciplines
    const paceStats = { category: 'Pace', type: 'Pace' as const, balls: 0, runs: 0, dots: 0, fours: 0, sixes: 0, dismissals: 0 };
    const spinStats = { category: 'Spin', type: 'Spin' as const, balls: 0, runs: 0, dots: 0, fours: 0, sixes: 0, dismissals: 0 };

    const armMap = new Map<string, { balls: number; runs: number; dots: number; fours: number; sixes: number; dismissals: number; type: 'Pace' | 'Spin' }>();
    const styleMap = new Map<string, { balls: number; runs: number; dots: number; fours: number; sixes: number; dismissals: number; type: 'Pace' | 'Spin'; arm: 'Right-arm' | 'Left-arm' }>();

    // Individual bowler records
    const bowlerMap = new Map<string, {
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
      fours: number;
      sixes: number;
      dismissals: number;
      dismissalTypes: string[];
      oversFaced: Set<number>;
      middleOversBalls: number;
      middleOversRuns: number;
      middleOversDots: number;
      middleOversBoundaries: number;
    }>();

    for (const b of activeDeliveries) {
      totalRuns += b.batterRuns;
      if (b.isDot) totalDots += 1;
      if (b.isFour) totalFours += 1;
      if (b.isSix) totalSixes += 1;

      const ov = b.cricketOver;
      if (oversData[ov]) {
        oversData[ov].balls += 1;
        oversData[ov].runs += b.batterRuns;
        if (b.isDot) oversData[ov].dots += 1;
        if (b.isFour) oversData[ov].fours += 1;
        if (b.isSix) oversData[ov].sixes += 1;
      }

      // Record bowler in this over
      const bMap = oversBowlersMap[ov];
      if (bMap) {
        let bOver = bMap.get(b.bowler);
        if (!bOver) {
          bOver = {
            bowler: b.bowler,
            bowlerType: b.bowlerType,
            bowlerArm: b.bowlerArm,
            bowlerStyle: b.bowlerStyle,
            balls: 0,
            runs: 0,
            dots: 0,
            fours: 0,
            sixes: 0,
            dismissals: 0,
          };
          bMap.set(b.bowler, bOver);
        }
        bOver.balls += 1;
        bOver.runs += b.batterRuns;
        if (b.isDot) bOver.dots += 1;
        if (b.isFour) bOver.fours += 1;
        if (b.isSix) bOver.sixes += 1;
        if (b.isWicket && b.playerDismissed?.toLowerCase() === officialName.toLowerCase()) {
          bOver.dismissals += 1;
        }
      }

      // Check dismissal
      if (b.isWicket && b.playerDismissed?.toLowerCase() === officialName.toLowerCase()) {
        dismissals += 1;
        if (oversData[ov]) {
          oversData[ov].dismissals += 1;
        }
      }

      // Match breakdown
      if (!matchesMap.has(b.matchId)) {
        matchesMap.set(b.matchId, {
          date: b.date,
          venue: b.venue,
          teams: [b.team],
          runs: 0,
          balls: 0,
        });
      }
      const mEntry = matchesMap.get(b.matchId)!;
      mEntry.runs += b.batterRuns;
      mEntry.balls += 1;

      // Pace vs Spin
      if (b.bowlerType === 'Pace') {
        paceStats.balls += 1;
        paceStats.runs += b.batterRuns;
        if (b.isDot) paceStats.dots += 1;
        if (b.isFour) paceStats.fours += 1;
        if (b.isSix) paceStats.sixes += 1;
        if (b.isWicket && b.playerDismissed?.toLowerCase() === officialName.toLowerCase()) {
          paceStats.dismissals += 1;
        }
      } else {
        spinStats.balls += 1;
        spinStats.runs += b.batterRuns;
        if (b.isDot) spinStats.dots += 1;
        if (b.isFour) spinStats.fours += 1;
        if (b.isSix) spinStats.sixes += 1;
        if (b.isWicket && b.playerDismissed?.toLowerCase() === officialName.toLowerCase()) {
          spinStats.dismissals += 1;
        }
      }

      // Arm breakdown
      const armKey = `${b.bowlerArm} ${b.bowlerType}`;
      if (!armMap.has(armKey)) {
        armMap.set(armKey, { balls: 0, runs: 0, dots: 0, fours: 0, sixes: 0, dismissals: 0, type: b.bowlerType });
      }
      const armObj = armMap.get(armKey)!;
      armObj.balls += 1;
      armObj.runs += b.batterRuns;
      if (b.isDot) armObj.dots += 1;
      if (b.isFour) armObj.fours += 1;
      if (b.isSix) armObj.sixes += 1;
      if (b.isWicket && b.playerDismissed?.toLowerCase() === officialName.toLowerCase()) {
        armObj.dismissals += 1;
      }

      // Detailed Style
      const styleKey = b.bowlerStyle;
      if (!styleMap.has(styleKey)) {
        styleMap.set(styleKey, { balls: 0, runs: 0, dots: 0, fours: 0, sixes: 0, dismissals: 0, type: b.bowlerType, arm: b.bowlerArm });
      }
      const stObj = styleMap.get(styleKey)!;
      stObj.balls += 1;
      stObj.runs += b.batterRuns;
      if (b.isDot) stObj.dots += 1;
      if (b.isFour) stObj.fours += 1;
      if (b.isSix) stObj.sixes += 1;
      if (b.isWicket && b.playerDismissed?.toLowerCase() === officialName.toLowerCase()) {
        stObj.dismissals += 1;
      }

      // Individual Bowler Head-to-Head
      if (!bowlerMap.has(b.bowler)) {
        bowlerMap.set(b.bowler, {
          bowler: b.bowler,
          bowlerType: b.bowlerType,
          bowlerArm: b.bowlerArm,
          bowlerStyle: b.bowlerStyle,
          balls: 0,
          runs: 0,
          dots: 0,
          singles: 0,
          twos: 0,
          threes: 0,
          fours: 0,
          sixes: 0,
          dismissals: 0,
          dismissalTypes: [],
          oversFaced: new Set(),
          middleOversBalls: 0,
          middleOversRuns: 0,
          middleOversDots: 0,
          middleOversBoundaries: 0,
        });
      }
      const bEntry = bowlerMap.get(b.bowler)!;
      bEntry.balls += 1;
      bEntry.runs += b.batterRuns;
      if (b.isDot) bEntry.dots += 1;
      if (b.batterRuns === 1) bEntry.singles += 1;
      if (b.batterRuns === 2) bEntry.twos += 1;
      if (b.batterRuns === 3) bEntry.threes += 1;
      if (b.isFour) bEntry.fours += 1;
      if (b.isSix) bEntry.sixes += 1;
      bEntry.oversFaced.add(b.cricketOver);

      if (b.cricketOver >= 7 && b.cricketOver <= 15) {
        bEntry.middleOversBalls += 1;
        bEntry.middleOversRuns += b.batterRuns;
        if (b.isDot) bEntry.middleOversDots += 1;
        if (b.isBoundary) bEntry.middleOversBoundaries += 1;
      }

      if (b.isWicket && b.playerDismissed?.toLowerCase() === officialName.toLowerCase()) {
        bEntry.dismissals += 1;
        if (b.dismissalType && !bEntry.dismissalTypes.includes(b.dismissalType)) {
          bEntry.dismissalTypes.push(b.dismissalType);
        }
      }
    }

    const totalBallsFaced = activeDeliveries.length;
    const totalBoundaries = totalFours + totalSixes;
    const overallDotPercentage = totalBallsFaced > 0
      ? Math.round((totalDots / totalBallsFaced) * 1000) / 10
      : 0;
    const overallBoundaryPercentage = totalBallsFaced > 0
      ? Math.round((totalBoundaries / totalBallsFaced) * 1000) / 10
      : 0;
    const overallStrikeRate = totalBallsFaced > 0
      ? Math.round((totalRuns / totalBallsFaced) * 1000) / 10
      : 0;

    // Build 20 overs array with bowlers faced per over
    const allOvers: OverStat[] = [];
    for (let ovNum = 1; ovNum <= 20; ovNum++) {
      const d = oversData[ovNum];
      const bound = d.fours + d.sixes;
      const dotPct = d.balls > 0 ? Math.round((d.dots / d.balls) * 1000) / 10 : 0;
      const boundPct = d.balls > 0 ? Math.round((bound / d.balls) * 1000) / 10 : 0;
      const sr = d.balls > 0 ? Math.round((d.runs / d.balls) * 1000) / 10 : 0;
      const eff = Math.round((boundPct - dotPct) * 10) / 10;

      const bowlersInOver: BowlerInOverStat[] = Array.from((oversBowlersMap[ovNum] || new Map()).values()).map(bv => {
        const bBound = bv.fours + bv.sixes;
        return {
          bowler: bv.bowler,
          bowlerType: bv.bowlerType,
          bowlerArm: bv.bowlerArm,
          bowlerStyle: bv.bowlerStyle,
          balls: bv.balls,
          runs: bv.runs,
          dots: bv.dots,
          fours: bv.fours,
          sixes: bv.sixes,
          boundaries: bBound,
          dotPercentage: bv.balls > 0 ? Math.round((bv.dots / bv.balls) * 1000) / 10 : 0,
          boundaryPercentage: bv.balls > 0 ? Math.round((bBound / bv.balls) * 1000) / 10 : 0,
          strikeRate: bv.balls > 0 ? Math.round((bv.runs / bv.balls) * 1000) / 10 : 0,
          dismissals: bv.dismissals,
        };
      }).sort((a, b) => b.balls - a.balls);

      allOvers.push({
        overNumber: ovNum,
        balls: d.balls,
        runs: d.runs,
        dots: d.dots,
        fours: d.fours,
        sixes: d.sixes,
        boundaries: bound,
        dotPercentage: dotPct,
        boundaryPercentage: boundPct,
        strikeRate: sr,
        dismissals: d.dismissals,
        efficiencyScore: eff,
        isGreenZone: false,
        bowlersFaced: bowlersInOver,
      });
    }

    const middleOversOnly = allOvers.filter(o => o.overNumber >= 7 && o.overNumber <= 15);

    const calcPhase = (start: number, end: number) => {
      let b = 0, r = 0, dt = 0, bd = 0;
      for (let i = start; i <= end; i++) {
        b += oversData[i].balls;
        r += oversData[i].runs;
        dt += oversData[i].dots;
        bd += oversData[i].fours + oversData[i].sixes;
      }
      return {
        balls: b,
        runs: r,
        dotPercentage: b > 0 ? Math.round((dt / b) * 1000) / 10 : 0,
        boundaryPercentage: b > 0 ? Math.round((bd / b) * 1000) / 10 : 0,
        strikeRate: b > 0 ? Math.round((r / b) * 1000) / 10 : 0,
      };
    };

    const powerplay = calcPhase(1, 6);
    const middleOvers = calcPhase(7, 15);
    const deathOvers = calcPhase(16, 20);

    const middleCandidates = middleOversOnly.filter(o => o.balls > 0);
    const pool = middleCandidates.length > 0 ? middleCandidates : allOvers.filter(o => o.balls > 0);

    const middleRanked = pool.map(o => ({
      overNumber: o.overNumber,
      dotPercentage: o.dotPercentage,
      boundaryPercentage: o.boundaryPercentage,
      strikeRate: o.strikeRate,
      balls: o.balls,
      score: o.efficiencyScore,
    })).sort((a, b) => b.score - a.score || b.boundaryPercentage - a.boundaryPercentage || a.dotPercentage - b.dotPercentage);

    const primaryGreenOver = middleRanked.length > 0 ? middleRanked[0].overNumber : 11;

    allOvers.forEach(o => {
      if (o.overNumber === primaryGreenOver) o.isGreenZone = true;
    });
    middleOversOnly.forEach(o => {
      if (o.overNumber === primaryGreenOver) o.isGreenZone = true;
    });

    const targetOverStat = allOvers.find(o => o.overNumber === primaryGreenOver);
    const paceDots = paceStats.balls > 0 ? Math.round((paceStats.dots / paceStats.balls) * 1000) / 10 : 0;
    const spinDots = spinStats.balls > 0 ? Math.round((spinStats.dots / spinStats.balls) * 1000) / 10 : 0;
    const paceBound = paceStats.balls > 0 ? Math.round(((paceStats.fours + paceStats.sixes) / paceStats.balls) * 1000) / 10 : 0;
    const spinBound = spinStats.balls > 0 ? Math.round(((spinStats.fours + spinStats.sixes) / spinStats.balls) * 1000) / 10 : 0;

    let paceVsSpinSuitability = 'Balanced matchup adaptability across both pace and spin.';
    if (spinBound > paceBound + 8) {
      paceVsSpinSuitability = `Elite Spin Destroyer (Boundary %: ${spinBound}% vs Spin, ${paceBound}% vs Pace). Best deployed when opposition introduces tandem spin in middle overs.`;
    } else if (paceBound > spinBound + 8) {
      paceVsSpinSuitability = `High-Velocity Enforcer (Boundary %: ${paceBound}% vs Pace, ${spinBound}% vs Spin). Enjoys pace-on-the-ball; ideal entry when opposition holds seam back.`;
    } else if (spinDots < paceDots - 10) {
      paceVsSpinSuitability = `Low-Risk Spin Rotator (Dot %: only ${spinDots}% vs Spin vs ${paceDots}% vs Pace). Keeps middle-overs scoreboard moving steadily.`;
    }

    const windowStart = Math.max(7, primaryGreenOver - 1);
    const windowEnd = Math.min(15, primaryGreenOver + 1);
    const entryPointWindow = `Overs ${windowStart}–${windowEnd}`;

    const greenZoneAnalysis: GreenZoneAnalysis = {
      primaryOver: primaryGreenOver,
      middleOversRanked: middleRanked,
      summary: `Over ${primaryGreenOver} emerges as ${officialName}'s high-octane Green Zone sweet spot, generating a ${targetOverStat?.boundaryPercentage ?? 0}% boundary strike with a restricted ${targetOverStat?.dotPercentage ?? 0}% dot-ball rate and ${targetOverStat?.strikeRate ?? 0} strike rate.`,
      optimalEntryPointRecommendation: `Target entry at ${entryPointWindow}. Sending ${officialName} in at this phase prevents stagnant middle-over lulls and exploits opposition field spreads while maintaining boundary pressure.`,
      paceVsSpinSuitability,
      entryPointWindow,
    };

    const toBowlingStat = (cat: string, type: 'Pace' | 'Spin' | 'Other', d: { balls: number; runs: number; dots: number; fours: number; sixes: number; dismissals: number }, arm?: 'Right-arm' | 'Left-arm'): BowlingTypeStat => {
      const bound = d.fours + d.sixes;
      return {
        category: cat,
        type,
        arm,
        balls: d.balls,
        runs: d.runs,
        dots: d.dots,
        fours: d.fours,
        sixes: d.sixes,
        boundaries: bound,
        dotPercentage: d.balls > 0 ? Math.round((d.dots / d.balls) * 1000) / 10 : 0,
        boundaryPercentage: d.balls > 0 ? Math.round((bound / d.balls) * 1000) / 10 : 0,
        strikeRate: d.balls > 0 ? Math.round((d.runs / d.balls) * 1000) / 10 : 0,
        dismissals: d.dismissals,
      };
    };

    const paceVsSpinList: BowlingTypeStat[] = [
      toBowlingStat('Pace', 'Pace', paceStats),
      toBowlingStat('Spin', 'Spin', spinStats),
    ];

    const armList: BowlingTypeStat[] = Array.from(armMap.entries())
      .map(([key, d]) => toBowlingStat(key, d.type, d, key.startsWith('Right-arm') ? 'Right-arm' : 'Left-arm'))
      .sort((a, b) => b.balls - a.balls);

    const styleList: BowlingTypeStat[] = Array.from(styleMap.entries())
      .map(([key, d]) => toBowlingStat(key, d.type, d, d.arm))
      .sort((a, b) => b.balls - a.balls);

    const bowlerMatchups: BowlerMatchupStat[] = Array.from(bowlerMap.values())
      .map(b => {
        const bound = b.fours + b.sixes;
        const dotPct = b.balls > 0 ? Math.round((b.dots / b.balls) * 1000) / 10 : 0;
        const bdyPct = b.balls > 0 ? Math.round((bound / b.balls) * 1000) / 10 : 0;
        const sr = b.balls > 0 ? Math.round((b.runs / b.balls) * 1000) / 10 : 0;
        const economy = b.balls > 0 ? Math.round(((b.runs / b.balls) * 6) * 100) / 100 : 0;

        let dominance: 'Batsman Dominates' | 'Balanced Contest' | 'Bowler Advantage' = 'Balanced Contest';
        if (sr >= 160 && bdyPct >= 22 && b.dismissals === 0) {
          dominance = 'Batsman Dominates';
        } else if (dotPct >= 42 || b.dismissals >= 2) {
          dominance = 'Bowler Advantage';
        }

        return {
          bowler: b.bowler,
          bowlerType: b.bowlerType,
          bowlerArm: b.bowlerArm,
          bowlerStyle: b.bowlerStyle,
          balls: b.balls,
          runs: b.runs,
          dots: b.dots,
          singles: b.singles,
          twos: b.twos,
          threes: b.threes,
          boundaries: bound,
          fours: b.fours,
          sixes: b.sixes,
          dotPercentage: dotPct,
          boundaryPercentage: bdyPct,
          strikeRate: sr,
          dismissals: b.dismissals,
          dismissalTypes: b.dismissalTypes,
          oversFaced: Array.from(b.oversFaced).sort((x, y) => x - y),
          middleOversBalls: b.middleOversBalls,
          middleOversRuns: b.middleOversRuns,
          middleOversDots: b.middleOversDots,
          middleOversBoundaries: b.middleOversBoundaries,
          economy,
          dominance,
        };
      })
      .sort((a, b) => b.balls - a.balls);

    const recentMatches = Array.from(matchesMap.entries()).map(([mId, val]) => ({
      matchId: mId,
      date: val.date,
      venue: val.venue,
      teams: val.teams,
      runs: val.runs,
      balls: val.balls,
    }));

    return {
      batsman: officialName,
      totalMatches: matchesMap.size,
      totalBallsFaced,
      totalRuns,
      totalDots,
      totalFours,
      totalSixes,
      totalBoundaries,
      overallDotPercentage,
      overallBoundaryPercentage,
      overallStrikeRate,
      dismissals,
      powerplay,
      middleOvers,
      deathOvers,
      overs: allOvers,
      middleOversOnly,
      greenZone: greenZoneAnalysis,
      bowlingStyleBreakdown: {
        paceVsSpin: paceVsSpinList,
        armBreakdown: armList,
        detailedStyleBreakdown: styleList,
      },
      topBowlerMatchups: bowlerMatchups,
      recentMatches,
    };
  }
}
