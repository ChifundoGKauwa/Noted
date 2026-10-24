import Link from "next/link";
import { getBackendBaseUrl } from "@/lib/backend";

type Confirmation = { message?: string; email?: string; status?: string };

export default async function ConfirmSubscriptionPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  let result: Confirmation = {};
  let confirmed = false;

  try {
    const response = await fetch(
      `${getBackendBaseUrl()}/subscribers/confirm/${encodeURIComponent(token)}`,
      { cache: "no-store" },
    );
    result = (await response.json()) as Confirmation;
    confirmed = response.ok && result.status === "confirmed";
  } catch {
    result = { message: "We couldn’t reach the subscription service. Please try again later." };
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        {confirmed ? "Subscription confirmed" : "Subscription confirmation"}
      </h1>
      <p className="mt-4 text-[var(--muted)]" role="status">
        {result.message ?? "The confirmation link could not be verified."}
      </p>
      {result.email ? <p className="mt-2 text-sm text-[var(--muted)]">{result.email}</p> : null}
      <Link href="/" className="mt-8 inline-block underline underline-offset-4">Return to Noted</Link>
    </main>
  );
}
