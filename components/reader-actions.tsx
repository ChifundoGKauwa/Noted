"use client";

import { Check, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ReaderProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      if (progressRef.current) progressRef.current.style.width = `${progress}%`;
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return <div ref={progressRef} aria-hidden="true" className="reader-progress" />;
}

export function ReaderShare({ title }: { title: string }) {
  const [message, setMessage] = useState("");

  async function shareStory() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setMessage("Link copied");
      window.setTimeout(() => setMessage(""), 2200);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setMessage("Could not share link");
      window.setTimeout(() => setMessage(""), 2800);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => void shareStory()}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-[var(--border)] px-3 text-sm text-[var(--muted-strong)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
      >
        {message === "Link copied" ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        {message || "Share"}
      </button>
      <span aria-live="polite" className="sr-only">{message}</span>
    </div>
  );
}
