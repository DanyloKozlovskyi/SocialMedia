import { User } from "@entities/user";

interface BlogCreateModel {
  description: string;
  mediaKey?: string | null;
  mediaContentType?: string | null;
  mediaType?: "image" | "video" | null;
  parentId: string | null;
}

interface Blog extends BlogCreateModel {
  id: string;
  likeCount: number;
  commentCount: number;
  user: User;
}

export type { Blog, BlogCreateModel };
