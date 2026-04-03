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
import StashPreviewModal from "./stash-preview-modal";
import edit from "@/icons/edit.svg";
import del from "@/icons/delete.svg";
import Image from "next/image";
import DeleteStashModal from "./delete-stash-modal";
type Props = {
  stash: Stash;
  collectionName?: string;
  mode?: "home" | "collection";
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
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
      return <IcVideo size={16} className="text-text-primary" />;
    case "document":
      return <IcFolderOpen size={16} className="text-text-primary" />;
    case "link":
      return <IcLink size={16} className="text-text-primary" />;
    case "photo":
      return <IcImage size={16} className="text-text-primary" />;
    case "note":
      return <IcNote size={16} className="text-text-primary" />;
    default:
      return <IcFolderOpen size={16} className="text-text-primary" />;
  }
}

export function StashCard({
  stash,
  mode = "home",
  onView,
  onEdit,
  onDelete,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [previewStash, setPreviewStash] = useState<Stash | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const thumbnail =
    stash.metadata?.thumbnailUrl ??
    stash.metadata?.thumbnail ??
    stash.metadata?.cloudinaryUrl;
  const isLink = stash.contentType === "link";

  function handleView(stash: Stash, setPreviewStash: (s: Stash) => void) {
    switch (stash.contentType) {
      case "link":
        window.open(stash.url, "_blank");
        break;
      // case "document":
      //   const pdfUrl = stash.metadata?.cloudinaryUrl?.replace(
      //     "/raw/upload/",
      //     "/image/upload/fl_attachment:false/",
      //   );
      //   window.open(pdfUrl ?? stash.url, "_blank");
      //   break;
      case "document": {
        const rawUrl = stash.metadata?.cloudinaryUrl ?? stash.url;
        const isPdf =
          rawUrl.toLowerCase().includes(".pdf") ||
          stash.title?.toLowerCase().includes(".pdf");

        if (isPdf) {
          window.open(
            `https://docs.google.com/viewer?url=${encodeURIComponent(rawUrl)}`,
            "_blank",
          );
        } else {
          // PowerPoint, Excel, Word → force download
          const downloadUrl = rawUrl.includes("cloudinary.com")
            ? rawUrl.replace("/raw/upload/", "/raw/upload/fl_attachment/")
            : rawUrl;
          window.open(downloadUrl, "_blank");
        }
        break;
      }
      case "photo":
      case "video":
      case "note":
        setPreviewStash(stash);
        break;
      default:
        window.open(stash.url, "_blank");
    }
  }
  const handleViewClick = () => {
    if (onView) {
      onView();
    } else {
      handleView(stash, setPreviewStash);
    }
  };

  return (
    <>
      <div
        className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden cursor-pointer"
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

          {stash.status === "processing" && (
            <div className="absolute top-2 right-2 bg-amber-100 text-amber-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
              Processing
            </div>
          )}

          {hovered && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-3">
              <button
                // onClick={handleViewClick}
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(stash, setPreviewStash);
                }}
                className="flex cursor-pointer items-center gap-2 bg-white text-gray-900 text-sm font-medium px-4 py-2 rounded-sm hover:bg-gray-50 transition-colors shadow-sm"
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
              <button
                onClick={onEdit}
                className="flex items-center gap-2 bg-white text-gray-900 text-sm font-medium px-4 py-2 rounded-sm hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Image src={edit} alt="edit icon" height={18} width={18} />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteOpen(true);
                }}
                className="flex items-center gap-2 bg-[#E7000B] text-sm font-medium px-4 py-2 rounded-sm  transition-colors shadow-sm"
              >
                <Image src={del} alt="edit icon" height={18} width={18} />
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 h-27.5">
          <h3 className="font-semibold text-text-primary capitalize text-base mb-8 truncate">
            {stash.title}
          </h3>
          <div className="flex-wrap flex gap-1.5 items-center">
            <div className="flex items-center gap-2">
              {stash.Tags.length > 0 && (
                <ContentTypeIcon type={stash.contentType} />
              )}
              {stash.Tags.length > 0 && (
                <span className="text-sm text-text-primary capitalize font-medium">
                  {stash.contentType}
                </span>
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
            <div className="flex items-center gap-2">
              <IcCalendar size={16} className="text-text-primary" />
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

      <StashPreviewModal
        stash={previewStash}
        onClose={() => setPreviewStash(null)}
      />
      <DeleteStashModal
        open={deleteOpen}
        stashTitle={stash.title}
        stashId={stash.id}
        onClose={() => setDeleteOpen(false)}
        onDelete={() => {
          setDeleteOpen(false);
          onDelete?.();
        }}
      />
    </>
  );
}
