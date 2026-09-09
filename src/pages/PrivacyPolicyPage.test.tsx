import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import PrivacyPolicyPage from "./PrivacyPolicyPage";

it("describes consent-gated analytics and external catalog services", () => {
  render(
    <MemoryRouter>
      <PrivacyPolicyPage />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole("heading", { name: "Privacy policy" }),
  ).toBeInTheDocument();
  expect(screen.getByText(/Analytics is off unless/)).toBeInTheDocument();
  expect(
    screen.getByText(/exclude query strings and fragments/),
  ).toBeInTheDocument();
  expect(screen.getByText(/Cookie settings/)).toBeInTheDocument();
  expect(screen.getByText(/Catalog requests use PokeAPI/)).toBeInTheDocument();
});
