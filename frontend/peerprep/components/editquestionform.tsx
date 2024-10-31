import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Input,
  Button,
  Tab,
  Tabs,
  Chip,
  Autocomplete,
  AutocompleteItem,
  ScrollShadow,
  useDisclosure,
} from "@nextui-org/react";
import Editor from "@monaco-editor/react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { DeleteConfirmationModal } from "./deleteconfirmationmodal";
import { SuccessModal } from "./succesmodal";
import { ErrorModal } from "./errormodal";
import { WysiMarkEditor } from "./wysimarkeditor";
import BoxIcon from "./boxicons";

import { capitalize, languages } from "@/utils/utils";
import {
  complexityColorMap,
  Question,
} from "@/app/@application/(main)/questions-management/columns";
import {
  deleteQuestion,
  editQuestion,
  useQuestionDataFetcher,
  useUniqueCategoriesFetcher,
  isValidQuestionSubmission,
} from "@/services/questionService";
import * as Y from "yjs";

interface EditQuestionFormProps {
  initialTitle?: string;
  initialDescription?: string;
  initialComplexity?: string;
  initialCategories?: string[];
  initialTemplateCode?: string;
  initialTestCases?: { input: string; output: string }[];
  // initialLanguage?: string; // NEW FIELD
}

export default function EditQuestionForm({
  initialTitle = "",
  initialDescription = "",
  initialComplexity = "Easy",
  initialCategories = [],
  initialTemplateCode = "",
  initialTestCases = [{ input: "", output: "" }],
}: // initialLanguage = "javascript", // Default language
EditQuestionFormProps) {
  // Yjs setup for saving template code
  const yDoc = new Y.Doc();
  const yText = yDoc.getText("code");
  const editorRef = useRef<any>(null);
  const [YDocUpdate, setYDocUpdate] = useState<Uint8Array>(
    Y.encodeStateAsUpdateV2(yDoc)
  );

  const onMount = async (editor: any) => {
    editorRef.current = editor;
    const model = editor.getModel();

    if (model) {
      const MonacoBinding = (await import("y-monaco")).MonacoBinding; // not dynamically importing this causes an error
      const binding = new MonacoBinding(yText, model, new Set([editor]));
    }

    model.setValue(initialTemplateCode);

    yDoc.on("update", () => {
      // console.log("Yjs update");
      // console.log(yText.toString());
      // console.log(Y.encodeStateAsUpdateV2(yDoc));
      setYDocUpdate(Y.encodeStateAsUpdateV2(yDoc));
    });
  };

  const params = useParams();
  const router = useRouter();
  const [language, setLanguage] = useState("javascript"); // Default language
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { theme } = useTheme();

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSuccessModalOpen, setSuccessModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isErrorModalOpen, setErrorModalOpen] = useState<boolean>(false);

  const [selectedTab, setSelectedComplexity] =
    useState<string>(initialComplexity);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [warnMessage, setWarnMessage] = useState<string>("");
  const [title, setTitle] = useState<string>(initialTitle);
  const [description, setDescription] = useState<string>(initialDescription);
  const [templateCode, setTemplateCode] = useState<string>(initialTemplateCode);
  const [testCases, setTestCases] =
    useState<{ input: string; output: string }[]>(initialTestCases);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(
    null
  );
  const [question, setQuestion] = useState<Question | null>(null);

  const { categoryData, categoryLoading } = useUniqueCategoriesFetcher();

  const questionId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { questionData, questionLoading } = useQuestionDataFetcher(questionId);

  useEffect(() => {
    if (params.id && !questionLoading) {
      setTitle(questionData?.question.title);
      setSelectedComplexity(questionData?.question.complexity);
      setCategories(questionData?.question.category);
      setLanguage(questionData?.question.language.toLowerCase());
      setDescription(questionData?.question.description);
      setTemplateCode(questionData?.question.templateCode);
      setTestCases(
        questionData?.question.testCases.flatMap((testCasesArray: string[]) =>
          testCasesArray.map((testCase: string) => {
            const [input, output] = testCase
              .split("->")
              .map((str) => str.trim());

            return { input, output };
          })
        ) || []
      );
      setQuestion(questionData?.question);
    }
  }, [params.id, questionLoading, questionData]);

  const editorContent = useMemo(() => {
    return (
      <Editor
        className="min-h-[250px] w-[250px]"
        defaultLanguage="javascript"
        language={language}
        options={{
          fontSize: 14,
          minimap: {
            enabled: false,
          },
          contextmenu: false,
        }}
        theme={theme === "dark" ? "vs-dark" : "vs-light"}
        value={templateCode}
        onChange={handleEditorChange}
        onMount={onMount}
      />
    );
  }, [language, templateCode, theme]);

  const uniqueCategories = React.useMemo(() => {
    return categoryData?.uniqueCategories;
  }, [categoryData?.uniqueCategories]);

  // Handle adding a category
  const addCategory = () => {
    const caps = currentCategory.toUpperCase();

    if (caps && !categories.includes(caps)) {
      // console.log(caps, categories);
      setCategories((prevCategories) => [...prevCategories, caps]);
    }
    setCurrentCategory(""); // Clear the input after adding
  };

  // Handle removing a category
  const removeCategory = (category: string) => {
    setCategories((prevCategories) =>
      prevCategories.filter((cat) => cat !== category)
    );
  };

  useEffect(() => {
    if (categories.length >= 3) {
      setWarnMessage("You can only add up to 3 categories.");
    } else {
      setWarnMessage(""); // Clear the message when less than 3 categories
    }
  }, [categories]);

  // State to manage test cases (each test case has an input and expected output)

  // Handle adding a new test case
  const addTestCase = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  // Remove a test case by index
  const removeTestCase = (index: number) => {
    const updatedTestCases = testCases.filter((_, i) => i !== index);

    setTestCases(updatedTestCases);
  };

  // Handle input change for test case
  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedTestCases = [...testCases];
    const { name, value } = event.target;

    if (name === "input" || name === "output") {
      updatedTestCases[index][name] = value;
    }
    setTestCases(updatedTestCases);
  };

  function handleEditorChange(value?: string) {
    setTemplateCode(value || "");
  }

  useEffect(() => {
    if (language === "") {
      setLanguage("javascript");
    }
  }, [language]);

  const handleLanguageInputChange = (value: string) => {
    // Check if the input value is a valid language in the list
    if (languages.includes(value)) {
      setLanguage(value);
    } else if (value === "") {
      // Set to empty if input is cleared
      setLanguage("");
    } else {
      // Do nothing or handle invalid input case if needed
    }
  };

  const handleDelete = () => {
    setQuestionToDelete(question);
    onOpen();
  };

  const handleEdit = async () => {
    if (
      !isValidQuestionSubmission(
        title,
        description,
        categories,
        templateCode,
        testCases,
        language
      )
    ) {
      setErrorMessage(
        "Please fill in all the required fields before submitting."
      );
      setErrorModalOpen(true); // Show error modal with the validation message

      return;
    }

    try {
      const response = await editQuestion(
        questionId,
        title,
        description,
        categories,
        selectedTab,
        templateCode,
        testCases,
        language,
        YDocUpdate
      );

      if (response.ok) {
        setSuccessMessage("Question updated successfully!");
        setSuccessModalOpen(true); // Open the success modal
      } else {
        const errorData = await response.json();

        setErrorMessage(
          errorData.error || "Failed to update the question. Please try again."
        );
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error updating the question:", error);
      setErrorMessage("An error occurred while updating the question.");
      setErrorModalOpen(true); // Show error modal with the error message
    }
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

  const handleCancel = () => {
    router.push("/questions-management");
  };

  return (
    <>
      <div className="flex flex-col gap-4 w-fit">
        <Input
          isRequired
          className="w-1/2 text-base"
          label="Title"
          labelPlacement="outside"
          maxLength={80}
          placeholder="Enter question title"
          size="md"
          type="title"
          value={title}
          onValueChange={setTitle}
        />
        <div className="flex flex-col gap-2 items-start">
          <span className="text-sm">Complexity</span>
          <Tabs
            color={complexityColorMap[selectedTab]}
            radius="sm"
            selectedKey={selectedTab}
            size="md"
            variant="bordered"
            onSelectionChange={(key) => setSelectedComplexity(key as string)}
          >
            <Tab key="EASY" title="Easy" />
            <Tab key="MEDIUM" title="Medium" />
            <Tab key="HARD" title="Hard" />
          </Tabs>
        </div>
        <div className="flex flex-col gap-2 items-start">
          <span className="text-sm">Categories</span>
          <div className="flex flex-row gap-2">
            <Autocomplete
              allowsCustomValue
              isRequired
              multiple
              className="w-[250px] text-left"
              description="You can add new categories too"
              inputValue={currentCategory}
              isDisabled={categories.length >= 3}
              isLoading={categoryLoading}
              label="Press plus to add the category"
              placeholder="Add a category"
              size="md"
              variant="flat"
              onInputChange={setCurrentCategory}
            >
              {uniqueCategories && uniqueCategories.length > 0
                ? uniqueCategories.map((category: string) => (
                    <AutocompleteItem key={category}>
                      {capitalize(category)}
                    </AutocompleteItem>
                  ))
                : null}
            </Autocomplete>
            {categories.length < 3 && (
              <Button
                isIconOnly
                className="text-gray-600 dark:text-gray-200"
                radius="full"
                variant="light"
                onPress={addCategory} // Trigger addCategory when button is pressed
              >
                <BoxIcon name="bx-plus" size="18px" />
              </Button>
            )}

            <div className="pt-2 flex flex-col gap-2 items-start">
              <ScrollShadow
                className="max-w-[700px] max-h-[70px]"
                orientation="horizontal"
              >
                <div className="flex flex-row gap-2">
                  {categories && categories.length > 0
                    ? categories.map((category, index) => (
                        <Chip
                          key={index}
                          size="md"
                          onClose={() => removeCategory(category)}
                        >
                          {capitalize(category)}
                        </Chip>
                      ))
                    : null}
                </div>
              </ScrollShadow>
              {warnMessage && (
                <p className="text-red-500 text-sm">{warnMessage}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-start">
          <span className="text-sm">
            Description<span className="text-red-500">*</span>
          </span>{" "}
          <WysiMarkEditor
            initialValue={description}
            onChange={(value) => setDescription(value)}
          />
        </div>
        <div className="flex flex-col gap-4 items-start">
          <div className="flex flex-row gap-2 items-center">
            <span className="text-sm">
              Template Code<span className="text-red-500">*</span>
            </span>{" "}
            <Autocomplete
              aria-label="Select Language"
              className="w-48"
              inputValue={language}
              onInputChange={handleLanguageInputChange}
            >
              {languages.map((lang) => (
                <AutocompleteItem key={lang} value={lang}>
                  {lang}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
          {editorContent}
        </div>
        <div className="flex flex-col gap-4 items-start">
          <span className="text-sm">
            Testcases<span className="text-red-500">*</span>
          </span>
          {testCases.map((testCase, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                className="w-48"
                name="input"
                placeholder="Input"
                value={testCase.input}
                onChange={(e) => handleInputChange(index, e)}
              />
              <Input
                className="w-48"
                name="output"
                placeholder="Expected Output"
                value={testCase.output}
                onChange={(e) => handleInputChange(index, e)}
              />
              {testCases.length > 1 && (
                <Button
                  isIconOnly
                  className="rounded-full mx-4"
                  size="sm"
                  startContent={
                    <BoxIcon name=" bxs-minus-circle" size="14px" />
                  }
                  variant="light"
                  onClick={() => removeTestCase(index)}
                />
              )}
            </div>
          ))}

          <Button
            isIconOnly
            className="my-4"
            radius="full"
            size="sm"
            startContent={<BoxIcon name="bx-plus" size="14px" />}
            variant="flat"
            onClick={addTestCase}
          />
        </div>
        <div className="flex flex-row gap-4 justify-end">
          <Button
            className="pr-5"
            startContent={<BoxIcon name="bx-x" size="20px" />}
            variant="light"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className="pr-5"
            color="danger"
            startContent={<BoxIcon name="bx-trash" size="20px" />}
            variant="light"
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button color="secondary" onClick={handleEdit}>
            Done
          </Button>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isOpen}
        questionToDelete={questionToDelete}
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        message={successMessage}
        onConfirm={() => router.push("/questions-management")} // Redirect to list after confirmation
        onOpenChange={setSuccessModalOpen}
      />
      <ErrorModal
        errorMessage={errorMessage}
        isOpen={isErrorModalOpen}
        onOpenChange={setErrorModalOpen}
      />
    </>
  );
}
