import { useState } from "react";
import { useIntl } from "react-intl";
import { EditProfileModal } from "@features/edit-profile";
import classes from "./edit-profile-button.module.scss";

const EditProfileButton = ({
  logoKey,
  name,
  description,
}: {
  name: string;
  logoKey: string;
  description: string;
}) => {
  const timeout = 1000;
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const intl = useIntl();

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, timeout);
  };

  return (
    <div>
      <button onClick={handleOpen} className={classes.editProfileButton}>
        {intl.formatMessage({
          id: "edit-profile.button-label",
        })}
      </button>
      <EditProfileModal
        isOpen={isOpen}
        onClose={handleClose}
        isClosing={isClosing}
        timeout={timeout}
        logoKey={logoKey}
        description={description ?? ""}
        name={name}
      />
    </div>
  );
};

export default EditProfileButton;
