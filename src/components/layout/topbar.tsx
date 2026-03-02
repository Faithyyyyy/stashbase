"use client";
import { IcBell, IcSettings, IcAdd } from "@/icons/icons";
import { Button } from "@/components/ui/index";
import SemanticSearch from "@/components/stash/semantic-search";
import { useRouter } from "next/navigation";

interface TopbarProps {
  section: string;
  view: "grid" | "list";
  onViewChange: (v: "grid" | "list") => void;
  onAdd: () => void;
  itemCount: number;
}

export default function Topbar({ onAdd }: TopbarProps) {
  const router = useRouter();
  return (
    <header className="h-18 flex w-full  items-center max-w-280.25   mx-auto justify-between">
      {/* Search */}
      <SemanticSearch
        onSearch={async (query, filters) => {
          const res = await fetch(
            `/api/search?q=${query}&filters=${filters.join(",")}`,
          );
          return res.json(); // must return StashResult[]
        }}
        onResultSelect={(result) => {
          router.push(`/stash/${result.id}`);
        }}
      />
      <div className="flex items-center gap-4 ">
        <Button size="sm" onClick={onAdd} leftIcon={<IcAdd size={18} />}>
          Add
        </Button>
        <div className="cursor-pointer">
          {" "}
          <IcBell size={16} />
        </div>
        <div className="cursor-pointer">
          {" "}
          <IcSettings size={16} />
        </div>
      </div>
    </header>
  );
}
