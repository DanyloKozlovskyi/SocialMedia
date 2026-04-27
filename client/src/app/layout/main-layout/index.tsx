"use client";
import React, { ReactNode, useEffect, useState } from "react";
import RightToolbar from "../right-toolbar";
import LeftToolbar from "../left-toolbar";
import { GlobalChatWidget } from "@widgets/chat";
import { getCookie } from "@shared/api";
import { getUserId } from "@entities/user/helpers";
import classes from "./main-layout.module.scss";

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
  const [token, setToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const loadAuthData = async () => {
      const accessToken = getCookie("access_token");
      if (accessToken) {
        const tokenValue = accessToken.split(" ")[1];
        setToken(tokenValue);

        const id = await getUserId();
        setUserId(id);
      }
    };

    loadAuthData();
  }, []);

  return (
    <div>
      <main className={classes.layout}>
        <div className={classes.left}>
          <LeftToolbar />
        </div>
        <div className={classes.mainContent}>{children}</div>
        <div className={classes.right}>
          <RightToolbar />
        </div>
      </main>
      {token && userId && (
        <GlobalChatWidget token={token} currentUserId={userId} />
      )}
    </div>
  );
};

export default MainLayout;
