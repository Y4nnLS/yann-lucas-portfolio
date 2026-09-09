import Link from "next/link";

import type { ProjectSummary } from "@/types/api";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { TechnologyBadge } from "@/components/ui/TechnologyBadge";

function ProjectPlaceholder() {
  return (
    <div className="flex aspect-[16/10] items-end rounded-[1.5rem] bg-[linear-gradient(135deg,#0D1524,#162033)] p-5 text-sm text-[var(--color-dark-text)]">
      <div>
        <p className="font-semibold">Sem imagem cadastrada</p>
        <p className="mt-1 text-[var(--color-dark-text-muted)]">Adicione uma capa pelo painel administrativo.</p>
      </div>
    </div>
  );
}

export function ProjectCard({ project }: { project: ProjectSummary }) {
  const cover = project.media.find((item) => item.media_type === "COVER") ?? project.media[0];

  return (
    <Card className="flex h-full flex-col gap-5">
      {cover ? (
        <img alt={cover.alt_text} className="aspect-[16/10] rounded-[1.5rem] object-cover" src={cover.file_url} />
      ) : (
        <ProjectPlaceholder />
      )}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {project.project_type ? <Badge>{project.project_type}</Badge> : null}
          {project.featured ? <Badge className="border-transparent bg-[var(--color-primary)]/10 text-[var(--color-primary)]">Destaque</Badge> : null}
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-2xl text-[var(--color-text)]">
            <Link className="hover:text-[var(--color-primary)]" href={`/projetos/${project.slug}`}>
              {project.name}
            </Link>
          </h3>
          {project.short_description ? <p className="text-sm leading-7 text-[var(--color-text-muted)]">{project.short_description}</p> : null}
          {project.responsibilities ? <p className="text-sm text-[var(--color-text)]">{project.responsibilities}</p> : null}
        </div>
        {project.technologies.length ? (
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 5).map((technology) => (
              <TechnologyBadge key={technology.id} technology={technology} />
            ))}
          </div>
        ) : null}
      </div>
      <div className="mt-auto pt-2">
        <Link className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]" href={`/projetos/${project.slug}`}>
          Ver estudo de caso
        </Link>
      </div>
    </Card>
  );
}

