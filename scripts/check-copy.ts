import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const publicFiles = ["app/layout.tsx", "app/page.tsx", "app/connexion", "components"];

const forbidden = [
  "demo",
  "démonstration",
  "test",
  "sample",
  "fake",
  "mock",
  "lorem",
  "placeholder",
  "tutoriel",
  "guide",
  "exemple",
  "squelette",
  "template",
  "base minimale",
  "DATABASE_URL",
  "POSTGRES_URL"
];

function collectFiles(path: string): string[] {
  const fullPath = join(process.cwd(), path);
  const stats = statSync(fullPath);

  if (stats.isFile()) {
    return [fullPath];
  }

  return readdirSync(fullPath).flatMap((entry) => collectFiles(join(path, entry)));
}

function hasForbiddenWord(content: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}])${escaped}([^\\p{L}]|$)`, "iu").test(content);
}

function extractStringLiterals(content: string): string {
  return [...content.matchAll(/(["'`])((?:(?!\1).){3,}?)\1/gs)]
    .map((match) => match[2])
    .join("\n");
}

const files = publicFiles
  .flatMap(collectFiles)
  .filter((file) => /\.(tsx|ts)$/.test(file) && !file.includes(`${join("app", "api")}${join("", "")}`));

const failures: string[] = [];

for (const file of files) {
  const content = readFileSync(file, "utf8");
  const stringLiterals = extractStringLiterals(content);

  for (const word of forbidden) {
    if (hasForbiddenWord(stringLiterals, word)) {
      failures.push(`${file}: visible copy contains "${word}"`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Public copy validation passed.");
