import { proxyToBackend } from "@/lib/backend";
import { proxyToBackendWithAuth } from "@/lib/server-backend";

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
  return proxyToBackendWithAuth(`/newsletters/${id}`, {
    method: "PUT",
    body: await request.text(),
  });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return proxyToBackendWithAuth(`/newsletters/${id}`, { method: "DELETE" });
}
