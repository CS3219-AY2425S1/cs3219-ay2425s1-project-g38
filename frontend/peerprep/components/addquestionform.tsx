import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { useQuestionForm } from "../hooks/useQuestionForm";

import { SuccessModal } from "./succesmodal";
import { ErrorModal } from "./errormodal";

import { QuestionFormBase } from "@/components/questionformshared/QuestionFormBase";
import {
  isValidQuestionSubmission,
  submitQuestion,
} from "@/services/questionService";

export default function AddQuestionForm() {
  const router = useRouter();
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formState = useQuestionForm({
    description:
      "# Question description \n Write your question description here! \n You can also insert images!",
    templateCode: "/** PUT YOUR TEMPLATE CODE HERE **/",
  });

  const handleSubmit = async () => {
    if (
      !isValidQuestionSubmission(
        formState.title,
        formState.description,
        formState.categories,
        formState.templateCode,
        formState.testCases,
        formState.language,
      )
    ) {
      setErrorMessage(
        "Please fill in all the required fields before submitting.",
      );
      setErrorModalOpen(true);

      return;
    }

    try {
      const response = await submitQuestion(
        formState.title,
        formState.description,
        formState.categories,
        formState.selectedTab,
        formState.templateCode,
        formState.testCases,
        formState.language,
        formState.YDocUpdate,
      );

      if (response.ok) {
        setSuccessMessage("Question successfully submitted!");
        setSuccessModalOpen(true);
      } else {
        const errorData = await response.json();

        setErrorMessage(
          errorData.error || "Failed to submit the question. Please try again.",
        );
        setErrorModalOpen(true);
      }
    } catch (error) {
      setErrorMessage(
        "An error occurred while submitting the question. Please try again later",
      );
      setErrorModalOpen(true);
    }
  };

  return (
    <>
      <QuestionFormBase
        {...formState}
        onCancel={() => router.push("/questions-management")}
        onSubmit={handleSubmit}
      />
      <SuccessModal
        isOpen={successModalOpen}
        message={successMessage}
        onConfirm={() => {
          setSuccessModalOpen(false);
          router.push("/questions-management");
        }}
        onOpenChange={setSuccessModalOpen}
      />
      <ErrorModal
        isOpen={errorModalOpen}
        onOpenChange={setErrorModalOpen}
        errorMessage={errorMessage}
      />
    </>
  );
}
