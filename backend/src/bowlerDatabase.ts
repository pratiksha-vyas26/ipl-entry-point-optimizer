import type { BowlerMeta } from './types.ts';

// Comprehensive catalog of IPL and T20 bowlers with style metadata
export const BOWLER_DIRECTORY: Record<string, BowlerMeta> = {
  // === PACE: Left-Arm ===
  'MA Starc': { name: 'MA Starc', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast' },
  'Mitchell Starc': { name: 'Mitchell Starc', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast' },
  'TA Boult': { name: 'TA Boult', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast-Medium' },
  'Trent Boult': { name: 'Trent Boult', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast-Medium' },
  'Arshdeep Singh': { name: 'Arshdeep Singh', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast-Medium' },
  'T Natarajan': { name: 'T Natarajan', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast-Medium' },
  'Mustafizur Rahman': { name: 'Mustafizur Rahman', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast-Medium' },
  'Yash Dayal': { name: 'Yash Dayal', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast-Medium' },
  'Khaleel Ahmed': { name: 'Khaleel Ahmed', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast-Medium' },
  'SM Curran': { name: 'SM Curran', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast-Medium' },
  'Sam Curran': { name: 'Sam Curran', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast-Medium' },
  'Mukesh Choudhary': { name: 'Mukesh Choudhary', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast-Medium' },
  'Mohsin Khan': { name: 'Mohsin Khan', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast-Medium' },
  'C Sakariya': { name: 'C Sakariya', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast-Medium' },
  'SH Johnson': { name: 'SH Johnson', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast' },
  'Spencer Johnson': { name: 'Spencer Johnson', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast' },
  'Jaydev Unadkat': { name: 'Jaydev Unadkat', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Medium-Fast' },
  'JD Unadkat': { name: 'JD Unadkat', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Medium-Fast' },
  'Fazalhaq Farooqi': { name: 'Fazalhaq Farooqi', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast-Medium' },
  'Nandre Burger': { name: 'Nandre Burger', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast' },
  'Marco Jansen': { name: 'Marco Jansen', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast-Medium' },
  'M Jansen': { name: 'M Jansen', paceOrSpin: 'Pace', arm: 'Left-arm', style: 'Left-arm Fast-Medium' },

  // === PACE: Right-Arm ===
  'JJ Bumrah': { name: 'JJ Bumrah', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'Jasprit Bumrah': { name: 'Jasprit Bumrah', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'PJ Cummins': { name: 'PJ Cummins', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'Pat Cummins': { name: 'Pat Cummins', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'Mohammed Shami': { name: 'Mohammed Shami', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'Mohammed Siraj': { name: 'Mohammed Siraj', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'HV Patel': { name: 'HV Patel', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast-Medium' },
  'Harshal Patel': { name: 'Harshal Patel', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast-Medium' },
  'B Kumar': { name: 'B Kumar', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Medium-Fast' },
  'Bhuvneshwar Kumar': { name: 'Bhuvneshwar Kumar', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Medium-Fast' },
  'Avesh Khan': { name: 'Avesh Khan', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'M Pathirana': { name: 'M Pathirana', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'Matheesha Pathirana': { name: 'Matheesha Pathirana', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'Harshit Rana': { name: 'Harshit Rana', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'Vaibhav Arora': { name: 'Vaibhav Arora', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast-Medium' },
  'Sandeep Sharma': { name: 'Sandeep Sharma', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Medium' },
  'Sandep Sharma': { name: 'Sandep Sharma', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Medium' },
  'K Rabada': { name: 'K Rabada', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'Kagiso Rabada': { name: 'Kagiso Rabada', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'Anrich Nortje': { name: 'Anrich Nortje', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'A Nortje': { name: 'A Nortje', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'LH Ferguson': { name: 'LH Ferguson', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'Lockie Ferguson': { name: 'Lockie Ferguson', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'Mohit Sharma': { name: 'Mohit Sharma', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Medium-Fast' },
  'Deepak Chahar': { name: 'Deepak Chahar', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Medium-Fast' },
  'DL Chahar': { name: 'DL Chahar', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Medium-Fast' },
  'Shardul Thakur': { name: 'Shardul Thakur', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Medium-Fast' },
  'SN Thakur': { name: 'SN Thakur', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Medium-Fast' },
  'Mukesh Kumar': { name: 'Mukesh Kumar', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast-Medium' },
  'Mayank Yadav': { name: 'Mayank Yadav', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'Gerald Coetzee': { name: 'Gerald Coetzee', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'G Coetzee': { name: 'G Coetzee', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'Naveen-ul-Haq': { name: 'Naveen-ul-Haq', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast-Medium' },
  'Umran Malik': { name: 'Umran Malik', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'Tushar Deshpande': { name: 'Tushar Deshpande', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast-Medium' },
  'TU Deshpande': { name: 'TU Deshpande', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast-Medium' },
  'Hardik Pandya': { name: 'Hardik Pandya', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast-Medium' },
  'HH Pandya': { name: 'HH Pandya', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast-Medium' },
  'AD Russell': { name: 'AD Russell', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'Andre Russell': { name: 'Andre Russell', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast' },
  'MP Stoinis': { name: 'MP Stoinis', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Medium' },
  'Marcus Stoinis': { name: 'Marcus Stoinis', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Medium' },
  'Shivam Dube': { name: 'Shivam Dube', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Medium' },
  'Yash Thakur': { name: 'Yash Thakur', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast-Medium' },
  'Vijaykumar Vyshak': { name: 'Vijaykumar Vyshak', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast-Medium' },
  'V Vyshak': { name: 'V Vyshak', paceOrSpin: 'Pace', arm: 'Right-arm', style: 'Right-arm Fast-Medium' },

  // === SPIN: Right-Arm Off-Break / Mystery ===
  'SP Narine': { name: 'SP Narine', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Off-break' },
  'Sunil Narine': { name: 'Sunil Narine', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Off-break' },
  'R Ashwin': { name: 'R Ashwin', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Off-break' },
  'Ravichandran Ashwin': { name: 'Ravichandran Ashwin', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Off-break' },
  'CV Varun': { name: 'CV Varun', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Leg-break / Mystery' },
  'Varun Chakaravarthy': { name: 'Varun Chakaravarthy', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Leg-break / Mystery' },
  'GJ Maxwell': { name: 'GJ Maxwell', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Off-break' },
  'Glenn Maxwell': { name: 'Glenn Maxwell', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Off-break' },
  'Washington Sundar': { name: 'Washington Sundar', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Off-break' },
  'W Sundar': { name: 'W Sundar', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Off-break' },
  'AK Markram': { name: 'AK Markram', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Off-break' },
  'Aiden Markram': { name: 'Aiden Markram', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Off-break' },
  'Moeen Ali': { name: 'Moeen Ali', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Off-break' },
  'Tilak Varma': { name: 'Tilak Varma', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Off-break' },

  // === SPIN: Right-Arm Leg-Break ===
  'YS Chahal': { name: 'YS Chahal', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Leg-break' },
  'Yuzvendra Chahal': { name: 'Yuzvendra Chahal', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Leg-break' },
  'Rashid Khan': { name: 'Rashid Khan', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Leg-break' },
  'Ravi Bishnoi': { name: 'Ravi Bishnoi', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Leg-break' },
  'R Bishnoi': { name: 'R Bishnoi', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Leg-break' },
  'Mayank Markande': { name: 'Mayank Markande', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Leg-break' },
  'M Markande': { name: 'M Markande', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Leg-break' },
  'Karn Sharma': { name: 'Karn Sharma', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Leg-break' },
  'Rahul Chahar': { name: 'Rahul Chahar', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Leg-break' },
  'RD Chahar': { name: 'RD Chahar', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Leg-break' },
  'Suyash Sharma': { name: 'Suyash Sharma', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Leg-break' },
  'Piyush Chawla': { name: 'Piyush Chawla', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Leg-break' },
  'PP Chawla': { name: 'PP Chawla', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Leg-break' },
  'Riyan Parag': { name: 'Riyan Parag', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Leg-break' },
  'R Parag': { name: 'R Parag', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Leg-break' },
  'LS Livingstone': { name: 'LS Livingstone', paceOrSpin: 'Spin', arm: 'Right-arm', style: 'Right-arm Leg-break' },

  // === SPIN: Left-Arm Orthodox & Wrist Spin ===
  'RA Jadeja': { name: 'RA Jadeja', paceOrSpin: 'Spin', arm: 'Left-arm', style: 'Left-arm Orthodox' },
  'Ravindra Jadeja': { name: 'Ravindra Jadeja', paceOrSpin: 'Spin', arm: 'Left-arm', style: 'Left-arm Orthodox' },
  'AR Patel': { name: 'AR Patel', paceOrSpin: 'Spin', arm: 'Left-arm', style: 'Left-arm Orthodox' },
  'Axar Patel': { name: 'Axar Patel', paceOrSpin: 'Spin', arm: 'Left-arm', style: 'Left-arm Orthodox' },
  'Kuldeep Yadav': { name: 'Kuldeep Yadav', paceOrSpin: 'Spin', arm: 'Left-arm', style: 'Left-arm Wrist Spin' },
  'Noor Ahmad': { name: 'Noor Ahmad', paceOrSpin: 'Spin', arm: 'Left-arm', style: 'Left-arm Wrist Spin' },
  'KH Pandya': { name: 'KH Pandya', paceOrSpin: 'Spin', arm: 'Left-arm', style: 'Left-arm Orthodox' },
  'Krunal Pandya': { name: 'Krunal Pandya', paceOrSpin: 'Spin', arm: 'Left-arm', style: 'Left-arm Orthodox' },
  'Harpreet Brar': { name: 'Harpreet Brar', paceOrSpin: 'Spin', arm: 'Left-arm', style: 'Left-arm Orthodox' },
  'Shahbaz Ahmed': { name: 'Shahbaz Ahmed', paceOrSpin: 'Spin', arm: 'Left-arm', style: 'Left-arm Orthodox' },
  'Swapnil Singh': { name: 'Swapnil Singh', paceOrSpin: 'Spin', arm: 'Left-arm', style: 'Left-arm Orthodox' },
  'Abhishek Sharma': { name: 'Abhishek Sharma', paceOrSpin: 'Spin', arm: 'Left-arm', style: 'Left-arm Orthodox' },
  'Manav Suthar': { name: 'Manav Suthar', paceOrSpin: 'Spin', arm: 'Left-arm', style: 'Left-arm Orthodox' },
  'Sai Kishore': { name: 'Sai Kishore', paceOrSpin: 'Spin', arm: 'Left-arm', style: 'Left-arm Orthodox' },
  'R Sai Kishore': { name: 'R Sai Kishore', paceOrSpin: 'Spin', arm: 'Left-arm', style: 'Left-arm Orthodox' },
  'Anukul Roy': { name: 'Anukul Roy', paceOrSpin: 'Spin', arm: 'Left-arm', style: 'Left-arm Orthodox' }
};

/**
 * Resolves bowler meta information with fallback heuristics
 */
export function getBowlerMeta(bowlerName: string, cricsheetMeta?: Partial<BowlerMeta>): BowlerMeta {
  if (cricsheetMeta && cricsheetMeta.paceOrSpin && cricsheetMeta.arm) {
    return {
      name: bowlerName,
      paceOrSpin: cricsheetMeta.paceOrSpin,
      arm: cricsheetMeta.arm,
      style: cricsheetMeta.style || `${cricsheetMeta.arm} ${cricsheetMeta.paceOrSpin}`
    };
  }

  // Exact lookup
  if (BOWLER_DIRECTORY[bowlerName]) {
    return BOWLER_DIRECTORY[bowlerName];
  }

  // Soft match (case-insensitive or partial)
  const lower = bowlerName.toLowerCase();
  for (const [key, value] of Object.entries(BOWLER_DIRECTORY)) {
    if (key.toLowerCase() === lower || lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return value;
    }
  }

  // Heuristic based on common cricket surname patterns or general default
  const spinKeywords = ['chahal', 'bishnoi', 'ashwin', 'narine', 'rashid', 'kuldeep', 'jadeja', 'varun', 'axar', 'krunal', 'gopal', 'markande', 'chawla', 'noor', 'brar', 'sundar'];
  const leftArmKeywords = ['boult', 'starc', 'natarajan', 'arshdeep', 'mustafizur', 'khaleel', 'curran', 'jansen', 'dayal', 'jadeja', 'axar', 'krunal', 'brar', 'kuldeep', 'noor'];

  const isSpin = spinKeywords.some(keyword => lower.includes(keyword));
  const isLeft = leftArmKeywords.some(keyword => lower.includes(keyword));

  return {
    name: bowlerName,
    paceOrSpin: isSpin ? 'Spin' : 'Pace',
    arm: isLeft ? 'Left-arm' : 'Right-arm',
    style: `${isLeft ? 'Left-arm' : 'Right-arm'} ${isSpin ? 'Spin' : 'Fast-Medium'}`
  };
}
