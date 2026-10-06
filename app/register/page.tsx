import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden rounded-[24px] border border-[#d7d2cc] bg-[#f6f4f2] shadow-[0_25px_90px_-40px_rgba(15,23,42,0.35)] lg:grid-cols-2">
        <div className="flex flex-col justify-between bg-[#f4f2f0] p-8 lg:p-12">
          <div className="mb-8 flex items-center justify-between">
            <div className="text-3xl font-semibold tracking-[-0.08em]">
              Noted.
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Editorial collective
            </div>

            <h1 className="max-w-md text-4xl font-semibold leading-[0.95] tracking-[-0.08em] text-slate-900 sm:text-5xl">
              “A publication dedicated to the preservation of disciplined
              thought, architectural grace, and independent critique.”
            </h1>

            <p className="max-w-md text-base leading-7 text-slate-600">
              Join a small editorial community and publish work that invites
              deeper attention, sharper ideas, and lasting readership.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#dcd5cd] bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Topics
              </p>
              <p className="mt-3 text-xl font-semibold tracking-[-0.05em] text-slate-900">
                The body of the city, its meanings and morphology
              </p>
            </div>
            <div className="rounded-2xl border border-[#dcd5cd] bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Members
              </p>
              <p className="mt-3 text-xl font-semibold tracking-[-0.05em] text-slate-900">
                12,000+ thoughtful readers
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 lg:p-12">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Author access
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-slate-900">
                Join as an author
              </h2>
            </div>
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Sign in
            </Link>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
              >
                Full name
              </label>
              <Input id="name" type="text" placeholder="Jane Writer" />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
              >
                Email address
              </label>
              <Input id="email" type="email" placeholder="jane@noted.com" />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#d7d2cc]"
                />
                I agree to the terms
              </label>
            </div>

            <Button className="w-full justify-center" size="lg">
              Create account
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
