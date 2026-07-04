import { spawn, spawnSync } from "node:child_process";

const root = process.cwd();
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
let server;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 120_000) {
    try {
      const response = await fetch(baseURL);
      if (response.status < 500) {
        return;
      }
    } catch {
      // Server not ready yet.
    }

    await wait(500);
  }

  throw new Error(`Server did not become ready at ${baseURL}`);
}

function stopServer() {
  if (!server?.pid) {
    return;
  }

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(server.pid), "/t", "/f"], {
      stdio: "ignore"
    });
    return;
  }

  server.kill("SIGTERM");
}

async function main() {
  if (!process.env.PLAYWRIGHT_BASE_URL) {
    server = spawn(
      process.execPath,
      ["node_modules/next/dist/bin/next", "dev", "-H", "127.0.0.1", "-p", "3000"],
      {
        cwd: root,
        env: process.env,
        stdio: ["ignore", "pipe", "pipe"]
      }
    );

    server.stdout.on("data", (chunk) => process.stdout.write(`[next] ${chunk}`));
    server.stderr.on("data", (chunk) => process.stderr.write(`[next] ${chunk}`));

    await waitForServer();
  }

  const args = ["node_modules/@playwright/test/cli.js", "test", ...process.argv.slice(2)];
  const result = spawn(process.execPath, args, {
    cwd: root,
    env: {
      ...process.env,
      PLAYWRIGHT_BASE_URL: baseURL
    },
    stdio: "inherit"
  });

  const exitCode = await new Promise((resolve) => {
    result.on("close", resolve);
  });

  stopServer();
  process.exit(typeof exitCode === "number" ? exitCode : 1);
}

process.on("SIGINT", () => {
  stopServer();
  process.exit(130);
});
process.on("SIGTERM", () => {
  stopServer();
  process.exit(143);
});

main().catch((error) => {
  stopServer();
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
