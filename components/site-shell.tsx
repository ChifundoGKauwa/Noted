import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Publish", href: "/publish" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--header-bg)] shadow-[0_10px_30px_-24px_rgba(28,27,26,0.28)]">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-[1.8rem] font-medium leading-none tracking-[-0.09em] text-[var(--foreground)] sm:text-[2rem]"
          >
            Noted.
          </Link>
          <div className="hidden rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--muted)] sm:block">
            Studio
          </div>
        </div>

        <nav className="hidden items-center gap-7 text-[13px] font-medium text-[var(--muted)] md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/register"
            className="hidden items-center justify-center rounded-full bg-[var(--surface-muted)] px-3.5 py-2 text-xs font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-elevated)] sm:inline-flex"
          >
            Subscribe
          </Link>
          <Link
            href="/publish"
            className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-3.5 py-2 text-xs font-medium text-[var(--background)] transition hover:opacity-90"
          >
            Write story
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--footer-bg)] shadow-[0_-12px_26px_-24px_rgba(28,27,26,0.22)]">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-10 md:grid-cols-[1.3fr_0.7fr_0.7fr_0.8fr]">
        <div>
          <div className="text-[2rem] font-medium leading-none tracking-[-0.09em] text-[var(--foreground)]">
            Noted.
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--muted)]">
            Thoughtful publishing for people who care about ideas, craft, and
            curiosity.
          </p>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Sections
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="hover:text-[var(--foreground)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Company
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            <li>
              <Link href="/login" className="hover:text-[var(--foreground)]">
                Sign in
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-[var(--foreground)]">
                Create account
              </Link>
            </li>
            <li>
              <Link href="/publish" className="hover:text-[var(--foreground)]">
                Write story
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Follow
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            <li>
              <Link href="/" className="hover:text-[var(--foreground)]">
                Instagram
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-[var(--foreground)]">
                X / Twitter
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-[var(--foreground)]">
                Newsletter
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-6 py-4 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Noted. All rights reserved.</span>
          <span>Built for thoughtful reading.</span>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      <SiteHeader />
      <div className="bg-[var(--background)]">{children}</div>
      <SiteFooter />
    </div>
  );
}
