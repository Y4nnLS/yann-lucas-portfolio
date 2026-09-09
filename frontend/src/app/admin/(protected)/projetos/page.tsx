import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { requireAdminSession } from "@/services/admin-auth";
import { getAdminProjects } from "@/services/content";

interface AdminProjectsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminProjectsPage({ searchParams }: AdminProjectsPageProps) {
  const params = await searchParams;
  const page = Number(Array.isArray(params.page) ? params.page[0] : params.page ?? "1");
  const status = Array.isArray(params.status) ? params.status[0] : params.status;
  const search = Array.isArray(params.busca) ? params.busca[0] : params.busca;

  const { cookieHeader } = await requireAdminSession();
  const projects = await getAdminProjects(cookieHeader, {
    page,
    page_size: 20,
    status: status ?? null,
    search: search ?? null,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent)]">Projetos</p>
          <h2 className="font-serif text-4xl text-[var(--color-text)]">Listagem administrativa</h2>
        </div>
        <Button href="/admin/projetos/novo">Novo projeto</Button>
      </div>

      <Card>
        <form className="grid gap-4 lg:grid-cols-[1fr_220px_auto]">
          <input
            className="min-h-11 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm"
            defaultValue={search ?? ""}
            name="busca"
            placeholder="Buscar por nome"
          />
          <select
            className="min-h-11 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm"
            defaultValue={status ?? ""}
            name="status"
          >
            <option value="">Todos</option>
            <option value="DRAFT">Rascunhos</option>
            <option value="PUBLISHED">Publicados</option>
          </select>
          <Button type="submit" variant="secondary">
            Filtrar
          </Button>
        </form>
      </Card>

      <div className="space-y-4">
        {projects.items.map((project) => (
          <Card className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between" key={project.id}>
            <div>
              <p className="font-medium text-[var(--color-text)]">{project.name}</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                {project.status} · destaque {project.featured ? "sim" : "não"} · ordem {project.sort_order}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {project.status === "PUBLISHED" ? (
                <Button href={`/projetos/${project.slug}`} variant="secondary">
                  Pré-visualizar
                </Button>
              ) : null}
              <Button href={`/admin/projetos/${project.id}`} variant="secondary">
                Editar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

