import { render, screen } from "@testing-library/react";

import type { ProjectSummary } from "@/types/api";

import { ProjectCard } from "@/components/ui/ProjectCard";

const project: ProjectSummary = {
  id: "1",
  name: "Projeto de Teste",
  slug: "projeto-de-teste",
  project_type: "Aplicação web",
  short_description: "Resumo do projeto",
  responsibilities: "Implementação full-stack",
  status: "PUBLISHED",
  featured: true,
  sort_order: 1,
  published_at: "2026-07-16T00:00:00Z",
  created_at: "2026-07-16T00:00:00Z",
  updated_at: "2026-07-16T00:00:00Z",
  technologies: [],
  media: [],
};

describe("ProjectCard", () => {
  it("renders project details and fallback placeholder", () => {
    render(<ProjectCard project={project} />);

    expect(screen.getByText("Projeto de Teste")).toBeInTheDocument();
    expect(screen.getByText("Sem imagem cadastrada")).toBeInTheDocument();
    expect(screen.getByText("Ver estudo de caso")).toHaveAttribute("href", "/projetos/projeto-de-teste");
  });
});

