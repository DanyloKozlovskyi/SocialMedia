"use client";

import { useRouter, usePathname } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import classes from "./left-toolbar.module.scss";

const LeftToolbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: <HomeIcon />, label: "Home", path: "/home" },
    { icon: <ChatIcon />, label: "Messages", path: "/chat" },
    { icon: <SearchIcon />, label: "Search", path: "/search" },
    { icon: <AccountCircleIcon />, label: "Account", path: "/account" },
  ];

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
    </div>
  );
};

export default LeftToolbar;
