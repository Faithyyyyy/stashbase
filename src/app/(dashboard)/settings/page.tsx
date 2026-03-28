"use client";

import { useEffect, useState } from "react";
import {
  getProfile,
  changePassword,
  deleteAccount,
  UserProfile,
} from "@/lib/profile";
import { useAuth } from "@/context/AuthContext";
import { IcX } from "@/icons/icons";
import edit from "@/icons/edit.svg";
import { cn } from "@/lib/utils";
import Image from "next/image";

const inputCls =
  "w-full text-sm font-medium text-text-primary placeholder:text-text-disabled " +
  "bg-white border border-[#D4D4D4] rounded-sm px-3.5 py-2.5 outline-none transition-all " +
  "hover:border-border-strong focus:border-border-strong";

// ── Change Password Modal ──────────────────────────────────────────────────
function ChangePasswordModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { signOut } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      Promise.resolve().then(() => {
        setCurrentPassword("");
        setNewPassword("");
        setError("");
      });
    }
  }, [open]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      onClose();
      await signOut();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to change password",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs backdrop-saturate-150"
      style={{ background: "rgba(15,15,15,0.35)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-modal w-full max-w-md animate-slide-up p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text-primary">
            Change password
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-base transition-colors"
          >
            <IcX size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-semibold text-text-primary block mb-1.5">
              Current password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-text-primary block mb-1.5">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className={inputCls}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-secondary bg-[#F5F5F5] rounded-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium bg-foreground text-white rounded-sm hover:bg-[#1a4050] transition-colors disabled:opacity-50"
          >
            {loading ? "Changing..." : "Change password"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Account Modal ───────────────────────────────────────────────────
function DeleteAccountModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteAccount();
      await signOut();
    } catch {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs backdrop-saturate-150"
      style={{ background: "rgba(15,15,15,0.35)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-sm shadow-modal w-full max-w-sm animate-slide-up pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between  mb-5 border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Delete Account?
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-base transition-colors"
          >
            <IcX size={20} />
          </button>
        </div>

        <p className="text-sm text-text-secondary font-semibold mb- px-6 mb-6">
          Once you delete your account, it is gone forever.
        </p>

        <div className="flex flex-col gap-2  px-6">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-full py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-medium text-text-secondary bg-[#F5F5F5] rounded-sm hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Settings Page ──────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => {});
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } catch {
      setSigningOut(false);
    }
  };

  const initials = profile?.displayName
    ? profile.displayName
        .trim()
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <>
      <div className="max-w-3xl">
        <h3 className="text-base font-semibold text-text-primary mb-6">
          Profile details
        </h3>

        <div className="space-y-0 divide-y divide-border">
          {/* Avatar */}
          <div className="flex items-center gap-16 py-6">
            <span className="w-40 text-sm text-text-secondary shrink-0">
              Avatar
            </span>
            <div className="w-12 h-12 rounded-full bg-[#022b3a] flex items-center justify-center">
              <span className="text-white text-sm font-bold">{initials}</span>
            </div>
          </div>

          {/* Full name */}
          <div className="flex items-center gap-16 py-6">
            <span className="w-40 text-sm text-text-secondary shrink-0">
              Full name
            </span>
            <div className="flex-1 max-w-md">
              <input
                value={profile?.displayName ?? ""}
                readOnly
                className={cn(inputCls, "cursor-default")}
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-16 py-6">
            <span className="w-40 text-sm text-text-secondary shrink-0">
              Email address
            </span>
            <div className="flex-1 max-w-md">
              <input
                value={profile?.email ?? ""}
                readOnly
                className={cn(inputCls, " cursor-default")}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex items-center gap-16 py-6">
            <span className="w-40 text-sm text-text-secondary shrink-0">
              Password
            </span>
            <button
              onClick={() => setChangePasswordOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-primary border border-border rounded-sm hover:bg-surface-base transition-colors"
            >
              <Image src={edit} alt="edit icon" height={18} width={18} />
              Change password
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-16 py-6">
            <span className="w-40 text-sm text-text-secondary shrink-0">
              Actions
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-primary border border-border rounded-sm hover:bg-surface-base transition-colors disabled:opacity-50"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                {signingOut ? "Signing out..." : "Log out"}
              </button>
              <button
                onClick={() => setDeleteAccountOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-sm transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
      <DeleteAccountModal
        open={deleteAccountOpen}
        onClose={() => setDeleteAccountOpen(false)}
      />
    </>
  );
}
