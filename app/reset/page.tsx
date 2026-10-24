import Link from "next/link";

export default function ResetPage() {
  return (
    <div className="bg-[var(--background)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_25px_90px_-40px_rgba(15,23,42,0.35)]">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-between bg-[var(--surface-muted)] p-8 lg:p-12">
            <div className="mb-8 flex items-center justify-between">
              <Link
                href="/"
                className="text-3xl font-semibold tracking-[-0.08em] text-[var(--foreground)]"
              >
                Noted.
              </Link>
              <Link
                href="/login"
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Back to login
              </Link>
            </div>

            <div className="space-y-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                Account recovery
              </div>

              <h1 className="max-w-md text-4xl font-semibold leading-[0.95] tracking-[-0.08em] text-[var(--foreground)] sm:text-5xl">
                Reset your access and continue the conversation.
              </h1>

              <p className="max-w-md text-base leading-7 text-[var(--muted)]">
              Password recovery is not available in the current backend API. You can return to sign in or contact your publication administrator.
              </p>
            </div>
          </div>

          <div className="bg-[var(--surface-elevated)] p-8 lg:p-12">
            <div className="mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                Reset password
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-[var(--foreground)]">
                Password recovery unavailable
              </h2>
            </div>

            <div className="space-y-5">
              <p className="text-sm leading-6 text-[var(--muted)]">The documented Axum API does not expose a password reset endpoint, so no reset request can be submitted from this page.</p>

              <div className="pt-2 text-center text-sm text-[var(--muted)]">
                Need a new account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-[var(--foreground)]"
                >
                  Create one here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
