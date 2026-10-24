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

export async function getAuthenticatedAuthor(): Promise<AuthenticatedAuthor | null> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return null;

  try {
    const response = await fetch(`${getBackendBaseUrl()}/auth/session`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const author = (await response.json()) as AuthenticatedAuthor;
    return typeof author.id === "string" && author.id ? author : null;
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
