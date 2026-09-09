import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/admin/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

