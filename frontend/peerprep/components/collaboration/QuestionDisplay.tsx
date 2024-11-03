"use client";

import { useTheme } from "next-themes";
import { Card, CardBody } from "@nextui-org/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Chip } from "@nextui-org/react";

import Chat from "./Chat";

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
        <Card className="flex flex-col h-3/5 w-full p-4 bg-gray-200 dark:bg-gray-800">
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
              <div className="flex flex-col w-full h-full">
                <h2 className="text-xl font-bold mb-2">Test Cases:</h2>
                <div className="flex flex-col w-full h-full overflow-y-auto">
                  <div className="flex flex-row mb-2">
                    <div className="flex-1 text-start w-1/2 font-bold px-2">
                      {testCases.length > 1 ? "Inputs" : "Input"}
                    </div>
                    <div className="flex-1 text-start w-1/2 font-bold px-2">
                      {testCases.length > 1 ? "Outputs" : "Output"}
                    </div>
                  </div>
                  {testCases?.map((testCase, index) => {
                    const [input, output] = testCase
                      .split("->")
                      .map((str) => str.trim());

                    return (
                      <div
                        key={index}
                        className="flex flex-row mb-2 max-2-full"
                      >
                        <Card className="flex w-1/2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg shadow min-h-[35px] mr-2 break-words">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                          >
                            {input}
                          </ReactMarkdown>
                        </Card>
                        <Card className="flex p-1 w-1/2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow min-h-[35px] mr-2 break-words">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                          >
                            {output}
                          </ReactMarkdown>
                        </Card>
                      </div>
                    );
                  })}
                </div>
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
