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

import { WysiMarkEditor } from "../wysimarkeditor";
import BoxIcon from "../boxicons";

import { capitalize, languages } from "@/utils/utils";
import { complexityColorMap } from "@/app/@application/(main)/questions-management/columns";
import { useUniqueCategoriesFetcher } from "@/services/questionService";

interface QuestionFormBaseProps {
  title: string;
  setTitle: (value: string) => void;
  selectedTab: string;
  setSelectedComplexity: (value: string) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
  description: string;
  setDescription: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  templateCode: string;
  setTemplateCode: (value: string) => void;
  testCases: { input: string; output: string }[];
  setTestCases: (testCases: { input: string; output: string }[]) => void;
  onMount?: (editor: any) => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitButtonText?: string;
  additionalButtons?: React.ReactNode;
}

export function QuestionFormBase({
  title,
  setTitle,
  selectedTab,
  setSelectedComplexity,
  categories,
  setCategories,
  description,
  setDescription,
  language,
  setLanguage,
  templateCode,
  setTemplateCode,
  testCases,
  setTestCases,
  onMount,
  onCancel,
  onSubmit,
  submitButtonText = "Done",
  additionalButtons,
}: QuestionFormBaseProps) {
  const { theme } = useTheme();
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [warnMessage, setWarnMessage] = useState<string>("");
  const { categoryData, categoryLoading } = useUniqueCategoriesFetcher();

  const uniqueCategories = React.useMemo(() => {
    return categoryData?.uniqueCategories;
  }, [categoryData?.uniqueCategories]);

  // Category management
  const addCategory = () => {
    const caps = currentCategory.toUpperCase();

    if (caps && !categories.includes(caps)) {
      setCategories([...categories, caps]);
    }
    setCurrentCategory("");
  };

  const removeCategory = (category: string) => {
    setCategories(categories.filter((cat) => cat !== category));
  };

  // Test cases management
  const addTestCase = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

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

  // Effects and handlers
  useEffect(() => {
    setWarnMessage(
      categories.length >= 3 ? "You can only add up to 3 categories." : "",
    );
  }, [categories]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      addCategory();
    }
  };

  return (
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
            isDisabled={categories.length >= 3}
            isLoading={categoryLoading}
            label="Press plus to add the category"
            placeholder="Add a category"
            size="md"
            variant="flat"
            onInputChange={setCurrentCategory}
            onKeyDown={handleKeyDown}
          >
            {uniqueCategories && uniqueCategories.length > 0
              ? uniqueCategories.map((category: string) => (
                  <AutocompleteItem key={category}>
                    {category
                      .split(" ")
                      .map((word) => capitalize(word))
                      .join(" ")}
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
                        className="capitalize"
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
            inputValue={language.toLowerCase()}
            onInputChange={setLanguage}
          >
            {languages.map((lang) => (
              <AutocompleteItem key={lang} value={lang}>
                {lang.toLowerCase()}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
        <Editor
          className="min-h-[250px] w-[250px]"
          defaultLanguage="javascript"
          defaultValue={templateCode}
          value={templateCode}
          language={language}
          options={{
            fontSize: 14,
            minimap: {
              enabled: false,
            },
            contextmenu: false,
          }}
          theme={theme === "dark" ? "vs-dark" : "vs-light"}
          onChange={(value) => setTemplateCode(value || "")}
          onMount={onMount}
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
                startContent={<BoxIcon name=" bxs-minus-circle" size="14px" />}
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

      {/* Submit Buttons */}
      <div className="flex flex-row gap-4 justify-end">
        <Button
          className="pr-5"
          color="danger"
          startContent={<BoxIcon name="bx-x" size="20px" />}
          variant="light"
          onClick={onCancel}
        >
          Cancel
        </Button>
        {additionalButtons}
        <Button color="secondary" onClick={onSubmit}>
          {submitButtonText}
        </Button>
      </div>
    </div>
  );
}
