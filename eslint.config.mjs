import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";
import babelParser from "@babel/eslint-parser";
import pluginCypress from "eslint-plugin-cypress"; 
const cypressGlobals = {
  cy: "writable",
  Cypress: "writable",
  assert: "writable",
  expect: "writable",
};

export default defineConfig([
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react: pluginReact,
      prettier: pluginPrettier,
    },
    rules: {
      "no-undef": "error",
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/__tests__/**/*.{js,jsx}", "**/*.test.{js,jsx}"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      "no-undef": "off", 
    },
  },
  {
    files: ["**/*.cy.{js,jsx}"], 
    ...pluginCypress.configs.recommended, 
    
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
        ...cypressGlobals,
      },
    },
    
    plugins: {
        cypress: pluginCypress,
    },
    
    rules: {
      "no-undef": "error", 
      "cypress/no-unnecessary-waiting": "warn", 
    },
  },
]);