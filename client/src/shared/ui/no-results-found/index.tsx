import NoResultsFoundIcon from "@assets/shared/no-results-found.svg";
import classes from "./no-results-found.module.scss";

interface NoResultsFoundProps {
  label: string;
}

const NoResultsFound = ({ label }: NoResultsFoundProps) => {
  return (
    <div className={classes.noResults}>
      <NoResultsFoundIcon />
      <p>{label}</p>
    </div>
  );
};

export default NoResultsFound;
