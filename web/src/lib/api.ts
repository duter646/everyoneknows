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
  return localFetchMeta();
}

import { localFetchPaper, localScorePaper, localFetchMeta } from "./localQuiz";

export function fetchPaper(count: number) {
  return localFetchPaper(count);
}

export async function scorePaper(token: string, answers: AnswerPayload[]) {
  return localScorePaper(token, answers);
}

export async function submitLeaderboard(
  token: string,
  answers: AnswerPayload[],
  nickname: string,
  durationSec: number
) {
  const summary = await localScorePaper(token, answers);
  
  // Insert directly into Supabase instead of using Edge Function
  const { data, error } = await supabase
    .from("leaderboard")
    .insert([
      {
        nickname,
        score: summary.score,
        correct_count: summary.correctCount,
        total_count: summary.totalCount,
        accuracy: summary.totalCount > 0 ? (summary.correctCount / summary.totalCount) * 100 : 0,
        duration_sec: durationSec
      }
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to submit leaderboard");
  }

  return {
    rank: 0, // Mock rank
    id: data.id,
    nickname: data.nickname,
    score: data.score,
    correctCount: data.correct_count,
    totalCount: data.total_count,
    accuracy: Number(data.accuracy),
    durationSec: data.duration_sec,
    submittedAt: new Date(data.submitted_at).getTime()
  } as LeaderboardEntry;
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
