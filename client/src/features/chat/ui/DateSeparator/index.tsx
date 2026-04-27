import React from "react";
import classes from "./DateSeparator.module.scss";

interface DateSeparatorProps {
  date: string;
  onClick?: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });
};

export const DateSeparator: React.FC<DateSeparatorProps> = ({
  date,
  onClick,
}) => {
  return (
    <div className={classes.separator}>
      <button className={classes.dateButton} onClick={onClick} type="button">
        {formatDate(date)}
      </button>
    </div>
  );
};
