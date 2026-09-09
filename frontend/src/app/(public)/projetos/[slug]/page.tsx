import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import { ApiRequestError } from "@/services/api";
import { getProject } from "@/services/content";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TechnologyBadge } from "@/components/ui/TechnologyBadge";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

async function loadProject(slug: string) {
  try {
    return await getProject(slug);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await loadProject(slug);

  return {
    title: project.seo_title ?? project.name,
    description: project.seo_description ?? project.short_description ?? undefined,
    openGraph: {
      title: project.seo_title ?? project.name,
      description: project.seo_description ?? project.short_description ?? undefined,
      images: project.media[0]?.file_url ? [{ url: project.media[0].file_url }] : undefined,
    },
  };
}

function MarkdownSection({ title, content }: { title: string; content: string | null }) {
  if (!content) {
    return null;
  }

  return (
    <Card className="space-y-4">
      <h2 className="font-serif text-3xl text-[var(--color-text)]">{title}</h2>
      <div className="prose-markdown">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]} remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </Card>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await loadProject(slug);

  return (
    <Section>
      <Container className="space-y-8">
        <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Projetos", href: "/projetos" }, { label: project.name }]} />
        <header className="grid gap-6 rounded-[2rem] border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-soft)] lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">{project.project_type ?? "Projeto publicado"}</p>
            <h1 className="font-serif text-4xl text-[var(--color-text)] sm:text-5xl">{project.name}</h1>
            {project.short_description ? <p className="text-lg leading-8 text-[var(--color-text-muted)]">{project.short_description}</p> : null}
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <TechnologyBadge key={technology.id} technology={technology} />
              ))}
            </div>
          </div>
          <div className="space-y-4 rounded-[1.5rem] bg-[var(--color-surface-alt)] p-6">
            {project.project_url ? (
              <a className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 text-sm font-semibold text-[var(--color-text)]" href={project.project_url} rel="noopener noreferrer" target="_blank">
                Ver projeto
                <ExternalLink size={16} />
              </a>
            ) : null}
            {project.repository_url ? (
              <a className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 text-sm font-semibold text-[var(--color-text)]" href={project.repository_url} rel="noopener noreferrer" target="_blank">
                Abrir repositório
                <ExternalLink size={16} />
              </a>
            ) : null}
            <p className="text-sm leading-7 text-[var(--color-text-muted)]">
              Seções vazias permanecem ocultas para evitar conteúdo artificial ou placeholder público.
            </p>
          </div>
        </header>

        {project.media.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {project.media.map((media) => (
              <img alt={media.alt_text} className="rounded-[1.5rem] border border-[var(--color-border)] object-cover" key={media.id} src={media.file_url} />
            ))}
          </div>
        ) : null}

        <div className="grid gap-6">
          <MarkdownSection content={project.context} title="Contexto" />
          <MarkdownSection content={project.problem} title="Problema" />
          <MarkdownSection content={project.responsibilities} title="Minha responsabilidade" />
          <MarkdownSection content={project.architecture} title="Arquitetura" />
          <MarkdownSection content={project.features} title="Funcionalidades" />
          <MarkdownSection content={project.challenges} title="Desafios técnicos" />
          <MarkdownSection content={project.decisions} title="Decisões" />
          <MarkdownSection content={project.results} title="Resultados" />
          <MarkdownSection content={project.learnings} title="Aprendizados" />
          <MarkdownSection content={project.future_improvements} title="Melhorias futuras" />
        </div>

        {(project.previous_project || project.next_project) ? (
          <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {project.previous_project ? (
              <Link className="text-sm font-semibold text-[var(--color-primary)]" href={`/projetos/${project.previous_project.slug}`}>
                ← {project.previous_project.name}
              </Link>
            ) : (
              <span />
            )}
            {project.next_project ? (
              <Link className="text-sm font-semibold text-[var(--color-primary)]" href={`/projetos/${project.next_project.slug}`}>
                {project.next_project.name} →
              </Link>
            ) : null}
          </Card>
        ) : null}

        <Button href="/projetos" variant="secondary">Voltar para projetos</Button>
      </Container>
    </Section>
  );
}
