import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getAdminSession } from "@/services/content";

export async function getCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

export async function requireAdminSession() {
  const cookieHeader = await getCookieHeader();
  if (!cookieHeader) {
    redirect("/admin/login");
  }

  try {
    const session = await getAdminSession(cookieHeader);
    return { session, cookieHeader };
  } catch {
    redirect("/admin/login");
  }
}

