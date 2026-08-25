import fs from "node:fs";

// Skip Husky install in production and CI
if (
  process.env.NODE_ENV === "production" ||
  process.env.CI === "true" ||
  process.env.HUSKY == "0"
) {
  process.exit(0);
}
// ⛔ ทำงานเฉพาะตอน npm/bun lifecycle = prepare เท่านั้น
if (
  process.env.npm_lifecycle_event &&
  process.env.npm_lifecycle_event !== "prepare"
) {
  process.exit(0);
}

// ⛔ ต้องมี .git ถึงจะติดตั้ง hook
if (!fs.existsSync(".git")) {
  process.exit(0);
}

const husky = (await import("husky")).default;
husky();
console.info("✅ Husky has been installed");
