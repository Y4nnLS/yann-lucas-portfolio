import { ProjectForm } from "@/components/admin/ProjectForm";
import { ProjectMediaManager } from "@/components/admin/ProjectMediaManager";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { requireAdminSession } from "@/services/admin-auth";
import { getAdminProject, getAdminTechnologies } from "@/services/content";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const { cookieHeader } = await requireAdminSession();
  const [project, technologies] = await Promise.all([
    getAdminProject(cookieHeader, id),
    getAdminTechnologies(cookieHeader),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent)]">Projeto</p>
          <h2 className="font-serif text-4xl text-[var(--color-text)]">{project.name}</h2>
        </div>
        {project.status === "PUBLISHED" ? (
          <Button href={`/projetos/${project.slug}`} variant="secondary">
            Abrir prévia pública
          </Button>
        ) : null}
      </div>
      <Card>
        <ProjectForm project={project} technologies={technologies.items} />
      </Card>
      <ProjectMediaManager media={project.media} projectId={project.id} />
    </div>
  );
}

