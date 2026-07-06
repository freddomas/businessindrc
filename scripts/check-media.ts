import { existsSync } from "node:fs";
import { join } from "node:path";
import { mediaRegistry } from "../lib/seed-data";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

assert(mediaRegistry.length >= 3, "Media registry must include the logo and page visuals.");

for (const asset of mediaRegistry) {
  assert(asset.approved, `Media asset ${asset.id} must be approved.`);
  assert(asset.alt.trim().length >= 12, `Media asset ${asset.id} needs useful alt text.`);
  assert(asset.license.trim().length >= 12, `Media asset ${asset.id} needs a license note.`);
  assert(asset.file.startsWith("/media/"), `Media asset ${asset.id} must be local.`);
  assert(existsSync(join(process.cwd(), "public", asset.file)), `Media asset ${asset.id} is missing.`);
}

console.log("Media validation passed.");
