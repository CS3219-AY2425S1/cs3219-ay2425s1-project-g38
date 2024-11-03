import { useState, useEffect } from "react";
import { Button, Card } from "@nextui-org/react";
import { useTheme } from "next-themes";

import { executeCode } from "../../services/sessionOutputService";

type SupportedLanguages =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "csharp"
  | "php";

export interface codeOutputInterface {
  stdout: string;
  stderr: string;
  output: string;
  code: number;
  signal: string | null;
}

interface OutputProps {
  codeOutput?: string[] | null;
  editorRef: React.RefObject<any>;
  language: SupportedLanguages;
  propagateUpdates: (
    docUpdate?: Uint8Array,
    languageUpdate?: SupportedLanguages,
    codeOutput?: codeOutputInterface,
  ) => void;
  isCodeError: boolean;
}

const Output: React.FC<OutputProps> = ({
  codeOutput,
  editorRef,
  language,
  propagateUpdates,
  isCodeError,
}) => {
  const { theme, resolvedTheme } = useTheme();
  const [isThemeReady, setIsThemeReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (resolvedTheme) {
      setIsThemeReady(true);
    }
  }, [resolvedTheme]);

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

  if (!isThemeReady) return null;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-start mb-2">
        <Button
          className=""
          variant="flat"
          color={`${isCodeError ? "danger" : "success"}`}
          disabled={isLoading}
          onClick={runCode}
        >
          {isLoading ? "Running" : "Run Code"}
        </Button>
      </div>
      <Card
        className={`flex-1 p-4 overflow-auto
        ${
          isCodeError
            ? theme === "dark"
              ? "bg-gradient-to-br from-[#751A1A] to-[#331638]"
              : "bg-gradient-to-br from-[#FFA6A6] to-[#FFD4D4]"
            : theme === "dark"
              ? "bg-gradient-to-br from-[#2055A6] to-[#6F0AD4]"
              : "bg-gradient-to-br from-[#A6C8FF] to-[#D4A6FF]"
        }`}
      >
        <div className="text-sm overflow-y-auto h-full">
          {" "}
          {/* Set font size for the output card */}
          {codeOutput
            ? codeOutput.map((line, index) => <p key={index}>{line}</p>)
            : 'Click "Run Code" to see output here'}
        </div>
      </Card>
    </div>
  );
};

export default Output;
