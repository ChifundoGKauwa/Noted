"use client";

import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const pendingEmail = sessionStorage.getItem("noted_write_email");
    if (!pendingEmail) return;
    const timer = window.setTimeout(() => setEmail(pendingEmail), 0);
    sessionStorage.removeItem("noted_write_email");
    return () => window.clearTimeout(timer);
  }, []);

  async function register(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });
      const data = (await response.json()) as { author?: { id: string; name: string; email: string }; message?: string };
      if (!response.ok || !data.author) throw new Error(data.message || "Unable to create your account.");
      router.push("/publish");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to create your account.");
    } finally { setPending(false); }
  }

  return (
    <main className="mx-auto grid max-w-7xl lg:grid-cols-2 lg:gap-12">
      {/* Left Side - Editorial Content */}
      <div className="px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-md">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[var(--foreground)]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]">
              Editorial Collective
            </span>
          </div>

          {/* Main Quote */}
          <h1 className="mb-6 text-[2.5rem] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--foreground)]">
            &ldquo;A publication dedicated to the preservation of disciplined thought, architectural grace, and independent
            critique.&rdquo;
          </h1>

          <p className="mb-12 text-[15px] leading-relaxed text-[var(--muted)]">
            By creating an account, you enter an uncompromising network of critics, essayists, typographers, and
            designers shaping modern culture without algorithmic manipulation.
          </p>

        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="px-6 py-12 lg:px-12 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.15)]">
        <div className="mx-auto max-w-md">
          <div className="mb-8">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Author Registration
            </p>
            <h2 className="text-[2rem] font-bold leading-tight tracking-[-0.02em] text-[var(--foreground)]">
              Join as an Author.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">
              Apply to publish your writing and become part of our curated network of essayists and critics.
            </p>
          </div>

          {/* Social Login */}
          <div className="mb-6 hidden grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Apple
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[var(--background)] px-4 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                Or register with your email
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <form className="space-y-5" onSubmit={register}>
            <div>
              <label
                htmlFor="fullname"
                className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground)]"
              >
                Full Name
              </label>
              <input
                id="fullname"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Clara V. Vance"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground)]"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@domain.com"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground)]"
                >
                  Password
                </label>
                <span className="text-xs text-[var(--muted)]">Minimum 8</span>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 pr-12 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-1.5 text-xs text-[var(--muted)]">Include letters, numbers, and symbols</p>
            </div>

            {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={pending}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--foreground)] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-[var(--surface)] transition-colors hover:opacity-90"
            >
              {pending ? "Creating account…" : "Create Account"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-[var(--muted)]">
            By creating an account, you agree to follow the publication’s community guidelines.
          </p>

          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--muted)]">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[var(--foreground)] underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
