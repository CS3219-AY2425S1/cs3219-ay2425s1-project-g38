"use client";
import { Button, Chip } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import BoxIcon from "@/components/boxicons";
import { capitalize } from "@/utils/utils";

export type Question = {
  _id: string;
  title: string;
  category: string[];
  complexity: string;
  question_id: number;
};

export const columns = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "complexity",
    label: "Complexity",
  },
  {
    key: "category",
    label: "Category",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

export const complexityColorMap: Record<
  string,
  "success" | "warning" | "danger"
> = {
  EASY: "success",
  MEDIUM: "warning",
  HARD: "danger",
};

export const complexityOptions = ["Easy", "Medium", "Hard"]; // Can consider retrieving this from the backend

export function RenderCell(
  question: Question,
  columnKey: React.Key,
  handleDelete: (question: Question) => void,
) {
  const cellValue = question[columnKey as keyof Question];
  const router = useRouter();

  const handleRowAction = (key: any) => {
    router.push(`/questions-management/edit/${key}`);
  };

  switch (columnKey) {
    case "title":
      return <span className="text-sm">{cellValue}</span>;
    case "complexity":
      return (
        <Chip
          className="capitalize"
          color={
            complexityColorMap[
              String(cellValue) as keyof typeof complexityColorMap
            ]
          }
          size="sm"
          variant="flat"
        >
          {capitalize(String(cellValue))}
        </Chip>
      );
    case "category":
      return (
        <div className="flex space-x-2">
          {question.category.map((cat) => (
            <Chip key={cat} className="capitalize" size="sm" variant="flat">
              {capitalize(String(cat))}
            </Chip>
          ))}
        </div>
      );
    case "actions":
      return (
        <div className="relative flex items-center gap-4">
          <Button
            isIconOnly
            className="cursor-pointer text-lg text-default-400 active:opacity-50"
            radius="full"
            variant="light"
            onPress={() => handleRowAction(question.question_id)}
          >
            <BoxIcon name="bxs-edit" />
          </Button>
          <Button
            isIconOnly
            className="cursor-pointer text-lg text-danger active:opacity-50"
            radius="full"
            variant="light"
            onPress={() => handleDelete(question)}
          >
            <BoxIcon name="bxs-trash" />
          </Button>
        </div>
      );
    default:
      return cellValue;
  }
}
