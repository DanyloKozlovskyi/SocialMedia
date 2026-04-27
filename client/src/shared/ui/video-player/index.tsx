import React, { useState } from "react";
import VideoLightbox from "@shared/ui/video-lightbox/lightbox";
import classes from "./video-player.module.scss";

interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  className?: string;
  width?: number;
  height?: number;
}

const VideoPlayer = ({
  src,
  className,
  width,
  height,
  ...props
}: VideoPlayerProps) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      <video
        {...props}
        src={src}
        controls
        preload="metadata"
        playsInline
        className={`${classes.videoPlayer} ${className}`}
        style={{
          width: width ? `${width}px` : "100%",
          maxHeight: height ? `${height}px` : "600px",
          objectFit: "contain",
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setIsLightboxOpen(true);
        }}
      />
      {isLightboxOpen && (
        <VideoLightbox
          src={src}
          onClose={(e: React.MouseEvent) => {
            e.stopPropagation();
            setIsLightboxOpen(false);
          }}
        />
      )}
    </>
  );
};

export default VideoPlayer;
