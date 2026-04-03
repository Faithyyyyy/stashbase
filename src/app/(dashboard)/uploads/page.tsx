"use client";

import { useState, useEffect } from "react";
import { Stash } from "@/types";
import { getUploads } from "@/lib/stash";
import StashGrid from "@/components/stash/stash-grid";
import StashCardSkeleton from "@/components/stash/stash-skeleton";
import EmptyState from "@/components/stash/empty-state";
import { useAddStash } from "@/context/AddStashContext";
import { useStashRefresh } from "@/context/StashRefreshContext";
import { IcGrid, IcList } from "@/icons/icons";
import { cn } from "@/lib/utils";

export default function UploadsPage() {
  const { openAddModal } = useAddStash();
  const { refreshKey } = useStashRefresh();
  const [stashes, setStashes] = useState<Stash[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");

  // useEffect(() => {
  //   getUploads()
  //     .then((data) => setStashes(data))
  //     .catch(() => setStashes([]))
  //     .finally(() => setLoading(false));
  // }, [refreshKey]);
  useEffect(() => {
    Promise.resolve().then(() => {
      setLoading(true);
      getUploads()
        .then((data) => setStashes(data))
        .catch(() => setStashes([]))
        .finally(() => setLoading(false));
    });
  }, [refreshKey]);

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between mb-4">
        <div className="mb-5">
          <h2 className="text-black text-2xl font-semibold mb-1.5">Uploads</h2>
          <span className="text-gray">
            All your uploaded documents, videos, photos and notes
          </span>
        </div>
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
              "w-6 h-6 flex items-center justify-center cursor-pointer rounded transition-all",
              view === "list"
                ? "bg-surface-raised text-text-primary"
                : "text-text-tertiary hover:text-text-secondary",
            )}
          >
            <IcList size={18} color="#0A0A0A" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(268px,1fr))] gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <StashCardSkeleton key={i} />
          ))}
        </div>
      ) : stashes.length === 0 ? (
        <EmptyState onAdd={openAddModal} />
      ) : (
        <StashGrid items={stashes} view={view} />
      )}
    </div>
  );
}
