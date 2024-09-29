import React, { useEffect, useMemo, useState } from "react";
import {
  Input,
  Button,
  Radio,
  Dropdown,
  Textarea,
  DropdownMenu,
  DropdownItem,
  RadioGroup,
  Tab,
  Tabs,
  Avatar,
  Chip,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
  ScrollShadow,
  useDisclosure,
} from "@nextui-org/react";

import {
  complexityColorMap,
  Question,
} from "@/app/questions-management/list/columns";
import BoxIcon from "./boxicons";
import MarkdownEditor from "./mdeditor";
import { WysiMarkEditor } from "./wysimarkeditor";
import useSWR from "swr";
import { capitalize, languages } from "@/utils/utils";
import Editor from "@monaco-editor/react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { DeleteConfirmationModal } from "./deleteconfirmationmodal";
import { SuccessModal } from "./succesmodal";
import { ErrorModal } from "./errormodal";

interface EditQuestionFormProps {
  initialTitle?: string;
  initialDescription?: string;
  initialComplexity?: string;
  initialCategories?: string[];
  initialTemplateCode?: string;
  initialTestCases?: { input: string; output: string }[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EditQuestionForm({
  initialTitle = "",
  initialDescription = "",
  initialComplexity = "Easy",
  initialCategories = [],
  initialTemplateCode = "",
  initialTestCases = [{ input: "", output: "" }],
}: EditQuestionFormProps) {
  const params = useParams();
  const router = useRouter();
  const [language, setLanguage] = useState("javascript");
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

  const { data: categoryData, isLoading: categoryLoading } = useSWR(
    `http://localhost:8003/api/questions/categories/unique`,
    fetcher
  );

  const { data: questionData, isLoading: questionLoading } = useSWR(
    `http://localhost:8003/api/questions/${params.id ? params.id : ""}`,
    fetcher
  );

  useEffect(() => {
    if (params.id && !questionLoading) {
      setTitle(questionData?.question.title);
      setSelectedComplexity(questionData?.question.complexity);
      setCategories(questionData?.question.category);
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
        value={templateCode}
        theme={theme === "dark" ? "vs-dark" : "vs-light"}
        options={{
          fontSize: 14,
          minimap: {
            enabled: false,
          },
          contextmenu: false,
        }}
        onChange={handleEditorChange}
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
      console.log(caps, categories);
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
    updatedTestCases[index][event.target.name] = event.target.value;
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

  const updateQuestion = async () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !categories.length ||
      !templateCode.trim() ||
      !testCases.every(
        (testCase) =>
          testCase.input.trim() !== "" && testCase.output.trim() !== ""
      )
    ) {
      setErrorMessage(
        "Please fill in all the required fields before submitting."
      );
      setErrorModalOpen(true); // Show error modal with the validation message
      return;
    }

    const formData = {
      title,
      description,
      category: categories,
      complexity: selectedTab,
      templateCode,
      testCases: testCases.map(
        (testCase) => `${testCase.input} -> ${testCase.output}`
      ),
    };

    try {
      const response = await fetch(
        `http://localhost:8003/api/questions/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
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

  const deleteQuestion = async () => {
    try {
      const response = await fetch(
        `http://localhost:8003/api/questions/${params.id}`,
        {
          method: "DELETE",
        }
      );

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
    router.push("/");
  };

  return (
    <>
      <div className="flex flex-col gap-4 w-fit">
        <Input
          type="title"
          label="Title"
          labelPlacement="outside"
          placeholder="Enter question title"
          className="w-1/2 text-base"
          size="md"
          value={title}
          onValueChange={setTitle}
          isRequired
          maxLength={80}
        />
        <div className="flex flex-col gap-2 items-start">
          <span className="text-sm">Complexity</span>
          <Tabs
            variant="bordered"
            color={complexityColorMap[selectedTab]}
            onSelectionChange={(key) => setSelectedComplexity(key as string)}
            selectedKey={selectedTab}
            radius="sm"
            size="md"
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
              label="Press plus to add the category"
              placeholder="Add a category"
              isRequired
              variant="flat"
              className="w-[250px] text-left"
              description="You can add new categories too"
              inputValue={currentCategory}
              onInputChange={setCurrentCategory}
              size="md"
              multiple
              isDisabled={categories.length >= 3}
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
                radius="full"
                variant="light"
                isIconOnly
                className="text-gray-600 dark:text-gray-200"
                onPress={addCategory} // Trigger addCategory when button is pressed
              >
                <BoxIcon name="bx-plus" size="18px" />
              </Button>
            )}

            <div className="pt-2 flex flex-col gap-2 items-start">
              <ScrollShadow
                orientation="horizontal"
                className="max-w-[700px] max-h-[70px]"
              >
                <div className="flex flex-row gap-2">
                  {categories && categories.length > 0
                    ? categories.map((category, index) => (
                        <Chip
                          key={index}
                          onClose={() => removeCategory(category)}
                          size="md"
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
              inputValue={language}
              onInputChange={handleLanguageInputChange}
              aria-label="Select Language"
              className="w-48"
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
                name="input"
                placeholder="Input"
                value={testCase.input}
                onChange={(e) => handleInputChange(index, e)}
                className="w-48"
              />
              <Input
                name="output"
                placeholder="Expected Output"
                value={testCase.output}
                onChange={(e) => handleInputChange(index, e)}
                className="w-48"
              />
              {testCases.length > 1 && (
                <Button
                  variant="light"
                  size="sm"
                  className="rounded-full mx-4"
                  onClick={() => removeTestCase(index)}
                  startContent={
                    <BoxIcon name=" bxs-minus-circle" size="14px" />
                  }
                  isIconOnly
                />
              )}
            </div>
          ))}

          <Button
            onClick={addTestCase}
            variant="flat"
            className="my-4"
            size="sm"
            isIconOnly
            radius="full"
            startContent={<BoxIcon name="bx-plus" size="14px" />}
          />
        </div>
        <div className="flex flex-row gap-4 justify-end">
          <Button
            variant="light"
            className="pr-5"
            startContent={<BoxIcon name="bx-x" size="20px" />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            variant="light"
            className="pr-5"
            startContent={<BoxIcon name="bx-trash" size="20px" />}
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button color="secondary" onClick={updateQuestion}>
            Done
          </Button>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        questionToDelete={questionToDelete}
        onConfirm={deleteQuestion}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onOpenChange={setSuccessModalOpen}
        message={successMessage}
        onConfirm={() => router.push("/")} // Redirect to list after confirmation
      />
      <ErrorModal
        isOpen={isErrorModalOpen}
        onOpenChange={setErrorModalOpen}
        errorMessage={errorMessage}
      />
    </>
  );
}
