"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { CreatePostModal } from "@features/create-post";
import classes from "./left-toolbar.module.scss";

const LeftToolbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const timeout = 1000;

  const navItems = [
    { icon: <HomeIcon />, label: "Home", path: "/home" },
    { icon: <ChatIcon />, label: "Messages", path: "/chat" },
    { icon: <SearchIcon />, label: "Search", path: "/search" },
    { icon: <AccountCircleIcon />, label: "Account", path: "/account" },
  ];

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, timeout);
  };

  return (
    <div className={classes.toolbar}>
      {navItems.map((item) => (
        <button
          key={item.path}
          className={`${classes.navButton} ${pathname === item.path ? classes.active : ""}`}
          onClick={() => router.push(item.path)}
          type="button"
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}

      <div className={classes.postButtonWrapper}>
        <button
          className={classes.navButton}
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <AddCircleIcon />
          <span>Create Post</span>
        </button>
      </div>

      <CreatePostModal
        isOpen={isOpen}
        onClose={handleClose}
        timeout={timeout}
        isClosing={isClosing}
      />
    </div>
  );
};

export default LeftToolbar;
