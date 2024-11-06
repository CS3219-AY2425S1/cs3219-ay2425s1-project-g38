import { capitalize } from "@/utils/utils";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Tooltip,
} from "@nextui-org/react";
import { formatDistanceToNow } from "date-fns";
import BoxIcon from "@/components/boxicons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

interface SessionHistoryCardProps {
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
  title,
  partner,
  categories,
  difficulty,
  date,
  description,
}: SessionHistoryCardProps) {
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });

  return (
    <Card shadow="sm" className="w-full" radius="sm">
      <CardHeader className="flex flex-col items-start px-4 pt-3 pb-3">
        <div className="flex justify-between w-full items-center">
          <div className="flex text-md font-semibold">
            You did&nbsp;
            <div className="flex flex-row items-center gap-1">
              <u className="text-violet-500">{title}</u>
              <Tooltip
                content={
                  <div className="prose dark:prose-invert w-[480px] break-words">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                      components={{
                        pre: ({ node, ...props }) => (
                          <div className="overflow-auto max-w-full">
                            <pre {...props} />
                          </div>
                        ),
                      }}
                    >
                      {description}
                    </ReactMarkdown>
                  </div>
                }
                placement="right"
                showArrow
              >
                <button className="focus:outline-none">
                  <BoxIcon
                    name="bx-info-circle"
                    size="16px"
                    className="text-violet-500 hover:text-violet-600"
                  />
                </button>
              </Tooltip>
            </div>
            &nbsp;with&nbsp;
            <p className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent font-semibold">
              {partner}
            </p>
          </div>
          <span className="text-xs text-gray-400">{timeAgo}</span>
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
