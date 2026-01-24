"use client";
import React, { useState } from "react";
import SettingsIcon from "@assets/layout/top-navigation-bar/settings.svg";
import AccountPopup from "./account-popup";
import classes from "./account-component.module.scss";

const AccountComponent = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [settingsHovered, setHomeHovered] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.menu}>
      <div className={classes.settingsImage}>
        <SettingsIcon
          onClick={handleClick}
          onMouseEnter={() => setHomeHovered(true)}
          onMouseLeave={() => setHomeHovered(false)}
          style={{
            fill: settingsHovered ? "var(--blue)" : "var(--dark-gray)",
          }}
          width={24}
          height={24}
          className={classes.icon}
        />
        <AccountPopup onClose={handleClose} anchorEl={anchorEl} />
      </div>
    </div>
  );
};

export default AccountComponent;
