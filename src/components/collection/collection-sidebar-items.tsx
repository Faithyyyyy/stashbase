"use client";

import { useState } from "react";
import { Collection } from "@/types";
import { useRouter } from "next/navigation";
import { IcFolderOpen, IcFolderFilledOpen } from "@/icons/icons";

type Props = {
  collection: Collection;
  isActive: boolean;
  onDeleteClick: (collection: Collection) => void;
};

export function CollectionSidebarItem({
  collection,
  isActive,
  onDeleteClick,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  return (
    <div
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={() => router.push(`/collections/${collection.id}`)}
        className={`w-full flex items-center gap-3 px-2.5 mb-3 py-2.5 rounded-sm text-foreground transition-all duration-100
    ${
      isActive
        ? "bg-background font-medium"
        : "text-text-secondary hover:bg-background"
    }`}
      >
        {isActive ? (
          <IcFolderFilledOpen size={18} />
        ) : (
          <IcFolderOpen size={18} />
        )}

        <span className="flex-1 text-left truncate capitalize">
          {collection.name}
        </span>
      </button>

      {/* Hover delete button */}
      {hovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick(collection);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <svg
            width="13"
            height="13"
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
        </button>
      )}
    </div>
  );
}
