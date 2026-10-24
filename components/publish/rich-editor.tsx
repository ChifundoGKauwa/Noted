"use client";

/**
 * RichEditor
 * ----------
 * A contenteditable-based WYSIWYG editor.  Formatting is applied through the
 * browser's built-in execCommand API — the same mechanism used by Word Online,
 * Google Docs (legacy path), and virtually every rich-text widget.
 *
 * The editor is uncontrolled at the DOM level (we never set innerHTML from
 * React after mount to avoid caret resets).  Instead we surface an
 * `onHtmlChange` callback so the parent can keep a serialised copy.
 */

import {
  type KeyboardEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

/* ── Public API exposed via ref ─────────────────────────────────────── */
export type RichEditorHandle = {
  /** Apply a named execCommand (bold, italic, underline, …) */
  exec: (cmd: string, value?: string) => void;
  /** Insert HTML at the current caret position */
  insertHTML: (html: string) => void;
  /** Return current innerHTML */
  getHTML: () => string;
  /** Return plain text (for word-count etc.) */
  getText: () => string;
  /** Clear the editor content */
  clear: () => void;
  /** Focus the editor */
  focus: () => void;
};

type RichEditorProps = {
  /** Initial HTML content (only used on first mount) */
  initialHTML: string;
  /** Fires whenever the content changes (debounced ~300 ms) */
  onHtmlChange: (html: string) => void;
  fontSize: number;
  textAlign: "left" | "center" | "right" | "justify";
  placeholder?: string;
  className?: string;
};

export const RichEditor = forwardRef<RichEditorHandle, RichEditorProps>(
  function RichEditor(
    { initialHTML, onHtmlChange, fontSize, textAlign, placeholder = "Write your story…", className },
    ref,
  ) {
    const divRef = useRef<HTMLDivElement>(null);
    const changeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    /* Set initial content once on mount */
    useEffect(() => {
      if (divRef.current) {
        divRef.current.innerHTML = initialHTML || "";
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Expose imperative handle to parent / toolbar */
    useImperativeHandle(ref, () => ({
      exec(cmd, value = "") {
        divRef.current?.focus();
        document.execCommand(cmd, false, value);
        fireChange();
      },
      insertHTML(html) {
        divRef.current?.focus();
        document.execCommand("insertHTML", false, html);
        fireChange();
      },
      getHTML() {
        return divRef.current?.innerHTML ?? "";
      },
      getText() {
        return divRef.current?.innerText ?? "";
      },
      clear() {
        if (!divRef.current) return;
        divRef.current.innerHTML = "";
        fireChange();
      },
      focus() {
        divRef.current?.focus();
      },
    }));

    function fireChange() {
      if (changeTimer.current) clearTimeout(changeTimer.current);
      changeTimer.current = setTimeout(() => {
        onHtmlChange(divRef.current?.innerHTML ?? "");
      }, 300);
    }

    /* Keyboard shortcuts */
    function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
      if (e.ctrlKey || e.metaKey) {
        const shortcuts: Record<string, string> = {
          b: "bold", i: "italic", u: "underline",
        };
        const cmd = shortcuts[e.key.toLowerCase()];
        if (cmd) {
          e.preventDefault();
          document.execCommand(cmd, false, "");
          fireChange();
        }
        if (e.key.toLowerCase() === "z") { e.preventDefault(); document.execCommand("undo", false, ""); fireChange(); }
        if (e.key.toLowerCase() === "y") { e.preventDefault(); document.execCommand("redo", false, ""); fireChange(); }
      }
    }

    /* Apply font-size & text-align reactively without touching innerHTML */
    useEffect(() => {
      if (divRef.current) {
        divRef.current.style.fontSize = `${fontSize}px`;
        divRef.current.style.textAlign = textAlign;
      }
    }, [fontSize, textAlign]);

    return (
      <div
        ref={divRef}
        contentEditable
        suppressContentEditableWarning
        onInput={fireChange}
        onKeyDown={onKeyDown}
        data-placeholder={placeholder}
        className={cn(
          "rich-editor min-h-[560px] w-full outline-none",
          "leading-[1.78] text-[#3a3632]",
          className,
        )}
        style={{ fontSize: `${fontSize}px`, textAlign }}
        aria-label="Story body"
        aria-multiline="true"
        role="textbox"
        spellCheck
      />
    );
  },
);
