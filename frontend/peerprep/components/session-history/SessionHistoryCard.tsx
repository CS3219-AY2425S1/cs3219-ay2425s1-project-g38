import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  ScrollShadow,
  Tooltip,
} from "@nextui-org/react";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useRouter } from "next/navigation";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { useTheme } from "next-themes";

import BoxIcon from "@/components/boxicons";
import { capitalize } from "@/utils/utils";

interface SessionHistoryCardProps {
  sessionId: string;
  title: string;
  partner: string;
  categories: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
  date: Date;
  description: string;
}

const difficultyColors = {
  EASY: "success",
  MEDIUM: "warning",
  HARD: "danger",
} as const;

export default function SessionHistoryCard({
  sessionId,
  title,
  partner,
  categories,
  difficulty,
  date,
  description,
}: SessionHistoryCardProps) {
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });
  const { theme } = useTheme();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/session-history/${sessionId}?username=${partner}`);
  };

  return (
    <Card
      shadow="sm"
      className="w-full hover:shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]"
      radius="sm"
      onClick={handleClick}
    >
      <CardHeader
        className="flex flex-col items-start px-4 pt-3 pb-3 cursor-pointer  "
        onClick={handleClick}
      >
        <div className="flex justify-between w-full items-center group">
          <div className="flex text-md font-medium">
            You did&nbsp;
            <div className="flex flex-row items-center gap-1">
              <span className="text-violet-500 font-semibold">{title}</span>
              <Tooltip
                content={
                  <ScrollShadow
                    size={20}
                    className="flex flex-col w-[480px] max-h-[600px] overflow-y-auto"
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      components={{
                        code(props) {
                          const { className, children } = props;
                          const match = /language-(\w+)/.exec(className || "");

                          return match ? (
                            <SyntaxHighlighter
                              style={
                                theme === "dark" ? oneDark : (oneLight as any)
                              }
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
                      {description}
                    </ReactMarkdown>
                  </ScrollShadow>
                }
                placement="right"
                showArrow
              >
                <div className="flex items-center justify-center">
                  <BoxIcon
                    name="bx-info-circle"
                    size="16px"
                    className="text-violet-500 hover:text-violet-600"
                  />
                </div>
              </Tooltip>
            </div>
            &nbsp;with&nbsp;
            <p className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent font-semibold">
              {partner}
            </p>
          </div>
          <span className="text-xs text-gray-400 group-hover:hidden p-1">
            {timeAgo}
          </span>
          <div className="hidden group-hover:block">
            <BoxIcon
              name="bx-right-arrow-alt"
              size="18px"
              className="text-gray-500 dark:text-gray-200"
            />
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="py-5 justify-end">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs">Difficulty:</span>
            <Chip size="sm" variant="flat" color={difficultyColors[difficulty]}>
              {capitalize(difficulty)}
            </Chip>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">Categories:</span>
            <div className="flex flex-row gap-2">
              {categories.map((category, index) => (
                <Chip key={index} size="sm" variant="flat">
                  {capitalize(category)}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
