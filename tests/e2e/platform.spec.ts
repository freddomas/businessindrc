import { expect, test, type Page, type TestInfo } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const criticalStatuses = new Set([400, 401, 403, 404, 500, 502, 503, 504]);
const forbiddenPublicCopy = [
  "demo",
  "démonstration",
  "test",
  "sample",
  "fake",
  "mock",
  "lorem",
  "placeholder",
  "tutoriel",
  "guide",
  "exemple"
];

const criticalRoutes = [
  { name: "home", path: "/" },
  { name: "suppliers", path: "/fournisseurs" },
  { name: "suppliers-filtered", path: "/fournisseurs?ville=Kolwezi&secteur=Mines%20et%20support" },
  { name: "opportunities", path: "/opportunites" },
  { name: "zone-kolwezi", path: "/zones/kolwezi" },
  { name: "login", path: "/connexion" }
];

function installGuards(page: Page) {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const networkErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
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
  expect(text).not.toMatch(/\b(undefined|null|NaN)\b|\[object Object\]/i);
  expect(text).not.toMatch(/Ã|Â|�|â€™|â€œ|â€|&eacute;|&agrave;|&ccedil;/);

  for (const word of forbiddenPublicCopy) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    expect(text, `forbidden public copy: ${word}`).not.toMatch(
      new RegExp(`(^|[^\\p{L}])${escaped}([^\\p{L}]|$)`, "iu")
    );
  }
}

async function auditLayout(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, "horizontal overflow").toBeLessThanOrEqual(1);

  const badBoxes = await page.evaluate(() => {
    const selectors = "a,button,input,select,textarea,[role='cell'],article";
    return Array.from(document.querySelectorAll<HTMLElement>(selectors))
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        if (style.visibility === "hidden" || style.display === "none" || Number(style.opacity) === 0) return false;
        if (rect.width === 0 && rect.height === 0) return false;
        return rect.width < 4 || rect.height < 4 || rect.left < -1 || rect.right > window.innerWidth + 1;
      })
      .map((element) => ({
        tag: element.tagName,
        text: element.innerText.slice(0, 80),
        box: element.getBoundingClientRect().toJSON()
      }));
  });

  expect(badBoxes, "clipped or invalid layout boxes").toEqual([]);
}

async function auditRealVisibility(page: Page) {
  const blocked = await page.evaluate(() => {
    const selectors = "a,button,input,select,textarea";
    const issues: Array<{ tag: string; text: string; covering: string | null }> = [];

    for (const element of Array.from(document.querySelectorAll<HTMLElement>(selectors))) {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      if (style.visibility === "hidden" || style.display === "none" || Number(style.opacity) === 0) continue;
      if (rect.width <= 0 || rect.height <= 0) continue;
      if (rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) continue;

      const x = Math.min(Math.max(rect.left + rect.width / 2, 1), window.innerWidth - 1);
      const y = Math.min(Math.max(rect.top + rect.height / 2, 1), window.innerHeight - 1);
      const topElement = document.elementFromPoint(x, y);
      if (topElement && topElement !== element && !element.contains(topElement)) {
        issues.push({
          tag: element.tagName,
          text: element.innerText.slice(0, 80),
          covering: `${topElement.tagName} ${(topElement as HTMLElement).innerText?.slice(0, 80) ?? ""}`.trim()
        });
      }
    }

    return issues;
  });

  expect(blocked, "interactive element covered at center point").toEqual([]);
}

async function auditA11y(page: Page) {
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations, "axe violations").toEqual([]);
}

async function attachVisualProof(page: Page, testInfo: TestInfo, name: string) {
  const screenshot = await page.screenshot({ fullPage: true, animations: "disabled" });
  await testInfo.attach(`${testInfo.project.name}-${name}`, {
    body: screenshot,
    contentType: "image/png"
  });
}

for (const route of criticalRoutes) {
  test(`${route.name} renders cleanly with visual proof`, async ({ page }, testInfo) => {
    const guards = installGuards(page);
    const response = await page.goto(route.path);
    expect(response?.status(), `${route.path} status`).toBeLessThan(400);
    await expect(page.locator("main")).toBeVisible();

    await auditVisibleText(page);
    await auditLayout(page);
    await auditRealVisibility(page);
    await auditA11y(page);
    await attachVisualProof(page, testInfo, route.name);
    guards.assertClean();
  });
}

test("supplier profile flow stays navigable and visible", async ({ page }, testInfo) => {
  const guards = installGuards(page);
  await page.goto("/fournisseurs");
  const firstProfileLink = page.getByRole("link", { name: /Voir dossier/i }).first();
  await expect(firstProfileLink).toBeVisible();
  await firstProfileLink.click();
  await expect(page).toHaveURL(/\/fournisseurs\/.+/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await auditVisibleText(page);
  await auditLayout(page);
  await auditRealVisibility(page);
  await auditA11y(page);
  await attachVisualProof(page, testInfo, "supplier-profile");
  guards.assertClean();
});

test("protected console redirects without session", async ({ page }, testInfo) => {
  const guards = installGuards(page);
  await page.goto("/console");
  await expect(page).toHaveURL(/\/connexion$/);
  await expect(page.getByRole("heading", { name: "Console de pilotage" })).toBeVisible();

  await auditVisibleText(page);
  await auditLayout(page);
  await auditRealVisibility(page);
  await attachVisualProof(page, testInfo, "console-redirect");
  guards.assertClean();
});

test("reduced motion keeps the home page usable", async ({ page }, testInfo) => {
  const guards = installGuards(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await auditVisibleText(page);
  await auditLayout(page);
  await auditRealVisibility(page);
  await attachVisualProof(page, testInfo, "home-reduced-motion");
  guards.assertClean();
});

test("health endpoint and disabled public API respond without exposing secrets", async ({ request }) => {
  const health = await request.get("/api/health");
  expect([200, 500], "health status is controlled").toContain(health.status());
  const healthPayload = await health.json();
  expect(JSON.stringify(healthPayload)).not.toContain("postgres://");
  expect(JSON.stringify(healthPayload)).not.toContain("postgresql://");
  expect(healthPayload).toHaveProperty("ok");
  expect(healthPayload).toHaveProperty("database");

  const publicApi = await request.get("/api/public/ping");
  expect(publicApi.status()).toBe(404);
});
