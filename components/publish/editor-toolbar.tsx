"use client";

import React, { useRef, useState } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code2,
  ExternalLink,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Plus,
  Quote,
  Redo2,
  Strikethrough,
  Table2,
  Underline,
  Undo2,
} from "lucide-react";
import { TbBtn, TbDivider } from "@/components/ui/toolbar-button";
import { cn } from "@/lib/utils";
import type { RichEditorHandle } from "@/components/publish/rich-editor";

export type Alignment = "left" | "center" | "right" | "justify";
export type ParaStyle =
  | "Paragraph"
  | "Heading 1"
  | "Heading 2"
  | "Heading 3"
  | "Blockquote"
  | "Code Block";

export const PARA_STYLES: ParaStyle[] = [
  "Paragraph", "Heading 1", "Heading 2", "Heading 3", "Blockquote", "Code Block",
];
export const FONT_SIZES = [10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

/** formatBlock value for each paragraph style */
const PARA_TAG: Record<ParaStyle, string> = {
  "Paragraph":   "p",
  "Heading 1":   "h1",
  "Heading 2":   "h2",
  "Heading 3":   "h3",
  "Blockquote":  "blockquote",
  "Code Block":  "pre",
};

type Props = {
  editorRef: React.RefObject<RichEditorHandle | null>;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  paraStyle: ParaStyle;
  onParaStyle: (s: ParaStyle) => void;
  fontSize: number;
  onFontSize: (n: number) => void;
  alignment: Alignment;
  onAlignment: (a: Alignment) => void;
  onImageClick: () => void;
};

export function EditorToolbar({
  editorRef,
  canUndo, canRedo, onUndo, onRedo,
  paraStyle, onParaStyle,
  fontSize, onFontSize,
  alignment, onAlignment,
  onImageClick,
}: Props) {
  const paraRef = useRef<HTMLDivElement>(null);
  const fontRef = useRef<HTMLDivElement>(null);
  const [paraOpen, setParaOpen] = useState(false);
  const [fontOpen, setFontOpen] = useState(false);
  const fontIdx = FONT_SIZES.indexOf(fontSize);

  /* ── execCommand helpers ──────────────────────────────────────────────── */

  /** Wraps the selection in the named format (bold, italic, etc.) */
  function cmd(command: string, value = "") {
    editorRef.current?.exec(command, value);
  }

  /** Apply a block-level format (heading, blockquote, etc.) */
  function applyBlock(style: ParaStyle) {
    onParaStyle(style);
    setParaOpen(false);
    cmd("formatBlock", PARA_TAG[style]);
  }

  /** Insert a link around the selection */
  function insertLink() {
    const url = window.prompt("Enter URL:", "https://");
    if (!url) return;
    cmd("createLink", url);
  }

  /** Insert a full-width table */
  function insertTable() {
    editorRef.current?.insertHTML(
      `<table><thead><tr><th>Column 1</th><th>Column 2</th><th>Column 3</th></tr></thead>` +
      `<tbody><tr><td>Cell</td><td>Cell</td><td>Cell</td></tr></tbody></table><p><br></p>`,
    );
  }

  /** Font size: use fontSize command (1-7 scale) or wrap in inline style */
  function applyFontSize(sz: number) {
    onFontSize(sz);
    setFontOpen(false);
    // execCommand fontSize uses a 1-7 scale; we set it via inline style instead
    // by wrapping the selection in a span — simpler and more reliable.
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    editorRef.current?.exec("fontSize", "7"); // placeholder size
    // Now replace all font size=7 spans with our px size
    const editor = (editorRef.current as unknown as { focus?: () => void }) as
      & RichEditorHandle
      & { _div?: HTMLDivElement };
    // Walk up from the focus node to find the created font element and restyle it
    requestAnimationFrame(() => {
      document.querySelectorAll('[size="7"]').forEach((el) => {
        (el as HTMLElement).removeAttribute("size");
        (el as HTMLElement).style.fontSize = `${sz}px`;
      });
    });
  }

  /* Prevent-default wrapper: stops the toolbar button click from blurring the editor */
  function md(fn: () => void) {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      fn();
    };
  }

  /* ─────────────────────────────────────────────────────────────────────── */

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-0.5 border-b border-[#d4c9b8] bg-[#f5f1eb] px-3 py-1">
      {/* Undo / Redo */}
      <TbBtn icon={Undo2} label="Undo (Ctrl+Z)" disabled={!canUndo} onMouseDown={md(onUndo)} />
      <TbBtn icon={Redo2} label="Redo (Ctrl+Y)" disabled={!canRedo} onMouseDown={md(onRedo)} />
      <TbDivider />

      {/* Paragraph style */}
      <div ref={paraRef} className="relative">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); setParaOpen((v) => !v); setFontOpen(false); }}
          className="flex h-7 min-w-[100px] items-center justify-between gap-1 rounded px-2 text-[11px] font-medium text-[#3a3632] hover:bg-[#ede7dc]"
        >
          {paraStyle} <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
        {paraOpen && (
          <div className="absolute left-0 top-8 z-50 w-40 overflow-hidden rounded-lg border border-[#d4c9b8] bg-white shadow-lg">
            {PARA_STYLES.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); applyBlock(s); }}
                className={cn(
                  "block w-full px-3 py-2 text-left text-[11px] hover:bg-[#f5f1eb]",
                  paraStyle === s ? "font-semibold text-[#1c1b1a]" : "text-[#3a3632]",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      <TbDivider />

      {/* Font size */}
      <div ref={fontRef} className="relative flex items-center gap-0.5">
        <TbBtn
          icon={Minus} label="Decrease size" small
          disabled={fontIdx <= 0}
          onMouseDown={md(() => applyFontSize(FONT_SIZES[Math.max(0, fontIdx - 1)] ?? fontSize))}
        />
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); setFontOpen((v) => !v); setParaOpen(false); }}
          className="flex h-6 w-8 items-center justify-center rounded text-[11px] font-medium text-[#3a3632] hover:bg-[#ede7dc]"
        >
          {fontSize}
        </button>
        {fontOpen && (
          <div className="absolute left-0 top-7 z-50 max-h-48 w-20 overflow-y-auto rounded-lg border border-[#d4c9b8] bg-white shadow-lg">
            {FONT_SIZES.map((sz) => (
              <button
                key={sz}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); applyFontSize(sz); }}
                className={cn(
                  "block w-full px-3 py-1.5 text-left text-[11px] hover:bg-[#f5f1eb]",
                  sz === fontSize ? "font-semibold text-[#1c1b1a]" : "text-[#3a3632]",
                )}
              >
                {sz}
              </button>
            ))}
          </div>
        )}
        <TbBtn
          icon={Plus} label="Increase size" small
          disabled={fontIdx >= FONT_SIZES.length - 1}
          onMouseDown={md(() => applyFontSize(FONT_SIZES[Math.min(FONT_SIZES.length - 1, fontIdx + 1)] ?? fontSize))}
        />
      </div>
      <TbDivider />

      {/* Inline formatting */}
      <TbBtn icon={Bold}          label="Bold (Ctrl+B)"       onMouseDown={md(() => cmd("bold"))} />
      <TbBtn icon={Italic}        label="Italic (Ctrl+I)"     onMouseDown={md(() => cmd("italic"))} />
      <TbBtn icon={Underline}     label="Underline (Ctrl+U)"  onMouseDown={md(() => cmd("underline"))} />
      <TbBtn icon={Strikethrough} label="Strikethrough"       onMouseDown={md(() => cmd("strikeThrough"))} />
      <TbBtn icon={Link2}         label="Insert link"         onMouseDown={md(insertLink)} />
      <TbDivider />

      {/* Alignment */}
      <TbBtn icon={AlignLeft}    label="Align left"    active={alignment === "left"}
        onMouseDown={md(() => { onAlignment("left");    cmd("justifyLeft"); })} />
      <TbBtn icon={AlignCenter}  label="Align center"  active={alignment === "center"}
        onMouseDown={md(() => { onAlignment("center");  cmd("justifyCenter"); })} />
      <TbBtn icon={AlignRight}   label="Align right"   active={alignment === "right"}
        onMouseDown={md(() => { onAlignment("right");   cmd("justifyRight"); })} />
      <TbBtn icon={AlignJustify} label="Justify"       active={alignment === "justify"}
        onMouseDown={md(() => { onAlignment("justify"); cmd("justifyFull"); })} />
      <TbDivider />

      {/* Lists */}
      <TbBtn icon={List}        label="Bullet list"   onMouseDown={md(() => cmd("insertUnorderedList"))} />
      <TbBtn icon={ListOrdered} label="Numbered list" onMouseDown={md(() => cmd("insertOrderedList"))} />
      <TbDivider />

      {/* Insert */}
      <TbBtn icon={ImageIcon}    label="Insert image"       onMouseDown={md(onImageClick)} />
      <TbBtn icon={Table2}       label="Insert table"       onMouseDown={md(insertTable)} />
      <TbBtn icon={ExternalLink} label="Insert link"        onMouseDown={md(insertLink)} />
      <TbBtn icon={Quote}        label="Blockquote"         onMouseDown={md(() => cmd("formatBlock", "blockquote"))} />
      <TbBtn icon={Code2}        label="Inline code"        onMouseDown={md(() => cmd("formatBlock", "pre"))} />
      <TbBtn icon={Minus}        label="Horizontal rule"    onMouseDown={md(() => editorRef.current?.insertHTML("<hr>"))} />
    </div>
  );
}
