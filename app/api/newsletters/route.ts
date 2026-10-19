import { proxyToBackend } from "@/lib/backend";
import { requireAuthenticatedAuthor } from "@/lib/server-auth";

export async function GET() {
  return proxyToBackend("/newsletters");
}

export async function POST(request: Request) {
  const auth = await requireAuthenticatedAuthor();
  if (auth.response) return auth.response;
  let payload: { author_id?: string };
  try {
    payload = (await request.clone().json()) as { author_id?: string };
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }
  if (payload.author_id !== auth.author.id) {
    return Response.json({ message: "You can only publish as your signed-in author." }, { status: 403 });
  }
  const body = await request.text();
  return proxyToBackend("/newsletters", {
    method: "POST",
    body,
  });
}
