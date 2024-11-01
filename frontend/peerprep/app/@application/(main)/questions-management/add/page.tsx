"use client";
import AddQuestionForm from "@/components/addquestionform";
import * as Y from "yjs";

export default function AddQuestionsPage() {
  const yDoc = new Y.Doc();
  return (
    <div className="flex">
      <AddQuestionForm yDoc={yDoc} />
    </div>
  );
}
