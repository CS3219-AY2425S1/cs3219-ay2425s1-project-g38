import React from "react";
import { IconName } from "boxicons";

interface IconProps {
  name: IconName;
  size?: string;
  color?: string;
}

const BoxIcon: React.FC<IconProps> = ({ name, size = "24px", color = "" }) => {
  return <i className={`bx ${name}`} style={{ fontSize: size, color }} />;
};

export default BoxIcon;
