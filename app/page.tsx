import Link from "next/link";
import { NewsletterSubscriptionForm } from "@/components/newsletter-subscription";
import { getBackendBaseUrl } from "@/lib/backend";
import type { Story } from "@/lib/stories";

export default async function Home() {
  let stories: Story[] = [];
  let unavailable = false;
  try {
    const response = await fetch(`${getBackendBaseUrl()}/newsletters`, {
      cache: "no-store",
    });
    if (response.ok) stories = (await response.json()) as Story[];
    else unavailable = true;
  } catch {
    unavailable = true;
  }
  const published = stories.filter((story) => story.published);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
      <header className="mb-12 border-b border-[var(--border)] pb-8 sm:mb-14 sm:pb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)] sm:text-xs">
          Noted · Independent publishing
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-medium leading-[0.98] tracking-[-0.06em] text-[var(--foreground)] sm:text-5xl lg:text-7xl">
          Thoughtful stories for curious readers.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          Ideas and essays, written by independent authors and delivered without
          the noise.
        </p>
      </header>

      <section aria-labelledby="latest-heading">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2
            id="latest-heading"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]"
          >
            Latest stories
          </h2>
          <Link
            href="/dashboard"
            className="text-sm text-[var(--muted)] underline underline-offset-4"
          >
            Author workspace
          </Link>
        </div>
        {unavailable ? (
          <p
            role="status"
            className="rounded-xl border border-[var(--border)] p-5 text-sm text-[var(--muted)]"
          >
            Stories are temporarily unavailable. Please try again later.
          </p>
        ) : null}
        {!unavailable && published.length === 0 ? (
          <p className="rounded-xl border border-[var(--border)] p-5 text-sm text-[var(--muted)]">
            No published stories yet.
          </p>
        ) : null}
        <div className="divide-y divide-[var(--border)]">
          {published.map((story) => (
            <article key={story.id} className="py-7 first:pt-0">
              <Link
                href={`/newsletters/${encodeURIComponent(story.id)}`}
                className="group block"
              >
                <h3 className="text-2xl font-medium tracking-tight text-[var(--foreground)] group-hover:underline underline-offset-4 sm:text-3xl">
                  {story.title}
                </h3>
                <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">
                  {story.content}
                </p>
                {story.created_at ? (
                  <time
                    className="mt-4 block text-xs text-[var(--muted)]"
                    dateTime={story.created_at}
                  >
                    {new Date(story.created_at).toLocaleDateString()}
                  </time>
                ) : null}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section
        id="newsletter-subscribe"
        className="mt-16 border-t border-[var(--border)] pt-10"
        aria-label="Newsletter subscription"
      >
        <NewsletterSubscriptionForm className="mx-auto max-w-3xl" />
      </section>
    </main>
  );
}
