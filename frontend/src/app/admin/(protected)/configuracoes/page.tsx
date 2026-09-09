import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { requireAdminSession } from "@/services/admin-auth";
import { getAdminSiteSettings } from "@/services/content";

export default async function SettingsAdminPage() {
  const { cookieHeader } = await requireAdminSession();
  const site = await getAdminSiteSettings(cookieHeader);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent)]">Configurações</p>
        <h2 className="font-serif text-4xl text-[var(--color-text)]">Conteúdo principal do site</h2>
      </div>
      <SiteSettingsForm site={site} />
    </div>
  );
}

