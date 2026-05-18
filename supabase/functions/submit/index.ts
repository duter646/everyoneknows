import { handleOptions, jsonResponse } from "../_shared/cors.ts";
import { supabase } from "../_shared/supabase.ts";
import { verifyToken } from "../_shared/token.ts";
import { scoreAnswers } from "../_shared/scoring.ts";
import { AnswerInput, Difficulty, QuestionType, ScoreQuestion } from "../_shared/types.ts";

const allowedTypes = new Set<QuestionType>(["single", "multiple"]);
const allowedDifficulties = new Set<Difficulty>(["easy", "medium", "hard"]);

function parseNumberArray(value: unknown) {
  if (!Array.isArray(value)) {
    return null;
  }
  if (!value.every((item) => Number.isInteger(item))) {
    return null;
  }
  return value as number[];
}

function parseAnswers(input: unknown): AnswerInput[] {
  if (!Array.isArray(input)) {
    return [];
  }
  return input
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const record = item as Record<string, unknown>;
      const id = typeof record.id === "string" ? record.id : "";
      const selected = parseNumberArray(record.selected);
      if (!id || !selected) {
        return null;
      }
      const timeSec = typeof record.timeSec === "number" ? record.timeSec : undefined;
      return { id, selected, timeSec } as AnswerInput;
    })
    .filter((item): item is AnswerInput => !!item);
}

Deno.serve(async (req) => {
  const optionsResponse = handleOptions(req);
  if (optionsResponse) {
    return optionsResponse;
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  const body = await req.json().catch(() => ({}));
  const token = typeof body.token === "string" ? body.token : "";
  const answers = parseAnswers(body.answers);
  const nickname = typeof body.nickname === "string" ? body.nickname : "";
  const durationSec = typeof body.durationSec === "number" ? body.durationSec : 0;

  if (!token || answers.length === 0) {
    return jsonResponse({ error: "Invalid payload." }, 400);
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return jsonResponse({ error: "Invalid token." }, 400);
  }

  const { data, error } = await supabase
    .from("questions")
    .select("id, domain, type, difficulty, answer")
    .in("id", payload.qids);

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  const questionMap = new Map<string, ScoreQuestion>();
  (data ?? []).forEach((row) => {
    const record = row as Record<string, unknown>;
    const id = typeof record.id === "string" ? record.id : "";
    const domain = typeof record.domain === "string" ? record.domain : "";
    const type = record.type as QuestionType;
    const difficulty = record.difficulty as Difficulty;
    const answer = parseNumberArray(record.answer);

    if (!id || !domain || !answer) {
      return;
    }
    if (!allowedTypes.has(type) || !allowedDifficulties.has(difficulty)) {
      return;
    }

    questionMap.set(id, {
      id,
      domain,
      type,
      difficulty,
      answer
    });
  });

  const summary = scoreAnswers(questionMap, payload.qids, answers);
  const totalPossible = summary.totalPossible || 1;
  const accuracy = summary.score / totalPossible;
  const safeNickname = nickname.trim().slice(0, 12) || "匿名玩家";
  const safeDuration = Math.max(0, Math.floor(durationSec || 0));

  const { data: entry, error: insertError } = await supabase
    .from("leaderboard")
    .insert({
      nickname: safeNickname,
      score: summary.score,
      correct_count: summary.correctCount,
      total_count: summary.totalCount,
      accuracy: Number(accuracy.toFixed(4)),
      duration_sec: safeDuration
    })
    .select("id, nickname, score, correct_count, total_count, accuracy, duration_sec, submitted_at")
    .single();

  if (insertError || !entry) {
    return jsonResponse({ error: insertError?.message || "Insert failed." }, 500);
  }

  return jsonResponse({
    entry: {
      id: entry.id,
      nickname: entry.nickname,
      score: entry.score,
      correctCount: entry.correct_count,
      totalCount: entry.total_count,
      accuracy: Number(entry.accuracy),
      durationSec: entry.duration_sec,
      submittedAt: new Date(entry.submitted_at).getTime()
    }
  });
});
