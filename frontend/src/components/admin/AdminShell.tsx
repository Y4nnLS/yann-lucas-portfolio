"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { AuthSession } from "@/types/api";

import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { Container } from "@/components/ui/Container";
import { cn } from "@/utils/cn";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projetos", label: "Projetos" },
  { href: "/admin/tecnologias", label: "Tecnologias" },
  { href: "/admin/experiencias", label: "Experiências" },
  { href: "/admin/repositorios", label: "Repositórios" },
  { href: "/admin/configuracoes", label: "Configurações" },
];

export function AdminShell({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: AuthSession;
}>) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="border-b border-[var(--color-border)] bg-white">
        <Container className="flex min-h-20 flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-accent)]">Painel administrativo</p>
            <h1 className="font-serif text-3xl text-[var(--color-text)]">Gerenciar conteúdo do portfólio</h1>
            <p className="text-sm text-[var(--color-text-muted)]">{session.user.email}</p>
          </div>
          <AdminLogoutButton />
        </Container>
      </header>
      <Container className="grid gap-8 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-[2rem] border border-[var(--color-border)] bg-white p-4">
          <nav className="flex flex-col gap-2" aria-label="Navegação administrativa">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm transition",
                    active
                      ? "bg-[var(--color-primary)] text-white"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)]",
                  )}
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="space-y-6">{children}</div>
      </Container>
    </div>
  );
}
