"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowLeft, Check, ChevronDown, Cloud, Eye, EyeOff, ImagePlus, Plus, Settings2 } from "lucide-react";

import { CoverImageZone } from "@/components/publish/cover-image-zone";
import {
  EditorToolbar,
} from "@/components/publish/editor-toolbar";
import { RichEditor, type RichEditorHandle } from "@/components/publish/rich-editor";
import { StorySettings } from "@/components/publish/story-settings";
import { type Author, type Story, createStory, deleteStory, updateStory } from "@/lib/stories";
import { cn } from "@/lib/utils";

/* ─── helpers ────────────────────────────────────────────────────────────── */
function countWords(t: string) { return t.trim().split(/\s+/).filter(Boolean).length; }
function formatStoryMonth(value?: string) {
  if (!value) return "Today";
  const date = new Date(`${value.slice(0, 10)}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? "Today" : new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}
function splitContent(content: string) {
  const [first, ...rest] = content.split("\n\n");
  return rest.length ? { subtitle: first ?? "", body: rest.join("\n\n") } : { subtitle: "", body: first ?? "" };
}

const DEFAULT_TITLE = "";
const DEFAULT_SUBTITLE = "";
const DEFAULT_BODY = "";

type SaveState = "idle" | "saving" | "saved" | "error";
type UploadState = "idle" | "uploading" | "done" | "error";

function sanitizeStoryHtml(html: string) {
  const template = document.createElement("template");
  template.innerHTML = html;
  template.content.querySelectorAll("script,style,iframe,object,embed,form,input,button").forEach((node) => node.remove());
  template.content.querySelectorAll<HTMLElement>("*").forEach((element) => {
    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      if (name.startsWith("on") || !["href", "src", "alt", "title", "target", "rel"].includes(name)) {
        element.removeAttribute(attribute.name);
      }
    }
    for (const name of ["href", "src"]) {
      const value = element.getAttribute(name);
      if (!value) continue;
      try {
        const url = new URL(value, window.location.origin);
        if (!["http:", "https:", "mailto:"].includes(url.protocol)) element.removeAttribute(name);
      } catch {
        element.removeAttribute(name);
      }
    }
  });
  return template.innerHTML;
}

/* ─── component ──────────────────────────────────────────────────────────── */
type Props = { author: Author; initialStory: Story | null; loadError: string | null };

export function PublishStudio({ author, initialStory, loadError }: Props) {
  const router = useRouter();
  const parsed = initialStory ? splitContent(initialStory.content) : null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toolbarFileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<RichEditorHandle>(null);
  const titleInputRef = useRef<HTMLTextAreaElement>(null);
  const subtitleInputRef = useRef<HTMLTextAreaElement>(null);
  const editVersionRef = useRef(0);
  const submittedBodyRef = useRef(parsed?.body ?? DEFAULT_BODY);
  const menusRef = useRef<HTMLDivElement>(null);
  const insertMenuRef = useRef<HTMLDivElement>(null);

  /* content */
  const [title, setTitle] = useState(initialStory?.title ?? DEFAULT_TITLE);
  const [subtitle, setSubtitle] = useState(parsed?.subtitle ?? DEFAULT_SUBTITLE);
  const [bodyHTML, setBodyHTML] = useState(parsed?.body ?? DEFAULT_BODY);

  /* image */
  const [imageUrl, setImageUrl] = useState(initialStory?.image_url ?? "");
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadError, setUploadError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  /* save */
  const [storyId, setStoryId] = useState(initialStory?.id ?? null);
  const [published, setPublished] = useState(Boolean(initialStory?.published));
  const [createdAt, setCreatedAt] = useState(initialStory?.created_at ?? null);
  const [saveState, setSaveState] = useState<SaveState>(initialStory ? "saved" : "idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(initialStory?.updated_at ?? null);
  const [statusMsg, setStatusMsg] = useState("");

  /* toolbar / UI */
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [publishMenuOpen, setPublishMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [insertMenuOpen, setInsertMenuOpen] = useState(false);

  useEffect(() => {
    function closeMenus(event: PointerEvent) {
      if (!menusRef.current?.contains(event.target as Node)) {
        setPublishMenuOpen(false);
        setAccountMenuOpen(false);
      }
      if (!insertMenuRef.current?.contains(event.target as Node)) setInsertMenuOpen(false);
    }
    document.addEventListener("pointerdown", closeMenus);
    return () => document.removeEventListener("pointerdown", closeMenus);
  }, []);

  const authorName = author.name;
  const authorId = author.id;
  const authorBio = author.bio?.trim() ?? "";

  useEffect(() => {
    for (const input of [titleInputRef.current, subtitleInputRef.current]) {
      if (!input) continue;
      input.style.height = "auto";
      input.style.height = `${input.scrollHeight}px`;
    }
  }, [title, subtitle]);

  /* derived */
  const bodyText = bodyHTML.replace(/<[^>]+>/g, " ");
  const wordCount = useMemo(() => countWords(`${title} ${subtitle} ${bodyText}`), [title, subtitle, bodyText]);
  const readMins = useMemo(() => Math.max(1, Math.round(wordCount / 200)), [wordCount]);
  const pageCount = useMemo(() => Math.max(1, Math.ceil(wordCount / 400)), [wordCount]);
  const busy = saveState === "saving";

  function markUnsaved() {
    editVersionRef.current += 1;
    setSaveState((state) => state === "saving" ? state : "idle");
    setStatusMsg("");
  }

  /* ── image upload ──────────────────────────────────────────────────────── */
  const uploadImage = useCallback(async (file: File, insertInline = false) => {
    setUploadError(""); setUploadState("uploading");
    const form = new FormData(); form.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed.");
      
      if (insertInline) {
        // Insert image at cursor position in the editor
        editorRef.current?.insertHTML(`<img src="${data.url}" alt="Story image" style="max-width: 100%; height: auto; margin: 1.5rem 0;" /><p><br></p>`);
      } else {
        // Set as cover image
        setImageUrl(data.url);
        markUnsaved();
      }
      setUploadState("done");
    } catch (err) {
      setUploadState("error");
      setUploadError(err instanceof Error ? err.message : "Could not upload image.");
    }
  }, []);

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; 
    if (f) {
      // Check if this was triggered from the toolbar (inline insert) or cover zone
      const isToolbarUpload = (e.target as HTMLInputElement).dataset.source === 'toolbar';
      uploadImage(f, isToolbarUpload);
    }
    e.target.value = "";
  }
  
  function onDragOver(e: DragEvent<HTMLDivElement>) { e.preventDefault(); setIsDragOver(true); }
  function onDragLeave(e: DragEvent<HTMLDivElement>) { e.preventDefault(); setIsDragOver(false); }
  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault(); setIsDragOver(false);
    if (uploadState === "uploading") return;
    const f = e.dataTransfer.files?.[0];
    if (f?.type.startsWith("image/")) uploadImage(f, false); // Cover image
  }

  /* Browser handles undo/redo natively inside contenteditable */
  function undo() { editorRef.current?.exec("undo"); }
  function redo() { editorRef.current?.exec("redo"); }

  /* ── save / publish ───────────────────────────────────────────────────── */
  async function handleSave(nextPublished: boolean) {
    if (busy) return;
    if (uploadState === "uploading") {
      setSaveState("error");
      setStatusMsg("Wait for the image upload to finish before saving.");
      return;
    }
    setSaveState("saving"); setStatusMsg("");
    const submittedVersion = editVersionRef.current;
    // Grab the latest HTML from the live editor
      const currentHTML = sanitizeStoryHtml(editorRef.current?.getHTML() ?? bodyHTML);
    submittedBodyRef.current = currentHTML;
    setBodyHTML(currentHTML);
    try {
      if (loadError && !initialStory) throw new Error(`Unable to load backend data. ${loadError}`);
      if (!authorId) throw new Error("Your author profile is unavailable. Sign in again before saving.");
      const composed = [subtitle.trim(), currentHTML.trim()].filter(Boolean).join("\n\n");
      if (!title.trim() || !composed.trim()) throw new Error("Add a title and body before saving.");
      const payload = { title: title.trim(), content: composed, image_url: imageUrl };
      let story;
      if (!storyId) {
        story = await createStory({ author_id: authorId, ...payload, image_url: payload.image_url ?? null });
        setStoryId(story.id);
        if (nextPublished && !story.published)
          story = await updateStory(story.id, { published: true });
      } else {
        story = await updateStory(storyId, { ...payload, published: nextPublished });
      }
      setPublished(story.published);
      setCreatedAt(story.created_at ?? createdAt);
      setLastSavedAt(story.updated_at ?? story.created_at ?? null);
      const changedWhileSaving = editVersionRef.current !== submittedVersion;
      setSaveState(changedWhileSaving ? "idle" : "saved");
      setStatusMsg(changedWhileSaving
        ? "Saved, with newer edits still unsaved. Save again to include them."
        : nextPublished
          ? "Story published."
          : "Draft saved.");
      if (nextPublished) router.refresh();
    } catch (err) {
      setSaveState("error");
      setStatusMsg(err instanceof Error ? err.message : "Unable to save.");
    }
  }

  async function discardDraft() {
    const confirmed = window.confirm(storyId ? "Permanently delete this story? This cannot be undone." : "Discard this draft and start fresh?");
    if (!confirmed || busy) return;
    if (storyId) {
      setSaveState("saving");
      try {
        await deleteStory(storyId);
        router.replace("/publish");
        router.refresh();
        return;
      } catch (err) {
        setSaveState("error");
        setStatusMsg(err instanceof Error ? err.message : "Unable to delete this story.");
        return;
      }
    }
    setTitle(DEFAULT_TITLE); setSubtitle(DEFAULT_SUBTITLE); setBodyHTML(DEFAULT_BODY);
    editorRef.current?.clear();
    setImageUrl(""); setStoryId(null);
    setPublished(false); setCreatedAt(null); setLastSavedAt(null); setStatusMsg("Draft cleared.");
  }

  function onTitleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const v = e.target.value; setTitle(v); markUnsaved();
  }

  function togglePreview() {
    if (!previewMode) setBodyHTML(sanitizeStoryHtml(editorRef.current?.getHTML() ?? bodyHTML));
    setPreviewMode(!previewMode);
  }

  /* ─────────────────────────────────────────────────────────────────────── */
  return (
    <div className="flex min-h-[calc(100svh-5rem)] flex-col bg-[var(--background)] text-[var(--foreground)]">
      <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" disabled={uploadState === "uploading"} onChange={onFileChange} />
      <input ref={toolbarFileInputRef} type="file" accept="image/*" className="sr-only" data-source="toolbar" disabled={uploadState === "uploading"} onChange={onFileChange} />

      <header className="sticky top-0 z-30 flex min-h-14 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 text-xs sm:gap-3">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-1.5 text-[var(--muted)] hover:text-[var(--foreground)]"><ArrowLeft className="h-3.5 w-3.5" /><span className="hidden sm:inline">Stories</span></Link>
          <span className="text-[var(--border-strong)]">/</span>
          <Link href="/" className="shrink-0 font-semibold text-[var(--foreground)]">Noted.</Link>
          <span className="hidden text-[var(--border-strong)] sm:inline">/</span>
          <span className="hidden min-w-0 truncate text-[var(--muted)] sm:inline">{published ? "Published" : "Draft"} in {authorName}</span>
          <span className="hidden shrink-0 items-center gap-1 text-[11px] sm:flex" aria-live="polite">
            {saveState === "saving" ? <><Cloud className="h-3 w-3" /> Saving</> : saveState === "error" ? <span className="text-red-600">Not saved</span> : saveState === "saved" && lastSavedAt ? <><Check className="h-3 w-3 text-emerald-600" /> Saved</> : <span className="text-[var(--muted)]">Unsaved</span>}
          </span>
        </div>
        <div ref={menusRef} className="flex shrink-0 items-center gap-1 sm:gap-2">
          <span className="hidden rounded-full bg-[var(--surface-muted)] px-3 py-1.5 text-[11px] text-[var(--muted-strong)] md:inline">{wordCount.toLocaleString()} words · {readMins} min read</span>
          <button type="button" onClick={togglePreview} className="flex items-center gap-1.5 rounded-md px-2.5 py-2 text-xs text-[var(--muted-strong)] hover:bg-[var(--surface-muted)] sm:text-sm">
            {previewMode ? <><EyeOff className="h-4 w-4" /><span className="hidden sm:inline">Edit</span></> : <><Eye className="h-4 w-4" /><span className="hidden sm:inline">Preview</span></>}
          </button>
          <button type="button" onClick={() => setSettingsOpen((open) => !open)} aria-label="Toggle story settings" className="rounded-md p-2 text-[var(--muted-strong)] hover:bg-[var(--surface-muted)]"><Settings2 className="h-4 w-4" /></button>
          <div className="relative flex">
            <button type="button" disabled={busy} onClick={() => void handleSave(true)} className="rounded-l-full bg-black px-3.5 py-2 text-xs font-medium text-white hover:bg-black/80 disabled:opacity-60">
              {busy ? "Saving…" : published ? "Update" : "Publish"}
            </button>
            <button type="button" disabled={busy} aria-label="More publish options" aria-expanded={publishMenuOpen} onClick={() => setPublishMenuOpen((open) => !open)} className="rounded-r-full border-l border-white/25 bg-black px-2 py-2 text-white hover:bg-black/80 disabled:opacity-60">
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {publishMenuOpen && <div className="absolute right-0 top-11 z-50 w-44 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1 shadow-xl">
              <button type="button" disabled={busy} onClick={() => { setPublishMenuOpen(false); void handleSave(false); }} className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[var(--surface-muted)] disabled:opacity-50">Save draft</button>
              <button type="button" disabled={busy} onClick={() => { setPublishMenuOpen(false); void handleSave(true); }} className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[var(--surface-muted)] disabled:opacity-50">Publish now</button>
            </div>}
          </div>
          <div className="relative">
            <button type="button" aria-label="Account menu" aria-expanded={accountMenuOpen} onClick={() => setAccountMenuOpen((open) => !open)} className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[11px] font-semibold text-[var(--foreground)]">
              {authorName.split(" ").slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "A"}
            </button>
            {accountMenuOpen && <div className="absolute right-0 top-10 z-50 w-48 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1 shadow-xl">
              <p className="truncate px-3 py-2 text-xs text-[var(--muted)]">{authorName}</p>
              {authorBio ? <p className="px-3 pb-2 text-xs leading-5 text-[var(--muted)]">{authorBio}</p> : null}
              <Link href="/dashboard" onClick={() => setAccountMenuOpen(false)} className="block rounded-md px-3 py-2 text-sm hover:bg-[var(--surface-muted)]">Dashboard</Link>
              <button type="button" onClick={async () => { await fetch("/api/auth/session", { method: "DELETE" }); router.push("/login"); }} className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[var(--surface-muted)]">Sign out</button>
            </div>}
          </div>
        </div>
      </header>

      {/* ── Formatting toolbar row 2 ───────────────────────────────────────── */}
      {!previewMode && <EditorToolbar editorRef={editorRef} onUndo={undo} onRedo={redo} onImageClick={() => { if (uploadState !== "uploading") toolbarFileInputRef.current?.click(); }} />}

      <main className={cn("grid w-full flex-1 grid-cols-1 gap-8 px-5 pb-12 pt-5 sm:px-8 sm:pt-8", settingsOpen && "lg:grid-cols-[minmax(0,1fr)_360px]")}>
        <div className="mx-auto w-full min-w-0 max-w-[720px]">
          {statusMsg && <div role="status" className={cn("mb-6 rounded-md px-4 py-3 text-sm", saveState === "error" ? "bg-red-50 text-red-700" : "bg-[var(--surface-muted)] text-[var(--muted-strong)]")}>{statusMsg}</div>}
          {loadError && <p role="alert" className="mb-6 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">Backend data could not be loaded: {loadError}</p>}
          {uploadError && !imageUrl && <p role="alert" className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{uploadError}</p>}
          {imageUrl && <CoverImageZone imageUrl={imageUrl} uploadState={uploadState} uploadError={uploadError} isDragOver={isDragOver} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onClickUpload={() => fileInputRef.current?.click()} onRemove={() => { setImageUrl(""); setUploadState("idle"); setUploadError(""); markUnsaved(); }} titleSlice={title.slice(0, 48)} />}
          {!imageUrl && !previewMode && <button type="button" disabled={uploadState === "uploading"} onClick={() => fileInputRef.current?.click()} className="mb-4 inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] disabled:opacity-50"><ImagePlus className="h-4 w-4" /> {uploadState === "uploading" ? "Uploading cover…" : "Add a cover image"}</button>}
          {previewMode ? <>
            <h1 className="mb-4 text-4xl font-bold leading-tight tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl">{title || "Untitled story"}</h1>
            {subtitle && <p className="mb-8 text-lg leading-relaxed text-[var(--muted-strong)]">{subtitle}</p>}
            <div className="rich-editor min-h-[200px]" dangerouslySetInnerHTML={{ __html: bodyHTML }} />
          </> : <>
            <textarea ref={titleInputRef} value={title} onChange={onTitleChange} rows={1} aria-label="Story title" className="w-full resize-none overflow-hidden bg-transparent text-4xl font-bold leading-[1.08] tracking-[-0.045em] text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] sm:text-5xl" placeholder="Title" />
            <textarea ref={subtitleInputRef} value={subtitle} onChange={(e) => { setSubtitle(e.target.value); markUnsaved(); }} rows={1} aria-label="Story subtitle" className="mt-4 w-full resize-none overflow-hidden bg-transparent text-lg leading-relaxed text-[var(--muted-strong)] outline-none placeholder:text-[var(--muted)]" placeholder="Add a subtitle…" />
            <div className="mt-5 flex items-center gap-2 border-y border-[var(--border)] py-3 text-xs text-[var(--muted)]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[9px] font-semibold text-[var(--foreground)]">{authorName.split(" ").slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "A"}</span>
              <span className="font-medium text-[var(--foreground)]">{authorName}</span>{authorBio ? <span className="hidden text-[var(--muted)] sm:inline">{authorBio}</span> : null}<span>·</span><span>{formatStoryMonth(createdAt ?? undefined)}</span><span>·</span><span>{published ? "Published" : "Draft"}</span>
            </div>
            <div className="group/editor relative mt-7">
              <div ref={insertMenuRef} className="absolute -left-11 top-0 z-10 hidden sm:block">
                <button type="button" aria-label="Insert a block" aria-expanded={insertMenuOpen} onMouseDown={(event) => event.preventDefault()} onClick={() => setInsertMenuOpen((open) => !open)} className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] shadow-sm hover:border-[var(--foreground)] hover:text-[var(--foreground)]"><Plus className="h-4 w-4" /></button>
                {insertMenuOpen && <div className="absolute left-8 top-0 z-20 w-36 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1 shadow-xl">
                  <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setInsertMenuOpen(false); if (uploadState !== "uploading") toolbarFileInputRef.current?.click(); }} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs hover:bg-[var(--surface-muted)]"><ImagePlus className="h-3.5 w-3.5" /> Image</button>
                  <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setInsertMenuOpen(false); editorRef.current?.exec("formatBlock", "blockquote"); }} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs hover:bg-[var(--surface-muted)]">Quote</button>
                  <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setInsertMenuOpen(false); editorRef.current?.insertHTML("<hr><p><br></p>"); }} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs hover:bg-[var(--surface-muted)]">Divider</button>
                </div>}
              </div>
              <RichEditor ref={editorRef} initialHTML={bodyHTML} onHtmlChange={(html) => { setBodyHTML(html); if (html !== submittedBodyRef.current) markUnsaved(); }} fontSize={17} textAlign="left" className="!mt-0 !min-h-[65vh] text-[17px] leading-[1.85]" />
            </div>
          </>}
          {!previewMode && <p className="mt-12 border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">{wordCount.toLocaleString()} words · {pageCount} {pageCount === 1 ? "page" : "pages"}</p>}
        </div>
        {settingsOpen && (
        <div className="relative z-20 h-[min(70svh,560px)] min-h-[420px] w-full lg:sticky lg:top-14 lg:h-[calc(100svh-9rem)] lg:min-h-0">
          <StorySettings
            published={published}
            busy={busy} onSave={handleSave} onDiscard={discardDraft}
            onClose={() => setSettingsOpen(false)}
          />
        </div>
        )}
      </main>
    </div>
  );
}


