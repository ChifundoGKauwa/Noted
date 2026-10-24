import { PublishStudio } from "@/components/publish-studio";
import { getBackendBaseUrl } from "@/lib/backend";
import type { Story } from "@/lib/stories";
import { getAuthenticatedAuthor } from "@/lib/server-auth";
import { redirect, notFound } from "next/navigation";

async function readJson<T>(path: string): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await fetch(`${getBackendBaseUrl()}${path}`, {
      cache: "no-store",
    });
    if (!response.ok) return { data: null, error: `Backend request failed (${response.status}).` };
    return { data: (await response.json()) as T, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Backend is unavailable." };
  }
}

export default async function PublishPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const author = await getAuthenticatedAuthor();
  if (!author) redirect("/login?next=%2Fpublish");

  const { id } = await searchParams;
  const storyResult = id
    ? await readJson<Story>(`/newsletters/${encodeURIComponent(id)}`)
    : { data: null, error: null };
  const initialStory = storyResult.data;
  if (id && initialStory && initialStory.author_id !== author.id) notFound();
  const loadError = id && !initialStory ? storyResult.error ?? "Story was not found in the backend." : null;

  return (
    <PublishStudio
      author={author}
      initialStory={initialStory}
      loadError={loadError}
    />
  );
}
