import axios from "axios";

import { LANGUAGE_VERSIONS } from "../utils/utils";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

interface ExecuteCodeResponse {
  run: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: string | null;
  };
  compile?: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: string | null;
  };
}

type Language = keyof typeof LANGUAGE_VERSIONS;

export const executeCode = async (
  language: Language,
  sourceCode: string,
): Promise<ExecuteCodeResponse> => {
  const response = await API.post<ExecuteCodeResponse>("/execute", {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        content: sourceCode,
      },
    ],
  });

  return response.data;
};
