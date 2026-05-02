"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import { CreatePostModal } from "@features/create-post";
import { useUniversityStore } from "@entities/university";
import { logout, clearTokens } from "@entities/auth";
import classes from "./left-toolbar.module.scss";

const LeftToolbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const timeout = 1000;

  const { universityDomain, isUniversityMode, setUniversityMode } =
    useUniversityStore();

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

  const handleUniversityClick = () => {
    setUniversityMode(!isUniversityMode);
    router.push("/home");
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout failed on server:", e);
    } finally {
      clearTokens();
      window.location.href = "/sign-in";
    }
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

      {/* University mode toggle in the toolbar */}
      {universityDomain && (
        <button
          className={`${classes.navButton} ${isUniversityMode ? classes.active : ""}`}
          onClick={handleUniversityClick}
          type="button"
        >
          <SchoolIcon />
          <span>University</span>
        </button>
      )}

      <div className={classes.postButtonWrapper}>
        <button
          className={classes.navButton}
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <AddCircleIcon />
          <span>Create Post</span>
        </button>

        <button
          className={classes.navButton}
          onClick={handleSignOut}
          type="button"
          style={{ marginTop: "8px", color: "#d32f2f" }}
        >
          <LogoutIcon style={{ color: "#d32f2f" }} />
          <span>Sign Out</span>
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
