"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Collection } from "@/types";
import { getCollections } from "@/lib/collections";

type CollectionsContextType = {
  collections: Collection[];
  setCollections: (c: Collection[]) => void;
  addCollection: (c: Collection) => void;
  removeCollection: (id: string) => void;
  collectionsVisible: boolean;
  toggleCollectionsVisible: () => void;
};

const CollectionsContext = createContext<CollectionsContextType>({
  collections: [],
  setCollections: () => {},
  addCollection: () => {},
  removeCollection: () => {},
  collectionsVisible: true,
  toggleCollectionsVisible: () => {},
});

export function CollectionsProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionsVisible, setCollectionsVisible] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sb_token");
    if (!token) return;

    getCollections()
      .then(setCollections)
      .catch(() => {});
  }, []);

  const addCollection = (c: Collection) =>
    setCollections((prev) => [c, ...prev]);

  const removeCollection = (id: string) =>
    setCollections((prev) => prev.filter((c) => c.id !== id));

  const toggleCollectionsVisible = () => setCollectionsVisible((v) => !v);

  return (
    <CollectionsContext.Provider
      value={{
        collections,
        setCollections,
        addCollection,
        removeCollection,
        collectionsVisible,
        toggleCollectionsVisible,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
}

export const useCollections = () => useContext(CollectionsContext);
