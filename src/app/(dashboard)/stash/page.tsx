"use client";
import Image from "next/image";
import video from "@/icons/video.svg";
import photos from "@/icons/photo.svg";
import docs from "@/icons/docs.svg";
import link from "@/icons/link.svg";

import { useRouter } from "next/navigation";

const CATEGORIES = [
  {
    key: "document",
    label: "Documents",
    icon: <Image src={docs} alt="Documents" width={24} height={24} />,
  },
  {
    key: "link",
    label: "Links",
    icon: <Image src={link} alt="Links" width={24} height={24} />,
  },
  {
    key: "video",
    label: "Videos",
    icon: <Image src={video} alt="Videos" width={24} height={24} />,
  },
  {
    key: "photo",
    label: "Photos",
    icon: <Image src={photos} alt="Photos" width={24} height={24} />,
  },
];
export default function StashPage() {
  const router = useRouter();

  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(268px,1fr))] gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => router.push(`/stash/${cat.key}`)}
            style={{
              backgroundColor: "#0A0A0A",
              borderRadius: "16px",
              padding: "24px",
              paddingInline: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "236px",
              textAlign: "left",
              transition: "background-color 0.2s",
              border: "none",
              cursor: "pointer",
            }}
            className=" hover:bg-[#1a1a1a] transition-colors text-left group"
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {cat.icon}
            </div>

            <span
              style={{
                color: "white",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
