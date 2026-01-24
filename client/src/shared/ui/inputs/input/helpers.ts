import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          padding: "0px !important",
        },
        input: {
          padding: "0px !important",
        },
      },
    },
  },
});

export const inputStyles = {
  "& .MuiInputBase-root": {
    padding: "4px 10px !important",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#f7f7f2",
    height: "40px",
    "&:hover": {
      backgroundColor: "#f7f7f2",
    },
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
  },
};
