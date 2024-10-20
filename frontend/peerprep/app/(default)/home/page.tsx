"use client";

import { Button } from "@nextui-org/react";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { useState } from "react";

import MatchUI from "@/components/matching/MatchUI";

export default function Home() {
  const [isMatchUIVisible, setIsMatchUIVisible] = useState<boolean>(false);

  const handleClose = () => {
    setIsMatchUIVisible(false);
  };

  return (
    <>
      <div>{isMatchUIVisible && <MatchUI onClose={handleClose} />}</div>
      <div className="flex flex-col items-center p-8">
        <h1 className="text-3xl font-bold text-center">
          Hey there! Ready for some coding challenges? 🧑‍💻
        </h1>
        <div className="flex justify-center gap-8 w-full mt-8">
          <div className="w-3/4">
            <div className="flex gap-4">
              <Card className="flex-1">
                <CardBody>
                  <h3 className="text-lg font-semibold mb-2 p-3">
                    Are you ready?
                  </h3>
                </CardBody>
                <CardFooter className="flex justify-end p-5">
                  <Button
                    color="primary"
                    onClick={() => setIsMatchUIVisible(true)}
                  >
                    Start a new session
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="w-1/4">
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold mb-2 p-3">Friends</h3>
                <ul className="space-y-4 min-h-40" />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
