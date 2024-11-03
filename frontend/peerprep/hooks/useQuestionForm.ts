import { useState } from "react";

export function useQuestionForm(initialValues: {
  title?: string;
  description?: string;
  complexity?: string;
  categories?: string[];
  templateCode?: string;
  testCases?: { input: string; output: string }[];
  language?: string;
}) {
  const [title, setTitle] = useState(initialValues.title || "");
  const [description, setDescription] = useState(
    initialValues.description || "",
  );
  const [selectedTab, setSelectedComplexity] = useState(
    initialValues.complexity || "EASY",
  );
  const [categories, setCategories] = useState(initialValues.categories || []);
  const [templateCode, setTemplateCode] = useState(
    initialValues.templateCode || "",
  );
  const [testCases, setTestCases] = useState(
    initialValues.testCases || [{ input: "", output: "" }],
  );
  const [language, setLanguage] = useState(
    initialValues.language || "javascript",
  );
  // Yjs setup

  return {
    title,
    setTitle,
    description,
    setDescription,
    selectedTab,
    setSelectedComplexity,
    categories,
    setCategories,
    templateCode,
    setTemplateCode,
    testCases,
    setTestCases,
    language,
    setLanguage,
  };
}
