import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getBackendBaseUrl } from "@/lib/backend";

export const AUTH_COOKIE = "noted_author_token";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 12;

export type AuthenticatedAuthor = {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  created_at?: string;
};

function verifyToken(token: string): string | null {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === "production" && !secret) return null;
  const signingSecret = secret ?? "email-news-dev-secret";
  const [encodedHeader, encodedClaims, encodedSignature, extra] = token.split(".");
  if (!encodedHeader || !encodedClaims || !encodedSignature || extra) return null;

  try {
    const header = JSON.parse(Buffer.from(encodedHeader, "base64url").toString("utf8")) as { alg?: string };
    const claims = JSON.parse(Buffer.from(encodedClaims, "base64url").toString("utf8")) as { sub?: string; exp?: number; token_use?: string };
    if (header.alg !== "HS256" || typeof claims.sub !== "string" || typeof claims.exp !== "number" || claims.exp <= Math.floor(Date.now() / 1000) || claims.token_use !== "author_access") return null;
    const expected = createHmac("sha256", signingSecret).update(`${encodedHeader}.${encodedClaims}`).digest();
    const received = Buffer.from(encodedSignature, "base64url");
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;
    return claims.sub;
  } catch {
    return null;
  }
}

export async function getAuthenticatedAuthor(): Promise<AuthenticatedAuthor | null> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return null;
  const authorId = verifyToken(token);
  if (!authorId) return null;

  try {
    const response = await fetch(`${getBackendBaseUrl()}/authors/${encodeURIComponent(authorId)}`, { cache: "no-store" });
    if (!response.ok) return null;
    const author = (await response.json()) as AuthenticatedAuthor;
    return author.id === authorId ? author : null;
  } catch {
    return null;
  }
}

export async function requireAuthenticatedAuthor() {
  const author = await getAuthenticatedAuthor();
  return author
    ? { author, response: null }
    : { author: null, response: Response.json({ message: "Sign in to continue." }, { status: 401 }) };
}
