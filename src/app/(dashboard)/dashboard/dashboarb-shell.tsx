"use client";

import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import AddModal from "@/components/stash/add-modal";
import type { NavKey } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { useStashRefresh } from "@/context/StashRefreshContext";
import { useAddStash } from "@/context/AddStashContext";
type Props = {
  children: React.ReactNode;
};

export default function DashboardShell({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { triggerRefresh } = useStashRefresh();
  const getActiveNav = (): NavKey | "none" => {
    if (pathname.startsWith("/collections")) return "none";
    if (pathname.includes("/stash")) return "stash";
    if (pathname === "/dashboard") return "home";
    return "home";
  };

  const { modalOpen, closeAddModal, openAddModal, setToastMessage } =
    useAddStash();

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

      <AddModal
        open={modalOpen}
        onClose={closeAddModal}
        onSuccess={(item) => {
          closeAddModal();
          setToastMessage(`"${item.title}" added!`);
          triggerRefresh();
        }}
      />
    </div>
  );
}
