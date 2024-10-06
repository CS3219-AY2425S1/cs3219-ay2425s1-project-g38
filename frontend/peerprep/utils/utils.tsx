export function capitalize(word: string) {
  if (typeof word !== "string" || word.length === 0) {
    return word;
  }

  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export const languages = [
  "typescript",
  "javascript",
  "css",
  "less",
  "scss",
  "json",
  "html",
  "xml",
  "php",
  "csharp",
  "cpp",
  "razor",
  "markdown",
  "diff",
  "java",
  "vb",
  "coffeescript",
  "handlebars",
  "batch",
  "pug",
  "fsharp",
  "lua",
  "powershell",
  "python",
  "ruby",
  "sass",
  "r",
  "objective-c",
];
