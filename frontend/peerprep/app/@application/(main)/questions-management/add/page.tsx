"use client";
import * as Y from "yjs";

import AddQuestionForm from "@/components/addquestionform";

export default function AddQuestionsPage() {
  const yDoc = new Y.Doc();

  return (
    <div className="flex">
      <AddQuestionForm yDoc={yDoc} />
    </div>
  );
}
