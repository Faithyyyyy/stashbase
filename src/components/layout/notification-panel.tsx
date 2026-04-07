"use client";

import { useEffect, useRef, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  Notification,
  openNotificationStream,
} from "@/lib/notification";
import { IcX } from "@/icons/icons";
import { useAuth } from "@/context/AuthContext";
import { IcDocs } from "@/icons/icons";
import { getStashById } from "@/lib/stash";
import { Stash } from "@/types";
import StashPreviewModal from "@/components/stash/stash-preview-modal";
import Image from "next/image";
import Bell from "@/icons/bell.svg";

function groupByDate(notifications: Notification[]) {
  const groups: { label: string; items: Notification[] }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const map = new Map<string, Notification[]>();

  notifications.forEach((n) => {
    const date = new Date(n.createdAt);
    date.setHours(0, 0, 0, 0);
    const isToday = date.getTime() === today.getTime();
    const label = isToday
      ? "Today"
      : date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(n);
  });

  map.forEach((items, label) => groups.push({ label, items }));
  return groups;
}

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [previewStash, setPreviewStash] = useState<Stash | null>(null);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const fetchNotifications = () => {
    setLoading(true);
    getNotifications()
      .then((data) => {
        const filtered = data.notifications.filter((n) => !n.isDeleted);

        setNotifications(filtered);
        setUnreadCount(filtered.filter((n) => !n.isRead).length);
      })
      .catch((err) => console.log("error", err))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    if (!user) return;
    Promise.resolve().then(() => fetchNotifications());
  }, [user]);

  // click outside to close
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // const handleMarkAllRead = async () => {
  //   await markAllNotificationsRead();
  //   setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  //   setUnreadCount(0);
  // };

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    // refetch to get accurate unreadCount from backend
    fetchNotifications();
  };
  const handleView = async (n: Notification) => {
    await markNotificationRead(n.id).catch(() => {});
    fetchNotifications();

    if (n.stashId) {
      const stash = await getStashById(n.stashId).catch(() => null);
      if (!stash) return;
      setOpen(false);

      if (stash.contentType === "link") {
        window.open(stash.url, "_blank");
      } else if (stash.contentType === "document") {
        const rawUrl = stash.metadata?.cloudinaryUrl ?? stash.url;
        const isPdf =
          rawUrl.toLowerCase().includes(".pdf") ||
          stash.title?.toLowerCase().includes(".pdf");

        if (isPdf) {
          window.open(
            `https://docs.google.com/viewer?url=${encodeURIComponent(rawUrl)}`,
            "_blank",
          );
        } else {
          // PowerPoint, Excel, Word → force download
          const downloadUrl = rawUrl.includes("cloudinary.com")
            ? rawUrl.replace("/raw/upload/", "/raw/upload/fl_attachment/")
            : rawUrl;
          window.open(downloadUrl, "_blank");
        }
      } else {
        // photo, video, note → preview modal
        setPreviewStash(stash);
      }
    }
  };

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("sb_token");
    if (!token) return;

    const eventSource = openNotificationStream(token, (data) => {
      console.log("new notification:", data);
      Promise.resolve().then(() => fetchNotifications());
    });

    return () => eventSource.close();
  }, [user]);

  const groups = groupByDate(notifications);

  return (
    <div ref={panelRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!open) fetchNotifications();
        }}
        className="relative cursor-pointer  flex items-center justify-center rounded-lg hover:bg-surface-base transition-colors"
      >
        <Image src={Bell} alt="bell" width={21} height={21} />
        {unreadCount > 0 && (
          <span className="absolute top-1 -right-1.5 w-2 h-2 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-[549px] bg-white border border-border rounded-xl shadow-modal z-50 overflow-hidden animate-slide-down"
          style={{ maxHeight: "80vh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5]">
            <h3 className="text-base font-semibold text-text-primary">
              Notification
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-surface-base transition-colors"
              >
                <IcX size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(80vh - 60px)" }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <svg
                  className="animate-spin w-5 h-5 text-text-tertiary"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <p className="text-sm text-[#737373] font-medium">
                  Nothing to see here
                </p>
              </div>
            ) : (
              <div className="py-2">
                {groups.map((group) => (
                  <div key={group.label}>
                    <p className="text-xs font-semibold text-text-tertiary px-5 py-2.5">
                      {group.label}
                    </p>
                    {group.items.map((n) => (
                      <div
                        key={n.id}
                        className="px-5 py-4  bg-[#fff] hover:bg-[#FAFAFA] transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8  flex items-center justify-center shrink-0 mt-0.5">
                            <IcDocs size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-primary mb-0.5">
                              {n.title}
                            </p>
                            <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                              {n.content}
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                              <button
                                onClick={() => handleView(n)}
                                className="text-xs font-medium text-text-primary border border-[#022B3A] px-3 py-1.5 rounded-sm hover:bg-surface-base transition-colors"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <StashPreviewModal
        stash={previewStash}
        onClose={() => setPreviewStash(null)}
      />
    </div>
  );
}
