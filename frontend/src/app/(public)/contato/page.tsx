import type { Metadata } from "next";

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getSiteSettings } from "@/services/content";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Contato",
  description: "Canais públicos de contato e links profissionais.",
};

export default async function ContactPage() {
  const site = await getSiteSettings();

  return (
    <Section>
      <Container>
        <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Contato" }]} />
      </Container>
      <ContactSection site={site} />
    </Section>
  );
}

