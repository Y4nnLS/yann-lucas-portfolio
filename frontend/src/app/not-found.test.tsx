import { render, screen } from "@testing-library/react";

import NotFound from "@/app/not-found";

describe("NotFound page", () => {
  it("renders a helpful 404 message", () => {
    render(<NotFound />);

    expect(screen.getByText("Página não encontrada")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voltar para a página inicial" })).toHaveAttribute("href", "/");
  });
});

