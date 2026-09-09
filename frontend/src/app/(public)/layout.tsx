import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { getSiteSettings } from "@/services/content";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let fullName = "Nome para configurar no painel";
  try {
    const site = await getSiteSettings();
    fullName = site.full_name;
  } catch {
    fullName = "Nome para configurar no painel";
  }

  return (
    <>
      <SkipLink />
      <Header fullName={fullName} />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
