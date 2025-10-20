import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest, // Jest globals like 'test', 'expect'
      },
    },
    plugins: { js },
    rules: {
      "no-undef": "error",
    },
  },
  pluginReact.configs.flat.recommended, // React recommended rules
  {
    files: ["**/*.{js,jsx}"],
    plugins: { prettier: pluginPrettier },
    rules: {
      "prettier/prettier": "error", // enable prettier errors
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);
