import type { Metadata } from "next";

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Privacidade",
  description: "Informações básicas sobre tratamento de dados do portfólio.",
};

export default function PrivacyPage() {
  return (
    <Section>
      <Container className="space-y-8">
        <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Privacidade" }]} />
        <SectionHeader
          description="Política inicial enxuta para o MVP, alinhada ao uso de autenticação administrativa e uploads locais."
          eyebrow="Privacidade"
          title="Tratamento básico de dados no portfólio"
        />
        <Card className="space-y-4 text-sm leading-8 text-[var(--color-text-muted)]">
          <p>Este portfólio não possui formulário público de contato no MVP e não coleta dados pessoais de navegação além do necessário para o funcionamento técnico da aplicação.</p>
          <p>As credenciais administrativas são tratadas apenas no back-end, com cookies HttpOnly e validação de autenticação no FastAPI.</p>
          <p>Uploads de imagens e currículo ficam armazenados localmente no ambiente de desenvolvimento e devem ser migrados para armazenamento persistente externo antes de um deploy com disco efêmero.</p>
        </Card>
      </Container>
    </Section>
  );
}

