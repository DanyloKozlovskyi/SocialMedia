"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LightboxImage from "@shared/ui/lightbox-image";
import VideoPlayer from "@shared/ui/video-player";
import { Blog } from "@entities/blog-post";
import { useMedia } from "@entities/media/lib/useMedia";
import { fetchImageWithFallbacks } from "@entities/image";
import {
  getUniversityLogoBasePath,
  getFacultyLogoBasePath,
} from "@shared/lib/universities";
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

  const {
    logoKey: userLogoKey,
    userName,
    id: userId,
    universityDomain,
    facultyCode,
  } = user;

  const [uniLogoUrl, setUniLogoUrl] = useState<string | null>(null);
  const [facultyLogoUrl, setFacultyLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!universityDomain) {
      setUniLogoUrl(null);
      return;
    }
    const basePath = getUniversityLogoBasePath(universityDomain);
    if (!basePath) return;
    fetchImageWithFallbacks(basePath, ["png", "svg", "jpg", "jpeg"])
      .then(setUniLogoUrl)
      .catch(() => setUniLogoUrl(null));
  }, [universityDomain]);

  useEffect(() => {
    if (!universityDomain || !facultyCode) {
      setFacultyLogoUrl(null);
      return;
    }
    const basePath = getFacultyLogoBasePath(universityDomain, facultyCode);
    if (!basePath) return;
    fetchImageWithFallbacks(basePath, ["png", "svg", "jpg", "jpeg"])
      .then(setFacultyLogoUrl)
      .catch(() => setFacultyLogoUrl(null));
  }, [universityDomain, facultyCode]);

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
        <div className={classes.userHeader}>
          <p className={classes.userName} onClick={goToUserPosts}>
            {userName}
          </p>
          {(uniLogoUrl || facultyLogoUrl) && (
            <div className={classes.affiliationLogos}>
              {uniLogoUrl && (
                <img
                  src={uniLogoUrl}
                  alt="University"
                  className={classes.affiliationLogo}
                />
              )}
              {facultyLogoUrl && (
                <img
                  src={facultyLogoUrl}
                  alt="Faculty"
                  className={classes.affiliationLogo}
                />
              )}
            </div>
          )}
        </div>
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
