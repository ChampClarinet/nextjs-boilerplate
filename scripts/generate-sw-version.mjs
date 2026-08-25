import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const pkgPath = path.join(root, "package.json");
const versionPath = path.join(root, "public", "version.json");

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const version = pkg.version ?? "0.0.0";

let commit = "";
try {
  commit = execSync("git rev-parse --short HEAD", { cwd: root }).toString().trim();
} catch (error) {
  console.info(error);
  commit = process.env.COMMIT_SHA || "";
}

let branch = "";
try {
  branch = execSync("git rev-parse --abbrev-ref HEAD", { cwd: root }).toString().trim();
} catch {
  branch = process.env.BRANCH || "";
}

const buildInfo = { version, commit, branch, builtAt: new Date().toISOString() };
fs.writeFileSync(versionPath, JSON.stringify(buildInfo, null, 2), "utf-8");

console.info(`Generated version.json v${version} (${commit || "no-git"})`);
