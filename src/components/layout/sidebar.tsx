"use client";
import { cn } from "@/lib/utils";
import type { NavKey } from "@/types";
import { IcHomeline, IcUploads, IcChevRight, IcBookmarks } from "@/icons/icons";

const NAV: {
  key: NavKey;
  label: string;
  Icon: React.ComponentType<{ size?: number }>;
}[] = [
  { key: "home", label: "Home", Icon: IcHomeline },
  { key: "stash", label: "Stash", Icon: IcBookmarks },
  { key: "library", label: "Uploads", Icon: IcUploads },
];

export default function Sidebar({
  active,
  onNav,
}: {
  active: NavKey;
  onNav: (k: NavKey) => void;
}) {
  return (
    <aside className="w-61.75 shrink-0 h-full py-6 px-6 bg-surface-raised border-r border-[#E5E5E5] flex flex-col">
      {/* Logo row */}
      <div className="h-11 flex items-center   shrink-0">
        <span className="text-lg font-bold text-primary tracking-[-0.015em]">
          StashBase
        </span>
      </div>

      {/* Workspace picker */}
      <div className=" py-8  shrink-0">
        <button className="w-full flex items-center gap-2  pr-6 rounded-md hover:bg-surface-base transition-colors ml-2">
          <div className="w-5 h-5 rounded-full bg-linear-to-br  from-violet-400 to-rose-400 shrink-0" />
          <span className=" font-semibold text-lg text-black flex-1 text-left truncate ">
            Daniel A
          </span>
          <IcChevRight size={20} className="text-gray" />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 space-y-px overflow-y-auto">
        {NAV.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => onNav(key)}
            className={cn(
              "w-full flex items-center gap-3 px-2.5 mb-4 py-2 rounded-sm text-black text-sm font-medium transition-all duration-100",
              active === key
                ? "bg-background font-semibold "
                : "text-text-secondary hover:bg-background ",
            )}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
