import { ThemeProvider } from "@mui/material/styles";
import TextField, {
  TextFieldVariants,
  TextFieldProps,
} from "@mui/material/TextField";
import { theme, inputStyles } from "./helpers";

interface Props extends Omit<TextFieldProps, "variant"> {
  type: string;
  variant?: TextFieldVariants;
  sx?: React.CSSProperties;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}

const Input = ({
  variant,
  sx,
  className,
  onChange,
  name,
  type,
  ...props
}: Props) => {
  return (
    <ThemeProvider theme={theme}>
      <TextField
        name={name}
        onChange={onChange}
        className={className}
        variant={variant ?? "outlined"}
        type={type}
        {...props}
        sx={{ ...inputStyles, ...sx }}
      ></TextField>
    </ThemeProvider>
  );
};

export default Input;
