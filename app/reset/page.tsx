import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPage() {
  return (
    <div className="bg-[#e9e7e3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[24px] border border-[#d7d2cc] bg-[#f6f4f2] shadow-[0_25px_90px_-40px_rgba(15,23,42,0.35)]">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-between bg-[#f4f2f0] p-8 lg:p-12">
            <div className="mb-8 flex items-center justify-between">
              <Link
                href="/"
                className="text-3xl font-semibold tracking-[-0.08em] text-slate-900"
              >
                Noted.
              </Link>
              <Link
                href="/login"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Back to login
              </Link>
            </div>

            <div className="space-y-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Account recovery
              </div>

              <h1 className="max-w-md text-4xl font-semibold leading-[0.95] tracking-[-0.08em] text-slate-900 sm:text-5xl">
                Reset your access and continue the conversation.
              </h1>

              <p className="max-w-md text-base leading-7 text-slate-600">
                Enter the email connected to your Noted account and we’ll send a
                secure reset link to help you get back in.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 lg:p-12">
            <div className="mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Reset password
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-slate-900">
                We’ll send a secure link
              </h2>
            </div>

            <form className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="reset-email"
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                >
                  Email address
                </label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="editor@noted.com"
                />
              </div>

              <Button className="w-full justify-center" size="lg">
                Send reset link
              </Button>

              <div className="pt-2 text-center text-sm text-slate-600">
                Need a new account?{" "}
                <Link href="/register" className="font-medium text-slate-900">
                  Create one here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
