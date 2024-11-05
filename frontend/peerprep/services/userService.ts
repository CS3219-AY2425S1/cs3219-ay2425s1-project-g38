import { env } from "next-runtime-env";
import useSWR from "swr";

import { getAccessToken, getSession } from "@/auth/actions";

const NEXT_PUBLIC_USER_SERVICE_URL = env("NEXT_PUBLIC_USER_SERVICE_URL");

// Custom fetcher that includes auth token and handles session
const fetcher = async (url: string) => {
  const token = await getAccessToken();
  const session = await getSession();
  
  if (!session?.userId) {
    throw new Error("No session found");
  }

  const response = await fetch(url.replace(":userId", session.userId), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch match history");
  }
  
  return response.json();
};

export const useMatchHistoryFetcher = () => {
  const { data, error, isLoading } = useSWR(
    `${NEXT_PUBLIC_USER_SERVICE_URL}/users/:userId/match-history`,
    fetcher
  );

  return {
    matchHistory: data?.data || [],
    error,
    isLoading,
  };
}; 