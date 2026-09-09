"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { apiFetch } from "@/services/api";
import { Button } from "@/components/ui/Button";

export function AdminLogoutButton() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  return (
    <Button
      disabled={submitting}
      onClick={async () => {
        setSubmitting(true);
        try {
          await apiFetch("/api/v1/auth/logout", { method: "POST", revalidate: false });
          router.push("/admin/login");
          router.refresh();
        } finally {
          setSubmitting(false);
        }
      }}
      variant="secondary"
    >
      {submitting ? "Saindo..." : "Sair"}
    </Button>
  );
}

