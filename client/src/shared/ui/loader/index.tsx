import CircularProgress from "@mui/material/CircularProgress";

interface LoaderProps {
  className?: string;
  isLoading: boolean;
}

const Loader = ({ className, isLoading }: LoaderProps) => {
  return (
    <div
      className={className}
      style={{ display: "flex", justifyContent: "center" }}
    >
      {isLoading && <CircularProgress />}
    </div>
  );
};

export default Loader;
