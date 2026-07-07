import { expect, test } from "@playwright/test";
import { auditLayout, auditPage, installRuntimeGuards } from "./helpers";

async function loginAsAdmin(page: import("@playwright/test").Page) {
  await page.goto("/connexion");
  await page.getByLabel("Identifiant").fill("admin");
  await page.getByLabel("Mot de passe").fill("demo2026!");
  await page.getByRole("button", { name: "Entrer dans la console" }).click();
  await page.waitForURL(/\/console$/, { timeout: 20_000 });
  await expect(page.locator("[data-console-ready='true']")).toBeVisible({ timeout: 20_000 });
}

test("protected console redirects anonymous traffic", async ({ page }, testInfo) => {
  const guards = installRuntimeGuards(page, [401]);
  await page.goto("/console");
  await expect(page).toHaveURL(/\/connexion$/);
  await auditPage(page, testInfo, "console-redirect", true);
  guards.assertClean();
});

test("admin login opens private console and logout closes access", async ({ page }, testInfo) => {
  const guards = installRuntimeGuards(page);
  await loginAsAdmin(page);
  await expect(page.getByRole("heading", { name: "Registre partenaires" })).toBeVisible();
  await expect(page.getByText("OCTOPUS Mining")).toBeVisible();
  await auditPage(page, testInfo, "console-authenticated", false);

  const cookies = await page.context().cookies();
  const session = cookies.find((cookie) => cookie.name === "gkih_session");
  expect(session?.httpOnly).toBe(true);
  expect(session?.sameSite).toBe("Lax");

  const logoutResponse = page.waitForResponse(
    (response) => response.url().includes("/api/auth/logout") && response.request().method() === "POST",
    { timeout: 30_000 }
  );
  await page.getByRole("button", { name: "Sortir" }).click();
  expect((await logoutResponse).status()).toBe(200);
  await expect(page).toHaveURL("/");
  await page.goto("/console");
  await expect(page).toHaveURL(/\/connexion$/);
  guards.assertClean();
});

test("console explains score method and assessment freshness", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-laptop", "Gate Zero content audit runs once.");
  const guards = installRuntimeGuards(page);
  await loginAsAdmin(page);

  await expect(page.getByRole("heading", { name: "Indice 0-100" })).toBeVisible();
  await expect(page.getByText(/Le statut porte la décision métier/i)).toBeVisible();
  await expect(page.getByText(/documents 20, références 20, capacité 20/i)).toBeVisible();
  await expect(page.getByText(/fraîcheur de l'évaluation 10/i)).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Indice" })).toBeVisible();
  await expect(page.getByRole("row", { name: /Lualaba Heavy Maintenance/ })).toContainText(/\d{2}\/\d{2}\/\d{4}/);

  guards.assertClean();
});

test("mobile console exposes decision fields without horizontal table panning", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-390", "Mobile table ergonomics runs once.");
  const guards = installRuntimeGuards(page);
  await loginAsAdmin(page);

  const tableWrap = page.locator(".partners-table-wrap");
  await expect(tableWrap).toBeVisible();
  const hasHorizontalScroll = await tableWrap.evaluate((element) => element.scrollWidth > element.clientWidth + 2);
  expect(hasHorizontalScroll).toBe(false);

  const firstPartner = page.getByRole("row", { name: /Lualaba Heavy Maintenance/ });
  await expect(firstPartner.locator('td[data-label="Indice"]')).toContainText(/%/);
  await expect(firstPartner.locator('td[data-label="Évaluation"]')).toContainText(/\d{2}\/\d{2}\/\d{4}/);
  await expect(firstPartner.locator('td[data-label="Actions"] button')).toHaveCount(2);
  await auditLayout(page);

  guards.assertClean();
});

test("partner registry supports controlled create update delete", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-laptop", "CRUD mutation runs once.");
  const guards = installRuntimeGuards(page);
  await loginAsAdmin(page);

  const companyName = `Lubudi Field Services ${Date.now()}`;
  await page.getByRole("button", { name: "Ajouter partenaire" }).click();
  const createDialog = page.getByRole("dialog", { name: "Ajouter un dossier" });
  await expect(createDialog).toBeVisible();
  await createDialog.getByLabel("Entreprise").fill(companyName);
  await createDialog.getByLabel("Secteur").selectOption("Construction");
  await createDialog.getByLabel("Ville").fill("Lubudi");
  await createDialog.getByLabel("Province").selectOption("Lualaba");
  await createDialog.getByLabel("Contact").fill("Médard Tshibangu");
  await createDialog.getByLabel("Fonction").fill("Coordinateur travaux");
  await createDialog.getByLabel("Téléphone").fill("+243 812 000 771");
  await createDialog.getByLabel("Email").fill("ops@lubudifield.cd");
  await createDialog.getByLabel("Statut").selectOption("En analyse");
  await createDialog.getByLabel("Risque").selectOption("Modéré");
  await createDialog.getByLabel("Indice").fill("74");
  await createDialog.getByLabel("Effectif").fill("28");
  await createDialog.getByLabel("Capacité annuelle").fill("12 chantiers de maintenance et ouvrages légers");
  await createDialog.getByLabel("Zones couvertes").fill("Lubudi, Kolwezi");
  await createDialog.getByLabel("Services").fill("Maintenance bâtiment, Génie civil léger");
  await createDialog.getByLabel("Certifications").fill("HSE site");
  await createDialog.getByLabel("Dernière évaluation").fill("2026-07-01");
  await createDialog.getByLabel("Notes").fill("Équipe mobile structurée avec outillage vérifié et supervision locale.");
  const createResponse = page.waitForResponse(
    (response) => response.url().includes("/api/partners") && response.request().method() === "POST",
    { timeout: 30_000 }
  );
  await createDialog.getByRole("button", { name: "Enregistrer" }).click();
  expect((await createResponse).status()).toBe(201);
  const createdRow = page.getByRole("row", { name: new RegExp(companyName) });
  await expect(createdRow).toBeVisible();
  await createdRow.click();
  const detailDialog = page.getByRole("dialog", { name: companyName });
  await expect(detailDialog).toBeVisible();
  await expect(detailDialog.getByText("Lubudi, Lualaba")).toBeVisible();
  await detailDialog.getByRole("button", { name: "Fermer" }).click();

  await page.getByRole("button", { name: `Modifier ${companyName}` }).click();
  const editDialog = page.getByRole("dialog", { name: "Modifier le dossier" });
  await expect(editDialog).toBeVisible();
  await editDialog.getByLabel("Indice").fill("82");
  const updateResponse = page.waitForResponse(
    (response) => response.url().includes("/api/partners/") && response.request().method() === "PATCH",
    { timeout: 30_000 }
  );
  await editDialog.getByRole("button", { name: "Enregistrer" }).click();
  expect((await updateResponse).status()).toBe(200);
  await expect(editDialog).toHaveCount(0, { timeout: 15_000 });
  await expect(page.getByRole("row", { name: new RegExp(companyName) }).getByText("82%")).toBeVisible();

  const deleteResponse = page.waitForResponse(
    (response) => response.url().includes("/api/partners/") && response.request().method() === "DELETE",
    { timeout: 30_000 }
  );
  await page.getByRole("button", { name: `Supprimer ${companyName}` }).click();
  expect((await deleteResponse).status()).toBe(200);
  await expect(page.getByText(companyName)).toHaveCount(0);
  guards.assertClean();
});
