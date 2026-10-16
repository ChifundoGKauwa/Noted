"use client";

import { Image as ImageIcon } from "lucide-react";
import { type DragEvent } from "react";
import { cn } from "@/lib/utils";

type UploadState = "idle" | "uploading" | "done" | "error";

type CoverImageZoneProps = {
  imageUrl: string;
  uploadState: UploadState;
  uploadError: string;
  isDragOver: boolean;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onClickUpload: () => void;
  onRemove: () => void;
  titleSlice: string;
};

export function CoverImageZone({
  imageUrl,
  uploadState,
  uploadError,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onClickUpload,
  onRemove,
  titleSlice,
}: CoverImageZoneProps) {
  return (
    <figure className="mb-8">
      {imageUrl ? (
        <div className="group relative">
          <img
            src={imageUrl}
            alt="Story cover"
            className="w-full object-cover"
            style={{ maxHeight: 320 }}
          />
          <div className="border border-t-0 border-[#e0d8ce] bg-[#f9f6f1] px-3 py-1.5 text-[10px] text-[#9b9188]">
            <span className="font-semibold uppercase tracking-[0.14em] text-[#6b6560]">
              Figure 1.0 •{" "}
            </span>
            {titleSlice}
          </div>
          <div className="absolute bottom-8 right-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={onClickUpload}
              className="flex h-7 items-center gap-1 rounded border border-[#d4c9b8] bg-white/95 px-2.5 text-[11px] font-semibold text-[#3a3632] shadow-sm hover:bg-[#f5f1eb]"
            >
              ✎ Replace
            </button>
            <button
              type="button"
              onClick={onRemove}
              aria-label="Remove image"
              className="flex h-7 items-center gap-1 rounded border border-[#d4c9b8] bg-white/95 px-2.5 text-[11px] font-semibold text-[#3a3632] shadow-sm hover:bg-[#f5f1eb]"
            >
              ✕ Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label="Add figure — drag and drop or click to browse"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={uploadState !== "uploading" ? onClickUpload : undefined}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && uploadState !== "uploading") {
              e.preventDefault();
              onClickUpload();
            }
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed py-14 transition-colors",
            isDragOver
              ? "border-[#1c1b1a] bg-[#f5f1eb]"
              : "border-[#d4c9b8] bg-[#faf8f4] hover:border-[#b0a898] hover:bg-[#f5f1eb]",
            uploadState === "uploading" ? "cursor-not-allowed" : "",
          )}
        >
          {uploadState === "uploading" ? (
            <>
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#d4c9b8] border-t-[#6b6560]" />
              <p className="text-xs font-medium text-[#6b6560]">Uploading…</p>
            </>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d4c9b8] bg-white">
                <ImageIcon className="h-5 w-5 text-[#9b9188]" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b6560]">
                Add figure image
              </p>
              <p className="text-[10px] text-[#9b9188]">
                Drag &amp; drop or click · PNG, JPG, WebP up to 10 MB
              </p>
            </>
          )}
        </div>
      )}

      {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}

      {!imageUrl && (
        <figcaption className="border border-t-0 border-[#e0d8ce] bg-[#f9f6f1] px-3 py-1.5 text-[10px] text-[#9b9188]">
          <span className="font-semibold uppercase tracking-[0.14em] text-[#6b6560]">
            Figure 1.0 • Monolithic Study
          </span>
        </figcaption>
      )}
    </figure>
  );
}
