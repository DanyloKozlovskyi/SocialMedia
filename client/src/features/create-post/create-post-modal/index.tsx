import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { Modal, Backdrop, Box, Slide } from "@mui/material";
import { createPost } from "@entities/blog-post";
import CloseIcon from "@assets/shared/close.svg";
import UploadFile from "@shared/ui/upload-file";
import TextArea from "@shared/ui/text-area";
import { getUploadUrl, saveFileIntoBlob } from "@entities/image";
import Button from "@shared/ui/buttons/button";
import classes from "./create-post-modal.module.scss";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeout?: number;
  isClosing?: boolean;
  parentId?: string | null;
}

const CreatePostModal = ({
  isOpen,
  onClose,
  timeout = 1000,
  isClosing = false,
  parentId = null,
}: CreatePostModalProps) => {
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const intl = useIntl();

  const handleClose = () => {
    setDescription("");
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onClose?.();
  };
  const fetchUploadParams = async (fileName: string) => {
    const { uploadUrl, key, contentType } = await getUploadUrl(fileName);
    return { uploadUrl, key, contentType };
  };

  const uploadToBlob = async (
    file: File,
    uploadUrl: string,
    contentType: string
  ) => {
    await saveFileIntoBlob(file, uploadUrl, contentType);
  };

  const uploadFileIntoBlob = async () => {
    if (!file) return { key: null, contentType: null };

    const { uploadUrl, key, contentType } = await fetchUploadParams(file.name);
    await uploadToBlob(file, uploadUrl, contentType);

    return { key, contentType };
  };

  const handleSubmit = async () => {
    try {
      const { key: imageKey, contentType: imageContentType } =
        await uploadFileIntoBlob();

      await createPost({ description, imageKey, imageContentType, parentId });

      handleClose();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file && file.type.startsWith("image/")) {
      setFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    if (!previewUrl) return;

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: timeout,
            sx: {
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              backdropFilter: isClosing ? "blur(0px)" : "blur(2px)",
              WebkitBackdropFilter: isClosing ? "blur(0px)" : "blur(2px)",
            },
          },
        }}
        disableScrollLock={true}
      >
        <div>
          <Slide in={isOpen && !isClosing} direction="up" timeout={timeout}>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                margin: "auto",
                width: "400px",
                height: "100vh",
                bgcolor: "white",
                boxShadow: 24,
                p: 3,
                overflowY: "auto",
              }}
            >
              <CloseIcon
                className={classes.closeIcon}
                width={24}
                height={24}
                onClick={handleClose}
              />
              <UploadFile
                className={classes.uploadFile}
                onUpload={handleUpload}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                setFile={setFile}
              />
              <div
                className={`${classes.wrapper} ${classes.textAreaContainer}`}
              >
                <label className={classes.label}>
                  {intl.formatMessage({
                    id: "add-post-modal.description",
                  })}
                </label>
                <TextArea
                  inputClassName={classes.textArea}
                  value={description || ""}
                  label="Enter description"
                  setValue={setDescription}
                />
              </div>
              <div className={classes.buttonRow}>
                <Button disabled={!description.trim()} onClick={handleSubmit}>
                  {intl.formatMessage({
                    id: "add-post-modal.enter",
                  })}
                </Button>{" "}
              </div>
            </Box>
          </Slide>
        </div>
      </Modal>
    </div>
  );
};

export { CreatePostModal };
