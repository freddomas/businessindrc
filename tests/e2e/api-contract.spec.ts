import { expect, test } from "@playwright/test";
import { assertNoSecretLeak } from "./helpers";

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-laptop", "API contract runs once per suite.");
});

test("health endpoint has a safe database contract", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  const payload = await response.json();
  expect(payload).toHaveProperty("ok", true);
  expect(payload).toHaveProperty("database");
  await assertNoSecretLeak(payload);

  if (process.env.PLAYWRIGHT_BASE_URL) {
    expect(payload.database).toBe("connected");
  } else {
    expect(["connected", "not_configured"]).toContain(payload.database);
  }
});

test("partners API is private and works after admin login", async ({ request }) => {
  const anonymous = await request.get("/api/partners");
  expect(anonymous.status()).toBe(401);

  const login = await request.post("/api/auth/login", {
    form: { identifier: "admin", password: "demo2026!" },
    maxRedirects: 0
  });
  expect(login.status()).toBe(303);
  expect(login.headers()["set-cookie"]).toContain("gkih_session");

  const response = await request.get("/api/partners");
  expect(response.status()).toBe(200);
  const payload = await response.json();
  expect(payload).toHaveProperty("ok", true);
  expect(Array.isArray(payload.partners)).toBe(true);
  expect(payload.partners.length).toBeGreaterThanOrEqual(10);
  expect(payload.partners[0]).toHaveProperty("companyName");
  expect(payload.partners[0]).not.toHaveProperty("password");
  await assertNoSecretLeak(payload);
});
