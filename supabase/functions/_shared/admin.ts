export function checkAdmin(req: Request) {
  const expected = Deno.env.get("ADMIN_SECRET");
  if (!expected) {
    return true;
  }
  return req.headers.get("x-admin-secret") === expected;
}
