import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (const file of ["seed-db.ts", "reset-db.ts"]) {
  const source = readFileSync(resolve(process.cwd(), "scripts", file), "utf8");
  const loadIndex = source.indexOf("loadLocalEnv();");
  const databaseImportIndex = source.indexOf('await import("../lib/schema")');

  assert(source.includes('import { loadLocalEnv } from "./load-env";'), `${file} must import the env loader explicitly.`);
  assert(loadIndex >= 0, `${file} must call loadLocalEnv().`);
  assert(databaseImportIndex >= 0, `${file} must load the database module dynamically.`);
  assert(loadIndex < databaseImportIndex, `${file} must load .env.local before the database module.`);
  assert(!source.includes('import { resetDataStore } from "../lib/schema"'), `${file} must not statically import the database module.`);
}

console.log("Database script bootstrap validation passed.");
