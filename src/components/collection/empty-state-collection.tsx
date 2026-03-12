"use client";

import Image from "next/image";
import illustation from "@/assets/images/illustrations.png";

type Props = {
  collectionName?: string;
};

export default function EmptyStateCollection({ collectionName }: Props) {
  return (
    <div className="flex-1 mt-30 flex flex-col items-center justify-center select-none">
      <Image
        src={illustation}
        alt="Empty state illustration"
        width={178}
        height={178}
        className="mb-3"
        loading="eager"
      />
      <p className="text-xl font-semibold text-black mb-1.5">
        This collection is empty
      </p>
      <p className="font-medium text-gray text-center leading-relaxed mb-5">
        {collectionName
          ? `No stashes in "${collectionName}" yet`
          : "Add stashes to this collection to see them here"}
      </p>
    </div>
  );
}
