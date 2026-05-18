import { handleOptions, jsonResponse } from "../_shared/cors.ts";
import { supabase } from "../_shared/supabase.ts";
import { checkAdmin } from "../_shared/admin.ts";

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
  const id = typeof body.id === "string" ? body.id : "";
  const enabled = typeof body.enabled === "boolean" ? body.enabled : null;

  if (!id || enabled === null) {
    return jsonResponse({ error: "Invalid payload." }, 400);
  }

  const { error } = await supabase
    .from("questions")
    .update({ enabled })
    .eq("id", id);

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ id, enabled });
});
