"use client";
import { useRouter } from "next/navigation";
import LightboxImage from "@shared/ui/lightbox-image";
import VideoPlayer from "@shared/ui/video-player";
import { Blog } from "@entities/blog-post";
import { useMedia } from "@entities/media/lib/useMedia";
import { UserLogo } from "../user-logo";
import { IconBar } from "./components";
import classes from "./blog-post.module.scss";

interface BlogPostProps extends Blog {
  className?: string;
  isLiked?: boolean;
  isCommented?: boolean;
  width?: number;
  height?: number;
}

const BlogPost = ({
  className,
  id,
  mediaKey,
  mediaType,
  user,
  description,
  isLiked,
  likeCount,
  isCommented,
  commentCount,
  width = 700,
}: BlogPostProps) => {
  const router = useRouter();
  const { mediaSrc } = useMedia(
    mediaKey || null,
    (mediaType as "image" | "video") || null,
  );

  const { logoKey: userLogoKey, userName, id: userId } = user;

  const goToDetails = () => {
    router.push(`details?id=${id}`);
  };

  const goToUserPosts = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/user-posts?id=${userId}`);
  };

  return (
    <div
      className={`${classes.blogPostContainer} ${className}`}
      onClick={goToDetails}
    >
      <div className={classes.avatarColumn}>
        <UserLogo
          className={classes.userLogo}
          logoKey={userLogoKey}
          size={50}
          onClick={goToUserPosts}
        />
      </div>
      <div className={classes.contentColumn}>
        <p className={classes.userName} onClick={goToUserPosts}>
          {userName}
        </p>
        <div className={classes.blogPostLabel}>{description}</div>
        {mediaType === "video" && mediaSrc ? (
          <VideoPlayer
            src={mediaSrc}
            width={width}
            className={classes.blogPostImage}
          />
        ) : mediaType === "image" && mediaSrc ? (
          <LightboxImage
            className={`${classes.blogPostImage}`}
            src={mediaSrc}
            width={width}
            alt="post"
          />
        ) : null}
        <IconBar
          id={id}
          isLiked={isLiked ?? false}
          likeCount={likeCount}
          isCommented={isCommented ?? false}
          commentCount={commentCount}
          width={width}
        />
      </div>
    </div>
  );
};

export default BlogPost;
