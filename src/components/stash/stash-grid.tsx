"use client";
import type { StashItem } from "@/types";
import StashCard from "./stash-card";

interface StashGridProps {
  items: StashItem[];
  view: "grid" | "list";
  onAdd: () => void;
}

export default function StashGrid({ items, view }: StashGridProps) {
  if (view === "list") {
    return (
      <div className="space-y-1.5 max-w-3xl">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="flex items-center gap-3.5 bg-surface-raised border border-border-subtle rounded-lg px-3.5 py-2.5 hover:border-border-default hover:shadow-card transition-all cursor-pointer group animate-card-in"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            {/* Thumb */}
            <div className="w-12 h-9 rounded-md overflow-hidden shrink-0 bg-surface-base ">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.coverUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-semibold text-text-primary truncate">
                {item.title}
              </p>
              <p className="text-[11px] text-text-tertiary mt-0.5">
                {item.collection} · {item.type}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              {item.tags.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="text-[10.5px] bg-tag-bg text-tag-text px-1.5 py-0.5 rounded-[4px] font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
            {/* Date */}
            <span className="text-[11px] text-text-disabled shrink-0">
              {item.addedAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(268px,1fr))] gap-4">
      {items.map((item, i) => (
        <StashCard
          key={item.id}
          item={item}
          style={{ animationDelay: `${i * 35}ms` }}
        />
      ))}
    </div>
  );
}
