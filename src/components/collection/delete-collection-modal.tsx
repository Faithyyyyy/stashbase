"use client";

import { useState } from "react";
import { Collection } from "@/types";
import { Button } from "../ui";

type Props = {
  open: boolean;
  collection: Collection | null;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
};

export function DeleteCollectionModal({
  open,
  collection,
  onClose,
  onDelete,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!collection) return;
    setLoading(true);
    try {
      await onDelete(collection.id);
      onClose();
    } catch {
      setLoading(false);
    }
  };

  if (!open || !collection) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-sm shadow-xl w-full max-w-sm pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 border-b border-gray-200 px-6 py-4">
          <h2 className="text-gray-900 font-semibold text-base">
            Delete collection?
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <p className="text-sm font-semibold text-gray-700 mb-2 px-6">
          Once you delete{" "}
          <span className="font-semibold text-gray-900 capitalize">
            {collection.name}
          </span>
          , it is gone forever
        </p>

        <div className="space-y-2 p-6">
          <Button
            size="md"
            onClick={handleDelete}
            disabled={loading}
            variant="danger"
            fullWidth
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
          <Button size="md" onClick={onClose} variant="secondary" fullWidth>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
