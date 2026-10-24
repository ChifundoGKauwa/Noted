import Link from "next/link";
import { getBackendBaseUrl } from "@/lib/backend";
import type { Story } from "@/lib/stories";

export default async function NewsletterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let story: Story | null = null;
  try {
    const response = await fetch(
      `${getBackendBaseUrl()}/newsletters/${encodeURIComponent(id)}`,
      { cache: "no-store" },
    );
    if (response.ok) story = (await response.json()) as Story;
  } catch {}
  if (!story || !story.published) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24">
        <h1 className="text-3xl font-semibold">Story unavailable</h1>
        <Link className="mt-6 inline-block underline" href="/">
          Return home
        </Link>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-[var(--muted)]">
        ← Noted
      </Link>
      {story.image_url ? (
        <img
          src={story.image_url}
          alt=""
          className="mt-8 max-h-[28rem] w-full rounded-2xl object-cover"
        />
      ) : null}
      <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-6xl">
        {story.title}
      </h1>
      <article className="prose prose-lg mt-8 max-w-none whitespace-pre-wrap leading-8 text-[var(--foreground)]">
        {story.content}
      </article>
    </main>
  );
}
