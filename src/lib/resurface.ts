import { api } from "./api";

export type ResurfaceItem = {
  stashId: string;
  reason: string;
};

export type InteractionAction = "opened" | "dismissed" | "snoozed" | "rated";

export async function getResurface(): Promise<ResurfaceItem> {
  const res = await api<{ success: boolean; data: ResurfaceItem }>(
    "/api/resurface",
  );
  return res.data;
}

export async function postInteraction(payload: {
  stashId: string;
  action: InteractionAction;
  rating?: number;
}): Promise<void> {
  await api("/api/resurface/interaction", {
    method: "POST",
    body: payload,
  });
}
