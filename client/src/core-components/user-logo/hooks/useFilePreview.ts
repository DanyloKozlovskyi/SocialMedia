import { useState, useRef, useCallback } from "react";

export function useFilePreview() {
  const [src, setSrc] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      console.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      console.error("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      console.error("Error reading file");
      setSrc("");
    };
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setSrc(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }, []);
  const reset = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSrc("");
  }, []);

  return { src, fileInputRef, onFileChange, reset };
}
