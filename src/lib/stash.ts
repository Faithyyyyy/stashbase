import { api } from "./api";
import { Stash } from "@/types";

type CreateStashPayload = {
  url: string;
  title: string;
  collectionId?: string;
  contentType?: string;
  reminderAt?: string;
};

type CreateStashResponse = {
  success: boolean;
  data: { id: string; status: string };
  message: string;
};

type GetStashesResponse = {
  success: boolean;
  data: {
    allStashes: Stash[];
    stashesByType: Record<string, Stash[]>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export async function createStash(
  payload: CreateStashPayload,
): Promise<CreateStashResponse> {
  return api<CreateStashResponse>("/api/stashes", {
    method: "POST",
    body: payload,
  });
}

export async function getStashes(): Promise<GetStashesResponse["data"]> {
  const res = await api<GetStashesResponse>("/api/stashes");
  return res.data;
}
export type SearchResult = {
  id: string;
  title: string;
  url: string;
  contentType: string;
  status: string;
  metadata: {
    thumbnailUrl?: string;
    description?: string;
    sourceDomain?: string;
  };
  Tags: { id: string; name: string }[];
  Collections: { id: string; name: string }[];
};

export async function searchStashes(
  query: string,
  filters: string[],
): Promise<SearchResult[]> {
  const params = new URLSearchParams();
  if (query) params.set("q", query);

  filters.forEach((f) => {
    if (f === "Type") params.set("type", query);
    if (f === "Tags") params.set("tag", query);
  });

  const res = await api<{
    success: boolean;
    data: { results: SearchResult[] };
  }>(`/api/search?${params.toString()}`);

  return res.data.results;
}
export async function getStashesByType(type: string): Promise<{
  allStashes: Stash[];
  stashesByType: Record<string, Stash[]>;
}> {
  const res = await api<{
    success: boolean;
    data: { allStashes: Stash[]; stashesByType: Record<string, Stash[]> };
  }>(`/api/stashes?type=${type}`);
  return res.data;
}
export async function createStashUpload(payload: {
  file: File;
  title: string;
  tagName?: string;
  collectionId?: string;
}): Promise<CreateStashResponse> {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("title", payload.title);
  if (payload.tagName) formData.append("tagName", payload.tagName);
  if (payload.collectionId)
    formData.append("collectionId", payload.collectionId);

  const token = localStorage.getItem("sb_token");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stashes`,
    {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    },
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Upload failed");
  }

  return res.json();
}
export async function getUploads(): Promise<Stash[]> {
  const types = ["photo", "video", "document", "note"];
  const results = await Promise.all(
    types.map((type) =>
      api<{
        success: boolean;
        data: { allStashes: Stash[] };
      }>(`/api/stashes?type=${type}`).then((res) => res.data.allStashes),
    ),
  );
  return results.flat();
}
export async function updateStash(
  id: string,
  payload: {
    collectionId?: string | null;
    tags?: string[];
    notes?: string;
  },
): Promise<void> {
  await api(`/api/stashes/${id}`, {
    method: "PATCH",
    body: payload,
  });
}
export async function getStashById(id: string): Promise<Stash> {
  const res = await api<{ success: boolean; data: Stash }>(
    `/api/stashes/${id}`,
  );
  return res.data;
}
export async function deleteStash(id: string): Promise<void> {
  await api(`/api/stashes/${id}/delete`, { method: "PUT" });
}
