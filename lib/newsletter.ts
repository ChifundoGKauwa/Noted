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

const SUBSCRIBERS_PATH = "/api/subscribers";

export async function subscribeToNewsletter(
  payload: NewsletterSubscriptionPayload,
): Promise<NewsletterSubscriptionResponse> {
  const response = await fetch(SUBSCRIBERS_PATH, {
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
      const data = (await response.json()) as { message?: string };
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
