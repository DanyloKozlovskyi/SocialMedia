import * as React from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/navigation";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { LanguageSelector } from "@features/change-language";

interface AccountPopupProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const AccountPopup = ({ anchorEl, onClose }: AccountPopupProps) => {
  const intl = useIntl();
  const open = Boolean(anchorEl);
  const router = useRouter();

  const goToLogin = () => {
    router.push("sign-in");
  };

  const goToAccount = () => {
    router.push("account");
  };

  return (
    <div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          "& .MuiMenuItem-root": {
            "&:hover": {
              backgroundColor: "transparent",
              textDecoration: "underline",
              textDecorationColor: "var(--dark-gray)",
              textDecorationThickness: "0.5px",
            },
          },
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
          },
        }}
        disableScrollLock={true}
      >
        <MenuItem onClick={goToLogin}>
          {intl.formatMessage({
            id: "menu.login",
          })}
        </MenuItem>
        <MenuItem onClick={goToAccount}>
          {intl.formatMessage({
            id: "menu.my-account",
          })}
        </MenuItem>
        <MenuItem disableRipple>
          <LanguageSelector />
        </MenuItem>
        <MenuItem onClick={onClose}>
          {intl.formatMessage({
            id: "menu.logout",
          })}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default AccountPopup;
