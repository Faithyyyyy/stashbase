import { api } from "./api";

export type Notification = {
  id: string;
  userId: string;
  stashId: string;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NotificationsResponse = {
  notifications: Notification[];
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getNotifications(): Promise<NotificationsResponse> {
  const res = await api<{ success: boolean; data: NotificationsResponse }>(
    "/api/notifications",
  );
  return res.data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await api(`/api/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllNotificationsRead(): Promise<void> {
  await api("/api/notifications/read-all", { method: "PATCH" });
}

export async function deleteNotification(id: string): Promise<void> {
  await api(`/api/notifications/${id}/delete`, { method: "PUT" });
}
export function openNotificationStream(
  token: string,
  onNotification: (data: unknown) => void,
): EventSource {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications/stream?token=${token}`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("SSE notification:", data);
      onNotification(data);
    } catch {
      // ignore parse errors
    }
  };

  eventSource.onerror = (err) => {
    console.log("SSE error:", err);
  };

  return eventSource;
}
