import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CricketDataEngine } from './dataParser.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const dataEngine = new CricketDataEngine();

// Initial load
dataEngine.loadLocalMatches();

export const apiRouter = Router();

// GET /api/health
apiRouter.get('/health', (_req: Request, res: Response) => {
  const meta = dataEngine.getParsedMatchesMeta();
  res.json({
    status: 'ok',
    service: 'IPL Entry-Point Optimizer API',
    matchesLoaded: meta.matchCount,
    deliveriesParsed: meta.totalDeliveries,
    dataDir: dataEngine.getDataDir(),
  });
});

// GET /api/matches
apiRouter.get('/matches', (_req: Request, res: Response) => {
  res.json(dataEngine.getParsedMatchesMeta());
});

// GET /api/batsmen
apiRouter.get('/batsmen', (req: Request, res: Response) => {
  const minBalls = req.query.minBalls ? parseInt(req.query.minBalls as string, 10) : 1;
  const list = dataEngine.getAllBatsmenSummary(isNaN(minBalls) ? 1 : minBalls);
  res.json({
    count: list.length,
    batsmen: list,
  });
});

// GET /api/data?batsman=<name>&bowler=<bowlerName>
apiRouter.get('/data', (req: Request, res: Response) => {
  const batsmanName = req.query.batsman as string;
  const bowlerName = req.query.bowler as string | undefined;

  if (!batsmanName) {
    const topBatsmen = dataEngine.getAllBatsmenSummary(10);
    if (topBatsmen.length === 0) {
      return res.status(404).json({ error: 'No batsman data found in database' });
    }
    const defaultBatsman = topBatsmen[0].name;
    const stats = dataEngine.getBatsmanAnalysis(defaultBatsman, bowlerName);
    return res.json(stats);
  }

  const stats = dataEngine.getBatsmanAnalysis(batsmanName, bowlerName);
  if (!stats) {
    return res.status(404).json({
      error: `Batsman "${batsmanName}" not found in current dataset`,
      availableBatsmen: dataEngine.getAllBatsmenSummary().slice(0, 10).map(b => b.name),
    });
  }

  res.json(stats);
});

// POST /api/upload
apiRouter.post('/upload', (req: Request, res: Response) => {
  try {
    const payload = req.body;
    if (!payload) {
      return res.status(400).json({ error: 'No JSON payload provided' });
    }

    if (Array.isArray(payload)) {
      payload.forEach((match, idx) => {
        const matchId = `uploaded_${Date.now()}_${idx}`;
        dataEngine.addUploadedMatch(matchId, match);
      });
      return res.json({
        success: true,
        message: `Successfully processed ${payload.length} match files`,
        meta: dataEngine.getParsedMatchesMeta(),
      });
    }

    // Single match JSON
    const matchId = payload.info?.match_type_number
      ? String(payload.info.match_type_number)
      : `uploaded_${Date.now()}`;

    dataEngine.addUploadedMatch(matchId, payload);
    return res.json({
      success: true,
      message: `Match ${matchId} parsed successfully`,
      meta: dataEngine.getParsedMatchesMeta(),
    });
  } catch (err: any) {
    console.error('Upload parsing error:', err);
    return res.status(500).json({ error: 'Failed to parse match data', details: err?.message });
  }
});

// GET /api/download/frontend - download frontend zip
apiRouter.get('/download/frontend', (_req: Request, res: Response) => {
  const possiblePaths = [
    path.resolve(process.cwd(), 'public', 'downloads', 'frontend.zip'),
    path.resolve(process.cwd(), 'frontend.zip'),
    path.resolve(__dirname, '..', '..', 'public', 'downloads', 'frontend.zip'),
  ];
  const zipPath = possiblePaths.find(p => fs.existsSync(p));
  if (!zipPath) {
    return res.status(404).json({ error: 'frontend.zip not found' });
  }
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="frontend.zip"');
  return res.sendFile(zipPath);
});

// GET /api/download/backend - download backend zip
apiRouter.get('/download/backend', (_req: Request, res: Response) => {
  const possiblePaths = [
    path.resolve(process.cwd(), 'public', 'downloads', 'backend.zip'),
    path.resolve(process.cwd(), 'backend.zip'),
    path.resolve(__dirname, '..', '..', 'public', 'downloads', 'backend.zip'),
  ];
  const zipPath = possiblePaths.find(p => fs.existsSync(p));
  if (!zipPath) {
    return res.status(404).json({ error: 'backend.zip not found' });
  }
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="backend.zip"');
  return res.sendFile(zipPath);
});

