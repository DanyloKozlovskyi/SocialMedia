"use client";

import { useRouter } from "next/navigation";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useUniversityStore } from "@entities/university";
import { chatApi } from "@entities/chat";
import classes from "./university-chat.module.scss";

const UniversityChatPanel = () => {
  const router = useRouter();
  const {
    isUniversityMode,
    universityDomain,
    universityName,
    facultyCode,
    facultyName,
  } = useUniversityStore();

  // Only show when university mode is active
  if (!isUniversityMode || !universityDomain) return null;

  const handleJoinUniChat = async () => {
    try {
      const { conversationId } = await chatApi.createGroupConversation(
        `${universityName ?? universityDomain} – Chat`,
        [], // Backend should handle adding members for uni-wide chats
      );
      router.push(`/chat?conversation=${conversationId}`);
    } catch {
      // If chat already exists, navigate to chat page
      router.push("/chat");
    }
  };

  const handleJoinFacultyChat = async () => {
    if (!facultyCode) return;
    try {
      const { conversationId } = await chatApi.createGroupConversation(
        `${facultyName ?? facultyCode} – Chat`,
        [],
      );
      router.push(`/chat?conversation=${conversationId}`);
    } catch {
      router.push("/chat");
    }
  };

  return (
    <div className={classes.panel}>
      <div className={classes.panelTitle}>Community Chats</div>

      <div className={classes.chatLink} onClick={handleJoinUniChat}>
        <div className={classes.uniChatIcon}>
          <SchoolIcon fontSize="inherit" />
        </div>
        <div className={classes.chatInfo}>
          <div className={classes.chatName}>{universityName ?? universityDomain}</div>
          <div className={classes.chatDesc}>University-wide chat</div>
        </div>
        <ChevronRightIcon className={classes.joinArrow} fontSize="inherit" />
      </div>

      {facultyCode && (
        <div className={classes.chatLink} onClick={handleJoinFacultyChat}>
          <div className={classes.facultyChatIcon}>
            <GroupsIcon fontSize="inherit" />
          </div>
          <div className={classes.chatInfo}>
            <div className={classes.chatName}>{facultyName ?? facultyCode}</div>
            <div className={classes.chatDesc}>Faculty chat</div>
          </div>
          <ChevronRightIcon className={classes.joinArrow} fontSize="inherit" />
        </div>
      )}
    </div>
  );
};

export { UniversityChatPanel };
