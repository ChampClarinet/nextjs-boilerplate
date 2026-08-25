// @ts-check

/** @type {import('@trivago/prettier-plugin-sort-imports').PrettierConfig} */
const config = {
  singleQuote: false,
  semi: true,
  printWidth: 100,
  tabWidth: 2,
  trailingComma: "all",
  plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  importOrder: ["^dotenv", "^react", "<THIRD_PARTY_MODULES>", "^@repo", "^[.]", "^[.][.]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ["decorators-legacy", "jsx", "typescript"],
};

module.exports = config;
