import type { BallRecord } from './types.ts';
import { IPL_BATSMEN_ROSTER, OPPONENT_BOWLERS } from './iplRosterData.ts';
import { getBowlerMeta } from './bowlerDatabase.ts';

// Deterministic pseudo-random number generator for reproducible cricket statistics
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

/**
 * Generates comprehensive ball-by-ball delivery history for all marquee IPL batsmen
 */
export function generateComprehensiveIPLBalls(): BallRecord[] {
  const records: BallRecord[] = [];

  IPL_BATSMEN_ROSTER.forEach((batter, pIdx) => {
    // Number of deliveries to simulate (120 - 220 balls per batsman)
    const baseBalls = 140 + (pIdx % 7) * 12;
    let seed = 1000 + pIdx * 97;

    // Bowlers this batsman faces (pick 10-15 bowlers)
    const bowlersCount = 10 + (pIdx % 6);
    const bowlersFaced: string[] = [];
    for (let i = 0; i < bowlersCount; i++) {
      const bIndex = (pIdx * 3 + i * 2) % OPPONENT_BOWLERS.length;
      bowlersFaced.push(OPPONENT_BOWLERS[bIndex]);
    }

    const matchesCount = 8 + (pIdx % 6);

    for (let ballNum = 1; ballNum <= baseBalls; ballNum++) {
      seed++;
      const rand1 = seededRandom(seed);
      seed++;
      const rand2 = seededRandom(seed);
      seed++;
      const rand3 = seededRandom(seed);

      // Match and Over distribution
      const matchIndex = (ballNum % matchesCount) + 1;
      const matchId = `ipl_cric_${batter.team.toLowerCase()}_${matchIndex}`;

      let cricketOver: number;
      if (batter.role === 'Top-Order') {
        // 35% powerplay (1-6), 55% middle (7-15), 10% death (16-20)
        if (rand1 < 0.35) cricketOver = 1 + Math.floor(rand2 * 6);
        else if (rand1 < 0.90) cricketOver = 7 + Math.floor(rand2 * 9);
        else cricketOver = 16 + Math.floor(rand2 * 5);
      } else if (batter.role === 'Middle-Order' || batter.role === 'All-Rounder') {
        // 10% powerplay, 75% middle (7-15), 15% death
        if (rand1 < 0.10) cricketOver = 4 + Math.floor(rand2 * 3);
        else if (rand1 < 0.85) cricketOver = 7 + Math.floor(rand2 * 9);
        else cricketOver = 16 + Math.floor(rand2 * 5);
      } else {
        // Finisher: 5% powerplay, 45% middle (7-15), 50% death (16-20)
        if (rand1 < 0.05) cricketOver = 6;
        else if (rand1 < 0.50) cricketOver = 9 + Math.floor(rand2 * 7);
        else cricketOver = 16 + Math.floor(rand2 * 5);
      }

      // Pick opposing bowler
      const bowlerName = bowlersFaced[(ballNum + cricketOver) % bowlersFaced.length];
      const bowlerMeta = getBowlerMeta(bowlerName);

      // Outcome scoring logic based on sweetSpotOver and bowler type
      const isSweetSpot = cricketOver === batter.sweetSpotOver || cricketOver === batter.sweetSpotOver - 1;
      const matchUpBonus =
        (batter.preferredPaceOrSpin === bowlerMeta.paceOrSpin || batter.preferredPaceOrSpin === 'Both') ? 0.08 : -0.05;

      let batterRuns = 0;
      let isDot = false;
      let isFour = false;
      let isSix = false;
      let isWicket = false;
      let dismissalType: string | undefined;

      // Base outcome probabilities
      // Sweet spot reduces dot balls and increases boundaries
      let dotProb = isSweetSpot ? 0.20 : 0.34 - matchUpBonus;
      let fourProb = isSweetSpot ? 0.18 : 0.11 + matchUpBonus;
      let sixProb = isSweetSpot ? 0.12 : 0.06;
      let outProb = isSweetSpot ? 0.015 : 0.035;

      // Adjust for phase
      if (cricketOver >= 16) {
        // Death overs: high boundary, higher dismissal, lower dot
        dotProb -= 0.06;
        fourProb += 0.06;
        sixProb += 0.08;
        outProb += 0.03;
      }

      if (rand3 < outProb) {
        isWicket = true;
        const outRand = seededRandom(seed + 10);
        if (outRand < 0.55) dismissalType = 'caught';
        else if (outRand < 0.80) dismissalType = 'bowled';
        else if (outRand < 0.93) dismissalType = 'lbw';
        else dismissalType = 'stumped';
        batterRuns = 0;
        isDot = true;
      } else if (rand3 < outProb + sixProb) {
        batterRuns = 6;
        isSix = true;
      } else if (rand3 < outProb + sixProb + fourProb) {
        batterRuns = 4;
        isFour = true;
      } else if (rand3 < outProb + sixProb + fourProb + dotProb) {
        batterRuns = 0;
        isDot = true;
      } else {
        // 1, 2, or 3 runs
        const singleRand = seededRandom(seed + 20);
        batterRuns = singleRand < 0.80 ? 1 : 2;
      }

      records.push({
        matchId,
        season: '2024',
        date: `2024-05-${String(10 + (matchIndex % 15)).padStart(2, '0')}`,
        venue: `${batter.team} Home Ground`,
        innings: (matchIndex % 2) + 1,
        team: batter.team,
        over: cricketOver - 1,
        cricketOver,
        ballInOver: (ballNum % 6) + 1,
        batter: batter.codeName,
        bowler: bowlerName,
        nonStriker: 'Partner',
        batterRuns,
        extraRuns: 0,
        totalRuns: batterRuns,
        isDot,
        isFour,
        isSix,
        isBoundary: isFour || isSix,
        isWide: false,
        isNoBall: false,
        isWicket,
        playerDismissed: isWicket ? batter.codeName : undefined,
        dismissalType,
        bowlerType: bowlerMeta.paceOrSpin,
        bowlerArm: bowlerMeta.arm,
        bowlerStyle: bowlerMeta.style,
      });
    }
  });

  return records;
}
