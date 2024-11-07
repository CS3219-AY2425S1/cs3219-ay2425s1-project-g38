import { Card, CardBody, CardFooter } from "@nextui-org/card"; // Adjust imports as needed
import { Button } from "@nextui-org/react";
import React from "react";

interface ReconnectCardProps {
  onReconnect: () => void;
  onLeave: () => void;
}

const ReconnectCard: React.FC<ReconnectCardProps> = ({
  onReconnect,
  onLeave,
}) => {
  return (
    <Card className="flex-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500">
      <CardBody>
        <h4 className="text-white font-medium text-large p-2">
          You&apos;re currently in a session
        </h4>
      </CardBody>
      <CardFooter className="flex justify-end gap-4 p-5">
        <Button
          onClick={onLeave}
          radius="lg"
          variant="flat"
          size="md"
          color="danger"
        >
          <span className="text-white">Leave</span>
        </Button>
        <Button
          onClick={onReconnect}
          radius="lg"
          variant="flat"
          size="md"
          color="success"
        >
          <span className="text-white">Reconnect</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReconnectCard;
