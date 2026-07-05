import { spawn, spawnSync } from "node:child_process";

const root = process.cwd();
const port = process.env.PLAYWRIGHT_PORT ?? "3000";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;
const serverCommand = process.env.PLAYWRIGHT_SERVER_COMMAND;
let server;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 120_000) {
    try {
      const response = await fetch(baseURL);
      if (response.status < 500) return;
    } catch {
      // Server not ready yet.
    }
    await wait(500);
  }

  throw new Error(`Server did not become ready at ${baseURL}`);
}

function startServer() {
  if (serverCommand) {
    server = spawn(serverCommand, {
      cwd: root,
      env: process.env,
      shell: true,
      stdio: ["ignore", "pipe", "pipe"]
    });
    return;
  }

  server = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "dev", "-H", "127.0.0.1", "-p", port],
    {
      cwd: root,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }
  );
}

function stopServer() {
  if (!server?.pid) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(server.pid), "/t", "/f"], { stdio: "ignore" });
    return;
  }
  server.kill("SIGTERM");
}

async function main() {
  if (!process.env.PLAYWRIGHT_BASE_URL) {
    startServer();
    server.stdout.on("data", (chunk) => process.stdout.write(`[next] ${chunk}`));
    server.stderr.on("data", (chunk) => process.stderr.write(`[next] ${chunk}`));
    await waitForServer();
  }

  const args = ["node_modules/@playwright/test/cli.js", "test", ...process.argv.slice(2)];
  const result = spawn(process.execPath, args, {
    cwd: root,
    env: { ...process.env, PLAYWRIGHT_BASE_URL: baseURL },
    stdio: "inherit"
  });

  const exitCode = await new Promise((resolve) => {
    result.on("close", resolve);
  });

  stopServer();
  process.exit(typeof exitCode === "number" ? exitCode : 1);
}

main().catch((error) => {
  stopServer();
  console.error(error);
  process.exit(1);
});
