import { User } from "@entities/user";

interface BlogCreateModel {
  description: string;
  imageKey: string | null;
  imageContentType: string | null;
  parentId: string | null;
}

interface Blog extends BlogCreateModel {
  id: string;
  likeCount: number;
  commentCount: number;
  user: User;
}

export type { Blog, BlogCreateModel };
