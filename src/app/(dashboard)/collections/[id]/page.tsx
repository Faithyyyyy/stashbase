"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Stash } from "@/types";
import { StashCard } from "@/components/stash/stash-card";
import { EditStashModal } from "@/components/stash/edit-stash-modal";
import { useCollections } from "@/context/CollectionContext";
import {
  getCollectionWithStashes,
  CollectionWithStashes,
} from "@/lib/collections";
import EmptyStateCollection from "@/components/collection/empty-state-collection";
import StashCardSkeleton from "@/components/stash/stash-skeleton";

export default function CollectionPage() {
  const { id } = useParams<{ id: string }>();
  const { collections } = useCollections();

  const [data, setData] = useState<CollectionWithStashes | null>(null);
  const [loading, setLoading] = useState(true);
  const [editStash, setEditStash] = useState<Stash | null>(null);

  const collection = collections.find((c) => c.id === id);

  useEffect(() => {
    if (!id) return;
    getCollectionWithStashes(id)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(268px,1fr))] gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <StashCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const stashes = data?.Stashes ?? [];

  return (
    <div>
      {stashes.length === 0 ? (
        <EmptyStateCollection collectionName={collection?.name} />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(268px,1fr))] gap-4">
          {stashes.map((stash) => (
            <StashCard
              key={stash.id}
              stash={stash}
              collectionName={collection?.name}
              onView={() => window.open(stash.url, "_blank")}
              onEdit={() => setEditStash(stash as unknown as Stash)}
              mode="collection"
            />
          ))}
        </div>
      )}

      <EditStashModal
        key={editStash?.id ?? "none"}
        open={!!editStash}
        stash={editStash}
        defaultCollectionId={id}
        collections={collections}
        onClose={() => setEditStash(null)}
        onSave={async () => {
          setEditStash(null);
          if (!id) return;
          getCollectionWithStashes(id)
            .then(setData)
            .catch(() => setData(null));
        }}
      />
    </div>
  );
}
