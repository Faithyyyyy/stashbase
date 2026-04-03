"use client";
import { IcSettings, IcAdd } from "@/icons/icons";
import Settings from "@/assets/icons/settings.svg";
import { Button } from "@/components/ui/index";
import SemanticSearch from "@/components/stash/semantic-search";
import { useRouter, usePathname } from "next/navigation";
import { useCollections } from "@/context/CollectionContext";
import type { StashResult } from "@/components/stash/semantic-search";
import { searchStashes } from "@/lib/stash";
import NotificationPanel from "./notification-panel";
import Image from "next/image";
interface TopbarProps {
  onAdd: () => void;
}

export default function Topbar({ onAdd }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { collections } = useCollections();

  const isHome = pathname === "/dashboard";
  const isCollection = pathname.startsWith("/collections/");
  const collectionId = isCollection ? pathname.split("/collections/")[1] : null;
  const activeCollection = collectionId
    ? collections.find((c) => c.id === collectionId)
    : null;

  const getPageTitle = () => {
    if (pathname.includes("/stash")) return "Stash";
    if (pathname.includes("/uploads")) return "Uploads";
    if (pathname.includes("/settings")) return "Settings";
    return null;
  };
  const isStashType = pathname.startsWith("/stash/");
  const stashType = isStashType ? pathname.split("/stash/")[1] : null;

  // capitalize first letter
  const formatType = (t: string) =>
    t.charAt(0).toUpperCase() + t.slice(1) + "s";
  return (
    <header className="h-18 flex w-full   items-center max-w-280.25   mx-auto justify-between">
      <div className="flex items-center">
        {isHome && (
          <SemanticSearch
            onSearch={async (query, filters) => {
              const results = await searchStashes(query, filters);
              return results.map((r) => ({
                id: r.id,
                title: r.title,
                url: r.url,
                description:
                  r.metadata?.description ??
                  r.metadata?.sourceDomain ??
                  r.contentType,
                type: r.contentType as StashResult["type"],
              }));
            }}
            onResultSelect={(result) => {
              if (result.type === "link") {
                window.open(result.url, "_blank");
              } else {
                router.push(`/stash/${result.id}`);
              }
            }}
          />
        )}

        {isCollection && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-gray hover:text-gray-600 transition-colors font-medium"
            >
              Collections
            </button>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="capitalize font-semibold text-gray-900">
              {activeCollection?.name ?? "Collection"}
            </span>
          </div>
        )}

        {isStashType && stashType ? (
          <span className="font-semibold text-text-primary">
            {formatType(stashType)}
          </span>
        ) : !isHome && !isCollection && getPageTitle() ? (
          <h1 className="text-lg font-semibold text-gray-900">
            {getPageTitle()}
          </h1>
        ) : null}
      </div>

      <div className="flex items-center gap-4 ">
        <Button
          size="md"
          onClick={onAdd}
          leftIcon={<IcAdd size={18} fontWeight={900} />}
        >
          Add
        </Button>
        <div className="cursor-pointer transition-colors">
          {/* <IcBell size={16} /> */}
          <NotificationPanel />
        </div>
        <div
          className="cursor-pointer transition-colors"
          onClick={() => router.push("/settings")}
        >
          <Image src={Settings} alt="settings" width={28} height={28} />
          {/* <IcSettings size={16} /> */}
        </div>
      </div>
    </header>
  );
}
