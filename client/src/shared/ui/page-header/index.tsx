"use client";
import { ReactNode } from "react";
import { ArrowBack } from "@shared/ui/arrow-back";
import classes from "./page-header.module.scss";

interface PageHeaderProps {
  onBack?: () => void;
  title?: string;
  children?: ReactNode;
  className?: string;
}

const PageHeader = ({ onBack, title, children, className }: PageHeaderProps) => {
  return (
    <div className={`${classes.pageHeader} ${className ?? ""}`}>
      <ArrowBack onBack={onBack} />
      {title && <h2 className={classes.title}>{title}</h2>}
      {children}
    </div>
  );
};

export default PageHeader;
