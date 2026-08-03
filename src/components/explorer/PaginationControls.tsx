import { useMemo } from "react";
import { Button } from "../ui/button";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (nextPage: number) => void;
}

type PaginationItem = number | "ellipsis";

const buildPaginationItems = (
  page: number,
  totalPages: number,
): PaginationItem[] => {
  if (totalPages <= 1) {
    return [1];
  }

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const current = Math.min(Math.max(page, 1), totalPages);
  const pages = new Set<number>([1, totalPages]);

  for (let value = current - 2; value <= current + 2; value += 1) {
    if (value >= 1 && value <= totalPages) {
      pages.add(value);
    }
  }

  const sortedPages = [...pages].sort((a, b) => a - b);
  const items: PaginationItem[] = [];

  sortedPages.forEach((value, index) => {
    if (index > 0) {
      const previousValue = sortedPages[index - 1];
      if (value - previousValue > 1) {
        items.push("ellipsis");
      }
    }

    items.push(value);
  });

  return items;
};

export const PaginationControls = ({
  page,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: PaginationControlsProps): JSX.Element => {
  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(page, 1), safeTotalPages);
  const pageItems = useMemo(
    () => buildPaginationItems(safePage, safeTotalPages),
    [safePage, safeTotalPages],
  );

  const onNavigate = (nextPage: number): void => {
    const bounded = Math.min(Math.max(nextPage, 1), safeTotalPages);
    if (bounded === safePage) {
      return;
    }

    onPageChange(bounded);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onFirstPage = safePage === 1;
  const onLastPage = safePage === safeTotalPages;

  return (
    <nav
      className="mt-6 flex flex-wrap items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        onClick={() => onNavigate(safePage - 1)}
        disabled={onFirstPage || !hasPreviousPage}
        type="button"
      >
        Previous
      </Button>

      {pageItems.map((item, index) => {
        if (item === "ellipsis") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-1 text-sm font-semibold text-slate-500"
              aria-hidden="true"
            >
              ...
            </span>
          );
        }

        const isCurrent = item === safePage;

        return (
          <Button
            key={item}
            variant={isCurrent ? "default" : "outline"}
            size="sm"
            type="button"
            aria-label={`Go to page ${item}`}
            aria-current={isCurrent ? "page" : undefined}
            onClick={() => onNavigate(item)}
          >
            {item}
          </Button>
        );
      })}

      <Button
        variant="outline"
        onClick={() => onNavigate(safePage + 1)}
        disabled={onLastPage || !hasNextPage}
        type="button"
      >
        Next
      </Button>
    </nav>
  );
};
