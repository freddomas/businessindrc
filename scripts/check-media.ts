import { generateMediaAssets, getPublicMediaAssets } from "../lib/seed-data";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const allAssets = generateMediaAssets();
const publicAssets = getPublicMediaAssets();

assert(allAssets.length > publicAssets.length, "Media quarantine path must exist.");
assert(
  publicAssets.every(
    (asset) =>
      asset.reviewStatus === "APPROVED" &&
      asset.licenseStatus === "VALID" &&
      !asset.isAiLike &&
      asset.allowedUse.includes("web_public")
  ),
  "Public media filter leaked an unapproved asset."
);

console.log("Media validation passed.");
