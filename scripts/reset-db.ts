import "./load-env";
import { resetDataStore } from "../lib/schema";

async function main() {
  await resetDataStore();
  console.log("Database reset completed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
