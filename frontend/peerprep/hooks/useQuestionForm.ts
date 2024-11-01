import { useState, useEffect } from 'react';
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
  const [description, setDescription] = useState(initialValues.description || "");
  const [selectedTab, setSelectedComplexity] = useState(initialValues.complexity || "EASY");
  const [categories, setCategories] = useState(initialValues.categories || []);
  const [templateCode, setTemplateCode] = useState(initialValues.templateCode || "");
  const [testCases, setTestCases] = useState(initialValues.testCases || [{ input: "", output: "" }]);
  const [language, setLanguage] = useState(initialValues.language || "javascript");
  const [isYDocReady, setIsYDocReady] = useState(false);
  const [editorModel, setEditorModel] = useState<any>(null);

  // Yjs setup
  const yDoc = new Y.Doc();
  const yText = yDoc.getText("code");
  const [YDocUpdate, setYDocUpdate] = useState<Uint8Array>(Y.encodeStateAsUpdateV2(yDoc));

  const updateDoc = async (update: Uint8Array) => {
    console.log("Updating YDoc with update", update);
    Y.applyUpdateV2(yDoc, update);
    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for the update to be applied
    setIsYDocReady(true);
    console.log("YDoc updated:\n", yText.toString());
  };

  useEffect(() => {
    if (editorModel && isYDocReady) {
      console.log('Monaco editor model is ready, yDoc is ', Y.encodeStateAsUpdateV2(yDoc));
      const setupMonacoBinding = async () => {
        const MonacoBinding = (await import('y-monaco')).MonacoBinding;
        new MonacoBinding(yText, editorModel, new Set([editorModel]));
      };
      setupMonacoBinding();
      console.log('Setting initial template code', yText.toString());
      editorModel.setValue(yText.toString());

      yDoc.on('update', () => {
        console.log('YDoc updated, updating YDocUpdate');
        setYDocUpdate(Y.encodeStateAsUpdateV2(yDoc));
      });
    }
  }, [editorModel, isYDocReady]);


  const onMount = async (editor: any) => {
    console.log("Monaco editor mounted");
    const model = editor.getModel();
    setEditorModel(model);
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
    updateDoc,
    onMount,
    isYDocReady
  };
} 