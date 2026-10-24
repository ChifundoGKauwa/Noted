import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/server-auth";
import { getBackendBaseUrl, proxyToBackend } from "@/lib/backend";

export async function getBackendAuthorization(): Promise<string | undefined> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  return token ? `Bearer ${token}` : undefined;
}

export async function proxyToBackendWithAuth(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const authorization = await getBackendAuthorization();
  const headers = new Headers(init.headers);
  if (authorization) headers.set("Authorization", authorization);
  return proxyToBackend(path, { ...init, headers });
}

export async function fetchBackendWithAuth(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const authorization = await getBackendAuthorization();
  const headers = new Headers(init.headers);
  if (authorization) headers.set("Authorization", authorization);
  return fetch(`${getBackendBaseUrl()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}
