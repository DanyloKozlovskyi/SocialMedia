import React, { useState } from "react";
import VideoLightbox from "./lightbox";
import classes from "./video-lightbox.module.scss";

export default function VideoLightboxImage({
  className,
  src,
  width = 300,
  height = 200,
}: {
  className?: string;
  src: string;
  width?: number;
  height?: number;
}) {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <video
        className={`${classes.lightBoxThumb} ${className}`}
        src={src}
        width={width}
        height={height}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        style={{ cursor: "pointer" }}
      />

      {isOpen && (
        <VideoLightbox
          src={src}
          onClose={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
