import { useState, useEffect } from "react";
import { Button, Card } from "@nextui-org/react";
import { useTheme } from "next-themes";

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

  useEffect(() => {
    if (resolvedTheme) {
      setIsThemeReady(true);
    }
  }, [resolvedTheme]);

  if (!isThemeReady) return null;

  return (
    <div className="flex flex-col h-full w-full">
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
