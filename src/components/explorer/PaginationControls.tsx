import { Button } from "../ui/button";

interface PaginationControlsProps {
  page: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (nextPage: number) => void;
}

export const PaginationControls = ({
  page,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: PaginationControlsProps): JSX.Element => (
  <div className="mt-6 flex items-center justify-center gap-3">
    <Button
      variant="outline"
      onClick={() => onPageChange(page - 1)}
      disabled={!hasPreviousPage}
      type="button"
    >
      Previous
    </Button>
    <div className="min-w-24 text-center text-sm font-semibold text-slate-700">
      Page {page}
    </div>
    <Button
      variant="outline"
      onClick={() => onPageChange(page + 1)}
      disabled={!hasNextPage}
      type="button"
    >
      Next
    </Button>
  </div>
);
