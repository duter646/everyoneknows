import crypto from "crypto";

const DEFAULT_SECRET = "everyoneknows_dev_secret";

export interface PaperTokenPayload {
  qids: string[];
  createdAt: number;
  version: number;
}

function base64UrlEncode(input: string) {
  return Buffer.from(input, "utf-8").toString("base64url");
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf-8");
}

function getSecret() {
  return process.env.QUIZ_TOKEN_SECRET || DEFAULT_SECRET;
}

export function signToken(payload: PaperTokenPayload) {
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(body)
    .digest("base64url");
  return `${body}.${signature}`;
}

export function verifyToken(token: string) {
  const [body, signature] = token.split(".");
  if (!body || !signature) {
    return null;
  }

  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(body)
    .digest("base64url");

  if (expected !== signature) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as PaperTokenPayload;
    if (!payload.qids || !Array.isArray(payload.qids)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
