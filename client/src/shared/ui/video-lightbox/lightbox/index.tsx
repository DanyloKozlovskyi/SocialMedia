import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import classes from "./lightbox.module.scss";

export default function VideoLightbox({
  src,
  onClose,
}: {
  src: string;
  onClose: (e: React.MouseEvent) => void;
}) {
  useEffect(() => {
    requestAnimationFrame(() => document.body.classList.add(classes.noScroll));

    return () => {
      requestAnimationFrame(() =>
        document.body.classList.remove(classes.noScroll),
      );
    };
  }, []);

  return createPortal(
    <div
      className={classes.lightBoxOverlay}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClose(e);
      }}
    >
      <video
        className={classes.lightBoxFull}
        src={src}
        controls
        autoPlay
        onClick={(e) => {
          e.stopPropagation();
          onClose(e);
        }}
      />
    </div>,
    document.body,
  );
}
