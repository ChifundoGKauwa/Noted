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
  useSyncExternalStore,
} from "react";
import { ChevronDown, Cloud, Eye, EyeOff, Settings2, ZoomIn, ZoomOut } from "lucide-react";

import { CoverImageZone } from "@/components/publish/cover-image-zone";
import {
  type Alignment,
  type ParaStyle,
  EditorToolbar,
} from "@/components/publish/editor-toolbar";
import { RichEditor, type RichEditorHandle } from "@/components/publish/rich-editor";
import { StorySettings } from "@/components/publish/story-settings";
import { getSession } from "@/lib/auth";
import { type Author, type Story, createStory, updateStory } from "@/lib/stories";
import { cn } from "@/lib/utils";

/* ─── helpers ────────────────────────────────────────────────────────────── */
function slugify(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}
function authorSlug(n: string) {
  return n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function countWords(t: string) { return t.trim().split(/\s+/).filter(Boolean).length; }
function splitContent(content: string) {
  const [first, ...rest] = content.split("\n\n");
  return rest.length ? { subtitle: first ?? "", body: rest.join("\n\n") } : { subtitle: "", body: first ?? "" };
}
function subscribeNever() { return () => undefined; }
function readSession() { return window.localStorage.getItem("noted-session"); }

const DEFAULT_TITLE = "";
const DEFAULT_SUBTITLE = "";
const DEFAULT_BODY = "";

const DEFAULT_TAGS: string[] = [];
const REVISIONS_KEY = "noted-story-revisions";
type SaveState = "idle" | "saving" | "saved" | "error";
type UploadState = "idle" | "uploading" | "done" | "error";

/* ─── component ──────────────────────────────────────────────────────────── */
type Props = { authors: Author[]; subscriberCount: number; initialStory: Story | null };

export function PublishStudio({ authors, subscriberCount, initialStory }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toolbarFileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<RichEditorHandle>(null);
  const publishMenuRef = useRef<HTMLDivElement>(null);

  const parsed = initialStory ? splitContent(initialStory.content) : null;

  /* content */
  const [title, setTitle] = useState(initialStory?.title ?? DEFAULT_TITLE);
  const [subtitle, setSubtitle] = useState(parsed?.subtitle ?? DEFAULT_SUBTITLE);
  const [bodyHTML, setBodyHTML] = useState(parsed?.body ?? DEFAULT_BODY);
  const [tags, setTags] = useState<string[]>(DEFAULT_TAGS);

  /* meta */
  const [slug, setSlug] = useState(slugify(initialStory?.title ?? DEFAULT_TITLE) || "untitled");
  const [metaTitle, setMetaTitle] = useState(initialStory?.title ?? DEFAULT_TITLE);
  const [audience, setAudience] = useState<"public" | "subscribers">("public");
  const [emailDispatch, setEmailDispatch] = useState(true);
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [license, setLicense] = useState("All Rights Reserved (Default)");

  /* image */
  const [imageUrl, setImageUrl] = useState(initialStory?.image_url ?? "");
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadError, setUploadError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  /* save */
  const [storyId, setStoryId] = useState(initialStory?.id ?? null);
  const [published, setPublished] = useState(Boolean(initialStory?.published));
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(initialStory?.updated_at ?? null);
  const [statusMsg, setStatusMsg] = useState("");
  const [publishMenuOpen, setPublishMenuOpen] = useState(false);

  /* toolbar / UI */
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [activeTab, setActiveTab] = useState("Edit");
  const [fontSize, setFontSize] = useState(16);
  const [alignment, setAlignment] = useState<Alignment>("left");
  const [paraStyle, setParaStyle] = useState<ParaStyle>("Paragraph");

  /* session */
  const sessionRaw = useSyncExternalStore(subscribeNever, readSession, () => null);
  const session = useMemo(() => {
    if (!sessionRaw) return null;
    try { return JSON.parse(sessionRaw) as ReturnType<typeof getSession>; } catch { return null; }
  }, [sessionRaw]);
  const matchedAuthor = useMemo(() => {
    if (!session) return authors[0] ?? null;
    return authors.find((a) => a.id === session.id)
      ?? authors.find((a) => a.email.toLowerCase() === session.email.toLowerCase())
      ?? authors[0] ?? null;
  }, [authors, session]);
  const authorName = matchedAuthor?.name ?? session?.name ?? "Author";
  const authorId = matchedAuthor?.id ?? "";

  /* derived */
  const bodyText = bodyHTML.replace(/<[^>]+>/g, " ");
  const wordCount = useMemo(() => countWords(`${title} ${subtitle} ${bodyText}`), [title, subtitle, bodyText]);
  const readMins = useMemo(() => Math.max(1, Math.round(wordCount / 200)), [wordCount]);
  const pageCount = useMemo(() => Math.max(1, Math.ceil(wordCount / 400)), [wordCount]);
  const permalink = `noted.com/${authorSlug(authorName) || "author"}/${slug || "untitled"}`;
  const composedContent = [subtitle.trim(), bodyHTML.trim()].filter(Boolean).join("\n\n");
  const busy = saveState === "saving";

  /* close publish menu on outside click */
  useEffect(() => {
    function handler(e: PointerEvent) {
      if (publishMenuRef.current && !publishMenuRef.current.contains(e.target as Node))
        setPublishMenuOpen(false);
    }
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);

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
    const f = e.dataTransfer.files?.[0];
    if (f?.type.startsWith("image/")) uploadImage(f, false); // Cover image
  }

  /* Browser handles undo/redo natively inside contenteditable */
  function undo() { editorRef.current?.exec("undo"); }
  function redo() { editorRef.current?.exec("redo"); }

  /* ── save / publish ───────────────────────────────────────────────────── */
  async function handleSave(nextPublished: boolean) {
    if (busy) return;
    setSaveState("saving"); setStatusMsg(""); setPublishMenuOpen(false);
    // Grab the latest HTML from the live editor
    const currentHTML = editorRef.current?.getHTML() ?? bodyHTML;
    setBodyHTML(currentHTML);
    try {
      if (!authorId) throw new Error("Create an author account before publishing.");
      const composed = [subtitle.trim(), currentHTML.trim()].filter(Boolean).join("\n\n");
      if (!title.trim() || !composed.trim()) throw new Error("Add a title and body before saving.");
      const payload = { title: title.trim(), content: composed, image_url: imageUrl || undefined };
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
      const rev = { id: crypto.randomUUID(), titleText: title, subtitle, body: currentHTML, tags, savedAt: new Date().toISOString() };
      const stored = JSON.parse(window.localStorage.getItem(REVISIONS_KEY) ?? "[]") as unknown[];
      window.localStorage.setItem(REVISIONS_KEY, JSON.stringify([rev, ...stored].slice(0, 8)));
      setLastSavedAt(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
      setSaveState("saved");
      setStatusMsg(nextPublished
        ? emailDispatch && subscriberCount ? `Published & queued for ${subscriberCount.toLocaleString()} subscribers.` : "Story published."
        : "Draft saved.");
      if (nextPublished) router.refresh();
    } catch (err) {
      setSaveState("error");
      setStatusMsg(err instanceof Error ? err.message : "Unable to save.");
    }
  }

  function discardDraft() {
    if (!window.confirm("Discard all changes and start fresh?")) return;
    setTitle(DEFAULT_TITLE); setSubtitle(DEFAULT_SUBTITLE);
    setBodyHTML(DEFAULT_BODY);
    if (editorRef.current) {
      // Clear the contenteditable
      const div = document.querySelector("[role='textbox'][contenteditable='true']") as HTMLDivElement | null;
      if (div) div.innerHTML = DEFAULT_BODY;
    }
    setTags(DEFAULT_TAGS); setImageUrl(""); setStoryId(null);
    setPublished(false); setLastSavedAt(null); setStatusMsg("Content cleared.");
  }

  function onTitleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const v = e.target.value; setTitle(v); setSlug(slugify(v)); setMetaTitle(v);
  }

  /* ─────────────────────────────────────────────────────────────────────── */
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={onFileChange} />
      <input ref={toolbarFileInputRef} type="file" accept="image/*" className="sr-only" data-source="toolbar" onChange={onFileChange} />

      {/* ── App bar row 1 ─────────────────────────────────────────────────── */}
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <Link href="/" className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-[#6b6560] hover:bg-[#ede7dc]" aria-label="Back">
            ←
          </Link>
          <span className="text-[1.05rem] font-semibold tracking-[-0.06em]">Noted</span>
          <span className="h-4 w-px bg-[#d4c9b8]" />
          <input value={title} onChange={onTitleChange}
            className="min-w-0 max-w-[240px] truncate bg-transparent text-sm font-medium outline-none placeholder:text-[#9b9188]"
            aria-label="Document title" />
          <div className={cn("flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px]",
            saveState === "error" ? "border-red-300 bg-red-50 text-red-600" : "border-[var(--border)] bg-[#ede7dc] text-[#6b6560]"
          )}>
            <Cloud className="h-3 w-3" />
            {saveState === "saving" ? "Saving…" : lastSavedAt ? `Saved • ${lastSavedAt}` : "Not saved yet"}
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-1 rounded-full border border-[var(--border)] bg-[#ede7dc] px-3 py-1 text-[11px] font-medium text-[#3a3632] sm:flex">
          {wordCount.toLocaleString()} WORDS <span className="mx-1 text-[#b0a898]">•</span> {readMins} MIN READ
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {(["Edit", "Review", "View", "Insert", "Layout"] as const).map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className={cn("hidden h-7 items-center rounded px-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] lg:flex",
                activeTab === tab ? "bg-[var(--foreground)] text-white" : "text-[#6b6560] hover:bg-[#ede7dc]"
              )}
            >{tab}</button>
          ))}
          <span className="mx-1 h-4 w-px bg-[#d4c9b8]" />

          <button type="button" onClick={() => setPreviewMode((v) => !v)}
            className={cn("flex h-7 items-center gap-1.5 rounded border px-3 text-[11px] font-semibold uppercase tracking-[0.1em]",
              previewMode ? "border-[var(--foreground)] bg-[var(--foreground)] text-white" : "border-[var(--border)] bg-[#ede7dc] text-[#3a3632] hover:bg-[#e2dbd2]"
            )}
          >
            {previewMode ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {previewMode ? "Edit" : "Preview"}
          </button>

          <div ref={publishMenuRef} className="relative flex">
            <button type="button" disabled={busy} onClick={() => handleSave(true)}
              className="flex h-8 items-center rounded-l-md bg-[var(--foreground)] px-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white hover:bg-[var(--surface-muted)] disabled:opacity-60"
            >
              {busy ? "Saving…" : published ? "Update Story" : "Publish Story"}
            </button>
            <button type="button" onClick={() => setPublishMenuOpen((v) => !v)}
              className="flex h-8 w-7 items-center justify-center rounded-r-md border-l border-white/20 bg-[var(--foreground)] text-white hover:bg-[var(--surface-muted)]"
              aria-label="More publish options"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {publishMenuOpen && (
              <div className="absolute right-0 top-10 z-50 w-44 overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-lg">
                <button type="button" className="block w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-elevated)]" onClick={() => handleSave(false)} disabled={busy}>Save draft</button>
                <button type="button" className="block w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-elevated)]" onClick={() => handleSave(true)} disabled={busy}>Publish now</button>
              </div>
            )}
          </div>

          <button type="button" onClick={() => setSettingsOpen((v) => !v)}
            className={cn("ml-1 flex h-8 w-8 items-center justify-center rounded-full border",
              settingsOpen ? "border-[var(--foreground)] bg-[var(--foreground)] text-white" : "border-[var(--border)] bg-[#ede7dc] text-[#6b6560] hover:bg-[#e2dbd2]"
            )}
            aria-label="Toggle settings"
          >
            <Settings2 className="h-3.5 w-3.5" />
          </button>

          <div className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-[11px] font-bold text-white select-none">
            {authorName.split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "N"}
          </div>
        </div>
      </div>

      {/* ── Formatting toolbar row 2 ───────────────────────────────────────── */}
      <EditorToolbar
        editorRef={editorRef}
        canUndo={true}
        canRedo={true}
        onUndo={undo}
        onRedo={redo}
        paraStyle={paraStyle}
        onParaStyle={setParaStyle}
        fontSize={fontSize}
        onFontSize={setFontSize}
        alignment={alignment}
        onAlignment={setAlignment}
        onImageClick={() => toolbarFileInputRef.current?.click()}
      />

      {/* ── Main area ──────────────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1">
        {/* Canvas */}
        <div className="relative flex-1 overflow-y-auto bg-[var(--background)]">
          {statusMsg && (
            <div className={cn("mx-auto mt-3 max-w-[760px] rounded-lg px-4 py-2 text-sm",
              saveState === "error" ? "bg-red-50 text-red-700" : "bg-[#f0ece5] text-[#6b6560]"
            )}>
              {statusMsg}
              <button type="button" className="ml-3 text-xs underline opacity-60 hover:opacity-100" onClick={() => setStatusMsg("")}>dismiss</button>
            </div>
          )}

          {/* Ruler */}
          <div className="sticky top-0 z-10 flex h-5 overflow-hidden border-b border-[var(--border)] bg-[#eee8e0] select-none">
            <div className="mx-auto flex w-full max-w-[760px]">
              {Array.from({ length: 32 }, (_, i) => (
                <div key={i} className="flex-1 border-r border-[#ccc5ba] pb-0.5 text-right text-[7px] text-[#b0a898]">
                  {i % 5 === 0 && i > 0 ? i : ""}
                </div>
              ))}
            </div>
          </div>

          {/* Paper */}
          <div className="mx-auto my-8 w-full max-w-[760px]" style={{ zoom: `${zoom}%` }}>
            <div className="min-h-[1056px] bg-white px-16 py-12 shadow-[0_2px_16px_-4px_rgba(28,27,26,0.18)]">

              {/* Doc header */}
              <div className="mb-8 flex items-start justify-between border-b border-[#e0d8ce] pb-3">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#9b9188]">Document Section:</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#3a3632]">
                    {tags.length > 0 ? `${tags[0]}${tags[1] ? ` & ${tags[1]}` : ''}` : "Untitled Section"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9b9188]">Draft Issue • Page</p>
                  <p className="text-[10px] font-bold text-[#3a3632]">1</p>
                </div>
              </div>

              {/* Cover image zone */}
              <CoverImageZone
                imageUrl={imageUrl} uploadState={uploadState} uploadError={uploadError}
                isDragOver={isDragOver} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                onClickUpload={() => fileInputRef.current?.click()} onRemove={() => { setImageUrl(""); setUploadState("idle"); setUploadError(""); }}
                titleSlice={title.slice(0, 48)}
              />

              {previewMode ? (
                <>
                  <h1 className="text-[2.4rem] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--foreground)]">{title || "Untitled"}</h1>
                  <p className="mt-3 text-[1.15rem] leading-snug text-[#6b6560]">{subtitle}</p>
                  {/* Render the live HTML directly — already styled by rich-editor CSS */}
                  <div
                    className="rich-editor mt-6 min-h-[200px] outline-none"
                    dangerouslySetInnerHTML={{ __html: editorRef.current?.getHTML() ?? bodyHTML }}
                  />
                </>
              ) : (
                <>
                  <textarea value={title} onChange={onTitleChange} rows={3} aria-label="Story title"
                    className="w-full resize-none bg-transparent text-[2.4rem] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--foreground)] outline-none placeholder:text-[#c5bdb5]"
                    placeholder="Story title…" />
                  <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={2} aria-label="Story subtitle"
                    className="mt-2 w-full resize-none bg-transparent text-[1.15rem] leading-snug text-[#6b6560] outline-none placeholder:text-[#c5bdb5]"
                    placeholder="Add a subtitle…" />
                  <RichEditor
                    ref={editorRef}
                    initialHTML={bodyHTML}
                    onHtmlChange={setBodyHTML}
                    fontSize={fontSize}
                    textAlign={alignment}
                    className="mt-6"
                  />
                </>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-dashed border-[var(--border)] pt-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#b0a898]">
                <span>— Page Break (Section 1 End) —</span>
                <span>Page 1 of {pageCount}</span>
              </div>
            </div>
          </div>
          <div className="h-16" />
        </div>

        {/* Settings panel */}
        {settingsOpen && (
          <StorySettings
            tags={tags} onTagsChange={setTags}
            slug={slug} onSlugChange={setSlug}
            metaTitle={metaTitle} onMetaTitleChange={setMetaTitle}
            permalink={permalink} subtitle={subtitle} body={bodyHTML}
            audience={audience} onAudienceChange={setAudience}
            emailDispatch={emailDispatch} onEmailDispatchChange={setEmailDispatch}
            subscriberCount={subscriberCount}
            canonicalUrl={canonicalUrl} onCanonicalUrlChange={setCanonicalUrl}
            license={license} onLicenseChange={setLicense}
            busy={busy} onSave={handleSave} onDiscard={discardDraft}
            onClose={() => setSettingsOpen(false)}
          />
        )}
      </div>

      {/* ── Status bar ────────────────────────────────────────────────────── */}
      <div className="flex shrink-0 items-center justify-between border-t border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-1 text-[10px] text-[#9b9188]">
        <div className="flex items-center gap-4">
          <span>Page 1 of {pageCount}</span>
          <span>{wordCount.toLocaleString()} words</span>
          <span className="hidden sm:inline">🌐 English (United States)</span>
          <span className="hidden sm:inline">Readability: Grade 9</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => setZoom((z) => Math.max(50, z - 10))} className="flex h-5 w-5 items-center justify-center rounded hover:bg-[#ede7dc]" aria-label="Zoom out"><ZoomOut className="h-3 w-3" /></button>
          <span className="w-10 text-center">{zoom}%</span>
          <button type="button" onClick={() => setZoom((z) => Math.min(200, z + 10))} className="flex h-5 w-5 items-center justify-center rounded hover:bg-[#ede7dc]" aria-label="Zoom in"><ZoomIn className="h-3 w-3" /></button>
        </div>
      </div>
    </div>
  );
}


