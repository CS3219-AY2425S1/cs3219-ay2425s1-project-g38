import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useTheme } from "next-themes";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false },
);

// const EditerMarkdown = dynamic(
//   () =>
//     import("@uiw/react-md-editor").then((mod) => {
//       return mod.default.Markdown;
//     }),
//   { ssr: false },
// );

function MarkdownEditor() {
  const [value, setValue] = useState<string | undefined>("");
  const { theme } = useTheme();

  return (
    <div className="w-full" data-color-mode={theme}>
      <MDEditor value={value} onChange={setValue} />
    </div>
  );
}

export default MarkdownEditor;
