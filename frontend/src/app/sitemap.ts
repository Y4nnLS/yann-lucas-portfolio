import type { MetadataRoute } from "next";

import { getProjects } from "@/services/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

  let projects = [] as Array<{ slug: string; updated_at: string }>;
  try {
    const response = await getProjects({ page: 1, page_size: 100 });
    projects = response.items;
  } catch {
    projects = [];
  }

  return [
    "",
    "/projetos",
    "/curriculo",
    "/contato",
    "/privacidade",
    ...projects.map((project) => `/projetos/${project.slug}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));
}

