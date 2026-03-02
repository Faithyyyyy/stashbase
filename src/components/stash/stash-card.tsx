"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { StashItem } from "@/types";
// import { IcDots } from "./icons";

interface StashCardProps {
  item: StashItem;
  style?: React.CSSProperties;
}

export default function StashCard({ item, style }: StashCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      style={style}
      className="group  border-[#e7e7e7] rounded-xl shadow-card h-56.5 hover:shadow-modal transition-all duration-200 cursor-pointer overflow-hidden animate-card-in"
    >
      {/* Cover image */}
      <div className="relative aspect-16/10  h-29.5 w-full overflow-hidden bg-surface-base">
        {!imgLoaded && <div className="absolute inset-0 skeleton" />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.coverUrl}
          alt={item.title}
          onLoad={() => setImgLoaded(true)}
          className={cn(
            "w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300",
            imgLoaded ? "opacity-100" : "opacity-0",
          )}
        />
      </div>

      {/* Card body */}
      <div className="px-3 pt-4 pb-3.5">
        <p className="text-lg font-semibold text-text-primary truncate leading-tight capitalize">
          {item.title}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px] text-text-tertiary font-medium">
            {item.collection}
          </span>
          <span className="text-[11px] text-text-disabled">
            {item.addedAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10.5px] font-medium bg-tag-bg text-tag-text px-1.5 py-0.5 rounded-[4px]"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 2 && (
              <span className="text-[10.5px] text-text-disabled">
                +{item.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
