import { api } from "./api";

export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
  passwordChangedAt: string | null;
};

export async function getProfile(): Promise<UserProfile> {
  const res = await api<{ success: boolean; data: UserProfile }>(
    "/api/auth/profile",
  );
  return res.data;
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await api("/api/auth/change-password", {
    method: "PATCH",
    body: payload,
  });
}

export async function deleteAccount(): Promise<void> {
  await api("/api/auth/account", { method: "DELETE" });
}
