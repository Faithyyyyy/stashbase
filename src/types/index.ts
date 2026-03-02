export type NavKey =
  | "home"
  | "tasks"
  | "library"
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
