import { proxyToBackend } from "@/lib/backend";
import { AUTH_COOKIE, AUTH_COOKIE_MAX_AGE, type AuthenticatedAuthor } from "@/lib/server-auth";

const actions = new Set(["login", "register"]);

export async function POST(
  request: Request,
  context: { params: Promise<{ action: string }> },
) {
  const { action } = await context.params;
  if (!actions.has(action)) {
    return Response.json({ message: "Unknown authentication action." }, { status: 404 });
  }
  const backendResponse = await proxyToBackend(`/auth/${action}`, {
    method: "POST",
    body: await request.text(),
  });
  if (!backendResponse.ok) return backendResponse;

  const result = (await backendResponse.json()) as { token?: string; author?: AuthenticatedAuthor };
  if (!result.token || !result.author?.id) {
    return Response.json({ message: "The authentication service returned an invalid response." }, { status: 502 });
  }

  const response = Response.json({ author: result.author });
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.headers.append(
    "Set-Cookie",
    `${AUTH_COOKIE}=${encodeURIComponent(result.token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${AUTH_COOKIE_MAX_AGE}${secure}`,
  );
  return response;
}
