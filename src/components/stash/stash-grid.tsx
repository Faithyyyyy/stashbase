"use client";
import type { Stash } from "@/types";
import { StashCard } from "./stash-card";
import { it } from "node:test";

interface StashGridProps {
  items: Stash[];
  view: "grid" | "list";
  mode?: "home" | "collection";
  onEdit?: (stash: Stash) => void;
}

export default function StashGrid({
  items,
  view,
  mode = "home",
}: StashGridProps) {
  if (view === "list") {
    return (
      <div className="space-y-2 w-full">
        {items.map((item, i) => {
          const thumbnail =
            item.metadata?.microlinkRaw?.image?.url ??
            item.metadata?.thumbnail ??
            item.metadata?.thumbnailUrl;

          const isLink = item.contentType === "link";

          return (
            <div
              key={item.id}
              className="flex items-center gap-3.5 w-full bg-white border  border-[#E5E5E5]  rounded-lg px-6 py-8 hover:border-border-default hover:shadow-card transition-all cursor-pointer group animate-card-in"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="w-12 h-9 rounded-md overflow-hidden shrink-0 bg-[#F5F0E8]">
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
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold capitalize text-text-primary truncate">
                  {item.title}
                </p>
                <p className="text-xs text-text-primary font-medium flex items-center capitalize mt-1.5">
                  {item.Collections?.[0]?.name ?? "Uncategorised"}{" "}
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "9999px",
                      backgroundColor: "#D4D4D4",
                      marginInline: "6px",
                    }}
                  />
                  {item.contentType}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                {item.Tags.slice(0, 2).map((t) => (
                  <span
                    key={t.id}
                    className="text-[10.5px] bg-tag-bg text-tag-text px-1.5 py-0.5 rounded-[4px] font-medium"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
              <span className="text-[11px] text-text-disabled shrink-0">
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          );
        })}
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
          onEdit={() => {}}
          mode={mode}
          // style={{ animationDelay: `${i * 35}ms` }}
        />
      ))}
    </div>
  );
}
