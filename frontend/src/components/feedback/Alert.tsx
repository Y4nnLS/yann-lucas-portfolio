import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

type AlertTone = "info" | "success" | "warning" | "error";

interface AlertProps {
  title: string;
  description?: ReactNode;
  tone?: AlertTone;
}

const toneClasses: Record<AlertTone, string> = {
  info: "border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)]",
  success: "border-green-200 bg-green-50 text-green-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  error: "border-red-200 bg-red-50 text-red-900",
};

export function Alert({ title, description, tone = "info" }: AlertProps) {
  return (
    <div aria-live="polite" className={cn("rounded-3xl border px-5 py-4", toneClasses[tone])}>
      <p className="font-semibold">{title}</p>
      {description ? <div className="mt-1 text-sm">{description}</div> : null}
    </div>
  );
}

