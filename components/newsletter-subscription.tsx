"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { cn } from "@/lib/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type NewsletterSubscriptionFormProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  className?: string;
};

export function NewsletterSubscriptionForm({
  title = "Subscribe to the weekly dispatch",
  description = "For thoughtful stories, sharp observations, and a calmer inbox.",
  buttonText = "Subscribe",
  className,
}: NewsletterSubscriptionFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim();
    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    if (status === "submitting") {
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const name = normalizedEmail.split("@")[0] || "Subscriber";
      await subscribeToNewsletter({
        email: normalizedEmail,
        name,
      });

      setStatus("success");
      setMessage(
        "You’re subscribed. Check your inbox for the confirmation email.",
      );
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "We couldn’t subscribe you right now. Please try again.",
      );
    }
  };

  const helperTextClassName =
    status === "success"
      ? "text-emerald-600 dark:text-emerald-400"
      : status === "error"
        ? "text-red-600 dark:text-red-400"
        : "text-[var(--muted)]";

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] sm:p-7",
        className,
      )}
      noValidate
    >
      <div className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--foreground)]" />
        Weekly digest
      </div>

      <div className="mb-4 space-y-2">
        <h3 className="text-[clamp(1.75rem,2vw,2.8rem)] font-medium leading-[0.95] tracking-[-0.06em] text-[var(--foreground)]">
          {title}
        </h3>
        <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
          {description}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={status === "error"}
          aria-describedby="newsletter-feedback"
          className="h-12 flex-1 rounded-full border-[var(--border)] bg-[var(--surface-elevated)] px-4 text-base"
        />

        <Button
          type="submit"
          size="lg"
          disabled={status === "submitting" || !email.trim()}
          className="h-12 min-w-[160px] rounded-full"
        >
          {status === "submitting" ? "Subscribing..." : buttonText}
        </Button>
      </div>

      {message ? (
        <p
          id="newsletter-feedback"
          role="status"
          aria-live="polite"
          className={cn("mt-3 text-sm", helperTextClassName)}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
