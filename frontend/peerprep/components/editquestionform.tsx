import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDisclosure } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

import { useQuestionForm } from "../hooks/useQuestionForm";

import { DeleteConfirmationModal } from "./deleteconfirmationmodal";
import { SuccessModal } from "./succesmodal";
import { ErrorModal } from "./errormodal";
import BoxIcon from "./boxicons";

import { QuestionFormBase } from "@/components/questionformshared/QuestionFormBase";
import { Question } from "@/app/@application/(main)/questions-management/columns";
import {
  deleteQuestion,
  editQuestion,
  useQuestionDataFetcher,
  isValidQuestionSubmission,
} from "@/services/questionService";

export default function EditQuestionForm() {
  const params = useParams();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(
    null,
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  const formState = useQuestionForm({});
  const questionId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { questionData, questionLoading } = useQuestionDataFetcher(questionId);

  useEffect(() => {
    if (questionData?.question && !questionLoading) {
      // Update form state with question data
      formState.setTitle(questionData.question.title);
      formState.setSelectedComplexity(questionData.question.complexity);
      formState.setCategories(questionData.question.category);
      formState.setLanguage(questionData.question.language.toLowerCase());
      formState.setDescription(questionData.question.description);
      formState.setTemplateCode(questionData.question.templateCode);
      formState.setTestCases(
        questionData.question.testCases.flatMap((testCasesArray: string[]) =>
          testCasesArray.map((testCase: string) => {
            const [input, output] = testCase
              .split("->")
              .map((str) => str.trim());

            return { input, output };
          }),
        ) || [],
      );
      setQuestionToDelete(questionData.question);
    }
  }, [questionData, questionLoading]);

  const handleEdit = async () => {
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
      setErrorModalOpen(true); // Show error modal with the validation message

      return;
    }

    try {
      const response = await editQuestion(
        questionId,
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
        setSuccessMessage("Question updated successfully!");
        setSuccessModalOpen(true); // Open the success modal
      } else {
        const errorData = await response.json();

        setErrorMessage(
          errorData.error || "Failed to update the question. Please try again.",
        );
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error updating the question:", error);
      setErrorMessage("An error occurred while updating the question.");
      setErrorModalOpen(true); // Show error modal with the error message
    }
  };

  const handleDelete = () => {
    onOpen();
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteQuestion(questionId);

      if (response.ok) {
        setSuccessMessage("Question deleted successfully!");
        setSuccessModalOpen(true); // Open the success modal
      } else {
        setErrorMessage("Failed to delete the question. Please try again.");
        setErrorModalOpen(true); // Show error modal with the error message
      }
    } catch (error) {
      console.error("Error deleting the question:", error);
      setErrorMessage("An error occurred while deleting the question.");
      setErrorModalOpen(true); // Show error modal with the error message
    }
  };

  const deleteButton = (
    <Button
      className="pr-5"
      color="danger"
      startContent={<BoxIcon name="bx-trash" size="20px" />}
      variant="light"
      onClick={handleDelete}
    >
      Delete
    </Button>
  );

  return (
    <>
      <QuestionFormBase
        {...formState}
        onCancel={() => router.push("/questions-management")}
        onSubmit={handleEdit}
        additionalButtons={deleteButton}
      />
      <DeleteConfirmationModal
        isOpen={isOpen}
        questionToDelete={questionToDelete}
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
      <SuccessModal
        isOpen={successModalOpen}
        message={successMessage}
        onConfirm={() => router.push("/questions-management")}
        onOpenChange={setSuccessModalOpen}
      />
      <ErrorModal
        errorMessage={errorMessage}
        isOpen={errorModalOpen}
        onOpenChange={setErrorModalOpen}
      />
    </>
  );
}
