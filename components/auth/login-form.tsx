"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthResponse = { author: { id: string; name: string; email: string } };

export function LoginForm({ accountCheck = false }: { accountCheck?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const pendingEmail = sessionStorage.getItem("noted_write_email");
    if (!pendingEmail) return;
    const timer = window.setTimeout(() => setEmail(pendingEmail), 0);
    sessionStorage.removeItem("noted_write_email");
    return () => window.clearTimeout(timer);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      if (accountCheck) {
        const authorsResponse = await fetch("/api/authors", { cache: "no-store" });
        if (!authorsResponse.ok) throw new Error("We couldn’t check your account. Please try again.");
        const authors = (await authorsResponse.json()) as Array<{ email: string }>;
        const normalizedEmail = email.trim().toLowerCase();
        const exists = authors.some((author) => author.email.trim().toLowerCase() === normalizedEmail);
        sessionStorage.setItem("noted_write_email", normalizedEmail);
        router.push(exists ? "/login?next=%2Fpublish" : "/register");
        return;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = (await response.json()) as AuthResponse | { message?: string };
      if (!response.ok || !("author" in data)) {
        throw new Error("message" in data && data.message ? data.message : "Unable to sign in.");
      }
      router.replace("/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Email address</label>
        <Input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="editor@noted.com" />
      </div>
      {!accountCheck ? <div className="space-y-2">
        <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Password</label>
        <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
      </div> : null}
      {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
      <Button className="w-full justify-center" size="lg" disabled={pending}>
        {pending ? (accountCheck ? "Checking your account…" : "Signing in…") : (accountCheck ? "Continue" : "Sign in")}
      </Button>
    </form>
  );
}
