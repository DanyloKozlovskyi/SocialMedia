import React, { useRef } from "react";
import { useIntl } from "react-intl";
import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

interface UploadFileProps {
  className?: string;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl?: string | null;
  setPreviewUrl: (previewUrl: string | null) => void;
  setFile: (file: File | null) => void;
  fileType?: "image" | "video" | null;
}

const UploadFile = ({
  className,
  onUpload,
  previewUrl,
  setPreviewUrl,
  setFile,
  fileType,
}: UploadFileProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const intl = useIntl();

  const handleCancel = () => {
    if (fileInputRef && fileInputRef?.current) {
      fileInputRef.current.value = "";
      const event = new Event("change", { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <Stack className={className} spacing={2} alignItems="center">
      <Box
        sx={{
          position: "relative",
          display: "inline-block",
        }}
      >
        <Box
          p={3}
          height={200}
          width={300}
          border="1px dashed grey"
          borderRadius={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundColor: fileType === "video" ? "#000" : "transparent",
            overflow: "hidden",
          }}
        >
          {fileType === "video" && previewUrl ? (
            <video
              src={previewUrl}
              controls
              preload="metadata"
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          ) : fileType === "image" && previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          ) : (
            <Typography color="text.secondary">
              {intl.formatMessage({
                id: "upload-file.no-image",
              })}
            </Typography>
          )}
        </Box>
        {previewUrl && (
          <IconButton
            onClick={handleCancel}
            sx={{
              position: "absolute",
              top: -12,
              right: -12,
              backgroundColor: "white",
              color: "black",
              border: "2px solid #ddd",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
      >
        {intl.formatMessage({
          id: "upload-logo.choose-file",
        })}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/mp4"
          onChange={onUpload}
          style={{ display: "none" }}
        />
      </Button>
    </Stack>
  );
};

export default UploadFile;
