// Reports: (1) t() keys used in components but missing from the Arabic dict,
// (2) template literals like t(`${x}.title`) that cannot be verified statically.
import { readFileSync, readdirSync } from "node:fs";
import { execSync } from "node:child_process";

const files = execSync("grep -rl 'useT\\|t(' components/ app/ lib/", { encoding: "utf8" })
  .trim().split("\n").filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"));

const used = new Set();
const dynamic = new Set();
for (const f of files) {
  const src = readFileSync(f, "utf8")
    // Strip comments so doc examples like t("hero.title", ...) are not counted.
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
  for (const m of src.matchAll(/\bt\(\s*"([^"]+)"/g)) used.add(m[1]);
  for (const m of src.matchAll(/\bt\(\s*`([^`]+)`/g)) dynamic.add(m[1]);
}

const dictSrc = readFileSync("lib/i18n/dictionaries.ts", "utf8");
const dictKeys = new Set([...dictSrc.matchAll(/^\s*"([^"]+)":/gm)].map((m) => m[1]));

const missing = [...used].filter((k) => !dictKeys.has(k)).sort();
const unused = [...dictKeys].filter((k) => !used.has(k)).sort();

console.log("USED keys:", used.size, "| DICT keys:", dictKeys.size);
console.log("\n=== MISSING from Arabic dict (will render English fallback) ===");
console.log(missing.length ? missing.join("\n") : "(none)");
console.log("\n=== dynamic template keys (checked manually) ===");
console.log([...dynamic].join("\n") || "(none)");
console.log("\n=== dict keys not referenced literally (may be used dynamically) ===");
console.log(unused.slice(0, 60).join("\n") || "(none)");

if (missing.length) {
  console.error(
    `\ni18n check FAILED: ${missing.length} key(s) would render the English fallback inside the Arabic page.`
  );
  process.exit(1);
}
console.log("\ni18n check passed.");
