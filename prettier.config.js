/** @type {import('prettier').Config} */
const config = {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf",
  jsxSingleQuote: true,

  plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],

  importOrder: [
    // Side-effect imports
    "^\\u0000",
    "",

    // React core
    "^(react/(.*)$)|^(react$)",
    "^(react-dom/(.*)$)|^(react-dom$)",

    // Third-party libraries
    "<THIRD_PARTY_MODULES>",
    "",

    // Environment, types, and constants
    "^@/env$",
    "^@/types(.*)$",
    "^@/constants(.*)$",
    "",

    // API layer
    "^@/api(.*)$",
    "",

    // Internal libraries and utilities
    "^@/lib(.*)$",
    "^@/utils(.*)$",
    "",

    // Providers and hooks
    "^@/providers(.*)$",
    "^@/hooks(.*)$",
    "",

    // Features, routes, and components
    "^@/features(.*)$",
    "^@/routes(.*)$",
    "^@/components(.*)$",
    "",

    // Static assets
    "^@/assets(.*)$",
    "",

    // Relative imports
    "^[.][.]",
    "^[.]",
    "",

    // Style imports (always last)
    "^@/styles(.*)$",
    "^.+[.]css$",
  ],

  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  tailwindAttributes: ["className"],
  tailwindFunctions: ["cn", "tv"],
};

export default config;
