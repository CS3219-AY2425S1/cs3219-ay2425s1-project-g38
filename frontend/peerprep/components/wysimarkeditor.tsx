import { Editable, useEditor } from "@wysimark/react";
import { env } from "next-runtime-env";
import { useEffect, useState } from "react";

interface WysiMarkEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

const NEXT_PUBLIC_IMAGE_UPLOAD_KEY = env("NEXT_PUBLIC_IMAGE_UPLOAD_KEY");

export const WysiMarkEditor = ({
  initialValue,
  onChange,
}: WysiMarkEditorProps) => {
  const [markdown, setMarkdown] = useState("");

  const editor = useEditor({
    authToken: NEXT_PUBLIC_IMAGE_UPLOAD_KEY,
    minHeight: 500,
  });

  const handleEditorChange = (value: string) => {
    setMarkdown(value); // Update local state
    onChange(value);
  };

  useEffect(() => {
    setMarkdown(initialValue);
  }, [initialValue]);

  return (
    <div className="flex flex-row gap-2 w-fit bg-gray-100 dark:bg-zinc-900 rounded">
      <Editable
        className="w-[1000px] text-left bg-gray-100 fill-gray-800 dark:text-gray-400 dark:bg-zinc-900"
        editor={editor}
        value={markdown}
        onChange={handleEditorChange}
      />
    </div>
  );
};
