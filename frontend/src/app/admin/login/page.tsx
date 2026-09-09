import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getCookieHeader } from "@/services/admin-auth";
import { getAdminSession } from "@/services/content";

export const metadata: Metadata = {
  title: "Login administrativo",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const cookieHeader = await getCookieHeader();
  if (cookieHeader) {
    try {
      await getAdminSession(cookieHeader);
      redirect("/admin");
    } catch {
      // Ignore and render login.
    }
  }

  return (
    <Section>
      <Container className="grid gap-8 lg:grid-cols-[0.95fr_0.85fr] lg:items-center">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">Admin</p>
          <h1 className="font-serif text-5xl text-[var(--color-text)]">Entrar no painel administrativo</h1>
          <p className="max-w-xl text-base leading-8 text-[var(--color-text-muted)]">
            O acesso é protegido pela API FastAPI com cookies HttpOnly. A interface do Next.js apenas melhora a experiência de navegação.
          </p>
        </div>
        <Card>
          <LoginForm />
        </Card>
      </Container>
    </Section>
  );
}

