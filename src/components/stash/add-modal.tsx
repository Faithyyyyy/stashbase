"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { StashItem } from "@/types";
import { COLLECTIONS, TAG_POOL } from "@/lib/data";
import { IcChevDown, IcAdd, IcX } from "@/icons/icons";

interface AddModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (item: StashItem) => void;
}

const COVER_URLS = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=80",
  "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600&q=80",
  "https://images.unsplash.com/photo-1507908708918-778587c9e563?w=600&q=80",
];

export default function AddModal({ open, onClose, onSuccess }: AddModalProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [collection, setCollection] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Dropdown open states
  const [collOpen, setCollOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);

  const collRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  // Reset on open
  useEffect(() => {
    if (open) {
      Promise.resolve().then(() => {
        setUrl("");
        setTitle("");
        setCollection("");
        setTags([]);
        setCollOpen(false);
        setTagsOpen(false);
      });
    }
  }, [open]);

  // Escape to close
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  // Click-outside for dropdowns
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (collRef.current && !collRef.current.contains(e.target as Node))
        setCollOpen(false);
      if (tagsRef.current && !tagsRef.current.contains(e.target as Node))
        setTagsOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggleTag = (tag: string) =>
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  const handleAdd = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    const item: StashItem = {
      id: crypto.randomUUID(),
      link: title.trim(),
      title: title.trim(),
      url,
      description: "",
      collection: collection || "Uncategorised",
      type: "Link",
      tags,
      coverUrl: COVER_URLS[Math.floor(Math.random() * COVER_URLS.length)],
      addedAt: new Date(),
    };
    setLoading(false);
    onSuccess(item);
  };

  if (!open) return null;

  return (
    <>
      {/* ── BACKDROP ── */}
      <div
        className="fixed inset-0 z-50 animate-fade-in backdrop-blur-xs backdrop-saturate-150"
        style={{
          background: "rgba(15,15,15,0.35)",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget && !loading) onClose();
        }}
      >
        {/* LOADING OVERLAY  */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-modal px-6 py-4 flex flex-col items-center gap-2.5 animate-slide-up">
              {/* Dashed spinner ring */}
              <svg
                className="animate-spin w-8 h-8 text-foreground"
                viewBox="0 0 32 32"
                fill="none"
              >
                <circle
                  cx="16"
                  cy="16"
                  r="13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-[13.5px] font-semibold text-text-primary tracking-[-0.01em]">
                Adding to stash
              </p>
            </div>
          </div>
        )}

        {/* ── MODAL (hidden during loading) ── */}
        {!loading && (
          <div
            className="absolute inset-0 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <div
              className="bg-white rounded-2xl shadow-modal w-full max-w-120 animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center border-b border-border justify-between px-6 py-4">
                <h2 className="text-[18px] font-semibold text-black">
                  Add to stash
                </h2>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-surface-base transition-colors"
                >
                  <IcX size={24} />
                </button>
              </div>

              {/* Form */}
              <div className="px-6 py-4 space-y-4">
                {/* Link */}
                <Field label="Link">
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://"
                    className={inputCls}
                  />
                </Field>

                {/* Title */}
                <Field label="Title">
                  <input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    placeholder=""
                    className={inputCls}
                  />
                </Field>

                {/* Collection dropdown */}
                <Field label="Collection">
                  <div ref={collRef} className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setCollOpen((o) => !o);
                        setTagsOpen(false);
                      }}
                      className={cn(
                        inputCls,
                        "flex items-center justify-between text-left w-full",
                        !collection && "text-text-disabled",
                      )}
                    >
                      <span>{collection || ""}</span>
                      <IcChevDown
                        size={14}
                        className="text-text-tertiary shrink-0"
                      />
                    </button>
                    {collOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-modal z-10 py-1 animate-slide-down overflow-hidden">
                        {COLLECTIONS.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              setCollection(c);
                              setCollOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2 text-[13px] transition-colors",
                              collection === c
                                ? "bg-surface-base text-text-primary font-medium"
                                : "text-text-secondary hover:bg-surface-base",
                            )}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </Field>

                {/* Tags dropdown */}
                <Field label="Tags">
                  <div ref={tagsRef} className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setTagsOpen((o) => !o);
                        setCollOpen(false);
                      }}
                      className={cn(
                        inputCls,
                        "flex items-center justify-between text-left w-full",
                      )}
                    >
                      <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
                        {tags.length === 0 ? (
                          <span className="text-text-disabled" />
                        ) : (
                          <>
                            {tags.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="shrink-0 text-[11.5px] font-medium bg-surface-base border border-border text-text-secondary px-2 py-0.5 rounded-md"
                              >
                                {t}
                              </span>
                            ))}
                            {tags.length > 3 && (
                              <span className="text-[12px] text-text-tertiary shrink-0">
                                +{tags.length - 3}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <IcChevDown
                        size={14}
                        className="text-text-tertiary shrink-0 ml-2"
                      />
                    </button>

                    {tagsOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-modal z-10 py-2 animate-slide-down">
                        <div className="flex flex-wrap gap-1.5 px-3">
                          {TAG_POOL.map((tag) => {
                            const active = tags.includes(tag);
                            return (
                              <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={cn(
                                  "px-2.5 py-1 rounded-lg text-[12px] font-medium border transition-all duration-100",
                                  active
                                    ? "bg-text-primary border-border text-white"
                                    : "border-border text-text-secondary hover:border-border-strong hover:bg-surface-base",
                                )}
                              >
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </Field>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2.5 px-6 py-4 ">
                <button
                  onClick={onClose}
                  className="px-4 py-2 cursor-pointer rounded-sm text-sm font-medium text-text-secondary bg-[#F5F5F5]  hover:border-border-strong transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!title.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-sm  bg-foreground text-white hover:bg-[#1a4050] transition-colors disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  <IcAdd size={16} />
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ── helpers ── */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-text-primary block mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full text-sm font-medium text-text-primary placeholder:text-text-disabled " +
  "bg-white border border-[#D4D4D4] rounded-sm px-3.5 py-2.5 outline-none transition-all " +
  "hover:border-border-strong focus:border-border-strong focus:shadow-input";
