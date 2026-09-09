import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminSession } from "@/services/admin-auth";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProtectedAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { session } = await requireAdminSession();

  return <AdminShell session={session}>{children}</AdminShell>;
}

