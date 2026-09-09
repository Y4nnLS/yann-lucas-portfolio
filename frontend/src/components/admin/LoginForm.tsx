"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { AuthSession } from "@/types/api";

import { FormField } from "@/components/admin/FormField";
import { Alert } from "@/components/feedback/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiFetch, ApiRequestError } from "@/services/api";
import { type LoginSchema, loginSchema } from "@/features/auth/schema";

export function LoginForm() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit(async (values) => {
        setFeedback(null);
        try {
          await apiFetch<AuthSession>("/api/v1/auth/login", {
            method: "POST",
            body: JSON.stringify(values),
            revalidate: false,
          });
          router.push("/admin");
          router.refresh();
        } catch (error) {
          setFeedback(error instanceof ApiRequestError ? error.message : "Não foi possível entrar.");
        }
      })}
    >
      {feedback ? <Alert title="Falha no login" description={feedback} tone="error" /> : null}
      <FormField error={errors.email?.message} htmlFor="email" label="E-mail">
        <Input autoComplete="email" id="email" type="email" {...register("email")} />
      </FormField>
      <FormField error={errors.password?.message} htmlFor="password" label="Senha">
        <Input autoComplete="current-password" id="password" type="password" {...register("password")} />
      </FormField>
      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}

