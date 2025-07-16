import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow the occasional use of `any` until full typing is completed
      "@typescript-eslint/no-explicit-any": "off",
      // Disable exhaustive-deps rule entirely to silence warnings
      "react-hooks/exhaustive-deps": "off",
      // Disable unused-vars completely for now
      "@typescript-eslint/no-unused-vars": "off",
      // Disable unused-vars experimental rule
      "@typescript-eslint/no-unused-vars-experimental": "off",
      // Allow <img> tags – Next/Image is optional for small personal sites
      "@next/next/no-img-element": "off",
      // Disable preconnect warning for Google fonts (handled via CSP elsewhere)
      "@next/next/google-font-preconnect": "off",
      // Allow unescaped entities in JSX for readability
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
