import { handleOptions, jsonResponse } from "../_shared/cors.ts";
import { supabase } from "../_shared/supabase.ts";
import { checkAdmin } from "../_shared/admin.ts";
import { validateQuestions } from "../_shared/validation.ts";
import { Question } from "../_shared/types.ts";

Deno.serve(async (req) => {
  const optionsResponse = handleOptions(req);
  if (optionsResponse) {
    return optionsResponse;
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }
  if (!checkAdmin(req)) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  const body = await req.json().catch(() => ({}));
  const questions = Array.isArray(body.questions) ? body.questions : null;

  if (!questions) {
    return jsonResponse({ error: "Questions must be an array." }, 400);
  }

  const validation = validateQuestions(questions as Partial<Question>[]);
  if (!validation.valid) {
    return jsonResponse(validation, 400);
  }

  const ids = (questions as Partial<Question>[])
    .map((question) => (typeof question.id === "string" ? question.id : ""))
    .filter((id) => id.length > 0);

  const { data: existingRows, error: existingError } = await supabase
    .from("questions")
    .select("id")
    .in("id", ids);

  if (existingError) {
    return jsonResponse({ error: existingError.message }, 500);
  }

  const existingIds = new Set((existingRows ?? []).map((row) => row.id));
  const toInsert = (questions as Partial<Question>[]).filter(
    (question) => question.id && !existingIds.has(question.id)
  );

  const rows = toInsert.map((question) => ({
    id: question.id,
    domain: question.domain,
    type: question.type,
    question: question.question,
    options: question.options,
    answer: question.answer,
    difficulty: question.difficulty,
    explanation: question.explanation ?? null,
    tags: question.tags ?? null,
    vector: (question as Record<string, unknown>).vector ?? null,
    enabled: true,
    source: "imported"
  }));

  if (rows.length > 0) {
    const { error: insertError } = await supabase.from("questions").insert(rows);
    if (insertError) {
      return jsonResponse({ error: insertError.message }, 500);
    }
  }

  return jsonResponse({
    ...validation,
    added: rows.length,
    skipped: existingIds.size
  });
});
