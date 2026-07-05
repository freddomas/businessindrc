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
  { name: "suppliers-filtered", path: "/fournisseurs?ville=Kolwezi&secteur=Mines" },
  { name: "opportunities", path: "/opportunites" },
  { name: "zone-kolwezi", path: "/zones/kolwezi" },
  { name: "login", path: "/connexion" }
];

function forbiddenWordRegex(word: string) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}])${escaped}([^\\p{L}]|$)`, "iu");
}

function installGuards(page: Page) {
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
    const expectedApiMiss = url.includes("/api/public/");
    if (criticalStatuses.has(response.status()) && !expectedApiMiss) {
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
  const audit = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const title = document.title;
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
    const attributes = Array.from(document.querySelectorAll<HTMLElement>("input,textarea,img,a,button,[aria-label],[title]"))
      .flatMap((element) => [
        element.getAttribute("placeholder") ?? "",
        element.getAttribute("aria-label") ?? "",
        element.getAttribute("title") ?? "",
        element.getAttribute("alt") ?? ""
      ])
      .filter(Boolean)
      .join("\n");

    return [bodyText, title, metaDescription, attributes].join("\n");
  });

  expect(audit).not.toMatch(/\b(undefined|null|NaN)\b|\[object Object\]/i);
  expect(audit).not.toMatch(/Ãƒ|Ã‚|ï¿½|Ã¢â‚¬â„¢|Ã¢â‚¬Å“|Ã¢â‚¬|&eacute;|&agrave;|&ccedil;/);

  for (const word of forbiddenPublicCopy) {
    expect(audit, `forbidden public copy: ${word}`).not.toMatch(forbiddenWordRegex(word));
  }
}

async function auditLayout(page: Page) {
  const issues = await page.evaluate(() => {
    const badBoxes: Array<{ tag: string; text: string; reason: string; box: DOMRect }> = [];
    const doc = document.documentElement;
    if (doc.scrollWidth > window.innerWidth + 2) {
      badBoxes.push({
        tag: "HTML",
        text: "horizontal overflow",
        reason: `${doc.scrollWidth} > ${window.innerWidth}`,
        box: doc.getBoundingClientRect()
      });
    }

    for (const element of Array.from(document.querySelectorAll<HTMLElement>("body *"))) {
      const style = getComputedStyle(element);
      if (style.visibility === "hidden" || style.display === "none" || Number(style.opacity) === 0) continue;
      if (["SCRIPT", "STYLE", "TEMPLATE"].includes(element.tagName)) continue;
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
      if (rect.left < -2 || rect.right > window.innerWidth + 2) {
        badBoxes.push({
          tag: element.tagName,
          text: element.innerText?.slice(0, 80) ?? "",
          reason: "outside viewport",
          box: rect
        });
      }
    }

    return badBoxes.map((issue) => ({
      tag: issue.tag,
      text: issue.text,
      reason: issue.reason,
      box: {
        x: issue.box.x,
        y: issue.box.y,
        width: issue.box.width,
        height: issue.box.height
      }
    }));
  });

  expect(issues, "layout issues").toEqual([]);
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

      const points = [
        [rect.left + rect.width / 2, rect.top + rect.height / 2],
        [rect.left + Math.min(8, rect.width / 3), rect.top + Math.min(8, rect.height / 3)],
        [rect.right - Math.min(8, rect.width / 3), rect.bottom - Math.min(8, rect.height / 3)]
      ];

      for (const [rawX, rawY] of points) {
        const x = Math.min(Math.max(rawX, 1), window.innerWidth - 1);
        const y = Math.min(Math.max(rawY, 1), window.innerHeight - 1);
        const topElement = document.elementFromPoint(x, y);
        if (topElement?.tagName === "NEXTJS-PORTAL") {
          continue;
        }
        if (topElement && topElement !== element && !element.contains(topElement)) {
          issues.push({
            tag: element.tagName,
            text: element.innerText?.slice(0, 80) ?? element.getAttribute("aria-label") ?? "",
            covering: `${topElement.tagName} ${(topElement as HTMLElement).innerText?.slice(0, 80) ?? ""}`.trim()
          });
          break;
        }
      }
    }

    return issues;
  });

  expect(blocked, "interactive element covered at sampled points").toEqual([]);
}

async function auditA11y(page: Page) {
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations, "axe violations").toEqual([]);
}

async function auditPublicMedia(page: Page) {
  const media = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll("img,picture,source"));
    const cssUrls = Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .map((element) => getComputedStyle(element).backgroundImage)
      .filter((value) => value && value !== "none" && value.includes("url("));

    return {
      elements: elements.map((element) => element.outerHTML.slice(0, 180)),
      cssUrls
    };
  });

  expect(media.elements, "unregistered public media elements").toEqual([]);
  expect(media.cssUrls, "unregistered CSS media URLs").toEqual([]);
}

async function attachVisualProof(page: Page, testInfo: TestInfo, name: string) {
  const screenshot = await page.screenshot({ fullPage: true, animations: "disabled" });
  expect(screenshot.length, "screenshot should not be empty").toBeGreaterThan(25_000);
  await testInfo.attach(`${testInfo.project.name}-${name}`, {
    body: screenshot,
    contentType: "image/png"
  });
}

for (const route of criticalRoutes) {
  test(`${route.name} renders cleanly with strict visual proof`, async ({ page }, testInfo) => {
    const guards = installGuards(page);
    const response = await page.goto(route.path);
    expect(response?.status(), `${route.path} status`).toBeLessThan(400);
    await expect(page.locator("main")).toBeVisible();
    await auditVisibleText(page);
    await auditLayout(page);
    await auditRealVisibility(page);
    await auditPublicMedia(page);
    await auditA11y(page);
    await attachVisualProof(page, testInfo, route.name);
    guards.assertClean();
  });
}

test("home scene renders an interactive WebGL surface", async ({ page }, testInfo) => {
  const guards = installGuards(page);
  await page.goto("/");
  const canvas = page.locator(".command-scene canvas");
  await expect(canvas).toBeVisible();
  const box = await canvas.boundingBox();
  expect(box?.width).toBeGreaterThan(250);
  expect(box?.height).toBeGreaterThan(250);
  await attachVisualProof(page, testInfo, "home-webgl-scene");
  guards.assertClean();
});

test("supplier profile flow keeps detail page clean", async ({ page }, testInfo) => {
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

test("reduced motion keeps home page usable", async ({ page }, testInfo) => {
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

test("health endpoint and disabled public API stay controlled", async ({ request }) => {
  const health = await request.get("/api/health");
  expect(health.status()).toBe(200);
  const healthPayload = await health.json();
  expect(JSON.stringify(healthPayload)).not.toContain("postgres://");
  expect(JSON.stringify(healthPayload)).not.toContain("postgresql://");
  expect(healthPayload).toHaveProperty("ok", true);
  expect(healthPayload).toHaveProperty("database");

  if (process.env.PLAYWRIGHT_BASE_URL) {
    expect(healthPayload.database).toBe("connected");
  } else {
    expect(["connected", "not_configured"]).toContain(healthPayload.database);
  }

  for (const method of ["get", "post", "put", "patch", "delete"] as const) {
    const response = await request[method]("/api/public/ping");
    expect([404, 405]).toContain(response.status());
  }
});

test("rfq API rejects invalid payloads and handles valid intake explicitly", async ({ request }) => {
  const invalid = await request.post("/api/rfq", {
    data: { title: "court", city: "K", sector: "M", urgency: "standard", lines: "trop court" }
  });
  expect([422, 503]).toContain(invalid.status());

  const valid = await request.post("/api/rfq", {
    data: {
      title: "Maintenance electrique urgente Kolwezi",
      city: "Kolwezi",
      sector: "Energie",
      urgency: "priority",
      lines: "Inspection, equipe mobilisable, pieces critiques, delai sous quarante-huit heures"
    }
  });
  expect([201, 503]).toContain(valid.status());
  const payload = await valid.json();
  expect(payload).toHaveProperty("ok");
  if (valid.status() === 201) {
    expect(payload.id).toMatch(/^rfq-user-/);
  }
});
