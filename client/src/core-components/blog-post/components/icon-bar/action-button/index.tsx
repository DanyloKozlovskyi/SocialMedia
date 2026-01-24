import React from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  SxProps,
  Theme,
} from "@mui/material";

export interface ActionButtonProps {
  title: string;
  active: boolean;
  count: number;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  icon: React.ReactElement;
  activeColor: string;
  lightColor: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  active,
  count,
  onClick,
  icon,
  activeColor,
  lightColor,
}) => {
  const rootStyles: SxProps<Theme> = (theme) => ({
    display: "flex",
    alignItems: "center",
    cursor: "pointer",

    "& .MuiIconButton-root": {
      transition: theme.transitions.create(
        ["background-color", "color", "stroke", "fill"],
        { duration: theme.transitions.duration.short }
      ),
      backgroundColor: "transparent",
      color: active ? activeColor : "var(--dark-gray)",
      stroke: active ? activeColor : "var(--dark-gray)",
      "& svg": {
        fill: active ? activeColor : "none",
      },
    },

    "& .MuiTypography-root": {
      fontSize: "12px",
      color: active ? activeColor : "var(--dark-gray)",
      marginLeft: 0.5,
      transition: theme.transitions.create("color", {
        duration: theme.transitions.duration.short,
      }),
    },

    "&:hover .MuiIconButton-root": {
      backgroundColor: lightColor,
      color: activeColor,
      stroke: `${activeColor} !important`,
      "& svg": {
        fill: activeColor,
      },
    },

    "&:hover .MuiTypography-root": {
      color: activeColor,
    },
  });

  return (
    <Tooltip title={title}>
      <Box component="div" sx={rootStyles} onClick={onClick}>
        <IconButton>{icon}</IconButton>
        <Typography component="span">
          {count !== 0 ? count : null}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default ActionButton;
