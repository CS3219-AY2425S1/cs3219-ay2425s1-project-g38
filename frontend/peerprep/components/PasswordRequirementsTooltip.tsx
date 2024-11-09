import { Tooltip } from "@nextui-org/react";
import BoxIcon from "@/components/boxicons";

export default function PasswordRequirementsTooltip() {
  return (
    <Tooltip
      content={
        <ul className="list-disc pl-2 py-1 text-xs">
          <li>At least 12 characters long</li>
          <li>Contains at least one uppercase letter</li>
          <li>Contains at least one lowercase letter</li>
          <li>Contains at least one digit</li>
          <li>Contains at least one special character (e.g., @$#!%*?&)</li>
        </ul>
      }
      placement="right"
      showArrow
    >
      <div className="flex flex-row gap-1 items-center w-fit dark:hover:text-gray-300 hover:text-gray-500 text-xs">
        <BoxIcon name="bx-info-circle" size="12px" />
        &nbsp;Password requirements
      </div>
    </Tooltip>
  );
}
