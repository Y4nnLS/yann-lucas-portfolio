import { ProjectForm } from "@/components/admin/ProjectForm";
import { Card } from "@/components/ui/Card";
import { requireAdminSession } from "@/services/admin-auth";
import { getAdminTechnologies } from "@/services/content";

export default async function NewProjectPage() {
  const { cookieHeader } = await requireAdminSession();
  const technologies = await getAdminTechnologies(cookieHeader);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent)]">Projetos</p>
        <h2 className="font-serif text-4xl text-[var(--color-text)]">Novo projeto</h2>
      </div>
      <Card>
        <ProjectForm technologies={technologies.items} />
      </Card>
    </div>
  );
}

