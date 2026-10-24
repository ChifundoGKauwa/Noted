export function getBackendBaseUrl() {
  return (
    process.env.BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://email-news.onrender.com"
  ).trim();
}

export async function proxyToBackend(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const url = `${getBackendBaseUrl()}${path}`;
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    headers,
    cache: "no-store",
  });

  const body = await response.arrayBuffer();
  const contentType = response.headers.get("Content-Type") ?? "application/json";

  return new Response(body, {
    status: response.status,
    headers: {
      "Content-Type": contentType,
    },
  });
}
