import type { Metadata } from "next";
import { Geist, Newsreader } from "next/font/google";

import { getSiteSettings } from "@/services/content";

import "@/app/globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const site = await getSiteSettings();
    return {
      title: {
        default: site.default_seo_title ?? site.hero_title,
        template: `%s | ${site.full_name}`,
      },
      description: site.default_seo_description ?? site.introduction,
      metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
      openGraph: {
        title: site.default_seo_title ?? site.hero_title,
        description: site.default_seo_description ?? site.introduction,
        url: process.env.SITE_URL ?? "http://localhost:3000",
        siteName: site.full_name,
        type: "website",
      },
    };
  } catch {
    return {
      title: "Yann Lucas Portfolio",
      description: "Portfólio Full-Stack com Next.js e FastAPI.",
      metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
    };
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${geist.variable} ${newsreader.variable}`} lang="pt-BR">
      <body className="font-[var(--font-sans)] antialiased">{children}</body>
    </html>
  );
}

