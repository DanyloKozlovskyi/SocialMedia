import { IconButton, Tooltip } from "@mui/material";
import { useState, useReducer } from "react";
import { useIntl } from "react-intl";
import LikeIcon from "@assets/blog-post/like.svg";
import { setLike } from "@entities/like";
import { getUserId } from "@entities/user";
import CommentIcon from "@assets/blog-post/comment.svg";
import ShareIcon from "@assets/blog-post/share.svg";
import { CreatePostModal } from "@features/create-post";
import ActionButton from "./action-button";
import { likeReducer } from "./likeReducer";
import classes from "./icon-bar.module.scss";

interface IconBarProps {
  isLiked: boolean;
  likeCount: number;
  isCommented: boolean;
  commentCount?: number;
  id: string;
  width: number;
}

const IconBar = ({
  id,
  isLiked,
  likeCount,
  isCommented,
  commentCount,
  width,
}: IconBarProps) => {
  const intl = useIntl();
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isCommentClosing, setIsCommentClosing] = useState(false);
  const timeout = 1000;

  const [state, dispatch] = useReducer(likeReducer, {
    liked: isLiked,
    count: likeCount,
  });

  const handleLike = async (
    e: React.MouseEvent<HTMLElement>
  ): Promise<void> => {
    e.stopPropagation();

    dispatch({ type: "TOGGLE_LIKE" });

    try {
      const userId = await getUserId();
      await setLike({ userId, blogId: id });
    } catch (err) {
      dispatch({ type: "TOGGLE_LIKE" });
      console.error("Failed to update like:", err);
    }
  };

  const likeTitle = intl.formatMessage({
    id: "iconbar.like",
    defaultMessage: "Like",
  });
  const commentTitle = intl.formatMessage({
    id: "iconbar.comment",
    defaultMessage: "Comment",
  });
  const shareTitle = intl.formatMessage({
    id: "iconbar.share",
    defaultMessage: "Share",
  });

  const handleClose = () => {
    setIsCommentClosing(true);
    setTimeout(() => {
      setIsCommentOpen(false);
      setIsCommentClosing(false);
    }, timeout);
  };

  const preventDetailsRedirect = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => e.stopPropagation();

  return (
    <>
      <div className={classes.iconContainer} style={{ width }}>
        <ActionButton
          title={likeTitle}
          active={state.liked}
          count={state.count}
          onClick={handleLike}
          icon={<LikeIcon />}
          activeColor="var(--like)"
          lightColor="var(--light-like)"
        />

        <ActionButton
          title={commentTitle}
          active={isCommented}
          count={commentCount ?? 0}
          onClick={(e) => {
            e.stopPropagation();
            setIsCommentOpen(true);
          }}
          icon={<CommentIcon />}
          activeColor="var(--comment)"
          lightColor="var(--light-comment)"
        />

        <Tooltip title={shareTitle}>
          <IconButton>
            <ShareIcon stroke="var(--dark-gray)" />
          </IconButton>
        </Tooltip>
      </div>
      <div onClick={preventDetailsRedirect}>
        <CreatePostModal
          isOpen={isCommentOpen}
          onClose={handleClose}
          timeout={timeout}
          isClosing={isCommentClosing}
          parentId={id}
        />
      </div>
    </>
  );
};

export default IconBar;
