import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  //Ignore compiled/output and irrelevant folders
  {
    ignores: ["dist/**", "logs/**", "node_modules/**"],
  },

  //Rules for TypeScript source files
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "indent": ["error", 4],
      //"no-console": "warn",
      "object-curly-spacing": ["error", "always"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_" 
        }
      ],
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
