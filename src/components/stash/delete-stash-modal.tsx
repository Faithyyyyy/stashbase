"use client";

import { useState } from "react";
import { IcX } from "@/icons/icons";
import { deleteStash } from "@/lib/stash";

interface Props {
  open: boolean;
  stashTitle: string;
  stashId: string;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteStashModal({
  open,
  stashTitle,
  stashId,
  onClose,
  onDelete,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteStash(stashId);
      onDelete();
    } catch {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs backdrop-saturate-150"
      style={{ background: "rgba(15,15,15,0.35)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-modal w-full max-w-sm animate-slide-up p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Delete Stash?
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-base transition-colors"
          >
            <IcX size={20} />
          </button>
        </div>

        <p className="text-sm text-text-secondary mb-6">
          Once you delete{" "}
          <span className="font-semibold capitalize text-text-primary ">
            {stashTitle},
          </span>{" "}
          it is gone forever
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-full py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-medium text-text-secondary bg-[#F5F5F5] rounded-sm hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
