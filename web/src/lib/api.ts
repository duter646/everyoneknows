import { supabase } from "./supabase";
import {
  AdminImportResult,
  AdminSummary,
  AnswerPayload,
  LeaderboardEntry,
  LeaderboardRow,
  Meta,
  PaperResponse,
  ScoreSummary
} from "./types";

async function invokeFunction<T>(
  name: string,
  body?: unknown,
  headers?: Record<string, string>
) {
  const { data, error } = await supabase.functions.invoke(name, {
    body,
    headers
  });

  if (error) {
    throw new Error(error.message || "Function call failed");
  }
  if (!data) {
    throw new Error("Empty response");
  }
  return data as T;
}

export function fetchMeta() {
  return invokeFunction<Meta>("meta");
}

export function fetchPaper(count: number) {
  return invokeFunction<PaperResponse>("paper", { count });
}

export async function scorePaper(token: string, answers: AnswerPayload[]) {
  const result = await invokeFunction<{ summary: ScoreSummary }>("score", {
    token,
    answers
  });
  return result.summary;
}

export async function submitLeaderboard(
  token: string,
  answers: AnswerPayload[],
  nickname: string,
  durationSec: number
) {
  const result = await invokeFunction<{ entry: LeaderboardEntry }>("submit", {
    token,
    answers,
    nickname,
    durationSec
  });
  return result.entry;
}

export async function fetchLeaderboard(limit = 100) {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("id, nickname, score, correct_count, total_count, accuracy, duration_sec, submitted_at")
    .order("accuracy", { ascending: false })
    .order("duration_sec", { ascending: true })
    .order("submitted_at", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(error.message || "Failed to load leaderboard");
  }

  const rows = (data ?? []) as LeaderboardRow[];
  return rows.map((row, index) => ({
    rank: index + 1,
    id: row.id,
    nickname: row.nickname,
    score: row.score,
    correctCount: row.correct_count,
    totalCount: row.total_count,
    accuracy: Number(row.accuracy),
    durationSec: row.duration_sec,
    submittedAt: new Date(row.submitted_at).getTime()
  }));
}

export function fetchAdminSummary() {
  return invokeFunction<AdminSummary>("admin-summary");
}

export function importQuestions(
  questions: Record<string, unknown>[],
  adminSecret?: string
) {
  return invokeFunction<AdminImportResult>(
    "admin-import",
    { questions },
    adminSecret ? { "x-admin-secret": adminSecret } : undefined
  );
}

export function setQuestionStatus(id: string, enabled: boolean, adminSecret?: string) {
  return invokeFunction<{ id: string; enabled: boolean }>(
    "admin-status",
    { id, enabled },
    adminSecret ? { "x-admin-secret": adminSecret } : undefined
  );
}
