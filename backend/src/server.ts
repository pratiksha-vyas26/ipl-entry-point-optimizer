import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './routes.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Mount API routes
app.use('/api', apiRouter);

// Root greeting / info
app.get('/', (_req, res) => {
  res.json({
    app: 'IPL Entry-Point Optimizer Backend',
    version: '1.0.0',
    documentation: {
      endpoints: [
        'GET /api/batsmen - List all available batsmen with aggregated statistics',
        'GET /api/data?batsman=<name> - Detailed ball-by-ball analysis for a batsman',
        'GET /api/matches - Metadata of loaded Cricsheet JSON matches',
        'POST /api/upload - Ingest additional Cricsheet JSON match file(s)',
        'GET /api/health - Engine health and memory status',
      ],
    },
  });
});

app.listen(PORT, () => {
  console.log(`[IPL Optimizer Backend] Server running on port ${PORT}`);
  console.log(`[IPL Optimizer Backend] Ready to serve ball-by-ball insights`);
});

export default app;
