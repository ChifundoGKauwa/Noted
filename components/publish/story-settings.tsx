"use client";

import { Check, ChevronDown, Lock, Plus, X } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PanelSection } from "@/components/ui/panel-section";
import { Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Audience = "public" | "subscribers";

type StorySettingsProps = {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  metaTitle: string;
  onMetaTitleChange: (v: string) => void;
  permalink: string;
  subtitle: string;
  body: string;
  audience: Audience;
  onAudienceChange: (a: Audience) => void;
  emailDispatch: boolean;
  onEmailDispatchChange: (v: boolean) => void;
  subscriberCount: number;
  canonicalUrl: string;
  onCanonicalUrlChange: (v: string) => void;
  license: string;
  onLicenseChange: (v: string) => void;
  busy: boolean;
  onSave: (publish: boolean) => void;
  onDiscard: () => void;
  onClose: () => void;
};

function slugify(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

export function StorySettings({
  tags, onTagsChange, slug, onSlugChange, metaTitle, onMetaTitleChange,
  permalink, subtitle, body, audience, onAudienceChange,
  emailDispatch, onEmailDispatchChange, subscriberCount,
  canonicalUrl, onCanonicalUrlChange, license, onLicenseChange,
  busy, onSave, onDiscard, onClose,
}: StorySettingsProps) {
  const [tagInput, setTagInput] = useState("");
  const [showMeta, setShowMeta] = useState(false);

  function addTag(value = tagInput) {
    const t = value.trim(); if (!t) return;
    if (tags.length >= 5) return;
    if (!tags.some((x) => x.toLowerCase() === t.toLowerCase())) onTagsChange([...tags, t]);
    setTagInput("");
  }
  function onTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); addTag(); }
  }

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-l border-[#d4c9b8] bg-[#f5f1eb]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#d4c9b8] px-4 py-3">
        <div className="flex items-center gap-2">
          <Settings2 className="h-3.5 w-3.5 text-[#6b6560]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#3a3632]">Story Settings</span>
        </div>
        <button type="button" onClick={onClose} className="text-[#9b9188] hover:text-[#3a3632]" aria-label="Close settings">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Topics & Tags */}
        <PanelSection label="Topics & Tags (max 5)">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline"
                className="gap-1 rounded-sm border-[#d4c9b8] bg-white px-2 py-0.5 text-[10px] font-medium normal-case tracking-normal text-[#3a3632]"
              >
                {tag}
                <button type="button" aria-label={`Remove ${tag}`} onClick={() => onTagsChange(tags.filter((t) => t !== tag))}>
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-1">
            <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={onTagKeyDown}
              placeholder="Type a tag & press enter…"
              className="h-8 rounded-sm border-[#d4c9b8] bg-white text-[11px] placeholder:text-[#b0a898]"
            />
            <button type="button" onClick={() => addTag()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-[#d4c9b8] bg-white text-[#6b6560] hover:bg-[#ede7dc]"
              aria-label="Add tag"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </PanelSection>

        {/* SEO & Permalink */}
        <PanelSection label="SEO & Permalink">
          <div className="rounded border border-[#d4c9b8] bg-white p-2.5 text-[11px]">
            <p className="truncate text-[#6b6560]">{permalink}</p>
            <p className="mt-1.5 font-semibold leading-snug text-[#1c1b1a]">
              {metaTitle.slice(0, 55)}{metaTitle.length > 55 ? "…" : ""}
            </p>
            <p className="mt-1 line-clamp-2 leading-4 text-[#6b6560]">{subtitle || body.slice(0, 100)}</p>
          </div>
          <button type="button" onClick={() => setShowMeta((v) => !v)}
            className="mt-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6b6560] hover:text-[#1c1b1a]"
          >
            ✎ {showMeta ? "Hide" : "Customize"} Meta Title &amp; Slug
          </button>
          {showMeta && (
            <div className="mt-2 space-y-1.5">
              <Input value={metaTitle} onChange={(e) => onMetaTitleChange(e.target.value)} placeholder="Meta title"
                className="h-8 rounded-sm border-[#d4c9b8] bg-white text-[11px]" />
              <Input value={slug} onChange={(e) => onSlugChange(slugify(e.target.value))} placeholder="url-slug"
                className="h-8 rounded-sm border-[#d4c9b8] bg-white text-[11px]" />
            </div>
          )}
        </PanelSection>

        {/* Audience Access */}
        <PanelSection label="Audience Access">
          <div className="grid grid-cols-2 gap-1.5">
            {(["public", "subscribers"] as const).map((opt) => (
              <button key={opt} type="button" onClick={() => onAudienceChange(opt)}
                className={cn("rounded border p-2.5 text-left transition-colors",
                  audience === opt ? "border-[#1c1b1a] bg-white" : "border-[#d4c9b8] bg-[#f0ece5] hover:bg-white"
                )}
              >
                <span className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.1em] text-[#1c1b1a]">
                  {opt === "public" ? "Public" : "Subscriber"}
                  {opt === "public" && audience === "public" && <Check className="h-3 w-3" />}
                  {opt === "subscribers" && <Lock className="h-3 w-3" />}
                </span>
                <span className="mt-1 block text-[9px] leading-[1.3] text-[#6b6560]">
                  {opt === "public" ? "Free to all readers worldwide" : "Paid / Patron exclusivity"}
                </span>
              </button>
            ))}
          </div>
        </PanelSection>

        {/* Email Dispatch */}
        <PanelSection>
          <div className="flex items-start justify-between gap-2 rounded border border-[#d4c9b8] bg-white p-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#3a3632]">Email Dispatch</p>
              <p className="mt-1.5 text-[10px] leading-[1.5] text-[#6b6560]">
                Send to <span className="font-semibold text-[#1c1b1a]">{subscriberCount.toLocaleString()}</span> subscribers upon publishing.
              </p>
            </div>
            <button type="button" role="switch" aria-checked={emailDispatch} onClick={() => onEmailDispatchChange(!emailDispatch)}
              className={cn("mt-0.5 h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors",
                emailDispatch ? "bg-[#1c1b1a]" : "bg-[#d4c9b8]"
              )}
            >
              <span className={cn("block h-4 w-4 rounded-full bg-white transition-transform",
                emailDispatch ? "translate-x-4" : "translate-x-0"
              )} />
            </button>
          </div>
        </PanelSection>

        {/* Canonical URL */}
        <PanelSection label="Canonical URL (Cross-Posting)">
          <Input value={canonicalUrl} onChange={(e) => onCanonicalUrlChange(e.target.value)}
            placeholder="https://external-domain.com/original-post"
            className="h-8 rounded-sm border-[#d4c9b8] bg-white text-[11px] placeholder:text-[#b0a898]"
          />
        </PanelSection>

        {/* License */}
        <PanelSection label="License & Syndication">
          <div className="relative">
            <select value={license} onChange={(e) => onLicenseChange(e.target.value)}
              className="w-full appearance-none rounded border border-[#d4c9b8] bg-white py-1.5 pl-2.5 pr-7 text-[11px] text-[#3a3632] outline-none"
            >
              <option>All Rights Reserved (Default)</option>
              <option>CC BY 4.0</option>
              <option>CC BY-SA 4.0</option>
              <option>CC BY-NC 4.0</option>
              <option>Public Domain (CC0)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#9b9188]" />
          </div>
        </PanelSection>

        {/* Draft Actions */}
        <PanelSection label="Draft Actions">
          <button type="button" onClick={onDiscard}
            className="flex w-full items-center justify-center gap-2 rounded border border-[#d4c9b8] bg-white py-2 text-[11px] font-semibold text-red-600 hover:bg-red-50"
          >
            🗑 Discard Draft
          </button>
        </PanelSection>
      </div>

      {/* Footer — publish immediately */}
      <div className="border-t border-[#d4c9b8] px-4 py-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9b9188]">Target Distribution</p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#3a3632]">
          Web + {subscriberCount >= 1000 ? `${(subscriberCount / 1000).toFixed(1)}K` : subscriberCount} Email
        </p>
        <button type="button" disabled={busy} onClick={() => onSave(true)}
          className="mt-3 flex w-full items-center justify-center rounded bg-[#1c1b1a] py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#2e2c2a] disabled:opacity-60"
        >
          {busy ? "Saving…" : "Publish Immediately"}
        </button>
      </div>
    </aside>
  );
}
