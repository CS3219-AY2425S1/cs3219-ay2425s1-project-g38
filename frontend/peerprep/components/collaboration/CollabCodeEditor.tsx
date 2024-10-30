"use client";

import { useRef, useState, useEffect } from "react";
import * as Y from "yjs";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Card } from "@nextui-org/react";

import { SupportedLanguages } from "../../utils/utils";
import { SocketIOProvider } from "y-socket.io";

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

  const onMount = async (editor: any) => {
    editorRef.current = editor;
    const model = editor.getModel();
    const provider = new SocketIOProvider(
      "http://localhost:8010",
      "test",
      yDoc,
      { autoConnect: true }
    );

    if (model) {
      const MonacoBinding = (await import("y-monaco")).MonacoBinding; // not dynamically importing this causes an error
      const binding = new MonacoBinding(
        yText,
        model,
        new Set([editor]),
        provider.awareness
      );
    }

    yDoc.on("update", async (update: Uint8Array) => {
      // propagateUpdates(update);
    });
  };

  const onSelect = (language: SupportedLanguages) => {
    propagateUpdates(undefined, language);
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <Card className="flex flex-col h-full w-full p-4 gap-4 bg-gray-200 dark:bg-gray-800">
        <div className="flex flex-col w-full h-3/4">
          <div className="px-4 sm:px-0 mb-2">
            <LanguageSelector language={language} onSelect={onSelect} />
          </div>
          <div className="flex w-full h-full">
            <Editor
              className="flex-1"
              theme={theme === "dark" ? "vs-dark" : "vs-light"}
              language={language}
              onMount={onMount}
              options={{ fontSize: 14 }}
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
      </Card>
    </div>
  );
}
