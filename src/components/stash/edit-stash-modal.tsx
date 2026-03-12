"use client";

import { useState, useRef, useEffect } from "react";
import { Stash, Collection } from "@/types";
import { IcChevDown, IcX } from "@/icons/icons";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  stash: Stash | null;
  collections: Collection[];
  onClose: () => void;
  onSave: (id: string, data: Partial<Stash>) => Promise<void>;
  defaultCollectionId?: string;
};

const STASH_TYPES = [
  { label: "Website", value: "Website" },
  { label: "Video", value: "Video" },
  { label: "Document", value: "Document" },
  { label: "Note", value: "Note" },
  { label: "Photo", value: "Photo" },
];

export function EditStashModal({
  open,
  stash,
  collections,
  defaultCollectionId,
  onClose,
  onSave,
}: Props) {
  const [collectionId, setCollectionId] = useState(
    stash?.Collections?.[0]?.id ?? defaultCollectionId ?? "",
  );
  const [tag, setTag] = useState(stash?.Tags?.[0]?.name ?? "");
  const [notes, setNotes] = useState(stash?.notes ?? "");
  const [tagOpen, setTagOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collOpen, setCollOpen] = useState(false);
  const collRef = useRef<HTMLDivElement>(null);

  // click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (collRef.current && !collRef.current.contains(e.target as Node))
        setCollOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedCollection = collections.find((c) => c.id === collectionId);

  const selectedTag = STASH_TYPES.find((t) => t.value === tag);

  const handleSave = async () => {
    if (!stash) return;
    setLoading(true);
    try {
      await onSave(stash.id, {
        collectionId: collectionId || null,
        tags: tag ? [tag] : [],
        notes,
      });
      onClose();
    } catch {
      setLoading(false);
    }
  };

  if (!open || !stash) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md py-3">
        {/* Header */}
        <div className="flex items-center border-b border-border justify-between px-6 py-2 mb-6">
          <h2 className="text-[18px] font-semibold text-black">Edit</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-surface-base transition-colors"
          >
            <IcX size={24} />
          </button>
        </div>

        {/* Stash preview */}
        <div className="px-6 mb-4">
          <div className="flex items-center gap-3 p-3 bg-[#F5F0E8] rounded-lg">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 shrink-0">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#022b3a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-900 truncate">
              {stash.title}
            </span>
          </div>
        </div>

        <div className="space-y-4 px-6">
          {/* Collection */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Collection
            </label>
            <div className="relative">
              <select
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="w-full appearance-none border border-[#D4D4D4] rounded-sm px-4 py-2.5 text-sm text-gray-900 outline-none transition-all bg-white"
              >
                <option value="">No collection</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div> */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Collection
            </label>
            <div ref={collRef} className="relative">
              <button
                type="button"
                onClick={() => setCollOpen((o) => !o)}
                className="w-full flex items-center justify-between border border-[#D4D4D4] rounded-sm px-4 py-2.5 text-sm bg-white outline-none transition-all"
              >
                <span
                  className={
                    selectedCollection
                      ? "text-gray-900 capitalize"
                      : "text-gray-400 capitalize"
                  }
                >
                  {selectedCollection?.name ?? "No collection"}
                </span>
                <IcChevDown size={14} className="text-text-tertiary shrink-0" />
              </button>
              {collOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-modal z-10 py-1 animate-slide-down overflow-hidden max-h-48 overflow-y-auto">
                  {/* <button
                    onClick={() => {
                      setCollectionId("");
                      setCollOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-[13px] transition-colors",
                      collectionId === ""
                        ? "bg-surface-base text-text-primary font-medium"
                        : "text-text-secondary hover:bg-surface-base",
                    )}
                  >
                    No collection
                  </button> */}
                  {collections.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setCollectionId(c.id);
                        setCollOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-[13px] transition-colors capitalize",
                        collectionId === c.id
                          ? "bg-surface-base text-text-primary font-medium capitalize"
                          : "text-text-secondary hover:bg-surface-base",
                      )}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tag — dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tag
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setTagOpen((o) => !o)}
                className="w-full flex items-center justify-between border border-[#D4D4D4] rounded-sm px-4 py-2.5 text-sm bg-white outline-none transition-all"
              >
                {selectedTag ? (
                  <span className="text-[12px] font-medium bg-surface-base border border-border text-text-secondary px-2 py-0.5 rounded-md">
                    {selectedTag.label}
                  </span>
                ) : (
                  <span className="text-gray-400">Select type</span>
                )}
                <IcChevDown size={14} className="text-text-tertiary shrink-0" />
              </button>

              {tagOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-modal z-10 py-2">
                  <div className="flex flex-wrap gap-1.5 px-3">
                    {STASH_TYPES.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => {
                          setTag(type.value);
                          setTagOpen(false);
                        }}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-[12px] font-medium border transition-all duration-100",
                          tag === type.value
                            ? "bg-text-primary border-border text-white"
                            : "border-border text-text-secondary hover:border-border-strong hover:bg-surface-base",
                        )}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a note..."
              rows={4}
              className="w-full border border-[#D4D4D4] rounded-sm px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 mt-6 px-6">
          <button
            onClick={onClose}
            className="px-4 py-2 cursor-pointer rounded-sm text-sm font-medium text-text-secondary bg-[#F5F5F5] hover:border-border-strong transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-sm bg-foreground text-white hover:bg-[#1a4050] transition-colors disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
