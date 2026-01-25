import { useIntl } from "react-intl";
import classes from "./create-post-button.module.scss";

interface CreatePostButtonProps {
  onClick?: () => void;
}

const CreatePostButton = ({ onClick }: CreatePostButtonProps) => {
  const intl = useIntl();
  return (
    <button type="button" className={classes.postButton} onClick={onClick}>
      {intl.formatMessage({
        id: "post-button.label",
      })}
    </button>
  );
};

export { CreatePostButton };
