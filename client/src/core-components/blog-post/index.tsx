"use client";
import { useEffect, useState } from "react";
import LightboxImage from "@shared/ui/lightbox-image";
import { useRouter } from "next/navigation";
import { Blog } from "@entities/blog-post";
import { fetchImageAsBlobURL } from "@entities/image";
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
  imageKey,
  user,
  description,
  isLiked,
  likeCount,
  isCommented,
  commentCount,
  width = 500,
}: BlogPostProps) => {
  const [src, setSrc] = useState<string>("");

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
    if (!imageKey) return;

    let objectUrl: string;
    fetchImageAsBlobURL(imageKey)
      .then((url: string) => {
        objectUrl = url;
        setSrc(url);
      })
      .catch((err: DOMException) => {
        console.error(err);
        //setError(err.message);
      });

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageKey]);

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
        {src && (
          <LightboxImage
            className={`${classes.blogPostImage}`}
            src={src}
            width={width}
            alt="post"
          />
        )}
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
