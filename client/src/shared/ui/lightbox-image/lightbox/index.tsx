// Lightbox.jsx
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import classes from "./lightbox.module.scss";

export default function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    requestAnimationFrame(() => document.body.classList.add(classes.noScroll));

    return () => {
      requestAnimationFrame(() =>
        document.body.classList.remove(classes.noScroll),
      );
    };
  }, []);
  // render into document.body
  return createPortal(
    <div
      className={classes.lightBoxOverlay}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClose();
      }}
    >
      <img
        className={classes.lightBoxFull}
        src={src}
        alt={alt}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
    </div>,
    document.body,
  );
}
