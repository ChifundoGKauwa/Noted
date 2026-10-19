import { cookies } from "next/headers";
import { AUTH_COOKIE, getAuthenticatedAuthor } from "@/lib/server-auth";

export async function GET() {
  const author = await getAuthenticatedAuthor();
  if (!author) return Response.json({ message: "Sign in to continue." }, { status: 401 });
  return Response.json({ author });
}

export async function DELETE() {
  (await cookies()).delete(AUTH_COOKIE);
  return Response.json({ ok: true });
}
