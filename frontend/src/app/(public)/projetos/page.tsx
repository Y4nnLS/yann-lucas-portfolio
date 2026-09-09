import Link from "next/link";

import type { Metadata } from "next";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Pagination } from "@/components/ui/Pagination";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getProjects, getTechnologies } from "@/services/content";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Lista de projetos publicados do portfólio.",
};

interface ProjectsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const currentPage = Number(Array.isArray(params.page) ? params.page[0] : params.page ?? "1");
  const technology = Array.isArray(params.tecnologia) ? params.tecnologia[0] : params.tecnologia;

  const [projects, technologies] = await Promise.all([
    getProjects({ page: currentPage, page_size: 9, technology }),
    getTechnologies(),
  ]);

  const buildHref = (page: number) => {
    const href = new URLSearchParams();
    href.set("page", String(page));
    if (technology) {
      href.set("tecnologia", technology);
    }
    return `/projetos?${href.toString()}`;
  };

  return (
    <Section>
      <Container>
        <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Projetos" }]} />
        <SectionHeader
          description="A listagem suporta paginação e filtro simples por tecnologia sem depender de busca avançada no MVP."
          eyebrow="Projetos"
          title="Portfólio publicado"
        />
        <div className="mb-8 flex flex-wrap gap-3">
          <Link className={`rounded-full px-4 py-2 text-sm ${!technology ? "bg-[var(--color-primary)] text-white" : "bg-white text-[var(--color-text)]"}`} href="/projetos">
            Todas
          </Link>
          {technologies.map((item) => (
            <Link
              className={`rounded-full px-4 py-2 text-sm ${technology === item.slug ? "bg-[var(--color-primary)] text-white" : "bg-white text-[var(--color-text)]"}`}
              href={`/projetos?tecnologia=${item.slug}`}
              key={item.id}
            >
              {item.name}
            </Link>
          ))}
        </div>
        {projects.items.length ? (
          <>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {projects.items.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            <Pagination buildHref={buildHref} pagination={projects.pagination} />
          </>
        ) : (
          <EmptyState
            actionHref="/projetos"
            actionLabel="Limpar filtros"
            description="Publique projetos ou ajuste o filtro escolhido para preencher esta página."
            title="Nenhum projeto encontrado"
          />
        )}
      </Container>
    </Section>
  );
}
