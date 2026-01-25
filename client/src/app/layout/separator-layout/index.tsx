import Separator from "@shared/ui/separator";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const SeparatorLayout = ({ children, ...props }: Props) => {
  return (
    <div>
      <Separator left={"-1px"} />
      <div {...props}>{children}</div>
      <Separator left={"100%"} />
    </div>
  );
};

export default SeparatorLayout;
