import { render, screen } from "@testing-library/react";

import type { SiteSettings } from "@/types/api";

import { ContactSection } from "@/components/sections/ContactSection";

const baseSite: SiteSettings = {
  id: "site-1",
  full_name: "Nome",
  professional_title: "Desenvolvedor Full-Stack",
  hero_title: "Título",
  hero_subtitle: "Subtítulo",
  introduction: "Introdução",
  about: "Sobre",
  email: null,
  location: null,
  github_username: null,
  github_url: null,
  linkedin_url: null,
  availability: null,
  resume_url: null,
  default_seo_title: null,
  default_seo_description: null,
  default_social_image_url: null,
  created_at: "2026-07-16T00:00:00Z",
  updated_at: "2026-07-16T00:00:00Z",
};

describe("ContactSection", () => {
  it("renders only configured public links", () => {
    render(
      <ContactSection
        site={{
          ...baseSite,
          email: "hello@example.com",
          github_url: "https://github.com/example",
        }}
      />,
    );

    expect(screen.getByText("hello@example.com")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/example");
    expect(screen.queryByRole("link", { name: "LinkedIn" })).not.toBeInTheDocument();
  });
});

