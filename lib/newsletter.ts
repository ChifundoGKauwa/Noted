export type NewsletterSubscriptionPayload = {
  email: string;
  name: string;
};

export type NewsletterSubscriptionResponse = {
  id: string;
  email: string;
  name: string;
  status: string;
  subscribed_at?: string;
  confirmation_token?: string;
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8004";

export async function subscribeToNewsletter(
  payload: NewsletterSubscriptionPayload,
): Promise<NewsletterSubscriptionResponse> {
  const response = await fetch(`${API_BASE_URL}/subscribers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "We couldn’t subscribe you right now. Please try again.";

    try {
      const data = (await response.json()) as Partial<{
        message?: string;
      }>;
      if (typeof data.message === "string" && data.message.trim()) {
        message = data.message;
      }
    } catch {
      // Ignore JSON parsing failures and keep the fallback message.
    }

    throw new Error(message);
  }

  return (await response.json()) as NewsletterSubscriptionResponse;
}
