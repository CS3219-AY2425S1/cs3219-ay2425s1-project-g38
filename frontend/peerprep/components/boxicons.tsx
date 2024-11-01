import React from "react";
import { IconName } from "boxicons";

interface IconProps {
  name: IconName;
  size?: string;
  color?: string;
  className?: string;
}

const BoxIcon: React.FC<IconProps> = ({
  name,
  size = "24px",
  color = "",
  className = "",
}) => {
  return (
    <i
      className={`bx ${name} ${className}`}
      style={{ fontSize: size, color }}
    />
  );
};

export default BoxIcon;
