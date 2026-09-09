import { RepositoryManager } from "@/components/admin/RepositoryManager";
import { requireAdminSession } from "@/services/admin-auth";
import { getAdminFeaturedRepositories } from "@/services/content";

export default async function RepositoriesAdminPage() {
  const { cookieHeader } = await requireAdminSession();
  const repositories = await getAdminFeaturedRepositories(cookieHeader);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent)]">Repositórios</p>
        <h2 className="font-serif text-4xl text-[var(--color-text)]">Destaques do GitHub</h2>
      </div>
      <RepositoryManager repositories={repositories.items} />
    </div>
  );
}

