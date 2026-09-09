import { ArrowRight, FileText, Settings, Sparkles } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { requireAdminSession } from "@/services/admin-auth";
import { getAdminExperiences, getAdminFeaturedRepositories, getAdminProjects, getAdminTechnologies } from "@/services/content";

export default async function AdminDashboardPage() {
  const { cookieHeader } = await requireAdminSession();
  const [projects, technologies, experiences, repositories] = await Promise.all([
    getAdminProjects(cookieHeader, { page: 1, page_size: 50 }),
    getAdminTechnologies(cookieHeader),
    getAdminExperiences(cookieHeader),
    getAdminFeaturedRepositories(cookieHeader),
  ]);

  const published = projects.items.filter((project) => project.status === "PUBLISHED").length;
  const drafts = projects.items.filter((project) => project.status === "DRAFT").length;
  const featured = projects.items.filter((project) => project.featured).length;
  const lastUpdated = projects.items[0]?.updated_at ?? null;

  const cards = [
    { label: "Projetos", value: projects.items.length, description: `${published} publicados · ${drafts} rascunhos` },
    { label: "Destaques", value: featured, description: "Projetos com vitrine na home" },
    { label: "Tecnologias", value: technologies.items.length, description: "Catálogo para projetos e experiências" },
    { label: "Experiências", value: experiences.items.length, description: `${repositories.items.length} repositórios destacados configurados` },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-text-muted)]">{card.label}</p>
            <p className="mt-3 font-serif text-5xl text-[var(--color-text)]">{card.value}</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{card.description}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent)]">Atalhos</p>
              <h2 className="font-serif text-3xl text-[var(--color-text)]">Ações frequentes</h2>
            </div>
            <Sparkles className="text-[var(--color-primary)]" size={24} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link className="rounded-[1.5rem] border border-[var(--color-border)] p-5 hover:border-[var(--color-primary)]" href="/admin/projetos/novo">
              <p className="font-medium text-[var(--color-text)]">Criar projeto</p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">Abrir formulário completo do estudo de caso.</p>
            </Link>
            <Link className="rounded-[1.5rem] border border-[var(--color-border)] p-5 hover:border-[var(--color-primary)]" href="/admin/configuracoes">
              <p className="font-medium text-[var(--color-text)]">Editar configurações</p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">Atualizar dados da home, SEO e currículo.</p>
            </Link>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <FileText size={20} />
            <h2 className="font-serif text-3xl text-[var(--color-text)]">Resumo do estado atual</h2>
          </div>
          <p className="text-sm leading-7 text-[var(--color-text-muted)]">
            Última atualização registrada: {lastUpdated ? new Date(lastUpdated).toLocaleString("pt-BR") : "sem atualizações ainda"}.
          </p>
          <div className="flex flex-col gap-3">
            <Link className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]" href="/admin/projetos">
              Gerenciar projetos
              <ArrowRight size={16} />
            </Link>
            <Link className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]" href="/admin/tecnologias">
              Manter tecnologias
              <ArrowRight size={16} />
            </Link>
            <Link className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]" href="/admin/configuracoes">
              Revisar configurações gerais
              <Settings size={16} />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
