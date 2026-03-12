import { api } from "./api";
import { Collection } from "@/types";
import { Stash } from "@/types";
export type BackendStash = Stash;

export type CollectionWithStashes = {
  id: string;
  userId: string;
  name: string;
  description: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  Stashes: BackendStash[];
};

// GET /api/collections
export async function getCollections(): Promise<Collection[]> {
  const res = await api<{ success: boolean; data: Collection[] }>(
    "/api/collections",
  );
  return res.data;
}

// POST /api/collections
export async function createCollection(name: string): Promise<Collection> {
  const res = await api<{ success: boolean; data: Collection }>(
    "/api/collections",
    {
      method: "POST",
      body: {
        name,
        description: "What do you do when you have free time? Design",
      },
    },
  );
  return res.data;
}

// GET /api/collections/:id/stashes
export async function getCollectionWithStashes(
  id: string,
): Promise<CollectionWithStashes> {
  const res = await api<{ success: boolean; data: CollectionWithStashes }>(
    `/api/collections/${id}/stashes`,
  );
  return res.data;
}

// PUT /api/collections/:id/delete
export async function deleteCollection(id: string): Promise<void> {
  await api(`/api/collections/${id}/delete`, { method: "PUT" });
}

// PATCH /api/collections/:id
export async function updateCollection(
  id: string,
  name: string,
): Promise<Collection> {
  const res = await api<{ success: boolean; data: Collection }>(
    `/api/collections/${id}`,
    { method: "PATCH", body: { name } },
  );
  return res.data;
}
