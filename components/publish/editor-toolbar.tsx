"use client";

import type { MouseEvent, ReactNode, RefObject } from "react";
import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";

import type { RichEditorHandle } from "@/components/publish/rich-editor";

type Props = {
  editorRef: RefObject<RichEditorHandle | null>;
  onUndo: () => void;
  onRedo: () => void;
  onImageClick: () => void;
};

function ToolbarButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(event: MouseEvent<HTMLButtonElement>) => event.preventDefault()}
      onClick={onClick}
      className="flex h-8 min-w-8 items-center justify-center gap-1 rounded-md px-2 text-xs text-white/90 transition hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {children}
    </button>
  );
}

export function EditorToolbar({ editorRef, onUndo, onRedo, onImageClick }: Props) {
  return (
    <div className="sticky top-14 z-20 flex justify-center px-3 py-3">
      <div
        role="toolbar"
        aria-label="Story formatting"
        className="flex max-w-full flex-wrap items-center justify-center gap-0.5 rounded-full bg-[#171717] px-2 py-1.5 shadow-lg"
      >
        <ToolbarButton label="Undo" onClick={onUndo}><Undo2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton label="Redo" onClick={onRedo}><Redo2 className="h-4 w-4" /></ToolbarButton>
        <span className="mx-1 h-4 w-px bg-white/20" />
        <ToolbarButton label="Bold" onClick={() => editorRef.current?.exec("bold")}><Bold className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton label="Italic" onClick={() => editorRef.current?.exec("italic")}><Italic className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton
          label="Insert link"
          onClick={() => {
            const selection = window.getSelection();
            const selectedText = selection?.toString() ?? "";
            const url = window.prompt("Enter the link URL", "https://");
            if (!url) return;
            try {
              const parsedUrl = new URL(url);
              if (!["http:", "https:", "mailto:"].includes(parsedUrl.protocol)) return;
            } catch {
              return;
            }
            if (selectedText) {
              editorRef.current?.exec("createLink", url);
            } else {
              const text = window.prompt("Text to display", url);
              if (text) {
                const escapedText = text.replace(/[&<>"']/g, (char) => ({
                  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
                })[char] ?? char);
                const escapedUrl = url.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
                editorRef.current?.insertHTML(`<a href="${escapedUrl}">${escapedText}</a>`);
              }
            }
          }}
        >
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <span className="mx-1 h-4 w-px bg-white/20" />
        <ToolbarButton label="Heading 1" onClick={() => editorRef.current?.exec("formatBlock", "h1")}><Heading1 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton label="Heading 2" onClick={() => editorRef.current?.exec("formatBlock", "h2")}><Heading2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton label="Quote" onClick={() => editorRef.current?.exec("formatBlock", "blockquote")}><Quote className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton label="Code block" onClick={() => editorRef.current?.exec("formatBlock", "pre")}><Code2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton label="Bullet list" onClick={() => editorRef.current?.exec("insertUnorderedList")}><List className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton label="Insert image" onClick={onImageClick}><ImageIcon className="h-4 w-4" /></ToolbarButton>
      </div>
    </div>
  );
}
