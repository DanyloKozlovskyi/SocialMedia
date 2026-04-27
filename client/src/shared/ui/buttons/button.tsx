import MaterialButton, { ButtonProps } from "@mui/material/Button";
import classes from "./button.module.scss";

interface Props extends Omit<ButtonProps, "variant"> {
  disabled?: boolean;
  variant?: ButtonProps["variant"];
  sx?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({
  disabled,
  variant,
  sx,
  className,
  children,
  onClick,
  ...props
}: Props) => {
  return (
    <MaterialButton
      disabled={disabled}
      onClick={onClick}
      {...props}
      className={`${className} ${classes.button}`}
      variant={variant ?? "contained"} // Can be "text", "outlined", or "contained"
      color="primary" // Can be "primary", "secondary", "error", etc.
      //onClick={handleClick} // Event handler for click
      sx={{
        "&:hover": {
          boxShadow: "none",
        },
        textTransform: "none",
        fontSize: "16px",
        ...sx,
      }}
    >
      {children}
    </MaterialButton>
  );
};

export default Button;
