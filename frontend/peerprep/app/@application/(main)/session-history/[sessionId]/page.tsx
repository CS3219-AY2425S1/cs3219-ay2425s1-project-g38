"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Card, Chip, CardBody, Divider } from "@nextui-org/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

import { SupportedLanguages } from "@/utils/utils"; // Assuming this is where the languages are defined
import BoxIcon from "@/components/boxicons";
import SkeletonCard from "@/components/session-history/SkeletonCard";
import BackButton from "@/components/session-history/BackButton";
import { capitalize } from "@/utils/utils";
import { getSessionDetails } from "@/services/sessionAPI";

const SessionDetailsPage: React.FC = () => {
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId as string;
  const username = searchParams.get("username");
  const { theme } = useTheme();

  useEffect(() => {
    if (!sessionId) return;

    const fetchSessionDetails = async () => {
      try {
        const result = await getSessionDetails(sessionId);

        if (result.status === "success") {
          setSessionData(result.data);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error fetching session details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 w-full mr-2">
        <BackButton />
        <div className="flex flex-row gap-5 items-center">
          <div className="flex flex-row gap-2 items-center">
            <BoxIcon name="bx-history" />
            <div className="flex flex-row text-md text-nowrap">
              Match history with:&nbsp;
              <p className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent font-semibold w-full">
                {username}
              </p>
            </div>
          </div>
          <div className="animate-pulse min-w-[150px] min-h-[22px] bg-gray-600/80 rounded-md" />
        </div>
        <div className="flex flex-row gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return <div>Error loading session details.</div>;
  }

  const { question, attemptCode, dateCreated, language } = sessionData;

  return (
    <div className="flex flex-col gap-3 mr-2">
      <BackButton />
      <div className="flex flex-row gap-5 items-center">
        <div className="flex flex-row gap-2 items-center">
          <BoxIcon name="bx-history" />
          <div className="flex flex-row text-md text-nowrap">
            Match history with:&nbsp;
            <p className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent font-semibold w-full">
              {username}
            </p>
          </div>
        </div>
        <Chip
          size="md"
          variant="dot"
          radius="sm"
          startContent={<BoxIcon name="bx-calendar-check" size="16px" />}
        >
          {new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }).format(new Date(dateCreated))}
        </Chip>
      </div>
      <div className="flex flex-row gap-2">
        <Card radius="sm" className="flex flex-col w-1/2 pt-4" shadow="sm">
          <h1 className="text-left text-lg font-semibold px-4 mb-4">
            Question
          </h1>
          <Divider />
          <div className="p-4">
            <h2 className="text-lg font-medium mb-1 text-left">
              {question.title}
            </h2>
            <div className="flex flex-row gap-2 text-gray-500 text-xs items-center mb-4">
              <div className="flex items-center">
                <Chip
                  size="sm"
                  variant="flat"
                  color={
                    difficultyColors[
                      question.complexity as keyof typeof difficultyColors
                    ]
                  }
                >
                  {capitalize(question.complexity)}
                </Chip>
              </div>
              |
              <div className="flex flex-row items-center gap-2">
                {question.category.map((category: string, index: number) => (
                  <Chip size="sm" key={index}>
                    {capitalize(category)}
                  </Chip>
                ))}
              </div>
            </div>
            <CardBody className="flex flex-col w-full text-wrap p-0 text-sm font-light leading-loose">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                  code(props) {
                    const { className, children, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || "");

                    return match ? (
                      <SyntaxHighlighter
                        style={theme === "dark" ? oneDark : (oneLight as any)}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ fontSize: "0.75rem" }}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
                className="space-y-2"
              >
                {question.description}
              </ReactMarkdown>
            </CardBody>
          </div>
        </Card>
        <Card className="flex flex-col w-1/2 pt-4" radius="sm" shadow="sm">
          <h1 className="text-left text-lg font-semibold px-4 mb-4">
            Submission
          </h1>
          <Divider />
          <SyntaxHighlighter
            language={language.toLowerCase() as SupportedLanguages}
            style={theme === "dark" ? oneDark : oneLight}
            customStyle={{
              fontSize: "0.75rem",
              margin: "1rem",
              height: "100%",
              borderRadius: "0.3rem",
            }}
          >
            {attemptCode}
          </SyntaxHighlighter>
        </Card>
      </div>
    </div>
  );
};

const difficultyColors = {
  EASY: "success",
  MEDIUM: "warning",
  HARD: "danger",
} as const;

export default SessionDetailsPage;
