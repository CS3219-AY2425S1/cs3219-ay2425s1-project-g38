"use client";
import QuestionsTable from "@/components/questionstable";

// async function getQuestions(): Promise<Question[]> {
//   // Make sure the fetch URL includes http:// or https://
//   const res = await fetch("http://localhost:8003/api/questions/categories/unique");

//   // Check for a successful response
//   if (!res.ok) {
//     throw new Error(`Failed to fetch questions: ${res.statusText}`);
//   }

//   // Parse the response as JSON
//   const data = await res.json();

//   // Return the questions part of the JSON response
//   return data.uniqueCategories;
// }

export default function QuestionsPage() {
  // const { data, isLoading } = useSWR(
  //   `http://localhost:8003/api/questions/categories/unique`,
  //   fetcher
  // );
  // let questions = await getQuestions();

  // console.log(questions);

  // let questions = Questions.questions;

  // const allCategories = questions.flatMap((question) => question.category);
  // const uniqueCategories = Array.from(new Set(allCategories));

  // setCategoryOptions(Array.from(data?.uniqueCategories));

  return (
    <div className="flex-grow">
      <QuestionsTable />
    </div>
  );
}
