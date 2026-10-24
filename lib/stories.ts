import { getBackendBaseUrl } from "@/lib/backend";

export type Author = {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
};

export type Story = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  image_url: string | null;
  published: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CreateStoryPayload = {
  author_id: string;
  title: string;
  content: string;
  image_url?: string | null;
};

export type UpdateStoryPayload = {
  title?: string;
  content?: string;
  published?: boolean;
  image_url?: string;
};

function storiesApiPath(path: string) {
  if (typeof window === "undefined") {
    return `${getBackendBaseUrl()}${path}`;
  }
  return `/api${path}`;
}

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const data = (await response.json()) as { message?: string };
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
  } catch {
    // Keep the fallback when the backend does not return JSON.
  }
  return fallback;
}

export async function listAuthors(): Promise<Author[]> {
  const response = await fetch(storiesApiPath("/authors"), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Unable to load authors."));
  }
  return (await response.json()) as Author[];
}

export async function listSubscribers(): Promise<Array<{ id: string }>> {
  const response = await fetch(storiesApiPath("/subscribers"), {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Unable to load subscribers."),
    );
  }
  return (await response.json()) as Array<{ id: string }>;
}

export async function getStory(id: string): Promise<Story> {
  const response = await fetch(storiesApiPath(`/newsletters/${id}`), {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Unable to load story."));
  }
  return (await response.json()) as Story;
}

export async function createStory(payload: CreateStoryPayload): Promise<Story> {
  const response = await fetch(storiesApiPath("/newsletters"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      author_id: payload.author_id,
      title: payload.title,
      content: payload.content,
      image_url: payload.image_url ?? null,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Unable to save this story."),
    );
  }

  return (await response.json()) as Story;
}

export async function updateStory(
  id: string,
  payload: UpdateStoryPayload,
): Promise<Story> {
  const response = await fetch(storiesApiPath(`/newsletters/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Unable to update this story."),
    );
  }

  return (await response.json()) as Story;
}

export async function deleteStory(id: string): Promise<void> {
  const response = await fetch(storiesApiPath(`/newsletters/${id}`), {
    method: "DELETE",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Unable to discard this story."),
    );
  }
}
