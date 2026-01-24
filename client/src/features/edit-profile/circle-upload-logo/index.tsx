import { Stack, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { LocalLogo } from "@core-components/user-logo";

export const UploadLogo = ({
  className,
  image64,
  onCancel,
  onUpload,
  ref,
}: {
  className: string;
  image64: string;
  ref?: React.RefObject<HTMLInputElement>;
  onCancel: () => void;
  onUpload: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <Stack spacing={2} alignItems="center" className={className}>
      <LocalLogo initialDataUrl={image64} />
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
        >
          Choose file
          <input
            type="file"
            accept="image/*"
            ref={ref}
            onChange={onUpload}
            style={{ display: "none" }}
          />
        </Button>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={!image64}
        >
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
};
