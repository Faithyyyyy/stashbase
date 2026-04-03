"use client";
import type { Stash } from "@/types";
import { StashCard } from "./stash-card";
import { useParams } from "next/navigation";
import {
  IcFolderOpen,
  IcImage,
  IcLink,
  IcNote,
  IcVideo,
  IcCalendar,
} from "@/icons/icons";
import del from "@/icons/delete.svg";
import { useState } from "react";
import StashPreviewModal from "./stash-preview-modal";
import { EditStashModal } from "./edit-stash-modal";
import { useCollections } from "@/context/CollectionContext";
import edit from "@/icons/edit.svg";
import Image from "next/image";
import DeleteStashModal from "./delete-stash-modal";
import { useStashRefresh } from "@/context/StashRefreshContext";
interface StashGridProps {
  items: Stash[];
  view: "grid" | "list";
  mode?: "home" | "collection";
  onEdit?: (stash: Stash) => void;
}
function ContentTypeIcon({ type }: { type: Stash["contentType"] }) {
  switch (type) {
    case "video":
      return <IcVideo size={13} className="text-text-primary" />;
    case "document":
      return <IcFolderOpen size={13} className="text-text-primary" />;
    case "link":
      return <IcLink size={13} className="text-text-primary" />;
    case "photo":
      return <IcImage size={13} className="text-text-primary" />;
    case "note":
      return <IcNote size={13} className="text-text-primary" />;
    default:
      return <IcFolderOpen size={13} className="text-text-primary" />;
  }
}

export default function StashGrid({
  items,
  view,
  mode = "home",
  onEdit,
}: StashGridProps) {
  const { id } = useParams<{ id: string }>();
  const [previewStash, setPreviewStash] = useState<Stash | null>(null);
  const [editStash, setEditStash] = useState<Stash | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteStash, setDeleteStash] = useState<Stash | null>(null);
  const { collections } = useCollections();
  const { triggerRefresh } = useStashRefresh();
  const handleView = (item: Stash) => {
    switch (item.contentType) {
      case "link":
        window.open(item.url, "_blank");
        break;
      case "document": {
        const rawUrl = item.metadata?.cloudinaryUrl ?? item.url;
        const isPdf =
          rawUrl.toLowerCase().includes(".pdf") ||
          item.title?.toLowerCase().includes(".pdf");

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
        setPreviewStash(item);
        break;
      default:
        window.open(item.url, "_blank");
    }
  };

  if (view === "list") {
    return (
      <div className="space-y-2 w-full">
        {items.map((item, i) => {
          const thumbnail =
            item.metadata?.thumbnailUrl ?? item.metadata?.thumbnail;
          const isLink = item.contentType === "link";

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 w-full bg-white border-b border-[#D4D4D4]  px-4 py-3  transition-all cursor-pointer group animate-card-in"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-sm overflow-hidden shrink-0 bg-[#F5F0E8]">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : isLink ? (
                  <img
                    src={`https://api.microlink.io/?url=${encodeURIComponent(item.url)}&screenshot=true&meta=false&embed=screenshot.url`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C5B99A"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Title + meta */}
              <div className="flex-1 min-w-0">
                <p className="text-lg mb-6 font-semibold capitalize text-[#404040] truncate">
                  {item.title}
                </p>
                <p className="text-xs text-text-tertiary font-medium flex items-center capitalize mt-1">
                  <span className="flex items-center gap-1">
                    {item.Tags.length > 0 && (
                      // <StashTypeIcon tagName={stash.Tags[0].name} />
                      <ContentTypeIcon type={item.contentType} />
                    )}
                    <span className="text-xs ">
                      {item.contentType ?? "Uncategorised"}
                    </span>
                  </span>
                  <div className="w-1 h-1 rounded-full bg-[#D4D4D4] mx-2" />
                  <span className="flex items-center gap-1">
                    <IcCalendar size={13} className="text-text-primary " />
                    <span className="text-xs text-text-primary">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </span>
                </p>
              </div>

              {/* View + Edit buttons — visible on hover */}
              <div className="flex items-center gap-2  transition-opacity shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(item);
                  }}
                  className="flex items-center gap-1.5 text-xs font-medium text-text-secondary bg-surface-base border border-border px-3 py-1.5 rounded-sm hover:border-border-strong transition-colors"
                >
                  <svg
                    width="12"
                    height="12"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(item);
                  }}
                  className="flex items-center gap-1.5 text-xs font-medium text-text-secondary bg-surface-base border border-border px-3 py-1.5 rounded-sm hover:border-border-strong transition-colors"
                >
                  <Image src={edit} alt="edit icon" height={14} width={14} />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteStash(item);
                    setDeleteOpen(true);
                  }}
                  className="flex items-center gap-2 bg-[#E7000B] text-sm font-medium px-3 py-1.5  rounded-sm  transition-colors shadow-sm"
                >
                  <Image src={del} alt="edit icon" height={18} width={18} />
                </button>
              </div>
            </div>
          );
        })}
        <StashPreviewModal
          stash={previewStash}
          onClose={() => setPreviewStash(null)}
        />
        <EditStashModal
          key={editStash?.id ?? "none"}
          open={!!editStash}
          stash={editStash}
          defaultCollectionId={id}
          collections={collections}
          onClose={() => setEditStash(null)}
          onSave={async () => {
            setEditStash(null);
          }}
        />
        <DeleteStashModal
          open={deleteOpen}
          stashTitle={deleteStash?.title ?? ""}
          stashId={deleteStash?.id ?? ""}
          onClose={() => {
            setDeleteOpen(false);
            setDeleteStash(null);
          }}
          onDelete={() => {
            setDeleteOpen(false);
            setDeleteStash(null);
            triggerRefresh();
          }}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(268px,1fr))] gap-4">
      {items.map((item, i) => (
        <StashCard
          key={item.id}
          stash={item}
          collectionName={item.Collections?.[0]?.name}
          onView={() => window.open(item.url, "_blank")}
          onEdit={() => setEditStash(item as unknown as Stash)}
          mode={mode}
          // style={{ animationDelay: `${i * 35}ms` }}
        />
      ))}
      <EditStashModal
        key={editStash?.id ?? "none"}
        open={!!editStash}
        stash={editStash}
        defaultCollectionId={id}
        collections={collections}
        onClose={() => setEditStash(null)}
        onSave={async () => {
          setEditStash(null);
        }}
      />
    </div>
  );
}
