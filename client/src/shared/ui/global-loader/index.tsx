import CircularProgress from "@mui/material/CircularProgress";
import classes from "./global-loader.module.scss";

const GlobalLoader = () => {
  return (
    <div className={classes.overlay}>
      <CircularProgress />
    </div>
  );
};

export default GlobalLoader;
