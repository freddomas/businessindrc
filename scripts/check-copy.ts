import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const publicFiles = [
  "app/page.tsx",
  "app/fournisseurs",
  "app/opportunites",
  "app/zones",
  "app/connexion",
  "components"
];
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
  "exemple"
];
const visibleTechnicalTerms = ["squelette", "template", "base minimale", "DATABASE_URL", "POSTGRES_URL"];

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

const files = publicFiles
  .flatMap(collectFiles)
  .filter((file) => /\.(tsx|ts)$/.test(file) && !file.includes(`${join("app", "api")}${join("", "")}`));
const failures: string[] = [];

for (const file of files) {
  const content = readFileSync(file, "utf8");
  const stringLiterals = [...content.matchAll(/(["'`])((?:(?!\1).){3,}?)\1/gs)]
    .map((match) => match[2])
    .join("\n");

  for (const word of [...forbidden, ...visibleTechnicalTerms]) {
    if (hasForbiddenWord(stringLiterals, word)) {
      failures.push(`${file}: visible copy contains "${word}"`);
    }
  }
}

if (failures.length) {
  throw new Error(failures.join("\n"));
}

console.log("Public copy validation passed.");
