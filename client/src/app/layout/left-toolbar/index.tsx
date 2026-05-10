"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import LanguageIcon from "@mui/icons-material/Language";
import { CreatePostModal } from "@features/create-post";
import { useUniversityStore } from "@entities/university";
import { getPersonalInfo, User } from "@entities/user";
import { UserLogo } from "@core-components/user-logo";
import { logout, clearTokens } from "@entities/auth";
import { wipeAllStores } from "@shared/lib/store-reset";
import { useLocale } from "@app/providers/client-intl-provider";
import { useIntl } from "react-intl";
import classes from "./left-toolbar.module.scss";

const LeftToolbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const timeout = 1000;

  const { universityDomain, isUniversityMode, setUniversityMode } =
    useUniversityStore();
  const { locale, switchLocale } = useLocale();
  const intl = useIntl();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getPersonalInfo()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const navItems = [
    {
      icon: <HomeIcon />,
      label: intl.formatMessage({ id: "sidebar.home", defaultMessage: "Home" }),
      path: "/home",
    },
    {
      icon: <ChatIcon />,
      label: intl.formatMessage({
        id: "sidebar.messages",
        defaultMessage: "Messages",
      }),
      path: "/chat",
    },
    {
      icon: <SearchIcon />,
      label: intl.formatMessage({
        id: "sidebar.search",
        defaultMessage: "Search",
      }),
      path: "/search",
    },
  ];

  const handleLanguageToggle = () => {
    switchLocale(locale === "en" ? "uk" : "en");
  };

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
      wipeAllStores();
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
          <span>
            {intl.formatMessage({
              id: "sidebar.university",
              defaultMessage: "University",
            })}
          </span>
        </button>
      )}

      <div className={classes.postButtonWrapper}>
        <button
          className={classes.navButton}
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <AddCircleIcon />
          <span>
            {intl.formatMessage({
              id: "sidebar.create-post",
              defaultMessage: "Create Post",
            })}
          </span>
        </button>

        <button
          className={classes.navButton}
          onClick={handleLanguageToggle}
          type="button"
        >
          <LanguageIcon />
          <span>{locale === "en" ? "English" : "Українська"}</span>
        </button>

        <button
          className={classes.navButton}
          onClick={handleSignOut}
          type="button"
          style={{ color: "#d32f2f" }}
        >
          <LogoutIcon style={{ color: "#d32f2f" }} />
          <span>
            {intl.formatMessage({
              id: "sidebar.sign-out",
              defaultMessage: "Sign Out",
            })}
          </span>
        </button>
      </div>

      {user && (
        <div
          className={classes.userProfile}
          onClick={() => router.push("/account")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && router.push("/account")}
        >
          <UserLogo
            className={classes.userAvatar}
            logoKey={user.logoKey || null}
            size={40}
          />
          <div className={classes.userInfo}>
            <span className={classes.userName}>
              {user.name || user.userName}
            </span>
            <span className={classes.userHandle}>@{user.userName}</span>
          </div>
        </div>
      )}

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
