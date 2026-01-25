import React, { useRef } from "react";
import { useIntl } from "react-intl";
import { Box, Button, Stack, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface UploadFileProps {
  className?: string;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl?: string | null;
  setPreviewUrl: (previewUrl: string | null) => void;
  setFile: (file: File | null) => void;
}

const UploadFile = ({
  className,
  onUpload,
  previewUrl,
  setPreviewUrl,
  setFile,
}: UploadFileProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const intl = useIntl();

  const handleCancel = () => {
    if (fileInputRef && fileInputRef?.current) {
      fileInputRef.current.value = ""; // triggers onchange even if file didn't change
    }
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <Stack className={className} spacing={2} alignItems="center">
      <Box
        p={3}
        height={200}
        width={300}
        border="1px dashed grey"
        borderRadius={2}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
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
      <Stack direction="row" spacing={2}>
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
            accept="image/*"
            onChange={onUpload}
            style={{ display: "none" }}
          />
        </Button>

        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={!previewUrl}
        >
          {intl.formatMessage({
            id: "upload-logo.cancel",
          })}
        </Button>
      </Stack>
    </Stack>
  );
};

export default UploadFile;
