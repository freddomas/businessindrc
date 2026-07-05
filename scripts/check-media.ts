import { generateMediaAssets, getPublicMediaAssets } from "../lib/seed-data";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const allAssets = generateMediaAssets();
const publicAssets = getPublicMediaAssets();
const allowedExternalDomains = new Set(["images.unsplash.com"]);

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

for (const asset of publicAssets.filter((asset) => asset.url)) {
  assert(asset.sourceDomain, `Public media ${asset.id} needs a source domain.`);
  assert(asset.licenseUrl, `Public media ${asset.id} needs a license URL.`);
  assert(asset.sourceUrl, `Public media ${asset.id} needs a source URL.`);
  assert(asset.alt.trim().length >= 12, `Public media ${asset.id} needs useful alt text.`);

  const url = new URL(asset.url!);
  assert(url.protocol === "https:", `Public media ${asset.id} must use HTTPS.`);
  assert(
    allowedExternalDomains.has(url.hostname) && asset.sourceDomain === url.hostname,
    `Public media ${asset.id} uses an unapproved source domain.`
  );
}

console.log("Media validation passed.");
