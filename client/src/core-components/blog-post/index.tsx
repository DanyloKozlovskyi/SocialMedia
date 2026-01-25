"use client";
import { useEffect, useState } from "react";
import LightboxImage from "@shared/ui/lightbox-image";
import { useRouter } from "next/navigation";
import { Blog } from "@entities/blog-post";
import { fetchImageAsBlobURL } from "@entities/image";
import { getSignedVideoUrl } from "@entities/video";
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
  width = 500,
}: BlogPostProps) => {
  const [mediaSrc, setMediaSrc] = useState<string | null>(null);

  const router = useRouter();

  const { logoKey: userLogoKey, userName, id: userId } = user;

  const goToDetails = () => {
    router.push(`details?id=${id}`);
  };

  const goToUserPosts = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`user-posts?id=${userId}`);
  };

  useEffect(() => {
    if (!mediaKey || !mediaType) {
      setMediaSrc(null);
      return;
    }

    if (mediaType === "video") {
      getSignedVideoUrl(mediaKey)
        .then((url: string) => {
          setMediaSrc(url);
        })
        .catch((err) => {
          console.error("Failed to load video URL:", err);
          setMediaSrc(null);
        });
    } else if (mediaType === "image") {
      fetchImageAsBlobURL(mediaKey)
        .then((url: string) => {
          setMediaSrc(url);
        })
        .catch((err: DOMException) => {
          console.error("Failed to load image:", err);
          setMediaSrc(null);
        });
    }
  }, [mediaKey, mediaType]);

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
          <video
            src={mediaSrc}
            controls
            preload="metadata"
            playsInline
            className={classes.blogPostImage}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: `${width}px`,
              maxHeight: "600px",
              objectFit: "contain",
            }}
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
