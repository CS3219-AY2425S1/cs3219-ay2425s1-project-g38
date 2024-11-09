import { SortDescriptor } from "@nextui-org/react";
import { SharedSelection } from "@nextui-org/system";
import { env } from "next-runtime-env";
import useSWR from "swr";

import { getAccessToken } from "@/auth/actions";

const NEXT_PUBLIC_QUESTION_SERVICE_URL = env(
  "NEXT_PUBLIC_QUESTION_SERVICE_URL",
);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useUniqueCategoriesFetcher = () => {
  const { data, error, isLoading } = useSWR(
    `${NEXT_PUBLIC_QUESTION_SERVICE_URL}/api/questions/categories/unique`,
    fetcher,
  );

  return {
    categoryData: data,
    categoryError: error,
    categoryLoading: isLoading,
  };
};

export const useQuestionDataFetcher = (questionId: string) => {
  const { data, error, isLoading } = useSWR(
    `${NEXT_PUBLIC_QUESTION_SERVICE_URL}/api/questions/${questionId}`,
    fetcher,
  );

  return {
    questionData: data,
    error,
    questionLoading: isLoading,
  };
};

export const useQuestionsFetcher = (
  searchFilter?: string,
  complexityFilter?: string | null,
  categoryFilter?: string | SharedSelection,
  sortDescriptor?: SortDescriptor, // Specify the structure for sortDescriptor
  page?: number,
) => {
  // Create an array to hold the query parameters
  const queryParams: string[] = [];

  // Add search filter to query parameters if present
  if (searchFilter) {
    queryParams.push(`title=${encodeURIComponent(searchFilter)}`);
  }

  // Add complexity filter to query parameters if present
  if (complexityFilter) {
    queryParams.push(`complexity=${encodeURIComponent(complexityFilter)}`);
  }

  // Add category filter to query parameters if present
  if (categoryFilter) {
    categoryFilter !== "all"
      ? Array.from(categoryFilter).forEach((category) => {
          queryParams.push(`category=${encodeURIComponent(category)}`);
        })
      : null;
  }

  // Add sorting information if present
  if (sortDescriptor) {
    const sortParam = `sort=${sortDescriptor.direction === "descending" ? "-" : ""}${sortDescriptor.column}`;

    queryParams.push(sortParam);
  }

  // Add page number to query parameters if present
  if (page) {
    queryParams.push(`page=${page}`);
  } else {
    queryParams.push(`page=1`);
  }

  // Construct the final API URL by joining the base URL with the query parameters
  const apiUrl =
    `${NEXT_PUBLIC_QUESTION_SERVICE_URL}/api/questions?` +
    queryParams.join("&");

  // Use SWR to fetch data
  const { data, error, isLoading } = useSWR(apiUrl, fetcher);

  return {
    questionData: data,
    error,
    questionLoading: isLoading,
  };
};

export const isValidQuestionSubmission = (
  title: string,
  description: string,
  category: string[],
  templateCode: string,
  testCases: any[],
  language: string, // New field
) => {
  return !(
    !title.trim() ||
    !description.trim() ||
    !language.trim() || // Language must not be empty
    !category.length ||
    !templateCode.trim() ||
    !testCases.every(
      (testCase) =>
        testCase.input.trim() !== "" && testCase.output.trim() !== "",
    )
  );
};

const createAuthHeaders = async () => {
  const token = await getAccessToken(); // Get the token dynamically

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Submit a new question to the API
export const submitQuestion = async (
  title: string,
  description: string,
  category: string[],
  complexity: string,
  templateCode: string,
  testCases: any[],
  language: string, // New field
  templateCodeYDocUpdate: Uint8Array,
) => {
  const formData = {
    title,
    description,
    category,
    complexity,
    templateCode,
    testCases: testCases.map(
      (testCase) => `${testCase.input} -> ${testCase.output}`,
    ),
    language, // New field
    templateCodeYDocUpdate: Buffer.from(templateCodeYDocUpdate),
  };

  const headers = await createAuthHeaders(); // Attach token

  const response = await fetch(
    `${NEXT_PUBLIC_QUESTION_SERVICE_URL}/api/questions/`,
    {
      method: "POST",
      // headers: {
      //   'Content-Type': 'application/json',
      // },
      headers,
      body: JSON.stringify(formData),
    },
  );

  return response;
};

export const editQuestion = async (
  questionId: string,
  title: string,
  description: string,
  category: string[],
  complexity: string,
  templateCode: string,
  testCases: any[],
  language: string, // New field
  templateCodeYDocUpdate: Uint8Array,
) => {
  const formData = {
    title,
    description,
    category,
    complexity,
    templateCode,
    testCases: testCases.map(
      (testCase) => `${testCase.input} -> ${testCase.output}`,
    ),
    language, // Include the language field,
    templateCodeYDocUpdate: Buffer.from(templateCodeYDocUpdate),
  };
  const headers = await createAuthHeaders(); // Attach token

  const response = await fetch(
    `${NEXT_PUBLIC_QUESTION_SERVICE_URL}/api/questions/${questionId}`,
    {
      method: "PUT",
      // headers: {
      //   'Content-Type': 'application/json',
      // },
      headers,
      body: JSON.stringify(formData),
    },
  );

  return response;
};

export const deleteQuestion = async (questionId: string) => {
  const headers = await createAuthHeaders(); // Attach token
  const response = await fetch(
    `${NEXT_PUBLIC_QUESTION_SERVICE_URL}/api/questions/${questionId}`,
    {
      method: "DELETE",
      headers,
    },
  );

  return response;
};
