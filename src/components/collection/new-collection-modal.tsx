"use client";

import { useState } from "react";
import { Button } from "../ui";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
};

export function NewCollectionModal({ open, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Collection name is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onCreate(name.trim());
      setName("");
      onClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to create collection",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setError("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-xs backdrop-saturate-150"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-sm shadow-xl w-full max-w-137.25  pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 border-b border-gray-200 px-6 py-4">
          <h2 className="text-gray-900 font-semibold text-base">
            New collection
          </h2>
          <button
            onClick={handleClose}
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

        {/* Input */}
        <div className=" px-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Name of collection
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="e.g. Design articles"
            autoFocus
            className={`w-full border rounded-sm px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all
              ${
                error
                  ? "border-red-400 focus:ring-2 focus:ring-red-100"
                  : "border-gray-300"
              }`}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6">
          <Button size="md" onClick={handleClose} variant="secondary">
            Cancel
          </Button>
          <Button size="md" onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
