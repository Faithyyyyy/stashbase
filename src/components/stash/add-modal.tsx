"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { StashItem } from "@/types";
import { IcChevDown, IcAdd, IcX, IcCal } from "@/icons/icons";
import { useCollections } from "@/context/CollectionContext";
import { createCollection } from "@/lib/collections";
import { createStash } from "@/lib/stash";
import { NewCollectionModal } from "../collection/new-collection-modal";
import { CalendarPicker } from "./calendar-picker";
import { createPortal } from "react-dom";

interface AddModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (item: StashItem) => void;
  onBack?: () => void;
}

const STASH_TYPES = [
  { label: "Website", value: "Website" },
  // { label: "Video", value: "Video" },
  // { label: "Document", value: "Document" },
  // { label: "Note", value: "Note" },
  // { label: "Photo", value: "Photo" },
];

export default function AddModal({
  open,
  onClose,
  onSuccess,
  onBack,
}: AddModalProps) {
  const { collections, addCollection } = useCollections();

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [tag, setTag] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [newCollectionOpen, setNewCollectionOpen] = useState(false);
  const [collOpen, setCollOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [reminderDate, setReminderDate] = useState<string>("");
  const [reminderTime, setReminderTime] = useState<string>("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const timeRef = useRef<HTMLDivElement>(null);

  const collRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const [calendarPos, setCalendarPos] = useState({ top: 0, left: 0 });
  const calendarTriggerRef = useRef<HTMLButtonElement>(null);

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

  const selectedCollection = collections.find((c) => c.id === collectionId);
  const selectedTag = STASH_TYPES.find((t) => t.value === tag);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (timeRef.current && !timeRef.current.contains(e.target as Node))
        setTimeOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleAdd = async () => {
    if (!url.trim()) {
      setError("Link is required");
      return;
    }
    if (!title) {
      setError("Title is required");
      return;
    }
    if (!collectionId) {
      setWarning("Please select a collection or create one first.");
      return;
    }
    if (!tag) {
      setError("Please select type website");
      return;
    }
    if (!reminderDate && reminderTime) {
      setError("Please select a date for the reminder");
      return;
    }
    setError("");
    setWarning("");
    setLoading(true);
    // const buildReminderAt = () => {
    //   if (!reminderDate) return undefined;
    //   const [day, month, year] = reminderDate.split("/");
    //   const hour = reminderTime.includes("pm")
    //     ? (parseInt(reminderTime) % 12) + 12
    //     : parseInt(reminderTime) % 12;
    //   return `${year}-${month}-${day}T${String(hour).padStart(2, "0")}:00:00Z`;
    // };
    const buildReminderAt = () => {
      if (!reminderDate) return undefined;
      const [day, month, year] = reminderDate.split("/");

      const timeMatch = reminderTime.match(/^(\d{1,2}):(\d{2})(am|pm)$/);
      if (!timeMatch) return undefined;

      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2];
      const meridiem = timeMatch[3];

      if (meridiem === "pm" && hours !== 12) hours += 12;
      if (meridiem === "am" && hours === 12) hours = 0;

      const fullYear =
        parseInt(year) < 100 ? 2000 + parseInt(year) : parseInt(year);

      return `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${String(hours).padStart(2, "0")}:${minutes}:00.000Z`;
    };
    try {
      const res = await createStash({
        url: url.trim(),
        title: title.trim() || url.trim(),
        ...(collectionId && { collectionId }),
        ...(tag && {
          // tagName: tag as "Note" | "Website" | "Video" | "Photo" | "Document",
          tagName: tag as "Website",
        }),
        ...(reminderDate && { reminderAt: buildReminderAt() }),
      });

      const item: StashItem = {
        id: res.data.id,
        link: url.trim(),
        title: title.trim() || url.trim(),
        url: url.trim(),
        description: "",
        collection: selectedCollection?.name ?? "Uncategorised",
        type: selectedTag?.label ?? "Link",
        tags: tag ? [tag] : [],
        coverUrl: "",
        addedAt: new Date(),
      };

      setLoading(false);
      onSuccess(item);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add stash");
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 z-50 animate-fade-in backdrop-blur-xs backdrop-saturate-150"
        style={{ background: "rgba(15,15,15,0.35)" }}
        onClick={(e) => {
          if (e.target === e.currentTarget && !loading) onClose();
        }}
      >
        {/* LOADING OVERLAY */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-modal px-6 py-4 flex flex-col items-center gap-2.5 animate-slide-up">
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

        {/* MODAL */}
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
              {/* Form */}
              {collections.length === 0 ? (
                <div className="px-6 py-8 flex flex-col items-center text-center gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      No collections yet
                    </p>
                    <p className="text-xs text-text-tertiary leading-relaxed">
                      You need at least one collection before adding a stash.
                      Create a collection first from the sidebar.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 rounded-sm text-sm font-medium text-text-secondary bg-[#F5F5F5]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setNewCollectionOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-medium bg-foreground text-white hover:bg-[#1a4050] transition-colors"
                    >
                      <IcAdd size={14} />
                      Create collection
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-4 space-y-4">
                  {/* Server error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5">
                      {error}
                    </div>
                  )}

                  {/* Link */}
                  <Field label="Link">
                    <input
                      autoFocus
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        setError("");
                      }}
                      placeholder="https://"
                      className={inputCls}
                      required
                    />
                  </Field>

                  {/* Title */}
                  <Field label="Title">
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                      placeholder=""
                      className={inputCls}
                      required
                    />
                  </Field>

                  {/* Collection dropdown*/}
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
                          !collectionId && "text-text-disabled capitalize",
                        )}
                      >
                        <span className="capitalize">
                          {selectedCollection?.name ?? (
                            <span className="text-[#737373] font-normal">
                              Select Collection
                            </span>
                          )}
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
                                setWarning("");
                                setCollOpen(false);
                              }}
                              className={cn(
                                "w-full text-left capitalize px-4 py-2 text-[13px] transition-colors",
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
                  </Field>

                  {/* Tags : stash type dropdown */}
                  <Field label="Type">
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
                          !tag && "text-text-disabled",
                        )}
                      >
                        <span>
                          {selectedTag?.label ?? (
                            <span className="text-[#737373] font-normal">
                              Select type
                            </span>
                          )}
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
                  </Field>
                  {/* Reminder */}
                  <Field label="Reminder">
                    <div className="flex items-center gap-2">
                      {/* Date input */}
                      <button
                        ref={calendarTriggerRef}
                        type="button"
                        onClick={openCalendar}
                        className={cn(
                          inputCls,
                          "flex-1 flex items-center justify-between text-left",
                          !reminderDate && "text-text-disabled",
                        )}
                      >
                        <span>{reminderDate || "DD/MM/YY"}</span>
                        <IcCal size={18} />
                      </button>
                    </div>
                  </Field>
                </div>
              )}

              {/* Footer */}
              {collections.length > 0 && (
                <div className="flex items-center justify-end gap-2.5 px-6 py-4">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 cursor-pointer rounded-sm text-sm font-medium text-text-secondary bg-[#F5F5F5] hover:border-border-strong transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={
                      !url.trim() || !title || !collectionId || !tag
                      // !(reminderTime && !reminderDate)
                    }
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-sm bg-foreground text-white hover:bg-[#1a4050] transition-colors disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    <IcAdd size={16} />
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
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
            {/* backdrop to close */}
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
