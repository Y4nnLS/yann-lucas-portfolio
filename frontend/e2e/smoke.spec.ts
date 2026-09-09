import { expect, test } from "@playwright/test";

test("public and admin smoke flow", async ({ page }) => {
  const browserErrors: string[] = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(message.text());
    }
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Desenvolvedor Full-Stack/i })).toBeVisible();

  await page.goto("/projetos");
  await expect(page.getByRole("heading", { name: "Portfólio publicado" })).toBeVisible();

  const firstProjectLink = page.getByRole("link", { name: /Ver estudo de caso/i }).first();
  if (await firstProjectLink.isVisible()) {
    await firstProjectLink.click();
    await expect(page.locator("main")).toContainText(/Projeto|Aplicação/i);
  }

  await page.goto("/admin/login");
  await expect(page.getByRole("heading", { name: "Entrar no painel administrativo" })).toBeVisible();

  await page.getByLabel("E-mail").fill(process.env.ADMIN_EMAIL ?? "admin@example.com");
  await page.getByLabel("Senha").fill(process.env.ADMIN_PASSWORD ?? "change-me-now");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Ações frequentes" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Resumo do estado atual" })).toBeVisible();

  await page.getByRole("link", { name: "Gerenciar projetos", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Listagem administrativa" })).toBeVisible();
  expect(browserErrors).toEqual([]);
});
