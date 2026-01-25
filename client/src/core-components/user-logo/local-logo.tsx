import { LogoAvatar } from "./logo-avatar";
import { useFilePreview } from "./hooks/useFilePreview";

interface LocalLogoProps {
  className?: string;
  initialDataUrl?: string;
  size?: number;
}

export const LocalLogo: React.FC<LocalLogoProps> = ({
  className,
  initialDataUrl = "",
  size,
}) => {
  const { src, fileInputRef, onFileChange } = useFilePreview();

  return (
    <>
      <LogoAvatar
        className={className}
        src={src || initialDataUrl}
        size={size}
        onClick={() => fileInputRef.current?.click()}
        showCameraIcon={true}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={onFileChange}
        style={{ display: "none" }}
      />
    </>
  );
};
