import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";

import BoxIcon from "@/components/boxicons";

const BackButton: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-row gap-2 items-center">
      <Button
        variant="light"
        size="sm"
        radius="md"
        onClick={() => router.back()}
        className="pr-3 pl-1"
      >
        <BoxIcon name="bx-chevron-left" size="16px" />
        Back to Dashboard
      </Button>
    </div>
  );
};

export default BackButton;
