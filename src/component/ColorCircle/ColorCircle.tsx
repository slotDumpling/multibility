import classNames from "classnames";
import { FC } from "react";

export const ColorCirle: FC<{ color: string; className?: string }> = ({
  color,
  className,
}) => {
  const style = { backgroundColor: color };
  return (
    <div className={classNames("color-circle", className)} style={style} />
  );
};
