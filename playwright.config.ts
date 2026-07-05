import { defineConfig, devices } from "@playwright/test";

const port = process.env.PLAYWRIGHT_PORT ?? "3000";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;
const serverCommand =
  process.env.PLAYWRIGHT_SERVER_COMMAND ?? `node node_modules/next/dist/bin/next dev -H 127.0.0.1 -p ${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45_000,
  expect: {
    timeout: 7_500
  },
  fullyParallel: false,
  workers: 2,
  reporter: [["list"], ["html", { outputFolder: "playwright-report" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: serverCommand,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000
      },
  projects: [
    {
      name: "chromium-360",
      use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 800 } }
    },
    {
      name: "chromium-390",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } }
    },
    {
      name: "chromium-tablet",
      use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } }
    },
    {
      name: "chromium-laptop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1366, height: 768 } }
    },
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } }
    },
    {
      name: "chromium-wide",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1920, height: 1080 } }
    }
  ]
});
