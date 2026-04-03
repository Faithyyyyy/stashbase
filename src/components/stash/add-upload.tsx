"use client";

import { useEffect, useRef, useState } from "react";
import { buildReminderAt, cn } from "@/lib/utils";
import { IcChevDown, IcX, IcUpload } from "@/icons/icons";
import { useCollections } from "@/context/CollectionContext";
import { createCollection } from "@/lib/collections";
import { createStashUpload } from "@/lib/stash";
import { NewCollectionModal } from "../collection/new-collection-modal";
import { createPortal } from "react-dom";
import { CalendarPicker } from "./calendar-picker";
import { IcCal } from "@/icons/icons";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onBack?: () => void;
}

export default function UploadModal({
  open,
  onClose,
  onSuccess,
  onBack,
}: Props) {
  const { collections, addCollection } = useCollections();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [collOpen, setCollOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newCollectionOpen, setNewCollectionOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tag, setTag] = useState<string>("");
  const [tagsOpen, setTagsOpen] = useState(false);
  const tagsRef = useRef<HTMLDivElement>(null);
  const [warning, setWarning] = useState("");
  const collRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const STASH_TYPES = [
    { label: "Document", value: "Document" },
    { label: "Photo", value: "Photo" },
    { label: "Video", value: "Video" },
    { label: "Note", value: "Note" },
  ];
  const selectedTag = STASH_TYPES.find((t) => t.value === tag);
  const [reminderDate, setReminderDate] = useState<string>("");
  const [reminderTime, setReminderTime] = useState<string>("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarPos, setCalendarPos] = useState({ top: 0, left: 0 });
  const [timeOpen, setTimeOpen] = useState(false);
  const calendarTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      Promise.resolve().then(() => {
        setFile(null);
        setTitle("");
        setCollectionId("");
        setError("");
        setCollOpen(false);
        setTag("");
        setTagsOpen(false);
        //
        setReminderDate("");
        setReminderTime("");
        setCalendarOpen(false);
        setTimeOpen(false);
      });
    }
  }, [open]);
  const openCalendar = () => {
    if (!calendarTriggerRef.current) return;
    const rect = calendarTriggerRef.current.getBoundingClientRect();
    const calendarHeight = 320;
    const spaceBelow = window.innerHeight - rect.bottom;
    const top =
      spaceBelow >= calendarHeight
        ? rect.bottom + 4
        : rect.top - calendarHeight - 4;
    setCalendarPos({ top, left: rect.left });
    setCalendarOpen(true);
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

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

  const selectedCollection = collections.find((c) => c.id === collectionId);

  const handleFile = (f: File) => {
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleAdd = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }
    if (!collectionId) {
      setWarning("Please select a collection or create one first.");
      return;
    }
    setError("");
    setWarning("");
    setLoading(true);
    try {
      await createStashUpload({
        file,
        title: title || file.name,
        ...(tag && { tagName: tag }),
        collectionId,
        ...(reminderDate && {
          reminderAt: buildReminderAt(reminderDate, reminderTime),
        }),
      });
      setLoading(false);
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload");
      setLoading(false);
    }
  };
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 animate-fade-in backdrop-blur-xs backdrop-saturate-150 flex items-center justify-center p-4"
        style={{ background: "rgba(15,15,15,0.35)" }}
        onClick={(e) => {
          if (e.target === e.currentTarget && !loading) onClose();
        }}
      >
        <div
          className="bg-white rounded-2xl shadow-modal w-full max-w-120 animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center border-b border-border justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-surface-base transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
              )}
              <h2 className="text-[18px] font-semibold text-black">
                Add to stash
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-surface-base transition-colors"
            >
              <IcX size={24} />
            </button>
          </div>

          <div className="px-6 py-4 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}
            {warning && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-lg px-4 py-2.5 flex items-center gap-2">
                {warning}
                <button
                  onClick={() => setNewCollectionOpen(true)}
                  className="ml-auto text-yellow-800 font-semibold underline underline-offset-2 hover:text-yellow-900 whitespace-nowrap"
                >
                  Create one
                </button>
              </div>
            )}

            {/* File dropzone */}
            {!file ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border border-[#D4D4D4] rounded-md py-10 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
                  dragging
                    ? "border-foreground bg-surface-base"
                    : "border-border hover:border-border-strong hover:bg-surface-base",
                )}
              >
                <IcUpload size={28} />
                <p className="text-sm font-medium text-text-secondary">
                  Select to add images, documents, videos
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 border border-border rounded-xl px-4 py-3">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-text-tertiary shrink-0"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {(file.size / 1024 / 1024).toFixed(1)}MB
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  Replace
                </button>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="text-sm font-semibold text-text-primary block mb-1.5">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder=""
                className={inputCls}
              />
            </div>

            {/* Collection */}
            <div>
              <label className="text-sm font-semibold text-text-primary block mb-1.5">
                Collection
              </label>
              <div ref={collRef} className="relative">
                <button
                  type="button"
                  onClick={() => setCollOpen((o) => !o)}
                  className={cn(
                    inputCls,
                    "flex items-center justify-between text-left w-full",
                  )}
                >
                  <span
                    className={
                      selectedCollection
                        ? "text-text-primary"
                        : "text-[#737373] font-normal"
                    }
                  >
                    {selectedCollection?.name ?? "Select collection"}
                  </span>
                  <IcChevDown
                    size={14}
                    className="text-text-tertiary shrink-0"
                  />
                </button>
                {collOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-modal z-10 py-1 animate-slide-down overflow-hidden max-h-48 overflow-y-auto">
                    {collections.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setCollectionId(c.id);
                          setCollOpen(false);
                          setWarning("");
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 capitalize text-[13px] transition-colors",
                          collectionId === c.id
                            ? "bg-surface-base text-text-primary font-medium"
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
            {/* Tags */}
            <div>
              <label className="text-sm font-semibold text-text-primary block mb-1.5">
                Type
              </label>
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
                  <span
                    className={
                      tag ? "text-text-primary" : "text-[#737373] font-normal"
                    }
                  >
                    {selectedTag?.label ?? "Select type"}
                  </span>
                  <IcChevDown
                    size={14}
                    className="text-text-tertiary shrink-0"
                  />
                </button>
                {tagsOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-modal z-10 py-1 animate-slide-down overflow-hidden max-h-48 overflow-y-auto">
                    {STASH_TYPES.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => {
                          setTag(type.value);
                          setTagsOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-[13px] transition-colors",
                          tag === type.value
                            ? "bg-surface-base text-text-primary font-medium"
                            : "text-text-secondary hover:bg-surface-base",
                        )}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Reminder */}
            <div>
              <label className="text-sm font-semibold text-text-primary block mb-1.5">
                Reminder
              </label>
              <button
                ref={calendarTriggerRef}
                type="button"
                onClick={openCalendar}
                className={cn(
                  inputCls,
                  "flex items-center justify-between text-left w-full",
                  !reminderDate && "text-text-disabled",
                )}
              >
                <span>{reminderDate || "DD/MM/YY"}</span>
                <IcCal size={18} />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 px-6 py-4">
            <button
              onClick={onClose}
              className="px-4 py-2 cursor-pointer rounded-sm text-sm font-medium text-text-secondary bg-[#F5F5F5]"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!file || loading}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-sm bg-foreground text-white hover:bg-[#1a4050] transition-colors disabled:cursor-not-allowed"
            >
              {loading ? "Uploading..." : "+ Add"}
            </button>
          </div>
        </div>
      </div>

      <NewCollectionModal
        open={newCollectionOpen}
        onClose={() => setNewCollectionOpen(false)}
        onCreate={async (name) => {
          const newCollection = await createCollection(name);
          addCollection(newCollection);
          setCollectionId(newCollection.id);
          setNewCollectionOpen(false);
        }}
      />
      {calendarOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setCalendarOpen(false)}
            />
            <div
              className="fixed z-[9999] bg-white rounded-xl shadow-modal border border-border"
              style={{ top: calendarPos.top, left: calendarPos.left }}
              onClick={(e) => e.stopPropagation()}
            >
              <CalendarPicker
                value={reminderDate}
                onSelect={(date) => setReminderDate(date)}
                onClose={() => setCalendarOpen(false)}
                reminderTime={reminderTime}
                onTimeChange={(t) => setReminderTime(t)}
                timeOpen={timeOpen}
                onTimeToggle={() => setTimeOpen((o) => !o)}
              />
            </div>
          </>,
          document.body,
        )}
    </>
  );
}

const inputCls =
  "w-full text-sm font-medium text-text-primary placeholder:text-text-disabled " +
  "bg-white border border-[#D4D4D4] rounded-sm px-3.5 py-2.5 outline-none transition-all " +
  "hover:border-border-strong focus:border-border-strong focus:shadow-input";
