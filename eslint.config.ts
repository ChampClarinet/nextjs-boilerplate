// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: [".next"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  //
  // 🌸 for frontend (React)
  //
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/consistent-type-imports": "error",
      "no-console": ["error", { allow: ["warn", "error", "info"] }],
    },
  },
  //
  // 🌿 additional for Node scripts (eg .husky, config, build script)
  //
  {
    files: [
      ".husky/**/*.{js,mjs,cjs}",
      "scripts/**/*.{js,mjs,cjs}",
      "**/*.config.{js,mjs,cjs}",
      ".prettierrc.{js,cjs,mjs,ts}",
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
    rules: {
      "no-console": ["error", { allow: ["warn", "error", "info"] }],
    },
  },
);
