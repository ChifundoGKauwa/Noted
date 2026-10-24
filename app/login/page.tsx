import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ "account-check"?: string }> }) {
  const { "account-check": accountCheck } = await searchParams;
  const checkingAccount = accountCheck === "1";
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_25px_90px_-40px_rgba(15,23,42,0.35)] lg:grid-cols-2">
        <div className="flex flex-col justify-between bg-[var(--surface-muted)] p-8 lg:p-12">
          <div className="mb-8 flex items-center justify-between">
            <div className="text-3xl font-semibold tracking-[-0.08em] text-[var(--foreground)]">
              Noted.
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Editorial collective
            </div>

            <h1 className="max-w-md text-4xl font-semibold leading-[0.95] tracking-[-0.08em] text-[var(--foreground)] sm:text-5xl">
              “A publication dedicated to the preservation of disciplined
              thought, architectural grace, and independent critique.”
            </h1>

            <p className="max-w-md text-base leading-7 text-[var(--muted)]">
              By creating an account, you are joining a community of editors,
              writers, and strategists crafting thoughtful work for curious
              readers.
            </p>
          </div>

        </div>

        <div className="bg-[var(--surface-elevated)] p-8 lg:p-12 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.15)]">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                Author access
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-[var(--foreground)]">
                {checkingAccount ? "Continue to your writing desk." : "Welcome back to Noted."}
              </h2>
            </div>
            {!checkingAccount ? <Link href="/register" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]">Create account</Link> : null}
          </div>

          <div>
            {!checkingAccount ? <div className="flex items-center justify-between text-sm text-[var(--muted)]">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[var(--border)] bg-[var(--surface-elevated)]"
                />
                Remember this device
              </label>
              <Link
                href="/reset"
                className="font-medium text-[var(--foreground)]"
              >
                Forgot password?
              </Link>
            </div> : null}

            </div>
            <div className="mt-5"><LoginForm accountCheck={checkingAccount} /></div>
        </div>
      </div>
    </main>
  );
}
