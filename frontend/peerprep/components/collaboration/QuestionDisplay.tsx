"use client";

import { useState, useEffect, use } from "react";
import { useTheme } from "next-themes";
import { Card, CardBody } from "@nextui-org/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Chip } from "@nextui-org/react";

import { socket } from "../../services/sessionService";
import Chat from "./Chat";
import { useQuestionDataFetcher } from "@/services/questionService";
import { capitalize } from "@/utils/utils";

interface QuestionDisplayProps {
  questionId: string;
  questionDifficulty: string;
  questionTitle: string;
  questionCategory: string[];
  questionDescription: string;
  testCases: string[];
  propagateMessage: any;
  chatHistory: any;
  username: string;
}

export default function QuestionDisplay({
  questionId,
  questionDifficulty,
  questionTitle,
  questionCategory,
  questionDescription,
  testCases,
  propagateMessage,
  chatHistory,
  username,
}: QuestionDisplayProps) {
  const { theme } = useTheme();

  const renderStars = () => {
    switch (questionDifficulty) {
      case "EASY":
        return <span className="text-2xl font-bold text-green-500">★</span>;
      case "MEDIUM":
        return (
          <>
            <span className="text-2xl font-bold text-orange-500">★</span>
            <span className="text-2xl font-bold text-orange-500">★</span>
          </>
        );
      case "HARD":
        return (
          <>
            <span className="text-2xl font-bold text-red-500">★</span>
            <span className="text-2xl font-bold text-red-500">★</span>
            <span className="text-2xl font-bold text-red-500">★</span>
          </>
        );
      case "None":
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="flex flex-col w-full h-full gap-4 p-4">
        <Card className="flex flex-col h-3/5 w-full p-4 bg-gray-200 dark:bg-gray-800 shadow-sm">
          <h2 className="text-xl font-bold ml-3 mb-1 mt-1">{`${questionId}. ${questionTitle}`}</h2>
          <div className="flex items-center ml-3 mb-2">
            <div className="pr-2">Difficulty:</div>
            {renderStars()}
          </div>
          <div className="flex flex-row gap-2 pb-2 ml-2">
            {questionCategory?.map((category, index) => (
              <Chip key={index} color="primary" className="text-sm">
                {capitalize(category)}
              </Chip>
            ))}
          </div>
          <CardBody className="flex flex-col w-full h-full overflow-y-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {questionDescription}
            </ReactMarkdown>
          </CardBody>
        </Card>
        <div className="flex flex-col w-full h-2/5">
          <div className="flex flex-row w-full h-full gap-4">
            <Card className="flex flex-col w-1/2 h-full p-4">
              <div className="flex flex-col w-full h-1/4">
                <h2 className="text-xl font-bold mb-4">Test Cases:</h2>
                {testCases?.map((testCase, index) => (
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
