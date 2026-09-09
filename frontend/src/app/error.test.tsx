import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { vi } from "vitest";

import RouteError from "@/app/error";

describe("Route error boundary", () => {
  it("renders inside the existing document and allows retrying", async () => {
    const reset = vi.fn();
    const error = new Error("Falha ao carregar o painel.");
    const markup = renderToStaticMarkup(<RouteError error={error} reset={reset} />);

    expect(markup).not.toMatch(/<\/?(?:html|body)(?:\s|>)/i);

    render(<RouteError error={error} reset={reset} />);
    expect(screen.getByText(error.message)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(reset).toHaveBeenCalledOnce();
  });
});
