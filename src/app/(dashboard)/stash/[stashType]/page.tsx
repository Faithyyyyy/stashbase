"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Stash } from "@/types";
import { getStashesByType } from "@/lib/stash";
import StashCardSkeleton from "@/components/stash/stash-skeleton";
import { useAddStash } from "@/context/AddStashContext";
import EmptyState from "@/components/stash/empty-state";
import { IcGrid, IcList } from "@/icons/icons";
import { cn } from "@/lib/utils";
import StashGrid from "@/components/stash/stash-grid";
export default function StashTypePage() {
  const { stashType } = useParams<{ stashType: string }>();
  const { openAddModal } = useAddStash();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [stashes, setStashes] = useState<Stash[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!stashType) return;
    getStashesByType(stashType)
      .then((data) => {
        setStashes(data.allStashes);
      })
      .catch((err) => {
        console.log("error:", err);
        setStashes([]);
      })
      .finally(() => setLoading(false));
  }, [stashType]);

  if (loading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(268px,1fr))] gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <StashCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (stashes.length === 0) {
    return <EmptyState onAdd={openAddModal} />;
  }

  return (
    <div>
      <div className="flex w-full items-center justify-between mb-7">
        <div className="mb-5"></div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "w-6 h-6 flex items-center justify-center cursor-pointer rounded transition-all",
              view === "grid"
                ? "bg-surface-raised text-text-primary"
                : "text-text-tertiary hover:text-text-secondary",
            )}
          >
            <IcGrid size={18} color="#0A0A0A" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "w-6 h-6 flex items-center cursor-pointer justify-center rounded transition-all",
              view === "list"
                ? "bg-surface-raised text-text-primary"
                : "text-text-tertiary hover:text-text-secondary",
            )}
          >
            <IcList size={18} color="#0A0A0A" />
          </button>
        </div>
      </div>

      <StashGrid items={stashes} view={view} mode="home" />
    </div>
  );
}
