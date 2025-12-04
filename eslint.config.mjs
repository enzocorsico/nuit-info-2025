import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import unusedImports from "eslint-plugin-unused-imports";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

const eslintConfig = [{
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "postcss.config.js"]
}, ...compat.extends(
  "eslint:recommended",
  "plugin:@typescript-eslint/recommended",
  "plugin:tailwindcss/recommended",
), {
  plugins: {
    "@typescript-eslint": typescriptEslint,
    "unused-imports": unusedImports,
    "@stylistic": stylistic
  },

  languageOptions: {
    parser: tsParser,
  },

  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "unused-imports/no-unused-imports": "error",
    "react-hooks/exhaustive-deps": "off",
    "@next/next/no-img-element": "off",
    "react-hooks/rules-of-hooks": "off",
    "@stylistic/indent": ["error", 2, {
      SwitchCase: 1,
    }],
    "@stylistic/quotes": ["error", "double"],
    "@stylistic/no-trailing-spaces": ["error", {
      skipBlankLines: false
    }],
    "tailwindcss/classnames-order": "error",
    "tailwindcss/no-custom-classname": "error",
    "tailwindcss/migration-from-tailwind-2": "error",
    "tailwindcss/enforces-shorthand": "error",
    "tailwindcss/no-unnecessary-arbitrary-value": "error",
    "max-params": ["error", 7],
    "space-before-blocks": ["error", "always"],
    "object-curly-spacing": ["error", "always"],
    "no-duplicate-imports": "error",
  },
}];

export default eslintConfig;