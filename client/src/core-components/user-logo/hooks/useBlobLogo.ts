import { useState, useEffect } from "react";
import { fetchImageAsBlobURL } from "@entities/image";

export function useBlobLogo(logoKey: string | null) {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    if (!logoKey) {
      setSrc("");
      return;
    }
    let objectUrl: string;
    fetchImageAsBlobURL(logoKey)
      .then((url) => {
        objectUrl = url;
        setSrc(url);
      })
      .catch(console.error);

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [logoKey]);

  return src;
}
