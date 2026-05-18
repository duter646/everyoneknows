import { handleOptions, jsonResponse } from "../_shared/cors.ts";
import { supabase } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  const optionsResponse = handleOptions(req);
  if (optionsResponse) {
    return optionsResponse;
  }

  const { count: questionCount, error: countError } = await supabase
    .from("questions")
    .select("id", { count: "exact", head: true });

  if (countError) {
    return jsonResponse({ error: countError.message }, 500);
  }

  const { data: domainRows, error: domainError } = await supabase
    .from("questions")
    .select("domain");

  if (domainError) {
    return jsonResponse({ error: domainError.message }, 500);
  }

  const domains = Array.from(
    new Set(
      (domainRows ?? [])
        .map((row) => (row as Record<string, unknown>).domain)
        .filter((domain): domain is string => typeof domain === "string" && domain.length > 0)
    )
  ).sort();

  return jsonResponse({
    questionCount: questionCount ?? 0,
    domainCount: domains.length,
    domains,
    loadedAt: Date.now()
  });
});
