export interface IPLPlayerMeta {
  codeName: string;
  fullName: string;
  team: string;
  role: 'Top-Order' | 'Middle-Order' | 'Finisher' | 'All-Rounder';
  battingHand: 'Right-hand' | 'Left-hand';
  preferredPaceOrSpin: 'Pace' | 'Spin' | 'Both';
  sweetSpotOver: number;
}

export const IPL_BATSMEN_ROSTER: IPLPlayerMeta[] = [
  // CSK
  { codeName: 'MS Dhoni', fullName: 'Mahendra Singh Dhoni', team: 'CSK', role: 'Finisher', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 19 },
  { codeName: 'RD Gaikwad', fullName: 'Ruturaj Gaikwad', team: 'CSK', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 9 },
  { codeName: 'S Dube', fullName: 'Shivam Dube', team: 'CSK', role: 'Middle-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 11 },
  { codeName: 'RA Jadeja', fullName: 'Ravindra Jadeja', team: 'CSK', role: 'All-Rounder', battingHand: 'Left-hand', preferredPaceOrSpin: 'Both', sweetSpotOver: 15 },
  { codeName: 'Ajinkya Rahane', fullName: 'Ajinkya Rahane', team: 'CSK', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 8 },
  { codeName: 'Moeen Ali', fullName: 'Moeen Ali', team: 'CSK', role: 'All-Rounder', battingHand: 'Left-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 10 },
  { codeName: 'Daryl Mitchell', fullName: 'Daryl Mitchell', team: 'CSK', role: 'Middle-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Both', sweetSpotOver: 12 },
  { codeName: 'Rachin Ravindra', fullName: 'Rachin Ravindra', team: 'CSK', role: 'Top-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 7 },
  { codeName: 'Sameer Rizvi', fullName: 'Sameer Rizvi', team: 'CSK', role: 'Finisher', battingHand: 'Right-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 14 },

  // RCB
  { codeName: 'V Kohli', fullName: 'Virat Kohli', team: 'RCB', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Both', sweetSpotOver: 10 },
  { codeName: 'F du Plessis', fullName: 'Faf du Plessis', team: 'RCB', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 8 },
  { codeName: 'Rajat Patidar', fullName: 'Rajat Patidar', team: 'RCB', role: 'Middle-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 11 },
  { codeName: 'GJ Maxwell', fullName: 'Glenn Maxwell', team: 'RCB', role: 'All-Rounder', battingHand: 'Right-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 12 },
  { codeName: 'Dinesh Karthik', fullName: 'Dinesh Karthik', team: 'RCB', role: 'Finisher', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 18 },
  { codeName: 'Cameron Green', fullName: 'Cameron Green', team: 'RCB', role: 'All-Rounder', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 13 },
  { codeName: 'Will Jacks', fullName: 'Will Jacks', team: 'RCB', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 9 },
  { codeName: 'Mahipal Lomror', fullName: 'Mahipal Lomror', team: 'RCB', role: 'Middle-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 14 },
  { codeName: 'Anuj Rawat', fullName: 'Anuj Rawat', team: 'RCB', role: 'Middle-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Both', sweetSpotOver: 13 },

  // MI
  { codeName: 'RG Sharma', fullName: 'Rohit Sharma', team: 'MI', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 7 },
  { codeName: 'SA Yadav', fullName: 'Suryakumar Yadav', team: 'MI', role: 'Middle-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Both', sweetSpotOver: 12 },
  { codeName: 'Tilak Varma', fullName: 'Tilak Varma', team: 'MI', role: 'Middle-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 10 },
  { codeName: 'Hardik Pandya', fullName: 'Hardik Pandya', team: 'MI', role: 'All-Rounder', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 16 },
  { codeName: 'Ishan Kishan', fullName: 'Ishan Kishan', team: 'MI', role: 'Top-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 8 },
  { codeName: 'Tim David', fullName: 'Tim David', team: 'MI', role: 'Finisher', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 17 },
  { codeName: 'Romario Shepherd', fullName: 'Romario Shepherd', team: 'MI', role: 'Finisher', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 19 },
  { codeName: 'Nehal Wadhera', fullName: 'Nehal Wadhera', team: 'MI', role: 'Middle-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 11 },
  { codeName: 'Naman Dhir', fullName: 'Naman Dhir', team: 'MI', role: 'Middle-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 13 },

  // KKR
  { codeName: 'Shreyas Iyer', fullName: 'Shreyas Iyer', team: 'KKR', role: 'Middle-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 11 },
  { codeName: 'SP Narine', fullName: 'Sunil Narine', team: 'KKR', role: 'Top-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 7 },
  { codeName: 'AD Russell', fullName: 'Andre Russell', team: 'KKR', role: 'All-Rounder', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 15 },
  { codeName: 'Rinku Singh', fullName: 'Rinku Singh', team: 'KKR', role: 'Finisher', battingHand: 'Left-hand', preferredPaceOrSpin: 'Both', sweetSpotOver: 16 },
  { codeName: 'VR Iyer', fullName: 'Venkatesh Iyer', team: 'KKR', role: 'Middle-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 9 },
  { codeName: 'Phil Salt', fullName: 'Philip Salt', team: 'KKR', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 8 },
  { codeName: 'Angkrish Raghuvanshi', fullName: 'Angkrish Raghuvanshi', team: 'KKR', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 10 },
  { codeName: 'Ramandeep Singh', fullName: 'Ramandeep Singh', team: 'KKR', role: 'Finisher', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 17 },
  { codeName: 'Nitish Rana', fullName: 'Nitish Rana', team: 'KKR', role: 'Middle-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 11 },

  // SRH
  { codeName: 'TM Head', fullName: 'Travis Head', team: 'SRH', role: 'Top-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 7 },
  { codeName: 'Abhishek Sharma', fullName: 'Abhishek Sharma', team: 'SRH', role: 'Top-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 8 },
  { codeName: 'H Klaasen', fullName: 'Heinrich Klaasen', team: 'SRH', role: 'Middle-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 12 },
  { codeName: 'NK Reddy', fullName: 'Nitish Kumar Reddy', team: 'SRH', role: 'All-Rounder', battingHand: 'Right-hand', preferredPaceOrSpin: 'Both', sweetSpotOver: 10 },
  { codeName: 'AK Markram', fullName: 'Aiden Markram', team: 'SRH', role: 'Middle-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 11 },
  { codeName: 'Abdul Samad', fullName: 'Abdul Samad', team: 'SRH', role: 'Finisher', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 16 },
  { codeName: 'Shahbaz Ahmed', fullName: 'Shahbaz Ahmed', team: 'SRH', role: 'All-Rounder', battingHand: 'Left-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 13 },
  { codeName: 'PJ Cummins', fullName: 'Pat Cummins', team: 'SRH', role: 'All-Rounder', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 18 },
  { codeName: 'Rahul Tripathi', fullName: 'Rahul Tripathi', team: 'SRH', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 8 },
  { codeName: 'Mayank Agarwal', fullName: 'Mayank Agarwal', team: 'SRH', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 7 },

  // RR
  { codeName: 'SV Samson', fullName: 'Sanju Samson', team: 'RR', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 9 },
  { codeName: 'JC Buttler', fullName: 'Jos Buttler', team: 'RR', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Both', sweetSpotOver: 10 },
  { codeName: 'YBK Jaiswal', fullName: 'Yashasvi Jaiswal', team: 'RR', role: 'Top-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 7 },
  { codeName: 'R Parag', fullName: 'Riyan Parag', team: 'RR', role: 'Middle-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Both', sweetSpotOver: 11 },
  { codeName: 'Shimron Hetmyer', fullName: 'Shimron Hetmyer', team: 'RR', role: 'Finisher', battingHand: 'Left-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 16 },
  { codeName: 'Dhruv Jurel', fullName: 'Dhruv Jurel', team: 'RR', role: 'Middle-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 14 },
  { codeName: 'Rovman Powell', fullName: 'Rovman Powell', team: 'RR', role: 'Finisher', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 17 },
  { codeName: 'R Ashwin', fullName: 'Ravichandran Ashwin', team: 'RR', role: 'All-Rounder', battingHand: 'Right-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 13 },

  // GT
  { codeName: 'Shubman Gill', fullName: 'Shubman Gill', team: 'GT', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Both', sweetSpotOver: 9 },
  { codeName: 'B Sai Sudharsan', fullName: 'Sai Sudharsan', team: 'GT', role: 'Top-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 10 },
  { codeName: 'DA Miller', fullName: 'David Miller', team: 'GT', role: 'Middle-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Both', sweetSpotOver: 13 },
  { codeName: 'Rahul Tewatia', fullName: 'Rahul Tewatia', team: 'GT', role: 'Finisher', battingHand: 'Left-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 17 },
  { codeName: 'Rashid Khan', fullName: 'Rashid Khan', team: 'GT', role: 'All-Rounder', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 18 },
  { codeName: 'Shahrukh Khan', fullName: 'Shahrukh Khan', team: 'GT', role: 'Finisher', battingHand: 'Right-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 12 },
  { codeName: 'Vijay Shankar', fullName: 'Vijay Shankar', team: 'GT', role: 'Middle-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 11 },
  { codeName: 'Wriddhiman Saha', fullName: 'Wriddhiman Saha', team: 'GT', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 7 },
  { codeName: 'Kane Williamson', fullName: 'Kane Williamson', team: 'GT', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 8 },

  // DC
  { codeName: 'RR Pant', fullName: 'Rishabh Pant', team: 'DC', role: 'Middle-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Both', sweetSpotOver: 11 },
  { codeName: 'J Fraser-McGurk', fullName: 'Jake Fraser-McGurk', team: 'DC', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 7 },
  { codeName: 'T Stubbs', fullName: 'Tristan Stubbs', team: 'DC', role: 'Finisher', battingHand: 'Right-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 13 },
  { codeName: 'AR Patel', fullName: 'Axar Patel', team: 'DC', role: 'All-Rounder', battingHand: 'Left-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 12 },
  { codeName: 'David Warner', fullName: 'David Warner', team: 'DC', role: 'Top-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 8 },
  { codeName: 'Prithvi Shaw', fullName: 'Prithvi Shaw', team: 'DC', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 7 },
  { codeName: 'Abishek Porel', fullName: 'Abishek Porel', team: 'DC', role: 'Top-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 8 },
  { codeName: 'Mitchell Marsh', fullName: 'Mitchell Marsh', team: 'DC', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 9 },
  { codeName: 'Shai Hope', fullName: 'Shai Hope', team: 'DC', role: 'Middle-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 10 },

  // LSG
  { codeName: 'KL Rahul', fullName: 'KL Rahul', team: 'LSG', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Both', sweetSpotOver: 10 },
  { codeName: 'Nicholas Pooran', fullName: 'Nicholas Pooran', team: 'LSG', role: 'Middle-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 12 },
  { codeName: 'MP Stoinis', fullName: 'Marcus Stoinis', team: 'LSG', role: 'All-Rounder', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 13 },
  { codeName: 'Ayush Badoni', fullName: 'Ayush Badoni', team: 'LSG', role: 'Middle-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 11 },
  { codeName: 'Quinton de Kock', fullName: 'Quinton de Kock', team: 'LSG', role: 'Top-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 8 },
  { codeName: 'Devdutt Padikkal', fullName: 'Devdutt Padikkal', team: 'LSG', role: 'Top-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 8 },
  { codeName: 'Deepak Hooda', fullName: 'Deepak Hooda', team: 'LSG', role: 'Middle-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 10 },
  { codeName: 'Krunal Pandya', fullName: 'Krunal Pandya', team: 'LSG', role: 'All-Rounder', battingHand: 'Left-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 14 },

  // PBKS
  { codeName: 'Shikhar Dhawan', fullName: 'Shikhar Dhawan', team: 'PBKS', role: 'Top-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 8 },
  { codeName: 'Shashank Singh', fullName: 'Shashank Singh', team: 'PBKS', role: 'Middle-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Both', sweetSpotOver: 13 },
  { codeName: 'Ashutosh Sharma', fullName: 'Ashutosh Sharma', team: 'PBKS', role: 'Finisher', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 16 },
  { codeName: 'JM Bairstow', fullName: 'Jonny Bairstow', team: 'PBKS', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 9 },
  { codeName: 'LS Livingstone', fullName: 'Liam Livingstone', team: 'PBKS', role: 'All-Rounder', battingHand: 'Right-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 12 },
  { codeName: 'SM Curran', fullName: 'Sam Curran', team: 'PBKS', role: 'All-Rounder', battingHand: 'Left-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 11 },
  { codeName: 'Jitesh Sharma', fullName: 'Jitesh Sharma', team: 'PBKS', role: 'Finisher', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 15 },
  { codeName: 'Prabhsimran Singh', fullName: 'Prabhsimran Singh', team: 'PBKS', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 7 },
  { codeName: 'Rilee Rossouw', fullName: 'Rilee Rossouw', team: 'PBKS', role: 'Top-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 8 },

  // IPL All-Time Legends
  { codeName: 'AB de Villiers', fullName: 'AB de Villiers', team: 'RCB', role: 'Middle-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Both', sweetSpotOver: 14 },
  { codeName: 'Chris Gayle', fullName: 'Chris Gayle', team: 'RCB', role: 'Top-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 9 },
  { codeName: 'Suresh Raina', fullName: 'Suresh Raina', team: 'CSK', role: 'Middle-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 10 },
  { codeName: 'Kieron Pollard', fullName: 'Kieron Pollard', team: 'MI', role: 'Finisher', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 17 },
  { codeName: 'Dwayne Bravo', fullName: 'Dwayne Bravo', team: 'CSK', role: 'Finisher', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 18 },
  { codeName: 'Shane Watson', fullName: 'Shane Watson', team: 'CSK', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 8 },
  { codeName: 'Gautam Gambhir', fullName: 'Gautam Gambhir', team: 'KKR', role: 'Top-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 9 },
  { codeName: 'Yuvraj Singh', fullName: 'Yuvraj Singh', team: 'SRH', role: 'Middle-Order', battingHand: 'Left-hand', preferredPaceOrSpin: 'Pace', sweetSpotOver: 13 },
  { codeName: 'Robin Uthappa', fullName: 'Robin Uthappa', team: 'CSK', role: 'Top-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 8 },
  { codeName: 'Ambati Rayudu', fullName: 'Ambati Rayudu', team: 'CSK', role: 'Middle-Order', battingHand: 'Right-hand', preferredPaceOrSpin: 'Spin', sweetSpotOver: 11 },
];

export const OPPONENT_BOWLERS = [
  'JJ Bumrah',
  'Rashid Khan',
  'SP Narine',
  'YS Chahal',
  'Kuldeep Yadav',
  'MA Starc',
  'TA Boult',
  'K Rabada',
  'Mohammed Siraj',
  'Harshal Patel',
  'Arshdeep Singh',
  'Varun Chakaravarthy',
  'M Pathirana',
  'RA Jadeja',
  'AR Patel',
  'B Kumar',
  'T Natarajan',
  'Sandeep Sharma',
  'Mohit Sharma',
  'PJ Cummins',
  'Ravi Bishnoi',
  'Mayank Yadav',
  'Noor Ahmad',
  'Lockie Ferguson',
];
