"use client";
import React from "react";
import { useRouter } from "next/navigation";
import ChatIcon from "@mui/icons-material/Chat";
import { User } from "@entities/user";
import { UserLogo } from "@core-components/user-logo";
import { useChatStore } from "@features/chat/model/store";
import classes from "./user-card.module.scss";

type Props = {
  user: User;
};

export default function UserCard({ user }: Props) {
  const router = useRouter();
  const { openChatWithUser } = useChatStore();

  const goToUserPosts = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    router.push(`user-posts?id=${userId}`);
  };

  const handleMessage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    openChatWithUser(user.id);
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
        <button className={classes.followBtn} type="button">
          Follow
        </button>
      </div>
    </div>
  );
}
