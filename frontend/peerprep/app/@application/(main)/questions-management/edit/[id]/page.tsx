"use client";
import * as Y from "yjs";

import EditQuestionForm from "@/components/editquestionform";

export default function AddQuestionsPage() {
  const yDoc = new Y.Doc();

  return (
    <div className="flex">
      <EditQuestionForm yDoc={yDoc} />
    </div>
  );
}
