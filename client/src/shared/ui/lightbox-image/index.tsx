import React, { useState } from "react";
import Lightbox from "./lightbox";
import classes from "./lightbox-image.module.scss";

export default function LightboxImage({
  className,
  src,
  alt,
  width = 200,
  props,
}: {
  className?: string;
  src: string;
  alt: string;
  width: number;
}) {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <img
        {...props}
        className={`${classes.lightBoxThumb} ${className}`}
        src={src}
        alt={alt}
        width={width}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        style={{ cursor: "pointer" }}
      />

      {isOpen && (
        <Lightbox
          src={src}
          alt={alt}
          onClose={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
