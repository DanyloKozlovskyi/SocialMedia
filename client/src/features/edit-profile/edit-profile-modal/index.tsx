import React, { useEffect, useState, useRef } from "react";
import { Modal, Backdrop, Box, Slide } from "@mui/material";
import { useIntl } from "react-intl";
import CloseIcon from "@assets/shared/close.svg";
import TextArea from "@shared/ui/text-area";
import Button from "@shared/ui/buttons/button";
import { editProfile } from "@entities/user";
import {
  getUploadLogoUrl,
  saveFileIntoBlob,
  fetchImageAsBlobURL,
} from "@entities/image";
import { getImage64 } from "@features/create-post/create-post-modal/helpers";
import { UploadLogo } from "../circle-upload-logo";
import classes from "./edit-profile-modal.module.scss";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeout?: number;
  isClosing?: boolean;
  name: string;
  description: string;
  logoKey: string | null;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  timeout = 1000,
  isClosing = false,
  name: initialName,
  description: initialDescription,
  logoKey: initialLogoKey,
}) => {
  const intl = useIntl();

  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  const [originalPreview, setOriginalPreview] = useState<string>("");
  const [preview, setPreview] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
    setFile(null);

    if (initialLogoKey) {
      fetchImageAsBlobURL(initialLogoKey)
        .then((url) => {
          setOriginalPreview(url);
          setPreview(url);
        })
        .catch((err) => {
          console.error("Failed to load existing logo:", err);
          setOriginalPreview("");
          setPreview("");
        });
    } else {
      setOriginalPreview("");
      setPreview("");
    }
  }, [initialName, initialDescription, initialLogoKey, isOpen]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    if (!picked || !picked.type.startsWith("image/")) {
      setFile(null);
      setPreview(originalPreview);
      return;
    }
    setFile(picked);

    const dataUri = await getImage64(picked);
    setPreview(dataUri);
  };

  const handleSubmit = async () => {
    try {
      let finalLogoKey = initialLogoKey;
      let finalContentType: string | undefined;

      if (file) {
        const { uploadUrl, key, contentType } = await getUploadLogoUrl(file.name);
        await saveFileIntoBlob(file, uploadUrl, contentType);
        finalLogoKey = key;
        finalContentType = contentType;
      }

      await editProfile({
        name,
        description,
        logoKey: finalLogoKey,
        logoContentType: finalContentType ?? null,
      });
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      onClose();
    }
  };

  const handleCancelLogo = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFile(null);
    setPreview(originalPreview);
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        onClose();
        handleCancelLogo();
      }}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout,
          sx: {
            backgroundColor: "rgba(255,255,255,0.7)",
            backdropFilter: isClosing ? "blur(0px)" : "blur(2px)",
            WebkitBackdropFilter: isClosing ? "blur(0px)" : "blur(2px)",
          },
        },
      }}
      disableScrollLock
    >
      <Slide in={isOpen && !isClosing} direction="up" timeout={timeout}>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            margin: "auto",
            width: 400,
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
            onClick={onClose}
          />

          <UploadLogo
            className={classes.uploadFile}
            image64={preview}
            onUpload={handleUpload}
            onCancel={handleCancelLogo}
            ref={fileInputRef}
          />

          <div className={`${classes.wrapper} ${classes.textAreaContainer}`}>
            <label className={classes.label}>
              {intl.formatMessage({ id: "edit-profile-modal.change-username" })}
            </label>
            <TextArea
              inputClassName={classes.textArea}
              value={name}
              setValue={setName}
            />
          </div>

          <div className={`${classes.wrapper} ${classes.textAreaContainer}`}>
            <label className={classes.label}>
              {intl.formatMessage({
                id: "edit-profile-modal.change-description",
              })}
            </label>
            <TextArea
              inputClassName={classes.textArea}
              value={description}
              setValue={setDescription}
            />
          </div>

          <div className={classes.buttonRow}>
            <Button onClick={handleSubmit}>
              {intl.formatMessage({ id: "edit-profile-modal.save" })}
            </Button>
          </div>
        </Box>
      </Slide>
    </Modal>
  );
};
