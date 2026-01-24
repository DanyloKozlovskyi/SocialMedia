"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import classes from "./arrow-back.module.scss";

interface ArrowBackProps {
  onBack?: () => void;
  className?: string;
}

const ArrowBack = ({ onBack, className }: ArrowBackProps) => {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBack = () => {
    if (!isMounted) return;

    if (window.history.length > 1) {
      onBack?.();
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className={`${classes.topContainer} ${className}`}>
      <IconButton onClick={handleBack}>
        <ArrowBackIcon />
      </IconButton>
    </div>
  );
};

export { ArrowBack };
