"use client";

import { IcEyeClosed, IcEyeOpened, IcTransfer } from "@/icons/icons";
import { useState, useRef, useEffect } from "react";
import { useCollections } from "@/context/CollectionContext";

type Props = {
  onNewCollection: () => void;
  onDeleteCollection: () => void;
  onHideCollections: () => void;
  collectionsVisible: boolean;
};

export function CollectionsMenu({
  onNewCollection,
  onHideCollections,
  collectionsVisible,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { collections, setCollections } = useCollections();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSortByName = () => {
    const sorted = [...collections].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    setCollections(sorted);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1 rounded hover:bg-gray-100 transition-colors text-gray hover:text-gray-600"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-sm shadow-lg z-50 overflow-hidden">
          {/* New collection */}
          <button
            onClick={() => {
              onNewCollection();
              setOpen(false);
            }}
            className="w-full flex items-center font-medium gap-2.5 px-2 py-2.5 text-sm text-[#737373] hover:bg-gray-50 transition-colors"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New collection
          </button>

          {/* Sort by name */}
          <button
            onClick={handleSortByName}
            className="w-full flex items-center font-medium gap-2.5 px-2 py-2.5 text-sm text-[#737373] hover:bg-gray-50 transition-colors"
          >
            <IcTransfer style={{ transform: "rotate(90deg)" }} />
            Sort by name
          </button>

          {/* Hide / Show collections */}
          <button
            onClick={() => {
              onHideCollections();
              setOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-2 py-2.5 text-sm text-[#737373] font-medium hover:bg-gray-50 transition-colors"
          >
            {collectionsVisible ? <IcEyeClosed /> : <IcEyeOpened />}
            {collectionsVisible ? "Hide collections" : "Show collections"}
          </button>

          {/* Delete */}
          {/* <button
            onClick={() => {
              onDeleteCollection();
              setOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-2 py-2.5 font-medium text-sm text-gray hover:bg-gray-50 transition-colors"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
            Delete collections
          </button> */}
        </div>
      )}
    </div>
  );
}
