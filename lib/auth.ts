export type UserSession = {
  email: string;
  name: string;
};

export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("noted-session") !== null;
}

export function getSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("noted-session");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function setSession(user: UserSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("noted-session", JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("noted-session");
}

export function getAuthRedirectPath() {
  return isLoggedIn() ? "/publish" : "/login";
}
