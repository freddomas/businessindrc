import { loadLocalEnv } from "./load-env";
import { hasDatabaseUrl } from "../lib/db";
import { resetDataStore } from "../lib/schema";

loadLocalEnv();

async function main() {
  if (!hasDatabaseUrl()) {
    throw new Error("DATABASE_URL or POSTGRES_URL is required for db:reset.");
  }

  await resetDataStore();
  console.log("Database reset and seed completed.");
}

main().catch((error) => {
  if (error instanceof Error) {
    const detail = error as Error & { code?: string; cause?: { code?: string; message?: string } };
    console.error(
      JSON.stringify(
        {
          name: detail.name,
          code: detail.code,
          message: detail.message,
          causeCode: detail.cause?.code,
          causeMessage: detail.cause?.message
        },
        null,
        2
      )
    );
  } else {
    console.error("Unknown reset failure.");
  }
  process.exit(1);
});
