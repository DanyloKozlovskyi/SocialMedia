"use client";
import React, { ReactNode } from "react";
import RightToolbar from "../right-toolbar";
import LeftToolbar from "../left-toolbar";
import classes from "./main-layout.module.scss";

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
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
    </div>
  );
};

export default MainLayout;
