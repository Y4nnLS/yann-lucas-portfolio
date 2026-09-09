"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/utils/cn";

const navigation = [
  { label: "Início", href: "/" },
  { label: "Projetos", href: "/projetos" },
  { label: "Experiência", href: "/#experiencia" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Currículo", href: "/curriculo" },
  { label: "Contato", href: "/contato" },
];

export function Header({ fullName }: { fullName: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)]/80 bg-[rgba(246,247,249,0.88)] backdrop-blur">
      <Container className="flex min-h-20 items-center justify-between gap-6">
        <Link className="max-w-[15rem] text-sm font-semibold tracking-[0.18em] text-[var(--color-text)] uppercase" href="/">
          {fullName}
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link className="text-sm text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <Button href="/admin/login" variant="secondary">
            Painel
          </Button>
        </nav>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={open}
          aria-label={open ? "Fechar menu principal" : "Abrir menu principal"}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-text)] lg:hidden"
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </Container>

      <div
        className={cn(
          "overflow-hidden border-t border-[var(--color-border)] bg-white transition-[max-height] lg:hidden",
          open ? "max-h-96" : "max-h-0",
        )}
        id="mobile-navigation"
      >
        <Container className="flex flex-col gap-2 py-4">
          {navigation.map((item) => (
            <Link
              className="min-h-11 rounded-2xl px-4 py-3 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]"
              href={item.href}
              key={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Button className="w-full" href="/admin/login" variant="secondary">
            Painel administrativo
          </Button>
        </Container>
      </div>
    </header>
  );
}

