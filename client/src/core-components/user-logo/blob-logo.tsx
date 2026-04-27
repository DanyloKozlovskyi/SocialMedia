import { LogoAvatar } from "./logo-avatar";
import { useBlobLogo } from "./hooks/useBlobLogo";

interface BlobLogoProps {
  className?: string;
  logoKey: string | null;
  size?: number;
  onClick?: (e: React.MouseEvent) => void;
}

export const BlobLogo: React.FC<BlobLogoProps> = (props) => {
  const src = useBlobLogo(props.logoKey);
  return (
    <LogoAvatar
      className={props.className}
      src={src}
      size={props.size}
      onClick={props.onClick}
      showCameraIcon={false}
    />
  );
};
