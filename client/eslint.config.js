import js from "@eslint/js";
import react from "eslint-plugin-react";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    plugins: {
      react
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      "indent": ["error", 2],
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "double", { "avoidEscape": true }],
      "semi": ["error", "always"],
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "prefer-const": "warn",
      "no-var": "error"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }
];
