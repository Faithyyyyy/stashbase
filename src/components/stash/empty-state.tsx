"use client";
import { IcAdd } from "@/icons/icons";
import Image from "next/image";
import illustation from "@/assets/images/illustrations.png";
import { Button } from "@/components/ui/index";

export default function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex-1 mt-30 flex flex-col items-center justify-center select-none">
      {/* Illustration */}
      <Image
        src={illustation}
        alt="Empty state illustration"
        width={178}
        height={178}
        className="mb-3"
        loading="eager"
      />

      <p className="text-xl font-semibold text-black mb-1.5">
        Nothing is your stash
      </p>
      <p className="font-medium text-gray text-center leading-relaxed  mb-5">
        Bookmark important links, photos or videos
      </p>

      <Button size="md" onClick={onAdd} leftIcon={<IcAdd size={18} />}>
        Add to stash
      </Button>
    </div>
  );
}
