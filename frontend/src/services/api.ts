import { BatsmanDetailedStats, BatsmanSummary } from '../types.ts';

// Configurable backend base URL (e.g. set in Render environment as VITE_API_URL)
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function fetchBatsmenList(minBalls = 1): Promise<BatsmanSummary[]> {
  const url = `${API_BASE_URL}/api/batsmen?minBalls=${minBalls}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch batsmen list: ${response.statusText}`);
  }
  const data = await response.json();
  return data.batsmen || [];
}

export async function fetchBatsmanData(name: string, bowler?: string): Promise<BatsmanDetailedStats> {
  const encodedName = encodeURIComponent(name);
  let url = `${API_BASE_URL}/api/data?batsman=${encodedName}`;
  if (bowler) {
    url += `&bowler=${encodeURIComponent(bowler)}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch batsman data: ${response.statusText}`);
  }
  return await response.json();
}

export async function uploadCricsheetMatch(matchData: any): Promise<{ success: boolean; message: string }> {
  const url = `${API_BASE_URL}/api/upload`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(matchData),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to ingest match file');
  }

  return await response.json();
}

export async function fetchBackendHealth(): Promise<any> {
  const url = `${API_BASE_URL}/api/health`;
  const response = await fetch(url);
  return await response.json();
}
