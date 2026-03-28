"use client";

import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import AddModal from "@/components/stash/add-modal";
import StashTypePickerModal from "@/components/stash/stash-picker";
import UploadModal from "@/components/stash/add-upload";
import type { NavKey } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { useStashRefresh } from "@/context/StashRefreshContext";
import { useAddStash } from "@/context/AddStashContext";
import ResurfacePopup from "@/components/stash/resurface-popup";

type Props = {
  children: React.ReactNode;
};

export default function DashboardShell({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { triggerRefresh } = useStashRefresh();

  const getActiveNav = (): NavKey | "none" => {
    if (pathname.startsWith("/collections")) return "none";
    if (pathname.startsWith("/settings")) return "none";
    if (pathname.includes("/stash")) return "stash";
    if (pathname === "/dashboard") return "home";
    if (pathname.startsWith("/uploads")) return "uploads";

    return "home";
  };

  const {
    modalOpen,
    pickerOpen,
    uploadOpen,
    closeAddModal,
    openAddModal,
    openLinkModal,
    openUploadModal,
    closePicker,
    closeUpload,
    setToastMessage,
  } = useAddStash();

  return (
    <div className="flex h-screen bg-surface-base overflow-hidden">
      <Sidebar
        active={getActiveNav()}
        onNav={(key) => router.push(`/${key === "home" ? "dashboard" : key}`)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="border-b border-[#E5E5E5]">
          <Topbar onAdd={openAddModal} />
        </div>

        <main className="flex-1 overflow-y-auto p-5 px-9">{children}</main>
      </div>

      <StashTypePickerModal
        open={pickerOpen}
        onClose={closePicker}
        onSelectLink={openLinkModal}
        onSelectUpload={openUploadModal}
      />

      <AddModal
        open={modalOpen}
        onClose={closeAddModal}
        onBack={() => {
          closeAddModal();
          openAddModal();
        }}
        onSuccess={(item) => {
          closeAddModal();
          setToastMessage(`"${item.title}" added!`);
          triggerRefresh();
        }}
      />

      <UploadModal
        open={uploadOpen}
        onClose={closeUpload}
        onBack={() => {
          closeUpload();
          openAddModal();
        }}
        onSuccess={() => {
          closeUpload();
          setToastMessage("File uploaded successfully!");
          triggerRefresh();
        }}
      />
      <ResurfacePopup />
    </div>
  );
}
