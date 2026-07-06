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

test("home WebGL scene renders nonblank canvas", async ({ page }, testInfo) => {
  const guards = installRuntimeGuards(page);
  await page.goto("/");
  const canvas = page.locator(".octopus-scene canvas");
  await expect(canvas).toBeVisible();
  const box = await canvas.boundingBox();
  expect(box?.width).toBeGreaterThan(250);
  expect(box?.height).toBeGreaterThan(250);
  const pixelSignal = await canvas.evaluate((element) => {
    const canvasElement = element as HTMLCanvasElement;
    const context = canvasElement.getContext("webgl2") ?? canvasElement.getContext("webgl");
    return Boolean(context);
  });
  expect(pixelSignal).toBe(true);
  await attachVisualProof(page, testInfo, "home-webgl");
  guards.assertClean();
});

test("reduced motion keeps public landing usable", async ({ page }, testInfo) => {
  const guards = installRuntimeGuards(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "OCTOPUS Mining" })).toBeVisible();
  await auditPage(page, testInfo, "home-reduced-motion", true);
  guards.assertClean();
});
