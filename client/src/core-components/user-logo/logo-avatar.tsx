import { Avatar, Box, IconButton } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

interface LogoAvatarProps {
  className?: string;
  src: string;
  size?: number;
  onClick?: () => void;
  showCameraIcon?: boolean;
}

export const LogoAvatar: React.FC<LogoAvatarProps> = ({
  className,
  src,
  size = 100,
  onClick,
  showCameraIcon = false,
}) => (
  <Box
    className={className}
    sx={{ position: "relative", width: size, height: size }}
  >
    <Avatar
      src={src}
      sx={{
        width: size,
        height: size,
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    />
    {showCameraIcon && onClick && (
      <IconButton
        size="small"
        onClick={onClick}
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          backgroundColor: "#fff",
          border: "1px solid #ccc",
        }}
      >
        <PhotoCameraIcon fontSize="small" />
      </IconButton>
    )}
  </Box>
);
