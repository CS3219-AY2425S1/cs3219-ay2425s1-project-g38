import React from "react";
import { useMatchHistoryFetcher } from "@/services/userService";
import SessionHistoryCard from "@/components/SessionHistoryCard";
import { Card, Skeleton, Spinner } from "@nextui-org/react";
import { useQuestionDataFetcher } from "@/services/questionService";

const SessionHistory = () => {
  const { matchHistory, error, isLoading } = useMatchHistoryFetcher();

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading match history</div>;

  return (
    <div className="flex flex-col gap-4">
      {matchHistory.map((match: Match) => (
        <SessionCard key={match.sessionId} match={match} />
      ))}
    </div>
  );
};

interface Match {
  sessionId: string;
  questionId: string;
  partnerUsername: string;
  date: Date;
  // Add other properties if needed
}

const SessionCard = ({ match }: { match: Match }) => {
  const { questionData, questionLoading } = useQuestionDataFetcher(
    match.questionId
  );

  if (questionLoading) {
    return (
      <Card className="w-full space-y-5 p-4" radius="lg">
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-default-300"></div>
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
          </Skeleton>
        </div>
      </Card>
    );
  }

  if (!questionData || !questionData.question) {
    return null;
  }

  return (
    <SessionHistoryCard
      key={match.sessionId}
      title={questionData.question.title}
      partner={match.partnerUsername}
      categories={questionData.question.category}
      difficulty={questionData.question.complexity}
      date={new Date(match.date)}
      description={questionData.question.description}
    />
  );
};

export default SessionHistory;
