import { proxyToBackend } from "@/lib/backend";
import { proxyToBackendWithAuth } from "@/lib/server-backend";

export async function GET() {
  return proxyToBackend("/newsletters");
}

export async function POST(request: Request) {
  try {
    await request.clone().json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }
  return proxyToBackendWithAuth("/newsletters", {
    method: "POST",
    body: await request.text(),
  });
}
