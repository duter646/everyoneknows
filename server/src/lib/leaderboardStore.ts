import fs from "fs/promises";
import path from "path";

const STORAGE_DIR = path.resolve(process.cwd(), "storage");
const LEADERBOARD_PATH = path.join(STORAGE_DIR, "leaderboard.json");

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  score: number;
  correctCount: number;
  totalCount: number;
  accuracy: number;
  durationSec: number;
  submittedAt: number;
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile(filePath: string, data: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function sortEntries(entries: LeaderboardEntry[]) {
  return [...entries].sort((a, b) => {
    if (b.accuracy !== a.accuracy) {
      return b.accuracy - a.accuracy;
    }
    if (a.durationSec !== b.durationSec) {
      return a.durationSec - b.durationSec;
    }
    return a.submittedAt - b.submittedAt;
  });
}

export async function getLeaderboard(limit = 100) {
  const entries = await readJsonFile<LeaderboardEntry[]>(LEADERBOARD_PATH, []);
  const sorted = sortEntries(entries);
  return sorted.slice(0, limit);
}

export async function appendLeaderboard(entry: LeaderboardEntry) {
  const entries = await readJsonFile<LeaderboardEntry[]>(LEADERBOARD_PATH, []);
  entries.push(entry);
  const sorted = sortEntries(entries).slice(0, 1000);
  await writeJsonFile(LEADERBOARD_PATH, sorted);
  return sorted;
}
