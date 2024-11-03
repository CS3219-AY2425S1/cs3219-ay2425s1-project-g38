import { useState } from "react";
import * as Y from "yjs";

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
  const yDoc = new Y.Doc();
  const yText = yDoc.getText("code");
  const [YDocUpdate, setYDocUpdate] = useState<Uint8Array>(
    Y.encodeStateAsUpdateV2(yDoc),
  );

  const onMount = async (editor: any) => {
    const model = editor.getModel();

    if (model) {
      const MonacoBinding = (await import("y-monaco")).MonacoBinding;

      new MonacoBinding(yText, model, new Set([editor]));
    }
    model.setValue(templateCode);
    yDoc.on("update", () => {
      setYDocUpdate(Y.encodeStateAsUpdateV2(yDoc));
    });
  };

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
    YDocUpdate,
    onMount,
  };
}
