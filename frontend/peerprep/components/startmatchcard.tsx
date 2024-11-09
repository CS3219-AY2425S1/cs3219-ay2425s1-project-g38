import { Card, CardBody, CardFooter } from "@nextui-org/card"; // Adjust imports as needed
import { Button } from "@nextui-org/react";
import React from "react";

interface StartMatchCardProps {
  onStart: () => void;
  isCollabAvail: boolean;
}

const StartMatchCard: React.FC<StartMatchCardProps> = ({
  onStart,
  isCollabAvail,
}) => {
  return (
    <Card className="flex-1 bg-gradient-to-br from-pink-200 via-purple-400 to-indigo-600 dark:from-[#FE9977] dark:to-[#6F0AD4]">
      <CardBody>
        <p className="text-tiny text-black/40 uppercase font-bold">
          Are you ready?
        </p>
        <h4 className="text-white font-medium text-large">
          Start a new session
        </h4>
      </CardBody>
      <CardFooter className="flex justify-end p-5">
        <Button
          onClick={onStart}
          radius="lg"
          variant="flat"
          size="md"
          isDisabled={!isCollabAvail}
        >
          <span className="text-white">Start</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StartMatchCard;
