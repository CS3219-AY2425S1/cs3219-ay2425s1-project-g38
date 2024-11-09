export function capitalize(word: string) {
  if (typeof word !== "string" || word.length === 0) {
    return word;
  }

  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// Validations
export const validateEmail = (email: string) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

export const validateUsername = (username: string) =>
  /^[a-zA-Z0-9_-]{2,32}$/.test(username);

export const validatePassword = (password: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{12,}$/.test(
    password,
  );

export type SupportedLanguages =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "csharp"
  | "php";

export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
};

export const languages = [
  "TYPESCRIPT",
  "JAVASCRIPT",
  "PHP",
  "CSHARP",
  "JAVA",
  "PYTHON",
];

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface chatMessage {
  message: string;
  sender: string;
  timestamp: number;
}
