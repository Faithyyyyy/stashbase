export type NavKey =
  | "home"
  | "tasks"
  | "uploads"
  | "stash"
  | "integrations"
  | "settings";

export interface StashItem {
  id: string;
  link?: string;
  title: string;
  url: string;
  description: string;
  collection: string;
  type: string;
  tags: string[];
  coverUrl: string;
  addedAt: Date;
}

export type ModalStep = 1 | 2 | 3 | 4;

export interface FormState {
  link: string;
  url: string;
  description: string;
  collection: string;
  type: string;
  tags: string[];
}
export type User = {
  firstName: string;
  lastName: string;
  fullName: string | null;
  email: string | null;
  avatar: string | null;
};

export type Collection = {
  id: string;
  userId?: string;
  name: string;
  description?: string;
  isDeleted?: boolean;
  stashCount?: string;
  createdAt: string;
  updatedAt: string;
};
export type StashTag = {
  id: string;
  name: string;
};

export type Stash = {
  id: string;
  userId: string;
  url: string;
  title: string;
  contentType: "video" | "document" | "link" | "image" | "note" | "photo";
  status: "ready" | "processing";
  metadata: {
    thumbnailUrl?: string;
    cloudinaryUrl?: string;
    sourceDomain?: string;
    pageCount?: number;
    extractedText?: string;
    thumbnail?: string;
    description?: string;
    publishedDate?: string;
    microlinkRaw?: {
      image?: { url?: string };
      screenshot?: { url?: string };
      logo?: { url?: string };
      publisher?: string;
      description?: string;
      title?: string;
    };
  };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  Tags: { id: string; name: string }[];
  Collections: { id: string; name: string }[];
  // optional fields EditStashModal uses
  collectionId?: string | null;
  tags?: string[];
  notes?: string;
};
