"use client";

import { Button, Textarea } from "@nextui-org/react";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { useState } from "react";

import MatchUI from "@/components/matching/MatchUI";

export default function Home() {
  const [isMatchUIVisible, setIsMatchUIVisible] = useState<boolean>(false);

  const handleClose = () => {
    setIsMatchUIVisible(false);
  };

  const updateLocalJwt = (value: string) => {
    console.log("Updating JWT in localStorage to:", value);
    localStorage.setItem("jwt", value);
  };

  return (
    <>
      <div>{isMatchUIVisible && <MatchUI onClose={handleClose} />}</div>
      <div className="flex flex-col items-center p-8">
        <h1 className="text-3xl font-bold text-center">
          Hey there! Ready for some coding challenges? 🧑‍💻
        </h1>

        {/* Layout container */}
        <div className="flex justify-center gap-8 w-full mt-8">
          {/* Left Column */}
          <div className="w-3/4">
            {/* Start a new session */}
            <div className="flex gap-4">
              <Card className="flex-1">
                <CardBody>
                  <h3 className="text-lg font-semibold mb-2 p-3">
                    Are you ready?
                  </h3>
                </CardBody>
                <CardFooter className="flex justify-end p-5">
                  <Textarea
                    label="JSONWebToken"
                    placeholder=""
                    className="w-50 pr-5"
                    onValueChange={updateLocalJwt}
                  />
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

          {/* Right Column (Friends List) */}
          <div className="w-1/4">
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold mb-2 p-3">Friends</h3>
                <ul className="space-y-4 min-h-40">
                  {/* LOAD FRIENDS FOR FUTURE IMPLEMENTATION
                {friends.map((friend, idx) => (
                  <li key={idx} className="flex items-center">
                    <Avatar name={friend.name} />
                    <div className="ml-4">
                      <h4 className="font-medium">{friend.name}</h4>
                      <Badge
                        color={
                          friend.status === "online"
                            ? "success"
                            : friend.status === "hidden"
                              ? "warning"
                              : "danger"
                        }
                      >
                        {friend.status}
                      </Badge>
                    </div>
                  </li>
                ))} */}
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
