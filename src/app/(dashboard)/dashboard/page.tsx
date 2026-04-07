"use client";

import { useState, useEffect } from "react";
import EmptyState from "@/components/stash/empty-state";
import StashGrid from "@/components/stash/stash-grid";
import type { Stash } from "@/types";
import { IcGrid, IcList } from "@/icons/icons";
import { cn } from "@/lib/utils";
import { useStashRefresh } from "@/context/StashRefreshContext";
import { getStashes } from "@/lib/stash";
import { useAddStash } from "@/context/AddStashContext";
import Toast from "@/components/stash/Toast";
import StashCardSkeleton from "@/components/stash/stash-skeleton";
import { useCollections } from "@/context/CollectionContext";
import { EditStashModal } from "@/components/stash/edit-stash-modal";
import { getStashesByType } from "@/lib/stash";
import { useParams } from "next/navigation";

export default function Home() {
  const { refreshKey } = useStashRefresh();
  const { openAddModal, toastMessage, setToastMessage } = useAddStash();
  const [stashes, setStashes] = useState<Stash[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [editStash, setEditStash] = useState<Stash | null>(null);
  const { collections } = useCollections();
  const { stashType } = useParams<{ stashType: string }>();
  useEffect(() => {
    Promise.resolve().then(() => {
      setLoading(true);
      getStashes()
        .then((data) => setStashes(data.allStashes))
        .catch(() => setStashes([]))
        .finally(() => setLoading(false));
    });
  }, [refreshKey]);
  // useEffect(() => {
  //   if (!stashType) return;
  //   getStashesByType(stashType)
  //     .then((data) => {
  //       setStashes(data.allStashes);
  //     })
  //     .catch((err) => {
  //       console.log("error:", err);
  //       setStashes([]);
  //     })
  //     .finally(() => setLoading(false));
  // }, [stashType]);

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between mb-4">
        <div className="mb-5">
          <h2 className="text-black text-2xl font-semibold mb-1.5">
            Recently stashed
          </h2>
          <span className="text-gray">
            Explore your recently stashed content..
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "w-6 h-6 flex items-center justify-center cursor-pointer rounded transition-all",
              view === "grid"
                ? "bg-surface-raised  text-text-primary"
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
      {/* toast */}
      <Toast
        message={toastMessage}
        onDismiss={() => setToastMessage(null)}
        inline={stashes.length > 0}
      />
      {/* toast */}
      {loading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(268px,1fr))] gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <StashCardSkeleton key={i} />
          ))}
        </div>
      ) : stashes.length === 0 ? (
        <EmptyState onAdd={openAddModal} />
      ) : (
        <StashGrid
          items={stashes}
          view={view}
          mode="collection"
          onEdit={(stash) => setEditStash(stash)}
        />
      )}

      <EditStashModal
        key={editStash?.id ?? "none"}
        open={!!editStash}
        stash={editStash!}
        collections={collections}
        onClose={() => setEditStash(null)}
        onSave={async () => {
          setEditStash(null);
          getStashesByType(stashType)
            .then((data) => setStashes(data.allStashes))
            .catch(() => {});
        }}
      />
    </div>
  );
}
