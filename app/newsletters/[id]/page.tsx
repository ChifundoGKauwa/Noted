import Link from "next/link";
import { getBackendBaseUrl } from "@/lib/backend";
import type { Story } from "@/lib/stories";
import { sanitizeStoryHtml, storyPreviewText } from "@/lib/story-content";
import { ReaderProgress, ReaderShare } from "@/components/reader-actions";

type StoryAuthor = { id: string; name: string; bio?: string | null };

function formatPublishedDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date);
}

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
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          Story unavailable
        </h1>
        <Link className="mt-6 inline-block underline" href="/">
          Return home
        </Link>
      </main>
    );
  }

  let author: StoryAuthor | null = null;
  try {
    const response = await fetch(
      `${getBackendBaseUrl()}/authors/${encodeURIComponent(story.author_id)}`,
      { cache: "no-store" },
    );
    if (response.ok) author = (await response.json()) as StoryAuthor;
  } catch {}

  const [firstBlock, ...remainingBlocks] = story.content.split("\n\n");
  const hasSubtitle = remainingBlocks.length > 0;
  const articleContent = hasSubtitle ? remainingBlocks.join("\n\n") : story.content;
  const subtitle = hasSubtitle ? firstBlock : "";
  const wordCount = storyPreviewText(story.content).split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 220));
  const publishedDate = formatPublishedDate(story.created_at);

  return (
    <main className="mx-auto max-w-4xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8">
      <ReaderProgress />
      <div className="mx-auto max-w-[680px]">
        <Link href="/" className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]">
          ← Noted
        </Link>
        <h1 className="mt-10 text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-[3.5rem]">
          {story.title}
        </h1>
        {subtitle ? <p className="mt-5 text-xl leading-relaxed text-[var(--muted-strong)]">{subtitle}</p> : null}
        <div className="mt-8 flex flex-col gap-5 border-y border-[var(--border)] py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-sm font-semibold text-[var(--foreground)]">
              {author?.name.split(" ").slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "N"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--foreground)]">{author?.name ?? "Noted author"}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {publishedDate ? `${publishedDate} · ` : ""}{readMinutes} min read
              </p>
            </div>
          </div>
          <ReaderShare title={story.title} />
        </div>
      </div>
      {story.image_url ? (
        <img
          src={story.image_url}
          alt={story.title}
          className="mx-auto mt-10 max-h-[34rem] w-full rounded-sm object-cover sm:mt-12"
        />
      ) : null}
      <article
        className="story-content mx-auto mt-8 max-w-[680px] text-[var(--foreground)] sm:mt-10"
        dangerouslySetInnerHTML={{ __html: sanitizeStoryHtml(articleContent) }}
      />
      {author?.bio ? <p className="mx-auto mt-12 max-w-[680px] border-t border-[var(--border)] pt-6 text-sm leading-6 text-[var(--muted)]">Written by {author.name}. {author.bio}</p> : null}
    </main>
  );
}
