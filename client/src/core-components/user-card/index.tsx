"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatIcon from "@mui/icons-material/Chat";
import {
  User,
  followUser,
  unfollowUser,
  getFollowStatus,
  getUserId,
} from "@entities/user";
import { UserLogo } from "@core-components/user-logo";
import { useChatStore } from "@features/chat/model/store";
import classes from "./user-card.module.scss";

type Props = {
  user: User;
};

export default function UserCard({ user }: Props) {
  const router = useRouter();
  const { openChatWithUser } = useChatStore();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      const currentUserId = await getUserId();
      setIsCurrentUser(currentUserId === user.id);
      if (currentUserId && currentUserId !== user.id) {
        const status = await getFollowStatus(user.id);
        setIsFollowing(status?.isFollowing ?? false);
      }
    };
    checkFollowStatus();
  }, [user.id]);

  const goToUserPosts = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    router.push(`user-posts?id=${userId}`);
  };

  const handleMessage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    openChatWithUser(user.id);
  };

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(user.id);
        setIsFollowing(false);
      } else {
        await followUser(user.id);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Follow action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.card} onClick={(e) => goToUserPosts(e, user?.id)}>
      <UserLogo logoKey={user?.logoKey} className={classes.avatar} size={48} />

      <div className={classes.info}>
        <div className={classes.nameRow}>
          <span className={classes.name}>{user.name}</span>
        </div>

        <div className={classes.handle}>
          @{user.name.replace(/\s+/g, "") || "user"}
        </div>
        <div className={classes.description}>{user.description}</div>
      </div>

      <div className={classes.actions}>
        <button
          className={classes.messageBtn}
          onClick={handleMessage}
          type="button"
        >
          <ChatIcon />
        </button>
        {!isCurrentUser && (
          <button
            className={`${classes.followButton} ${isFollowing ? classes.following : ""}`}
            onClick={handleFollow}
            disabled={isLoading}
            type="button"
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>
    </div>
  );
}
