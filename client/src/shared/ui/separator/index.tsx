import classes from "./separator.module.scss";

interface SeparatorProps {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  horizontal?: boolean;
}

const Separator = ({
  left = "0px",
  right = "0px",
  top = "0px",
  bottom = "0px",
  horizontal = false,
}: SeparatorProps) => {
  return (
    <div
      style={{
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        position: "absolute",
        zIndex: 1,
      }}
      className={
        horizontal ? classes.horizontalSeparator : classes.verticalSeparator
      }
    />
  );
};

export default Separator;
