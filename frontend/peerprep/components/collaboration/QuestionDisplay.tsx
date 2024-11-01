"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Card, CardBody } from "@nextui-org/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Chip } from "@nextui-org/react";

import { socket } from "../../services/sessionService";
import Chat from "./Chat";

interface QuestionDisplayProps {
  question: string;
  testCases: string[];
  propagateMessage: any;
  chatHistory: any;
  username: string;
}

export default function QuestionDisplay({
  question,
  testCases,
  propagateMessage,
  chatHistory,
  username,
}: QuestionDisplayProps) {
  const { theme } = useTheme();

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="flex flex-col w-full h-full gap-4 p-4">
        <Card className="flex flex-col h-3/5 w-full p-4 bg-gray-200 dark:bg-gray-800">
          <h2 className="text-xl font-bold ml-3">Question:</h2>
          <div className="flex items-center ml-3 mb-2">
            {/* Difficulty Stars */}
            <div className="pr-2">Difficulty:</div>
            <span className="text-2xl font-bold text-green-500">★</span>
            <span className="text-2xl font-bold text-green-500">★</span>
            <span className="text-2xl font-bold text-green-500">★</span>
          </div>
          <div className="flex flex-row gap-2 pb-2 ml-2">
            <Chip color="primary" className="text-sm">
              Category Placeholder
            </Chip>
            <Chip color="primary" className="text-sm">
              Category Placeholder
            </Chip>
          </div>
          <CardBody className="flex flex-col w-full h-full overflow-y-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {question}
            </ReactMarkdown>
          </CardBody>
        </Card>
        <div className="flex flex-col w-full h-2/5">
          <div className="flex flex-row w-full h-full gap-4">
            <Card className="flex flex-col w-1/2 h-full p-4">
              <div className="flex flex-col w-full h-1/4">
                <h2 className="text-xl font-bold mb-4">Test Cases:</h2>
                {testCases.map((testCase, index) => (
                  <Card
                    key={index}
                    className="mb-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg shadow min-h-[35px]"
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                      {testCase}
                    </ReactMarkdown>
                  </Card>
                ))}
              </div>
            </Card>
            <div className="flex w-1/2 h-full">
              <Chat
                username={username}
                propagateMessage={propagateMessage}
                chatHistory={chatHistory}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
