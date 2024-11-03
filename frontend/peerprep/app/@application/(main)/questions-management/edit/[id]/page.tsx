"use client";
import EditQuestionForm from "@/components/editquestionform";
import * as Y from "yjs";

export default function AddQuestionsPage() {
  const yDoc = new Y.Doc();
  return (
    <div className="flex">
      <EditQuestionForm yDoc={yDoc} />
    </div>
  );
}
