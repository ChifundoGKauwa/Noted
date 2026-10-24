"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Share2, Trash2 } from "lucide-react";
import Link from "next/link";

export function StoryActions({ id, title, published }: { id: string; title: string; published: boolean }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  async function remove() {
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
    const response = await fetch(`/api/newsletters/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) {
      setMessage("Could not delete this story.");
      return;
    }
    router.refresh();
  }
  async function share() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/newsletters/${encodeURIComponent(id)}`);
      setMessage("Link copied");
    } catch {
      setMessage("Copy this story link from its public page.");
    }
  }
  return (
    <div className="flex items-center gap-2">
      {published ? <>
        <Link href={`/newsletters/${encodeURIComponent(id)}`} aria-label={`View ${title}`} title="View story" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-muted)]"><ExternalLink className="h-3.5 w-3.5" /></Link>
        <button type="button" onClick={() => void share()} aria-label={`Copy link to ${title}`} title="Copy link" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-muted)]"><Share2 className="h-3.5 w-3.5" /></button>
      </> : null}
      <button type="button" onClick={() => void remove()} aria-label={`Delete ${title}`} title="Delete story" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-red-50 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
      {message ? <span role="status" className="text-xs text-[var(--muted)]">{message}</span> : null}
    </div>
  );
}
