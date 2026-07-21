import { expect, test } from "@playwright/test";
import { attachVisualProof, auditPage, installRuntimeGuards } from "./helpers";

for (const route of [
  { name: "home", path: "/" },
  { name: "login", path: "/connexion" }
]) {
  test(`${route.name} renders with strict public QA`, async ({ page }, testInfo) => {
    const guards = installRuntimeGuards(page);
    const response = await page.goto(route.path);
    expect(response?.status(), `${route.path} status`).toBeLessThan(400);
    await auditPage(page, testInfo, route.name, true);
    guards.assertClean();
  });
}

test("home realistic media render", async ({ page }, testInfo) => {
  const guards = installRuntimeGuards(page);
  await page.goto("/");

  async function expectLoadedImage(selector: string) {
    const image = page.locator(selector).first();
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect
      .poll(
        () =>
          image.evaluate((node) => {
            const element = node as HTMLImageElement;
            return element.complete && element.naturalWidth > 0 && element.naturalHeight > 0;
          }),
        { timeout: 10_000 }
      )
      .toBe(true);
  }

  await expectLoadedImage('img[src*="octopus-hero-v2"]');
  await expectLoadedImage('img[src*="octopus-field-operations-v2"]');
  await attachVisualProof(page, testInfo, "home-realistic-media");
  guards.assertClean();
});

test("reduced motion keeps public landing usable", async ({ page }, testInfo) => {
  const guards = installRuntimeGuards(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Un besoin critique devient une décision maîtrisée." })).toBeVisible();
  await auditPage(page, testInfo, "home-reduced-motion", true);
  guards.assertClean();
});
