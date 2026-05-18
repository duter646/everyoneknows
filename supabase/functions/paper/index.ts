import { corsHeaders, handleOptions, jsonResponse } from "../_shared/cors.ts";
import { supabase } from "../_shared/supabase.ts";
import { buildPaper } from "../_shared/quiz.ts";
import { mulberry32, shuffle } from "../_shared/rng.ts";
import { signToken } from "../_shared/token.ts";
import { Difficulty, Question, QuestionType, QuestionView } from "../_shared/types.ts";

const allowedTypes = new Set<QuestionType>(["single", "multiple"]);
const allowedDifficulties = new Set<Difficulty>(["easy", "medium", "hard"]);

function parseStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return null;
  }
  if (!value.every((item) => typeof item === "string")) {
    return null;
  }
  return value as string[];
}

function parseNumberArray(value: unknown) {
  if (!Array.isArray(value)) {
    return null;
  }
  if (!value.every((item) => Number.isInteger(item))) {
    return null;
  }
  return value as number[];
}

function toQuestion(row: Record<string, unknown>): Question | null {
  const id = typeof row.id === "string" ? row.id : "";
  const domain = typeof row.domain === "string" ? row.domain : "";
  const type = row.type as QuestionType;
  const difficulty = row.difficulty as Difficulty;
  const question = typeof row.question === "string" ? row.question : "";
  const options = parseStringArray(row.options);
  const answer = parseNumberArray(row.answer);
  const tags = parseStringArray(row.tags);

  if (!id || !domain || !question || !options || !answer) {
    return null;
  }
  if (!allowedTypes.has(type) || !allowedDifficulties.has(difficulty)) {
    return null;
  }

  return {
    id,
    domain,
    type,
    question,
    options,
    answer,
    difficulty,
    tags: tags ?? undefined
  };
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
  const rawCount = typeof body.count === "number" ? body.count : Number(body.count);
  const count = Math.max(5, Math.min(Number.isFinite(rawCount) ? rawCount : 20, 50));

  const { data, error } = await supabase
    .from("questions")
    .select("id, domain, type, question, options, answer, difficulty, tags")
    .eq("enabled", true);

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  const questions = (data ?? [])
    .map((row) => toQuestion(row as Record<string, unknown>))
    .filter((row): row is Question => !!row);

  if (questions.length === 0) {
    return jsonResponse({ error: "No questions available." }, 404);
  }

  const seed = crypto.getRandomValues(new Uint32Array(1))[0];
  const rng = mulberry32(seed);
  const selected = buildPaper(questions, count, rng);
  const qids = selected.map((question) => question.id);
  const token = await signToken({ qids, createdAt: Date.now(), version: 1 });

  const questionViews: QuestionView[] = selected.map((question) => {
    const options = shuffle(
      question.options.map((option, index) => ({ id: index, text: option })),
      rng
    );
    return {
      id: question.id,
      domain: question.domain,
      type: question.type,
      difficulty: question.difficulty,
      question: question.question,
      options,
      tags: question.tags
    };
  });

  return jsonResponse({ token, questions: questionViews });
});
