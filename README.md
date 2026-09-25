# IPL Entry-Point Optimizer

> Advanced T20 batsman entry-point analytics using Cricsheet ball-by-ball IPL match data. Evaluates middle-over (Overs 7–15) dot-ball %, boundary % (4s & 6s), bowling discipline matchups (pace vs. spin, left-arm vs. right-arm), and isolates the batsman's **Green Zone** sweet spot.

---

## 🏏 Table of Contents
1. [Overview & Core Features](#overview--core-features)
2. [Project Architecture](#project-architecture)
3. [Structuring the Local `/data` Folder](#structuring-the-local-data-folder)
4. [Testing Locally](#testing-locally)
5. [Deploying to Render via Zip File / Blueprint](#deploying-to-render-via-zip-file--blueprint)
6. [Backend API Reference](#backend-api-reference)
7. [Cricket Analytics Methodology](#cricket-analytics-methodology)

---

## Overview & Core Features

In modern T20 cricket, middle overs (7–15) represent the inflection phase of an innings. Teams that minimize dot balls while accelerating boundary conversion dominate the run rate. 

The **IPL Entry-Point Optimizer** calculates:
- **Dot-Ball % by Over**: Fraction of deliveries where the batsman scored 0 runs off the bat.
- **Boundary % by Over**: Percentage of balls cleared for 4 or 6.
- **Green Zone Highlight**: Automatically identifies the over(s) with the minimum dot-ball % and maximum boundary efficiency.
- **Bowling Discipline Breakdown**: Head-to-head performance against Pace vs. Spin, Left-arm vs. Right-arm, and sub-types (e.g. Right-arm Off-break, Left-arm Wrist Spin).
- **Tactical Entry-Point Simulator**: Interactive scenario tester comparing simulated entry overs (e.g. entering at Over 9 vs. Over 12) against the batsman's optimal Green Zone.
- **Head-to-Head Bowler Matchup Matrix**: In-depth stats against individual IPL bowlers faced in the Cricsheet dataset.
- **Dynamic Cricsheet Ingestion**: Ingest additional match JSON files on the fly via the UI or by dropping files into `/backend/data/`.

---

## Project Architecture

The repository is organized into two distinct, standalone directories optimized for Render:

```
ipl-entry-point-optimizer/
├── backend/                        # Node.js + Express Cricsheet Processing Engine
│   ├── data/                       # Local Cricsheet match JSON files
│   │   ├── 1426312.json            # KKR vs SRH (IPL 2024 Final)
│   │   ├── 1422165.json            # SRH vs RCB (Record 287 game)
│   │   ├── 1422159.json            # MI vs CSK (El Clasico)
│   │   ├── 1422161.json            # KKR vs RR (Double ton thriller)
│   │   └── README.md
│   ├── src/
│   │   ├── bowlerDatabase.ts       # 150+ IPL bowler style & arm classification
│   │   ├── dataParser.ts           # Ball-by-ball aggregation & Green Zone calculator
│   │   ├── routes.ts               # Express API endpoints
│   │   ├── server.ts               # Express server entry point
│   │   └── types.ts                # TypeScript schemas
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                       # React 19 + Chart.js + Tailwind CSS Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx          # 3-zone top bar contract
│   │   │   ├── BatsmanSelector.tsx # Dynamic dropdown selector
│   │   │   ├── GreenZoneCard.tsx   # Sweet spot highlight card
│   │   │   ├── OversChart.tsx      # Overs 7–15 dot vs boundary Chart.js bar
│   │   │   ├── BowlingBreakdownChart.tsx # Pace vs Spin & Arm breakdown
│   │   │   ├── BowlerMatchupTable.tsx    # Head-to-head bowler records
│   │   │   ├── EntryPointSimulator.tsx   # Tactical scenario simulator
│   │   │   └── DataUploadModal.tsx       # Live Cricsheet JSON file importer
│   │   ├── services/
│   │   │   └── api.ts              # API client (uses VITE_API_URL)
│   │   ├── types.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── index.html
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── render.yaml                     # Render Blueprint deploying backend & frontend
├── server.ts                       # Unified full-stack server (for dev/preview)
├── package.json
└── README.md
```

---

## Structuring the Local `/data` Folder

Cricsheet publishes full ball-by-ball IPL match files in JSON format (schema 1.1.0).

1. Locate the data folder at `backend/data/` (or create it if not present).
2. Download official IPL match files from [Cricsheet Downloads](https://cricsheet.org/downloads/#ipl) (`ipl_json.zip`).
3. Unzip and drop any number of match `.json` files into `backend/data/`:
   ```
   backend/data/
   ├── 1426312.json
   ├── 1422165.json
   ├── 1422159.json
   └── <any_other_match_id>.json
   ```
4. The backend automatically scans this directory on startup, parses every ball delivered, categorizes bowlers by style and arm, and indexes all batsmen.

---

## Testing Locally

### Option A: Unified Full-Stack (Easiest)
From the root directory:
```bash
# Install dependencies
npm install

# Run full-stack dev server (starts Express API & Vite dev server on port 3000)
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Option B: Separate Backend & Frontend Processes

#### 1. Start the Backend:
```bash
cd backend
npm install
npm run dev
```
The backend API starts on `http://localhost:5000` (or `PORT` specified in `.env`).

Verify with:
```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/batsmen
```

#### 2. Start the Frontend:
In a new terminal:
```bash
cd frontend
npm install
# Set backend URL if not using default proxy
export VITE_API_URL=http://localhost:5000
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploying to Render via Zip File / Blueprint

### Method 1: Render Blueprint (`render.yaml`) — Recommended

This repository includes a root-level `render.yaml` configured to deploy both services automatically:

1. Push your repository to GitHub or GitLab (or upload the zip file to a Git repository).
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** → **Blueprint**.
3. Connect your repository.
4. Render will parse `render.yaml` and provision:
   - **`ipl-optimizer-backend`**: Node.js Web Service running `npm run build && npm start` inside `/backend`.
   - **`ipl-optimizer-frontend`**: Static Site building inside `/frontend` with `VITE_API_URL` automatically wired to the backend URL.
5. Click **Apply**.

---

### Method 2: Manual Web Service + Static Site Setup on Render

#### Step 1: Deploy Backend (Web Service)
1. Go to **New +** → **Web Service**.
2. Connect your repo (or upload zip).
3. Set the following configuration:
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `PORT`: `10000`
     - `NODE_ENV`: `production`
4. Deploy and copy your backend service URL (e.g. `https://ipl-optimizer-backend.onrender.com`).

#### Step 2: Deploy Frontend (Static Site)
1. Go to **New +** → **Static Site**.
2. Connect the same repo.
3. Set the following configuration:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL`: `https://ipl-optimizer-backend.onrender.com` (your backend URL from Step 1)
   - **Redirects / Rewrites**:
     - Source: `/*`
     - Destination: `/index.html`
     - Action: `Rewrite`
4. Deploy the Static Site!

---

## Backend API Reference

| Endpoint | Method | Description | Parameters |
|---|---|---|---|
| `/api/health` | `GET` | Health check & match indexing status | None |
| `/api/batsmen` | `GET` | Summaries of all batsmen in dataset | `minBalls` (optional, default: 1) |
| `/api/data` | `GET` | Complete ball-by-ball analysis for a batsman | `batsman` (e.g. `?batsman=H Klaasen`) |
| `/api/matches` | `GET` | List of parsed Cricsheet match files | None |
| `/api/upload` | `POST` | Ingest new Cricsheet JSON match file(s) | JSON body with match structure |

### Example Response: `/api/data?batsman=H Klaasen`
```json
{
  "batsman": "H Klaasen",
  "totalMatches": 2,
  "totalBallsFaced": 48,
  "totalRuns": 83,
  "overallDotPercentage": 22.9,
  "overallBoundaryPercentage": 29.2,
  "overallStrikeRate": 172.9,
  "greenZone": {
    "primaryOver": 11,
    "entryPointWindow": "Overs 10–12",
    "summary": "Over 11 emerges as H Klaasen's high-octane Green Zone sweet spot...",
    "optimalEntryPointRecommendation": "Target entry at Overs 10–12...",
    "paceVsSpinSuitability": "Elite Spin Destroyer (Boundary %: 36.4% vs Spin)..."
  },
  "middleOvers": {
    "balls": 38,
    "runs": 71,
    "dotPercentage": 21.1,
    "boundaryPercentage": 31.6,
    "strikeRate": 186.8
  },
  "bowlingStyleBreakdown": {
    "paceVsSpin": [
      { "category": "Pace", "balls": 26, "dotPercentage": 26.9, "boundaryPercentage": 23.1, "strikeRate": 150.0 },
      { "category": "Spin", "balls": 22, "dotPercentage": 18.2, "boundaryPercentage": 36.4, "strikeRate": 200.0 }
    ]
  }
}
```

---

## Cricket Analytics Methodology

1. **Ball-Faced Filtering**: Wide deliveries are excluded from balls faced per standard MCC Laws and cricket statistics conventions; no-balls and byes/leg-byes faced by the batsman are recorded.
2. **Dot Ball Definition**: Any delivery faced by the batter resulting in 0 runs off the bat (`runs.batter === 0`).
3. **Boundary %**: Formula: `((fours + sixes) / total_balls_faced) * 100`.
4. **Green Zone Calculation**: For middle overs 7–15, each over is evaluated with an Efficiency Score:
   $$\text{Efficiency Score} = \text{Boundary \%} - \text{Dot-Ball \%}$$
   The over maximizing boundary conversion while minimizing dot-ball stalling represents the batsman's prime entry window.
