"use client";

import React from "react";
import { useIntl } from "react-intl";
import { useLocale } from "@app/providers/client-intl-provider";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export const LanguageSelector: React.FC = () => {
  const intl = useIntl();

  const { locale, switchLocale } = useLocale();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const typographyStyles = {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    fontSize: "1rem",
  };

  const englishTitle = intl.formatMessage({
    id: "languages.en",
    defaultMessage: "English",
  });
  const ukrainianTitle = intl.formatMessage({
    id: "languages.uk",
    defaultMessage: "Ukrainian",
  });

  const available = [
    { code: "en", label: englishTitle },
    { code: "uk", label: ukrainianTitle },
  ];

  const currentLabel = available.find((l) => l.code === locale)!.label;

  return (
    <>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          color: "black",
          textTransform: "none",
          padding: 0,
          ...typographyStyles,
        }}
      >
        {currentLabel}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            mt: 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: 1,
          },
        }}
      >
        {available.map((loc) => (
          <MenuItem
            key={loc.code}
            selected={loc.code === locale}
            onClick={() => {
              switchLocale(loc.code);
              setAnchorEl(null);
            }}
            sx={{
              color: "black",
              fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
            }}
          >
            {loc.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
