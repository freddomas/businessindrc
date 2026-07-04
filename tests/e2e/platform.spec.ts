import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const criticalStatuses = new Set([400, 401, 403, 404, 500, 502, 503, 504]);

async function installGuards(page: Page) {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const networkErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (response) => {
    const url = response.url();
    if (criticalStatuses.has(response.status()) && !url.includes("/api/public/")) {
      networkErrors.push(`${response.status()} ${url}`);
    }
  });

  return {
    assertClean() {
      expect(consoleErrors, "console errors").toEqual([]);
      expect(pageErrors, "page errors").toEqual([]);
      expect(networkErrors, "network errors").toEqual([]);
    }
  };
}

async function auditVisibleText(page: Page) {
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(/undefined|null|NaN|\[object Object\]/);
  expect(text).not.toMatch(/Ã©|Ã¨|Ãª|Ã |â€™|â€œ|�|&eacute;|&agrave;|&ccedil;/);
}

async function auditLayout(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, "horizontal overflow").toBeLessThanOrEqual(1);

  const badBoxes = await page.evaluate(() => {
    const selectors = "a,button,input,select,textarea,[role='cell'],article";
    return Array.from(document.querySelectorAll<HTMLElement>(selectors))
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return (
          style.visibility !== "hidden" &&
          style.display !== "none" &&
          rect.width > 0 &&
          rect.height > 0 &&
          (rect.right < 0 ||
            rect.left > window.innerWidth ||
            rect.bottom < -1)
        );
      })
      .map((element) => element.textContent?.trim().slice(0, 80) ?? element.tagName);
  });

  expect(badBoxes, "elements outside viewport").toEqual([]);
}

async function auditPrimaryAction(page: Page, name: RegExp) {
  const action = page.getByRole("link", { name }).first();
  await expect(action).toBeVisible();
  const box = await action.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(40);
}

test("public cockpit is usable, accessible and visually stable", async ({ page }) => {
  const guards = await installGuards(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Coordonner fournisseurs/ })).toBeVisible();
  await auditPrimaryAction(page, /Explorer l'annuaire/);
  await auditVisibleText(page);
  await auditLayout(page);

  const a11y = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();
  expect(a11y.violations).toEqual([]);
  guards.assertClean();
});

test("supplier directory and profile routes work", async ({ page }) => {
  const guards = await installGuards(page);
  await page.goto("/fournisseurs?ville=Kolwezi&secteur=Mines%20et%20support");
  await expect(page.getByRole("heading", { name: "Fournisseurs industriels" })).toBeVisible();
  await Promise.all([
    page.waitForURL(/\/fournisseurs\/[^/?#]+$/),
    page.getByRole("link", { name: "Voir dossier" }).first().click()
  ]);
  await expect(page.getByRole("link", { name: /Retour annuaire/ })).toBeVisible();
  await auditVisibleText(page);
  await auditLayout(page);
  guards.assertClean();
});

test("health and disabled public API responses are controlled", async ({ request }) => {
  const health = await request.get("/api/health");
  expect([200, 500]).toContain(health.status());
  const healthPayload = await health.json();
  expect(typeof healthPayload.ok).toBe("boolean");
  expect(JSON.stringify(healthPayload)).not.toContain("postgres://");

  const publicApi = await request.get("/api/public/ping");
  expect(publicApi.status()).toBe(404);
});

test("protected console redirects without session", async ({ page }) => {
  await page.goto("/console");
  await expect(page).toHaveURL(/\/connexion$/);
  await expect(page.getByRole("heading", { name: "Console opérationnelle" })).toBeVisible();
});
