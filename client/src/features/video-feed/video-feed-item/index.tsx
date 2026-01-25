"use client";

import { useEffect, useState } from "react";
import { getSignedVideoUrl } from "@entities/video";
import classes from "./video-feed-item.module.scss";

interface VideoFeedItemProps {
  storageKey: string;
  title?: string;
  description?: string;
  className?: string;
}

const VideoFeedItem = ({
  storageKey,
  title,
  description,
  className,
}: VideoFeedItemProps) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideoUrl = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const url = await getSignedVideoUrl(storageKey);
        setVideoUrl(url);
      } catch (err) {
        console.error("Failed to load video URL:", err);
        setError("Failed to load video");
      } finally {
        setIsLoading(false);
      }
    };

    loadVideoUrl();
  }, [storageKey]);

  if (isLoading) {
    return (
      <div className={`${classes.container} ${className || ""}`}>
        <div className={classes.skeleton} />
      </div>
    );
  }

  if (error || !videoUrl) {
    return (
      <div className={`${classes.container} ${className || ""}`}>
        <div className={classes.error}>{error || "Video unavailable"}</div>
      </div>
    );
  }

  return (
    <div className={`${classes.container} ${className || ""}`}>
      <video
        src={videoUrl}
        controls
        preload="metadata"
        playsInline
        className={classes.video}
      />
      {(title || description) && (
        <div className={classes.metadata}>
          {title && <h3 className={classes.title}>{title}</h3>}
          {description && <p className={classes.description}>{description}</p>}
        </div>
      )}
    </div>
  );
};

export { VideoFeedItem };
