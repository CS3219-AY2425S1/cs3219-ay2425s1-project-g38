import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  useDisclosure,
  Button,
  Pagination,
  SortDescriptor,
  Input,
  Spinner,
  Autocomplete,
  AutocompleteItem,
  SharedSelection,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import BoxIcon from "./boxicons";
import { SearchIcon } from "./icons";
import { DeleteConfirmationModal } from "./deleteconfirmationmodal";
import { ErrorModal } from "./errormodal";

import { capitalize } from "@/utils/utils";
import {
  columns,
  Question,
  RenderCell,
  complexityOptions,
} from "@/app/(default)/questions-management/columns";
import {
  deleteQuestion,
  useQuestionsFetcher,
  useUniqueCategoriesFetcher,
} from "@/services/questionService";

export default function QuestionsTable() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();
  const {
    isOpen: isErrorModalOpen,
    onOpen: onErrorModalOpen,
    onOpenChange: onErrorModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isConfirmModalOpen,
    onOpen: onConfirmModalOpen,
    onOpenChange: onConfirmModalOpenChange,
  } = useDisclosure();
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(
    null,
  );

  const handleDelete = (question: Question) => {
    setQuestionToDelete(question);
    onConfirmModalOpen();
  };

  const handleConfirmDelete = async () => {
    if (questionToDelete) {
      try {
        await deleteQuestion(`${questionToDelete.question_id}`);
        onConfirmModalOpenChange();
        location.reload();
      } catch (error) {
        setErrorMessage("Failed to delete the question, please try again.");
        onErrorModalOpen();
        console.error("Failed to delete the question", error);
      }
    }
  };

  const [filterValue, setFilterValue] = useState("");
  const hasSearchFilter = Boolean(filterValue);
  const [complexityFilter, setComplexityFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<
    string | SharedSelection
  >(new Set());
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const { questionData, questionLoading } = useQuestionsFetcher(
    filterValue,
    complexityFilter,
    categoryFilter,
    sortDescriptor,
    page,
  );

  const { categoryData, categoryLoading } = useUniqueCategoriesFetcher();

  const uniqueCategories = React.useMemo(() => {
    return categoryData?.uniqueCategories;
  }, [categoryData?.uniqueCategories]);

  const pages = React.useMemo(() => {
    return questionData?.totalPages;
  }, [questionData?.totalPages]);

  const questionLoadingState = questionLoading ? "loading" : "idle";

  const items = React.useMemo(() => {
    return questionData?.totalQuestions;
  }, [questionData?.totalQuestions]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const handleSetComplexityFilter = useCallback((value: string | null) => {
    if (value) {
      setComplexityFilter(value);
      setPage(1);
    } else {
      setComplexityFilter(null);
    }
  }, []);

  const handleAddNew = () => {
    router.push("/questions-management/add");
  };

  const handleRowAction = (key: any) => {
    router.push(`/questions-management/edit/${key}`);
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-row gap-4">
            <Input
              isClearable
              className="min-w-fit sm:max-w-[30%]"
              placeholder="Search by question title..."
              startContent={<SearchIcon />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
            <Autocomplete
              className="w-[215px]"
              placeholder="Select Complexity"
              onSelectionChange={(key) =>
                handleSetComplexityFilter(key as string | null)
              }
            >
              {complexityOptions.map((complexity: string) => (
                <AutocompleteItem
                  key={complexity}
                  classNames={{
                    base: [
                      "rounded-md",
                      "text-default-500",
                      "transition-opacity",
                      "data-[hover=true]:text-foreground",
                      "data-[hover=true]:bg-default-100",
                      "dark:data-[hover=true]:bg-default-50",
                      "data-[selectable=true]:focus:bg-default-50",
                      "data-[pressed=true]:opacity-70",
                      "data-[focus-visible=true]:ring-default-500",
                    ],
                  }}
                >
                  {complexity}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Select
              className="w-[215px]"
              isLoading={categoryLoading}
              placeholder="Select Categories"
              renderValue={(items) => {
                console.log(items.length, uniqueCategories?.length);

                return items
                  .map((item) => capitalize(item.key as string))
                  .join(", ");
              }}
              selectedKeys={categoryFilter}
              selectionMode="multiple"
              onSelectionChange={setCategoryFilter}
            >
              {uniqueCategories && uniqueCategories.length > 0
                ? uniqueCategories.map((category: string) => (
                    <SelectItem key={category}>
                      {capitalize(category)}
                    </SelectItem>
                  ))
                : null}
            </Select>
          </div>
          <div className="flex flex-row gap-4">
            <Button
              className="pr-5"
              color="secondary"
              startContent={<BoxIcon name="bx-plus" size="20px" />}
              onClick={handleAddNew}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {items} {items == 1 ? "question" : "questions"}
          </span>
        </div>
      </div>
    );
  }, [
    filterValue,
    complexityFilter,
    categoryFilter,
    onSearchChange,
    onClear,
    hasSearchFilter,
    uniqueCategories,
    items,
  ]);

  return (
    <>
      <Table
        removeWrapper
        aria-label="Rows actions table example with dynamic content"
        bottomContent={
          pages > 0 ? (
            <div className="py-2 px-2 flex justify-between items-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
              <div className="hidden sm:flex w-[30%] justify-end gap-2">
                <Button
                  isDisabled={pages === 1}
                  size="md"
                  variant="flat"
                  onPress={onPreviousPage}
                >
                  Previous
                </Button>
                <Button
                  isDisabled={pages === 1}
                  size="md"
                  variant="flat"
                  onPress={onNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null
        }
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background",
          },
        }}
        classNames={{
          th: [
            "bg-transparent",
            "text-default-500",
            "border-b",
            "border-divider",
          ],
        }}
        selectionMode="single"
        topContent={topContent}
        topContentPlacement="outside"
        onRowAction={(key) => handleRowAction(key)}
        sortDescriptor={sortDescriptor}
        // sortDescritptor={setSortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              className="text-base"
              {...(["title", "complexity"].includes(column.key)
                ? { allowsSorting: true }
                : {})}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No questions to display."}
          items={questionData?.questions ?? []}
          loadingContent={<Spinner />}
          loadingState={questionLoadingState}
        >
          {(question: Question) => (
            <TableRow key={question.question_id}>
              {(columnKey) => (
                <TableCell>
                  {RenderCell(question, columnKey, handleDelete)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DeleteConfirmationModal
        isOpen={isConfirmModalOpen}
        questionToDelete={questionToDelete}
        onConfirm={handleConfirmDelete}
        onOpenChange={onConfirmModalOpenChange}
      />
      <ErrorModal
        isOpen={isErrorModalOpen}
        onOpenChange={onErrorModalOpenChange}
        errorMessage={errorMessage}
      />
    </>
  );
}
