import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { UserLogo } from "@core-components/user-logo";
import { useChatStore } from "../../model/store";
import classes from "./UserSearch.module.scss";
import api from "@shared/api/interceptor-api";

interface User {
  id: string;
  name?: string;
  logoKey?: string;
  description?: string;
}

export const UserSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { startConversation, selectConversation } = useChatStore();

  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) {
        setUsers([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get(
          `/account/filterUsers?query=${encodeURIComponent(query)}`,
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleUserClick = async (userId: string) => {
    const conversationId = await startConversation(userId);
    if (conversationId) {
      selectConversation(conversationId);
      setIsOpen(false);
      setQuery("");
      setUsers([]);
    }
  };

  if (!isOpen) {
    return (
      <button
        className={classes.openButton}
        onClick={() => setIsOpen(true)}
        title="Start new conversation"
        type="button"
      >
        <PersonAddIcon />
      </button>
    );
  }

  return (
    <div className={classes.searchContainer}>
      <div className={classes.header}>
        <h3>New Chat</h3>
        <button
          className={classes.closeButton}
          onClick={() => {
            setIsOpen(false);
            setQuery("");
            setUsers([]);
          }}
          type="button"
        >
          Cancel
        </button>
      </div>

      <div className={classes.searchInput}>
        <SearchIcon className={classes.searchIcon} />
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div className={classes.userList}>
        {isLoading ? (
          <div className={classes.loading}>Searching...</div>
        ) : users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className={classes.userItem}
              onClick={() => handleUserClick(user.id)}
            >
              <UserLogo
                className={classes.avatar}
                logoKey={user.logoKey || null}
                size={40}
              />
              <div className={classes.userInfo}>
                <span className={classes.userName}>
                  {user.name || "Unknown User"}
                </span>
                {user.description && (
                  <span className={classes.userDesc}>{user.description}</span>
                )}
              </div>
            </div>
          ))
        ) : query ? (
          <div className={classes.noResults}>No users found</div>
        ) : (
          <div className={classes.placeholder}>
            Search for users to start a conversation
          </div>
        )}
      </div>
    </div>
  );
};
