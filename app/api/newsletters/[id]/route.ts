import { proxyToBackend } from "@/lib/backend";
import { getBackendBaseUrl } from "@/lib/backend";
import { requireAuthenticatedAuthor } from "@/lib/server-auth";

async function ownsStory(id: string, authorId: string) {
  try {
    const response = await fetch(`${getBackendBaseUrl()}/newsletters/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (!response.ok) return false;
    const story = (await response.json()) as { author_id?: string };
    return story.author_id === authorId;
  } catch {
    return false;
  }
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return proxyToBackend(`/newsletters/${id}`);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const auth = await requireAuthenticatedAuthor();
  if (auth.response) return auth.response;
  if (!(await ownsStory(id, auth.author.id))) {
    return Response.json({ message: "Story not found." }, { status: 404 });
  }
  const body = await request.text();
  return proxyToBackend(`/newsletters/${id}`, {
    method: "PUT",
    body,
  });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const auth = await requireAuthenticatedAuthor();
  if (auth.response) return auth.response;
  if (!(await ownsStory(id, auth.author.id))) {
    return Response.json({ message: "Story not found." }, { status: 404 });
  }
  return proxyToBackend(`/newsletters/${id}`, { method: "DELETE" });
}
