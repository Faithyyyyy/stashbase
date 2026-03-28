"use client";
import { cn } from "@/lib/utils";
import type { NavKey } from "@/types";
import {
  IcHomeline,
  IcUploads,
  IcChevRight,
  IcBookmarks,
  IcBookmarksFilled,
  IcHomeFilled,
} from "@/icons/icons";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { CollectionsMenu } from "@/components/collection/collection-dropdown";
import { CollectionSidebarItem } from "@/components/collection/collection-sidebar-items";
import { NewCollectionModal } from "@/components/collection/new-collection-modal";
import { DeleteCollectionModal } from "@/components/collection/delete-collection-modal";
import { useCollections } from "@/context/CollectionContext";
import { Collection } from "@/types";
import { createCollection, deleteCollection } from "@/lib/collections";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

type Props = {
  active: NavKey | "none";
  onNav: (k: NavKey) => void;
};

const NAV: {
  key: NavKey;
  label: string;
  Icon: React.ComponentType<{ size?: number }>;
  IconFilled: React.ComponentType<{ size?: number }>;
}[] = [
  { key: "home", label: "Home", Icon: IcHomeline, IconFilled: IcHomeFilled },
  {
    key: "stash",
    label: "Stash",
    Icon: IcBookmarks,
    IconFilled: IcBookmarksFilled,
  },
  { key: "uploads", label: "Uploads", Icon: IcUploads, IconFilled: IcUploads },
];

export default function Sidebar({ active, onNav }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const {
    collections,
    addCollection,
    removeCollection,
    collectionsVisible,
    toggleCollectionsVisible,
  } = useCollections();
  const [newCollectionOpen, setNewCollectionOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);
  const handleCreate = async (name: string) => {
    const newCollection = await createCollection(name);
    addCollection(newCollection);
  };

  const handleDelete = async (id: string) => {
    await deleteCollection(id);
    removeCollection(id);
    if (pathname.includes(id)) router.push("/dashboard");
  };

  const initials = user?.displayName
    ? user.displayName
        .trim()
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <aside className="w-61.75  relative shrink-0 h-full py-6 px-6 bg-surface-raised border-r border-[#E5E5E5] flex flex-col">
      {/* Logo row */}
      <div className="h-11 flex items-center   shrink-0">
        <span className="text-lg font-bold text-primary tracking-[-0.015em]">
          StashBase
        </span>
      </div>
      {/* Workspace picker */}
      <div className="py-8 shrink-0">
        <button className="w-full flex items-center gap-2 pr-6 rounded-md hover:bg-surface-base transition-colors ml-2">
          <div className="w-8 h-8 rounded-full bg-[#022b3a] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold ">{initials}</span>
          </div>
          <span className="font-semibold text-text-primary flex-1 text-left truncate capitalize">
            {user?.displayName ?? "..."}
          </span>
          <IcChevRight size={20} className="text-gray" />
        </button>
      </div>
      {/* Nav items */}
      <nav className=" px-2 space-y-px overflow-y-auto ">
        {NAV.map(({ key, label, Icon, IconFilled }) => (
          <button
            key={key}
            onClick={() => onNav(key)}
            className={cn(
              "w-full flex items-center gap-3 px-2.5 mb-3 py-2.5 rounded-sm text-foreground   transition-all duration-100",
              active === key
                ? "bg-background font-medium "
                : "text-text-secondary hover:bg-background ",
            )}
          >
            {active === key ? <IconFilled size={18} /> : <Icon size={18} />}
            {label}
          </button>
        ))}
      </nav>
      {/* Collections section */}
      <div className="px-2 mt-6">
        <div className="flex items-center justify-between px-2.5 mb-2">
          <span className="text-sm font-medium text-gray uppercase tracking-wider">
            Collections
          </span>
          <CollectionsMenu
            onNewCollection={() => setNewCollectionOpen(true)}
            onDeleteCollection={() => setDeleteTarget(collections[0] ?? null)}
            onHideCollections={toggleCollectionsVisible}
            collectionsVisible={collectionsVisible}
          />
        </div>

        {collectionsVisible && (
          <div className="space-y-px">
            {collections.map((c) => (
              <CollectionSidebarItem
                key={c.id}
                collection={c}
                onDeleteClick={setDeleteTarget}
                isActive={pathname.includes(c.id)}
              />
            ))}
          </div>
        )}
      </div>
      {/* Modals */}
      <NewCollectionModal
        open={newCollectionOpen}
        onClose={() => setNewCollectionOpen(false)}
        onCreate={handleCreate}
      />
      <DeleteCollectionModal
        open={!!deleteTarget}
        collection={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDelete={handleDelete}
      />
    </aside>
  );
}
