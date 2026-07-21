import { loadLocalEnv } from "./load-env";

async function main() {
  loadLocalEnv();
  const { resetDataStore } = await import("../lib/schema");
  await resetDataStore();
  console.log("Database seed completed.");
}

main().catch((error) => {
  const code = error && typeof error === "object" && "code" in error && typeof error.code === "string" ? error.code : "unknown";
  console.error(`Database seed failed (${code}).`);
  process.exit(1);
});
