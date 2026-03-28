"use client";

import { Stash } from "@/types";
import { IcX } from "@/icons/icons";

interface Props {
  stash: Stash | null;
  onClose: () => void;
}

export default function StashPreviewModal({ stash, onClose }: Props) {
  if (!stash) return null;

  const cloudinaryUrl = stash.metadata?.cloudinaryUrl;
  const extractedText = stash.metadata?.extractedText;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs backdrop-saturate-150"
      style={{ background: "rgba(15,15,15,0.7)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative bg-white rounded-2xl shadow-modal overflow-hidden animate-slide-up"
        style={{
          maxWidth: "900px",
          maxHeight: "90vh",
          minWidth: "400px",
          // width: "700px",
          // height: "500px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <h3 className="text-sm font-semibold text-text-primary truncate max-w-xs capitalize">
            {stash.title}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-surface-base transition-colors ml-4 shrink-0"
          >
            <IcX size={20} />
          </button>
        </div>

        {/* Body */}

        {/* Body */}
        <div className="w-full h-[calc(500px-56px)] overflow-hidden">
          {stash.contentType === "photo" && cloudinaryUrl && (
            <img
              src={cloudinaryUrl}
              alt={stash.title}
              className="w-full h-full object-center"
            />
          )}

          {stash.contentType === "video" && cloudinaryUrl && (
            <video
              src={cloudinaryUrl}
              controls
              autoPlay
              className="w-full h-full object-contain bg-black"
            />
          )}

          {stash.contentType === "note" && (
            <div className="px-6 py-5 overflow-y-auto h-full">
              <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                {extractedText || "No content available."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
