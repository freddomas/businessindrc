import { expect, type Page, type TestInfo } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const criticalStatuses = new Set([400, 401, 403, 404, 500, 502, 503, 504]);

export const forbiddenPublicCopy = [
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

function forbiddenWordRegex(word: string) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}])${escaped}([^\\p{L}]|$)`, "iu");
}

export function installRuntimeGuards(page: Page, allowedStatuses: number[] = []) {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const networkErrors: string[] = [];
  const allowed = new Set(allowedStatuses);

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (response) => {
    if (criticalStatuses.has(response.status()) && !allowed.has(response.status())) {
      networkErrors.push(`${response.status()} ${response.url()}`);
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

export async function assertNoSecretLeak(value: unknown) {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  expect(text).not.toMatch(/postgres:\/\/|postgresql:\/\/|DATABASE_URL|POSTGRES_URL|AUTH_SECRET|demo2026!/i);
}

export async function auditVisibleText(page: Page, options: { publicPage?: boolean } = {}) {
  const audit = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const title = document.title;
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
    const attributes = Array.from(
      document.querySelectorAll<HTMLElement>("input,textarea,img,a,button,[aria-label],[title]")
    )
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
  expect(audit).not.toMatch(/Ã©|Ã¨|Ãª|Ã |Â|�|â€™|â€œ|â€|&eacute;|&agrave;|&ccedil;/);
  await assertNoSecretLeak(audit);

  if (options.publicPage) {
    for (const word of forbiddenPublicCopy) {
      expect(audit, `forbidden public copy: ${word}`).not.toMatch(forbiddenWordRegex(word));
    }
  }
}

export async function auditLayout(page: Page) {
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
      if (element.closest("[data-allow-horizontal-scroll='true']")) continue;
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

export async function auditRealVisibility(page: Page) {
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
        if (topElement?.tagName === "NEXTJS-PORTAL") continue;
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

export async function auditA11y(page: Page) {
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations, "axe violations").toEqual([]);
}

export async function auditPublicMedia(page: Page) {
  const issues = await page.evaluate(() => {
    return Array.from(document.querySelectorAll<HTMLImageElement>("img")).flatMap((image) => {
      const url = new URL(image.currentSrc || image.src, window.location.href);
      const isInternal = url.origin === window.location.origin || url.protocol === "data:" || url.protocol === "blob:";
      const hasAlt = Boolean(image.getAttribute("alt")?.trim());
      return isInternal && hasAlt ? [] : [image.outerHTML.slice(0, 180)];
    });
  });

  expect(issues, "unapproved public media").toEqual([]);
}

export async function auditInteractiveTargets(page: Page) {
  const domIssues = await page.evaluate(() => {
    function isVisible(element: HTMLElement) {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.visibility !== "hidden" &&
        style.display !== "none" &&
        Number(style.opacity) !== 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    }

    const linkIssues = Array.from(document.querySelectorAll<HTMLAnchorElement>("a")).flatMap((anchor) => {
      if (!isVisible(anchor)) return [];
      const href = anchor.getAttribute("href")?.trim() ?? "";
      const label = (anchor.innerText || anchor.getAttribute("aria-label") || "").trim();
      if (!href || href === "#") return [`Link without destination: ${label || anchor.outerHTML.slice(0, 120)}`];
      if (href.startsWith("#") && !document.getElementById(href.slice(1))) {
        return [`Missing fragment target ${href}: ${label}`];
      }
      return [];
    });

    const buttonIssues = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).flatMap((button) => {
      if (!isVisible(button) || button.disabled) return [];
      const label = (button.innerText || button.getAttribute("aria-label") || "").trim();
      const type = button.getAttribute("type");
      if (!label) return [`Button without accessible text: ${button.outerHTML.slice(0, 120)}`];
      if (!type) return [`Button without explicit type: ${label}`];
      if (type === "submit" && !button.closest("form")) return [`Submit button outside form: ${label}`];
      return [];
    });

    return [...linkIssues, ...buttonIssues];
  });

  expect(domIssues, "inactive or ambiguous interactive controls").toEqual([]);
}

export async function attachVisualProof(page: Page, testInfo: TestInfo, name: string) {
  const screenshot = await page.screenshot({ fullPage: true, animations: "disabled" });
  expect(screenshot.length, "screenshot should not be empty").toBeGreaterThan(25_000);
  await testInfo.attach(`${testInfo.project.name}-${name}`, {
    body: screenshot,
    contentType: "image/png"
  });
}

export async function auditPage(page: Page, testInfo: TestInfo, name: string, publicPage = false) {
  await expect(page.locator("main")).toBeVisible();
  await auditVisibleText(page, { publicPage });
  await auditLayout(page);
  await auditRealVisibility(page);
  await auditInteractiveTargets(page);
  await auditPublicMedia(page);
  await auditA11y(page);
  await attachVisualProof(page, testInfo, name);
}
