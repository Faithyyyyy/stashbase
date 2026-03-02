"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import EmptyState from "@/components/stash/empty-state";
import StashGrid from "@/components/stash/stash-grid";
import AddModal from "@/components/stash/add-modal";
import Toast from "@/components/stash/Toast";
import type { NavKey, StashItem } from "@/types";
import { IcGrid, IcList } from "@/icons/icons";
import { cn } from "@/lib/utils";

export default function Home() {
  const [nav, setNav] = useState<NavKey>("home");
  const [items, setItems] = useState<StashItem[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleSuccess = (item: StashItem) => {
    setItems((prev) => [item, ...prev]);
    setModalOpen(false);
    setToast(`"${item.title}" added to stash!`);
  };

  const isEmpty = items.length === 0;

  return (
    <div className="flex h-screen bg-surface-base overflow-hidden">
      {/* Sidebar */}
      <Sidebar active={nav} onNav={setNav} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <Topbar
          section={nav}
          view={view}
          onViewChange={setView}
          onAdd={() => setModalOpen(true)}
          itemCount={items.length}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 px-9 ">
          <div className="flex w-full items-center justify-between">
            {/* Section header */}
            <div className=" mb-4">
              <h2 className="text-black text-2xl font-semibold mb-1.5 ">
                Recently stashed
              </h2>
              <span className=" text-gray">
                Explore your recently stashed documents, videos, websites etc
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "w-6 h-6 flex items-center justify-center rounded transition-all",
                  view === "grid"
                    ? "bg-surface-raised shadow-card text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary",
                )}
              >
                <IcGrid size={18} color="#0A0A0A" />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn(
                  "w-6 h-6 flex items-center justify-center rounded transition-all",
                  view === "list"
                    ? "bg-surface-raised shadow-card text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary",
                )}
              >
                <IcList size={18} color="#0A0A0A" />
              </button>
            </div>
          </div>
          {isEmpty ? (
            <EmptyState onAdd={() => setModalOpen(true)} />
          ) : (
            <div>
              <StashGrid
                items={items}
                view={view}
                onAdd={() => setModalOpen(true)}
              />
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      <AddModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Toast */}
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
