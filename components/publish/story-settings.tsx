"use client";

import { Check, X } from "lucide-react";

type StorySettingsProps = {
  published: boolean;
  busy: boolean;
  onSave: (publish: boolean) => void;
  onDiscard: () => void;
  onClose: () => void;
};

export function StorySettings({ published, busy, onSave, onDiscard, onClose }: StorySettingsProps) {
  return (
    <aside role="dialog" aria-modal="true" aria-label="Story settings" className="flex h-full w-full flex-col border border-[var(--border)] bg-[var(--surface)] shadow-xl lg:w-[360px]">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--border)] px-4">
        <h2 className="text-sm font-medium">Story settings</h2>
        <button type="button" onClick={onClose} aria-label="Close story settings" className="rounded p-1.5 text-[var(--muted)] hover:bg-[var(--surface-muted)]"><X className="h-4 w-4" /></button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <section className="border-b border-[var(--border)] pb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Publication status</p>
          <p className="mt-3 flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
            <Check className="h-4 w-4" /> {published ? "Published" : "Draft"}
          </p>
        </section>
        <p className="py-5 text-xs leading-5 text-[var(--muted)]">
          Story title, content, cover image, author, and publication status are stored by the backend when you save. This API does not store tags, custom URLs, subscriber-only access, or email delivery settings.
        </p>
        <button type="button" onClick={onDiscard} disabled={busy} className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50">
          {published ? "Delete story" : "Discard draft"}
        </button>
      </div>
      <footer className="shrink-0 border-t border-[var(--border)] p-4">
        <button type="button" disabled={busy} onClick={() => onSave(true)} className="flex w-full items-center justify-center rounded-full bg-black py-2.5 text-xs font-semibold text-white hover:bg-black/80 disabled:opacity-50">
          {busy ? "Saving…" : "Publish now"}
        </button>
      </footer>
    </aside>
  );
}
