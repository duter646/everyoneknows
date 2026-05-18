import { PaperTokenPayload } from "./types.ts";

const DEFAULT_SECRET = "everyoneknows_dev_secret";
const encoder = new TextEncoder();

function base64UrlEncode(bytes: Uint8Array) {
  const binary = String.fromCharCode(...bytes);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  const binary = atob(normalized + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function getSecret() {
  return Deno.env.get("TOKEN_SECRET") || DEFAULT_SECRET;
}

async function signHmac(message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return base64UrlEncode(new Uint8Array(signature));
}

export async function signToken(payload: PaperTokenPayload) {
  const body = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const signature = await signHmac(body);
  return `${body}.${signature}`;
}

export async function verifyToken(token: string) {
  const [body, signature] = token.split(".");
  if (!body || !signature) {
    return null;
  }
  const expected = await signHmac(body);
  if (expected !== signature) {
    return null;
  }
  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(body))) as PaperTokenPayload;
    if (!payload.qids || !Array.isArray(payload.qids)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
