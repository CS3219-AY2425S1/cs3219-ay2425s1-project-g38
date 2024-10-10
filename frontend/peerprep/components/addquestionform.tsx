import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Tab,
  Tabs,
  Chip,
  Autocomplete,
  AutocompleteItem,
  ScrollShadow,
} from "@nextui-org/react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import { SuccessModal } from "./succesmodal";
import { ErrorModal } from "./errormodal";
import { WysiMarkEditor } from "./wysimarkeditor";
import BoxIcon from "./boxicons";

import { capitalize, languages } from "@/utils/utils";
import { complexityColorMap } from "@/app/(default)/questions-management/columns";
import {
  useUniqueCategoriesFetcher,
  isValidQuestionSubmission,
  submitQuestion,
} from "@/services/questionService";

interface AddQuestionFormProps {
  initialTitle?: string;
  initialDescription?: string;
  initialComplexity?: string;
  initialCategories?: string[];
  initialTemplateCode?: string;
  initialTestCases?: { input: string; output: string }[];
}

export default function AddQuestionForm({
  initialTitle = "",
  initialDescription = "# Question description \n Write your question description here! \n You can also insert images!",
  initialComplexity = "Easy",
  initialCategories = [],
  initialTemplateCode = "/** PUT YOUR TEMPLATE CODE HERE **/",
  initialTestCases = [{ input: "", output: "" }],
}: AddQuestionFormProps) {
  const router = useRouter();
  const { theme } = useTheme();

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [language, setLanguage] = useState("javascript");
  const [selectedTab, setSelectedComplexity] =
    useState<string>(initialComplexity);
  const [category, setCategories] = useState<string[]>(initialCategories);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [warnMessage, setWarnMessage] = useState<string>("");
  const [title, setTitle] = useState<string>(initialTitle);
  const [description, setDescription] = useState<string>(initialDescription);
  const [templateCode, setTemplateCode] = useState<string>(initialTemplateCode);
  const [testCases, setTestCases] =
    useState<{ input: string; output: string }[]>(initialTestCases);

  const { categoryData, categoryLoading } = useUniqueCategoriesFetcher();

  const uniqueCategories = React.useMemo(() => {
    return categoryData?.uniqueCategories;
  }, [categoryData?.uniqueCategories]);

  // Handle adding a category
  const addCategory = () => {
    const caps = currentCategory.toUpperCase();

    if (caps && !category.includes(caps)) {
      // console.log(caps, category);
      setCategories((prevCategories) => [...prevCategories, caps]);
    }
    setCurrentCategory(""); // Clear the input after adding
  };

  // Handle removing a category
  const removeCategory = (category: string) => {
    setCategories((prevCategories) =>
      prevCategories.filter((cat) => cat !== category),
    );
  };

  useEffect(() => {
    if (category.length >= 3) {
      setWarnMessage("You can only add up to 3 categories.");
    } else {
      setWarnMessage(""); // Clear the message when less than 3 categories
    }
  }, [category]);

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
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const updatedTestCases = [...testCases];

    const { name, value } = event.target;

    if (name === "input" || name === "output") {
      updatedTestCases[index][name] = value;
    }
    setTestCases(updatedTestCases);
  };

  function handleEditorChange(value?: string) {
    setTemplateCode(value || "/** PUT YOUR TEMPLATE CODE HERE **/");
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

  // Form submission handler
  const handleSubmit = async () => {
    if (
      !isValidQuestionSubmission(
        title,
        description,
        category,
        templateCode,
        testCases,
      )
    ) {
      setErrorMessage(
        "Please fill in all the required fields before submitting.",
      );
      setErrorModalOpen(true); // Show error modal with the validation message

      return;
    }

    // console.log(formData);

    try {
      // Send POST request
      const response = await submitQuestion(
        title,
        description,
        category,
        selectedTab,
        templateCode,
        testCases,
      );

      if (response.ok) {
        // Show success modal
        setSuccessMessage("Question successfully submitted!");
        setSuccessModalOpen(true);
      } else {
        // Show error modal with error response message
        const errorData = await response.json();

        setErrorMessage(
          errorData.error || "Failed to submit the question. Please try again.",
        );
        setErrorModalOpen(true);
      }
    } catch (error) {
      // Show error modal with generic error message
      setErrorMessage(
        "An error occurred while submitting the question. Please try again later",
      );
      setErrorModalOpen(true);
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
          <span className="text-sm">
            Complexity<span className="text-red-500">*</span>
          </span>
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
              isDisabled={category.length >= 3}
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
            {category.length < 3 && (
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
                  {category && category.length > 0
                    ? category.map((category, index) => (
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
          </span>
          <WysiMarkEditor
            initialValue={description}
            onChange={(value) => setDescription(value)}
          />
        </div>
        <div className="flex flex-col gap-4 items-start">
          <div className="flex flex-row gap-2 items-center">
            <span className="text-sm">
              Template Code<span className="text-red-500">*</span>
            </span>
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
          <Editor
            className="min-h-[250px] w-[250px]"
            defaultLanguage="javascript"
            defaultValue={templateCode}
            language={language}
            options={{
              fontSize: 14,
              minimap: {
                enabled: false,
              },
              contextmenu: false,
            }}
            theme={theme === "dark" ? "vs-dark" : "vs-light"}
            onChange={handleEditorChange}
          />
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
            color="danger"
            startContent={<BoxIcon name="bx-x" size="20px" />}
            variant="light"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button color="secondary" onClick={handleSubmit}>
            Done
          </Button>
        </div>
      </div>
      <SuccessModal
        isOpen={successModalOpen}
        message={successMessage}
        onConfirm={() => {
          setSuccessModalOpen(false);
          router.push("/questions-management");
        }}
        onOpenChange={() => {
          setSuccessModalOpen;
          router.push("/questions-management");
        }}
      />
      <ErrorModal
        isOpen={errorModalOpen}
        onOpenChange={setErrorModalOpen}
        errorMessage={errorMessage}
        // onClose={setErrorModalOpen}
      />
    </>
  );
}
