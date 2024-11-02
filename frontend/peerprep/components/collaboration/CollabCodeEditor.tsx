"use client";

import { useRef, useState, useEffect } from "react";
import * as Y from "yjs";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Button, Card, Chip } from "@nextui-org/react";

import { SupportedLanguages } from "../../utils/utils";
import { executeCode } from "../../services/sessionOutputService";

import Output, { codeOutputInterface } from "./Output";
import LanguageSelector from "./LanguageSelector";

interface CollabCodeEditorProps {
  language: SupportedLanguages;
  yDoc: Y.Doc;
  codeOutput: string[] | null;
  isCodeError: boolean;
  propagateUpdates: (
    docUpdate?: Uint8Array,
    languageUpdate?: SupportedLanguages,
    codeOutput?: codeOutputInterface
  ) => void;
}

export default function CollabCodeEditor({
  language,
  yDoc,
  codeOutput,
  isCodeError,
  propagateUpdates,
}: CollabCodeEditorProps) {
  const { theme } = useTheme();
  const yText = yDoc.getText("code");
  const editorRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();

    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      propagateUpdates(undefined, undefined, result);
    } catch (error: any) {
      // would only occur if api is down
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onMount = async (editor: any) => {
    editorRef.current = editor;
    const model = editor.getModel();

    if (model) {
      const MonacoBinding = (await import("y-monaco")).MonacoBinding; // not dynamically importing this causes an error
      const binding = new MonacoBinding(yText, model, new Set([editor]));
    }

    yDoc.on("update", async (update: Uint8Array) => {
      propagateUpdates(Y.encodeStateAsUpdateV2(yDoc));
    });
  };

  const onSelect = (language: SupportedLanguages) => {
    propagateUpdates(undefined, language);
  };

  return (
    <div className="flex justify-center items-center h-full w-full pt-4">
      <div className="flex flex-col h-full w-full pt-2 gap-4 bg-gray-200 dark:bg-gray-800 rounded-2xl shadow-2xl">
        <div className="flex flex-col w-full h-3/4">
          <div className="flex flex-row px-4 sm:px-0 mb-2 ml-2 mr-2 ">
            <LanguageSelector language={language} onSelect={onSelect} />
            <Button
              className="ml-auto"
              variant="flat"
              color={`${isCodeError ? "danger" : "success"}`}
              disabled={isLoading}
              onClick={runCode}
            >
              {isLoading ? "Running" : "Run Code"}
            </Button>
          </div>
          <div className="flex w-full h-full">
            <Editor
              className="flex-1 border-1 border-gray-300 dark:border-gray-700"
              theme={theme === "dark" ? "vs-dark" : "vs"}
              language={language}
              onMount={onMount}
              options={{ fontSize: 14, autoIndent: "none" }}
            />
          </div>
        </div>
        <div className="flex w-full h-1/4">
          <Output
            codeOutput={codeOutput}
            editorRef={editorRef}
            language={language}
            propagateUpdates={propagateUpdates}
            isCodeError={isCodeError}
          />
        </div>
      </div>
    </div>
  );
}
