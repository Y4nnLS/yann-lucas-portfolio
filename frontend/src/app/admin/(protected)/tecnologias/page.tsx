import { TechnologyManager } from "@/components/admin/TechnologyManager";
import { requireAdminSession } from "@/services/admin-auth";
import { getAdminTechnologies } from "@/services/content";

export default async function TechnologiesAdminPage() {
  const { cookieHeader } = await requireAdminSession();
  const technologies = await getAdminTechnologies(cookieHeader);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent)]">Tecnologias</p>
        <h2 className="font-serif text-4xl text-[var(--color-text)]">Catálogo técnico</h2>
      </div>
      <TechnologyManager technologies={technologies.items} />
    </div>
  );
}

