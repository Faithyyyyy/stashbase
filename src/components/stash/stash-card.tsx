"use client";

import { useState } from "react";
import { Stash } from "@/types";
import {
  IcFolderOpen,
  IcImage,
  IcLink,
  IcNote,
  IcVideo,
  IcCalendar,
} from "@/icons/icons";

type Props = {
  stash: Stash;
  collectionName?: string;
  mode?: "home" | "collection";
  onView: () => void;
  onEdit?: () => void;
};

function LinkThumbnail({ url, title }: { url: string; title: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F5F0E8]">
        <ContentTypeIcon type="link" />
      </div>
    );
  }

  return (
    <img
      src={`https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`}
      alt={title}
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function ContentTypeIcon({ type }: { type: Stash["contentType"] }) {
  switch (type) {
    case "video":
      return (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C5B99A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      );
    case "document":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C5B99A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "link":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C5B99A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    default:
      return (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C5B99A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
  }
}
function StashTypeIcon({ tagName }: { tagName: string }) {
  switch (tagName) {
    case "Website":
      return <IcLink size={16} className="text-text-primary" />;
    case "Video":
      return <IcVideo size={14} className="text-text-primary" />;
    case "Document":
      return <IcFolderOpen size={14} className="text-text-primary" />;
    case "Photo":
      return <IcImage size={14} className="text-text-primary" />;
    case "Note":
      return <IcNote size={14} className="text-text-primary" />;
    default:
      return <IcFolderOpen size={14} className="text-text-primary" />;
  }
}

export function StashCard({ stash, mode = "home", onView, onEdit }: Props) {
  const [hovered, setHovered] = useState(false);
  const thumbnail = stash.metadata?.thumbnailUrl;
  const isLink = stash.contentType === "link";

  return (
    <div
      className="bg-white border  border-[#E5E5E5] rounded-xl overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-29.5 bg-[#444443] overflow-hidden shrink-0">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={stash.title}
            className="w-full h-full object-cover"
          />
        ) : isLink ? (
          <LinkThumbnail url={stash.url} title={stash.title} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ContentTypeIcon type={stash.contentType} />
          </div>
        )}

        {/* Status badge */}
        {stash.status === "processing" && (
          <div className="absolute top-2 right-2 bg-amber-100 text-amber-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
            Processing
          </div>
        )}

        {/* Hover overlay */}
        {hovered && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-3">
            <button
              onClick={onView}
              className="flex items-center gap-2 bg-white text-gray-900 text-sm font-medium px-4 py-2 rounded-sm hover:bg-gray-50 transition-colors shadow-sm"
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
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              View
            </button>

            {/* Only show Edit on collection pages */}
            {mode === "collection" && onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center gap-2 bg-white text-gray-900 text-sm font-medium px-4 py-2 rounded-sm hover:bg-gray-50 transition-colors shadow-sm"
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
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 h-27.5">
        <h3 className="font-semibold text-text-primary capitalize text-base mb-8 truncate">
          {stash.title}
        </h3>
        <div className="flex-wrap flex gap-1.5 items-center">
          <div className="flex items-center gap-2 ">
            {stash.Tags.length > 0 && (
              <StashTypeIcon tagName={stash.Tags[0].name} />
            )}
            {stash.Tags.length > 0 && (
              <>
                <span className="text-sm text-text-primary capitalize font-medium">
                  {/* {stash.Tags[0].name} */}
                  {stash.contentType}
                </span>
              </>
            )}
          </div>
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "9999px",
              backgroundColor: "#D4D4D4",
            }}
          />
          <div className="flex items-center gap-2 ">
            <IcCalendar size={16} className="text-text-primary " />
            <span className="text-sm text-text-primary font-medium">
              {new Date(stash.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
