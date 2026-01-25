import React from "react";
import { Stack, TextField } from "@mui/material";

interface TextAreaProps {
  className?: string;
  inputClassName?: string;
  label?: string;
  value: string;
  setValue: (value: string) => void;
}

const TextArea = ({
  className,
  inputClassName,
  label,
  value,
  setValue,
}: TextAreaProps) => {
  return (
    <Stack className={className} spacing={2} alignItems="center">
      <TextField
        className={inputClassName}
        label={label}
        multiline
        fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "#1565c0",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1565c0",
            },
          },
          "& .MuiInputLabel-root": {
            position: "absolute",
            top: 0, // Align vertically centered
            //maxWidth: 0,
            left: 0, // Align horizontally at the left
            opacity: value ? 1 : 1, // Hide label if value is entered
            transition: "opacity 0.2s", // Smooth transition for the opacity
            //display: "none",
          },
          "& .MuiInputLabel-shrink": {
            //opacity: 0, // Hides label when the input is focused or has text
            //maxWidth: 0,
            border: "#1565c0",
          },
          "& .MuiInputBase-root": {
            padding: "8px 10px !important",
          },
        }}
        InputLabelProps={{
          shrink: false,
          sx: { display: "none" },
        }}
        variant="outlined"
      />
    </Stack>
  );
};

export default TextArea;
