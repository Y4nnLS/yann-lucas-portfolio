import { render, screen } from "@testing-library/react";

import { EmptyState } from "@/components/feedback/EmptyState";

describe("EmptyState", () => {
  it("shows title, description and action link", () => {
    render(
      <EmptyState
        actionHref="/admin/login"
        actionLabel="Abrir painel"
        description="Nenhum item encontrado."
        title="Lista vazia"
      />,
    );

    expect(screen.getByText("Lista vazia")).toBeInTheDocument();
    expect(screen.getByText("Nenhum item encontrado.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Abrir painel" })).toHaveAttribute("href", "/admin/login");
  });
});

