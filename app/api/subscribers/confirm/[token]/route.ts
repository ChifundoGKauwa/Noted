import { proxyToBackend } from "@/lib/backend";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  return proxyToBackend(`/subscribers/confirm/${encodeURIComponent(token)}`);
}
