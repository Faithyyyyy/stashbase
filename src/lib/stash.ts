import { api } from "./api";
import { Stash } from "@/types";

type CreateStashPayload = {
  url: string;
  title: string;
  collectionId?: string;
  contentType?: string;
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
