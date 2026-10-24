import { proxyToBackend } from "@/lib/backend";

export async function GET() {
  return proxyToBackend("/subscribers");
}

export async function POST(request: Request) {
  return proxyToBackend("/subscribers", {
    method: "POST",
    body: await request.text(),
  });
}
