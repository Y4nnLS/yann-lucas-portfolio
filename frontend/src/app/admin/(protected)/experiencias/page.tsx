import { ExperienceManager } from "@/components/admin/ExperienceManager";
import { requireAdminSession } from "@/services/admin-auth";
import { getAdminExperiences, getAdminTechnologies } from "@/services/content";

export default async function ExperiencesAdminPage() {
  const { cookieHeader } = await requireAdminSession();
  const [experiences, technologies] = await Promise.all([
    getAdminExperiences(cookieHeader),
    getAdminTechnologies(cookieHeader),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent)]">Experiências</p>
        <h2 className="font-serif text-4xl text-[var(--color-text)]">Trajetória profissional</h2>
      </div>
      <ExperienceManager experiences={experiences.items} technologies={technologies.items} />
    </div>
  );
}

