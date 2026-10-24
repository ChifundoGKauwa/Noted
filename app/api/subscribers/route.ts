import { proxyToBackend } from "@/lib/backend";
import { proxyToBackendWithAuth } from "@/lib/server-backend";

export async function GET() {
  return proxyToBackendWithAuth("/subscribers");
}

export async function POST(request: Request) {
  return proxyToBackend("/subscribers", {
    method: "POST",
    body: await request.text(),
  });
}
