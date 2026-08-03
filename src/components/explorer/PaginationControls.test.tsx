import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PaginationControls } from "./PaginationControls";

describe("PaginationControls", () => {
  beforeEach(() => {
    vi.stubGlobal("scrollTo", vi.fn());
  });

  it("renders compact numbered window with ellipses for middle pages", () => {
    render(
      <PaginationControls
        page={6}
        totalPages={12}
        hasPreviousPage
        hasNextPage
        onPageChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Go to page 1" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to page 4" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to page 5" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to page 6" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to page 7" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to page 8" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to page 12" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("...")).toHaveLength(2);
  });

  it("marks active page with aria-current", () => {
    render(
      <PaginationControls
        page={3}
        totalPages={8}
        hasPreviousPage
        hasNextPage
        onPageChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Go to page 3" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("disables previous and next buttons at boundaries", () => {
    const { rerender } = render(
      <PaginationControls
        page={1}
        totalPages={8}
        hasPreviousPage={false}
        hasNextPage
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();

    rerender(
      <PaginationControls
        page={8}
        totalPages={8}
        hasPreviousPage
        hasNextPage={false}
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Previous" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("navigates to numbered page exactly once", () => {
    const onPageChange = vi.fn();

    render(
      <PaginationControls
        page={2}
        totalPages={8}
        hasPreviousPage
        hasNextPage
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Go to page 4" }));

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(4);
  });
});
