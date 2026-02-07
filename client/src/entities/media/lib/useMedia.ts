import { useState, useEffect } from "react";
import { fetchImageAsBlobURL } from "@entities/image";
import { getSignedVideoUrl } from "@entities/video";

export const useMedia = (
  mediaKey: string | null,
  mediaType: "image" | "video" | null,
) => {
  const [mediaSrc, setMediaSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchMedia = async () => {
      if (!mediaKey || !mediaType) {
        setMediaSrc(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let url: string;
        if (mediaType === "video") {
          url = await getSignedVideoUrl(mediaKey);
        } else {
          url = await fetchImageAsBlobURL(mediaKey);
          objectUrl = url;
        }
        setMediaSrc(url);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error(`Failed to load ${mediaType}:`, error);
        setError(error);
        setMediaSrc(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [mediaKey, mediaType]);

  return { mediaSrc, isLoading, error };
};
