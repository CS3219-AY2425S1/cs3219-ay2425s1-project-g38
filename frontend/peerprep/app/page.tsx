"use client";

import {
  Progress,
  Button,
  Avatar,
  Badge,
  Spacer,
  Divider,
} from "@nextui-org/react";

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";

export default function Home() {
  const friends = [
    { name: "s_name", status: "online" },
    { name: "thisisalongusername", status: "online" },
    { name: "Friend3", status: "hidden" },
    { name: "Friend4", status: "offline" },
  ];

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-center">
        Hey there! Ready for some coding challenges? 🧑‍💻
      </h1>

      {/* Layout container */}
      <div className="flex flex-wrap justify-center gap-8 w-full mt-8">
        {/* Left Column */}
        <div className="flex-1 min-w-[300px]">
          {/* Start a new session */}
          <div className="flex gap-4">
            <Card className="flex-1">
              <CardBody>
                <h3 className="text-lg font-semibold mb-2 p-3">
                  Are you ready?
                </h3>
              </CardBody>
              <CardFooter className="flex justify-end p-5">
                <Button color="primary">Start a new session</Button>
              </CardFooter>
            </Card>
            <Card className="flex-1">
              <CardBody>
                <h3 className="text-lg font-semibold mb-2 p-3">
                  Current Score
                </h3>
                <h3 className="text-4xl font-bold">1600</h3>
                <Progress value={75} color="primary" className="w" />
                <span>75%</span>
              </CardBody>
            </Card>
          </div>

          <Spacer y={5} />

          {/* Activity Heatmap */}
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold mb-2">
                Activities in the last year
              </h3>
              <div className="h-[100px] bg-gray-200">
                {/* Placeholder for heatmap */}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column (Friends List) */}
        <div className="flex-shrink-0 min-w-[250px]">
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold mb-4">Friends</h3>
              <ul className="space-y-4">
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
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="w-full mt-8">
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">Activity Feed</h3>
            <Divider />
            <div className="space-y-4 mt-4">
              {/* Mock activity feed */}
              <div>
                <h4 className="font-medium">
                  JayCee completed 'Split Linked List in Parts'
                </h4>
                <p className="text-sm">
                  With jweng5551 | Linked List - Medium | +200 points
                </p>
              </div>
              <div>
                <h4 className="font-medium">
                  jweng5551 completed 'Split Linked List in Parts'
                </h4>
                <p className="text-sm">
                  With JayCee | Linked List - Medium | +200 points
                </p>
              </div>
              <div>
                <h4 className="font-medium">
                  DelilShad completed 'Regular Expression Matching'
                </h4>
                <p className="text-sm">
                  With You | Dynamic Programming - Hard | +500 points
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Spacer y={2} />
    </div>
  );
}
